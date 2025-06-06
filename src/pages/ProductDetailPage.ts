import { createElement, formatPrice, getCategoryColor } from "@/utils/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { PageLoader } from "@/components/Loading";
import { productApi } from "@/api/api";
import { Product } from "@/types/product";

export class ProductDetailPage {
  private product: Product | null = null;
  private relatedProducts: Product[] = [];
  private loading = true;
  private error: string | null = null;
  private quantity = 1;

  async create(): Promise<HTMLElement> {
    const page = createElement("div", "min-h-screen flex flex-col");

    const productId = this.getProductIdFromURL();
    if (!productId) {
      return this.createNotFoundPage();
    }

    const navbar = new Navbar();
    const footer = new Footer();

    page.appendChild(navbar.create());

    const main = createElement("div", "container mx-auto px-4 py-6 flex-1");

    try {
      await this.loadProduct(productId);

      if (!this.product) {
        return this.createNotFoundPage();
      }

      const breadcrumb = this.createBreadcrumb();
      main.appendChild(breadcrumb);

      const backButton = this.createBackButton();
      main.appendChild(backButton);

      const productDetails = this.createProductDetails();
      main.appendChild(productDetails);

      if (this.relatedProducts.length > 0) {
        const relatedSection = this.createRelatedProducts();
        main.appendChild(relatedSection);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      main.appendChild(PageLoader.showError("Failed to load product"));
    }

    page.appendChild(main);
    page.appendChild(footer.create());

    return page;
  }

  private getProductIdFromURL(): string | null {
    const hash = window.location.hash.slice(1);
    const match = hash.match(/\/products\/(\d+)/);
    return match ? match[1] : null;
  }

  private async loadProduct(productId: string): Promise<void> {
    try {
      this.product = await productApi.getProduct(productId);

      if (this.product) {
        this.relatedProducts = await productApi.getRelatedProducts(
          this.product.id,
          this.product.category
        );
      }

      this.loading = false;
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "Failed to load product";
      this.loading = false;
      throw error;
    }
  }

  private createNotFoundPage(): HTMLElement {
    const page = createElement("div", "min-h-screen flex flex-col");

    const navbar = new Navbar();
    const footer = new Footer();

    page.appendChild(navbar.create());

    const main = createElement(
      "div",
      "flex-1 flex items-center justify-center"
    );
    main.innerHTML = `
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-4">Product not found</h2>
        <p class="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <a href="#/products" class="btn btn-primary">Back to Products</a>
      </div>
    `;

    page.appendChild(main);
    page.appendChild(footer.create());

    return page;
  }

  private createBreadcrumb(): HTMLElement {
    const breadcrumb = createElement("div", "mb-6");

    breadcrumb.innerHTML = `
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <a href="#/" class="text-muted-foreground hover:text-primary">Home</a>
          </li>
          <li>
            <i data-lucide="chevron-right" class="h-4 w-4 text-muted-foreground"></i>
          </li>
          <li>
            <a href="#/products" class="text-muted-foreground hover:text-primary">Products</a>
          </li>
          <li>
            <i data-lucide="chevron-right" class="h-4 w-4 text-muted-foreground"></i>
          </li>
          <li>
            <a href="#/products?category=${encodeURIComponent(
              this.product!.category
            )}" class="text-muted-foreground hover:text-primary">
              ${this.product!.category}
            </a>
          </li>
          <li>
            <i data-lucide="chevron-right" class="h-4 w-4 text-muted-foreground"></i>
          </li>
          <li>
            <span class="text-foreground line-clamp-1">${
              this.product!.title
            }</span>
          </li>
        </ol>
      </nav>
    `;

    return breadcrumb;
  }

  private createBackButton(): HTMLElement {
    const backButton = createElement("button", "btn btn-ghost mb-6");

    backButton.innerHTML = `
      <i data-lucide="chevron-left" class="h-4 w-4 mr-2"></i>
      Back
    `;

    backButton.addEventListener("click", () => {
      window.history.back();
    });

    return backButton;
  }

  private createProductDetails(): HTMLElement {
    const container = createElement("div", "grid lg:grid-cols-2 gap-12 mb-16");

    const stars = this.renderStars(this.product!.rating.rate);

    container.innerHTML = `
      <div class="space-y-4">
        <div class="aspect-square bg-white rounded-lg border overflow-hidden">
          <img
            src="${this.product!.image}"
            alt="${this.product!.title}"
            class="w-full h-full object-contain p-8"
          />
        </div>

        <div class="grid grid-cols-4 gap-2">
          ${[...Array(4)]
            .map(
              (_, index) => `
            <button
              class="aspect-square bg-white rounded-lg border overflow-hidden ${
                index === 0 ? "ring-2 ring-primary" : ""
              }"
              onclick="this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary')); this.classList.add('ring-2', 'ring-primary');"
            >
              <img
                src="${this.product!.image}"
                alt="${this.product!.title}"
                class="w-full h-full object-contain p-2"
              />
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <span class="badge badge-secondary mb-3 ${getCategoryColor(
            this.product!.category
          )}">
            ${this.product!.category}
          </span>
          <h1 class="text-3xl font-bold mb-4">${this.product!.title}</h1>

          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center space-x-1">
              ${stars}
            </div>
            <span class="text-sm text-muted-foreground">
              ${this.product!.rating.rate} (${
      this.product!.rating.count
    } reviews)
            </span>
          </div>

          <div class="text-3xl font-bold text-primary mb-6">
            ${formatPrice(this.product!.price)}
          </div>
        </div>

        <hr class="border-border">

        <div>
          <h3 class="font-semibold mb-3">Description</h3>
          <p class="text-muted-foreground leading-relaxed">
            ${this.product!.description}
          </p>
        </div>

        <hr class="border-border">

        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <label class="font-medium">Quantity:</label>
            <div class="flex items-center border rounded-lg">
              <button
                class="btn btn-ghost btn-icon"
                onclick="this.nextElementSibling.textContent = Math.max(1, parseInt(this.nextElementSibling.textContent) - 1)"
              >
                <i data-lucide="minus" class="h-4 w-4"></i>
              </button>
              <span class="px-4 py-2 min-w-[3rem] text-center" id="quantity-display">1</span>
              <button
                class="btn btn-ghost btn-icon"
                onclick="this.previousElementSibling.textContent = parseInt(this.previousElementSibling.textContent) + 1"
              >
                <i data-lucide="plus" class="h-4 w-4"></i>
              </button>
            </div>
          </div>

          <div class="flex space-x-4">
            <button
              class="btn btn-primary btn-lg flex-1"
              onclick="window.addToCartWithQuantity('${
                this.product!.id
              }', parseInt(document.getElementById('quantity-display').textContent))"
            >
              <i data-lucide="shopping-cart" class="h-5 w-5 mr-2"></i>
              Add to Cart
            </button>
            <button class="btn btn-outline btn-lg">
              <i data-lucide="heart" class="h-5 w-5"></i>
            </button>
            <button class="btn btn-outline btn-lg">
              <i data-lucide="share-2" class="h-5 w-5"></i>
            </button>
          </div>
        </div>

        <hr class="border-border">

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card p-4 text-center">
            <i data-lucide="truck" class="h-8 w-8 text-primary mx-auto mb-2"></i>
            <h4 class="font-medium mb-1">Free Shipping</h4>
            <p class="text-sm text-muted-foreground">On orders over $50</p>
          </div>

          <div class="card p-4 text-center">
            <i data-lucide="refresh-cw" class="h-8 w-8 text-primary mx-auto mb-2"></i>
            <h4 class="font-medium mb-1">Easy Returns</h4>
            <p class="text-sm text-muted-foreground">30-day return policy</p>
          </div>

          <div class="card p-4 text-center">
            <i data-lucide="shield" class="h-8 w-8 text-primary mx-auto mb-2"></i>
            <h4 class="font-medium mb-1">Secure Payment</h4>
            <p class="text-sm text-muted-foreground">100% secure checkout</p>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  private createRelatedProducts(): HTMLElement {
    const section = createElement("section", "");

    section.innerHTML = `
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold">Related Products</h2>
        <a href="#/products?category=${encodeURIComponent(
          this.product!.category
        )}" class="btn btn-outline">
          View All
        </a>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" id="related-products">
        </div>
    `;

    const relatedContainer = section.querySelector("#related-products");
    if (relatedContainer) {
      this.relatedProducts.forEach((product) => {
        const productCard = new ProductCard(product);
        relatedContainer.appendChild(productCard.create());
      });
    }

    return section;
  }

  private renderStars(rating: number): string {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        '<i data-lucide="star" class="h-5 w-5 fill-yellow-400 text-yellow-400"></i>'
      );
    }

    if (hasHalfStar) {
      stars.push(
        '<i data-lucide="star" class="h-5 w-5 fill-yellow-400/50 text-yellow-400"></i>'
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('<i data-lucide="star" class="h-5 w-5 text-gray-300"></i>');
    }

    return stars.join("");
  }
}
