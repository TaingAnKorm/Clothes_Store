import { createElement } from "@/utils/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { productApi } from "@/api/api";
import { Product } from "@/types/product";

export class HomePage {
  private products: Product[] = [];
  private loading = true;
  private error: string | null = null;

  async create(): Promise<HTMLElement> {
    const page = createElement("div", "min-h-screen flex flex-col");

    const navbar = new Navbar();
    const footer = new Footer();

    page.appendChild(navbar.create());

    const heroSection = this.createHeroSection();
    page.appendChild(heroSection);

    const featuresSection = this.createFeaturesSection();
    page.appendChild(featuresSection);

    const categoriesSection = this.createCategoriesSection();
    page.appendChild(categoriesSection);

    const productsSection = this.createProductsSection();
    page.appendChild(productsSection);

    page.appendChild(footer.create());

    this.loadProducts();

    return page;
  }

  private createHeroSection(): HTMLElement {
    const section = createElement(
      "section",
      "relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32"
    );

    section.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <span class="badge badge-outline">
                <i data-lucide="zap" class="h-3 w-3 mr-1"></i>
                New Collection 2024
              </span>
              <h1 class="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Your
                <span class="text-primary block">Perfect Style</span>
              </h1>
              <p class="text-lg text-muted-foreground max-w-lg">
                Explore our curated collection of premium clothing and stunning jewelry.
                Quality meets affordability in every piece.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <a href="#/products" class="btn btn-primary btn-lg">
                Shop Now
                <i data-lucide="arrow-right" class="ml-2 h-5 w-5"></i>
              </a>
              <button class="btn btn-outline btn-lg">
                View Collections
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-4">
                <div class="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center">
                  <i data-lucide="shopping-bag" class="h-16 w-16 text-blue-600 dark:text-blue-400"></i>
                </div>
                <div class="aspect-[4/3] bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 rounded-2xl flex items-center justify-center">
                  <i data-lucide="heart" class="h-12 w-12 text-pink-600 dark:text-pink-400"></i>
                </div>
              </div>
              <div class="space-y-4 pt-8">
                <div class="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-2xl flex items-center justify-center">
                  <i data-lucide="award" class="h-12 w-12 text-green-600 dark:text-green-400"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-2xl flex items-center justify-center">
                  <i data-lucide="star" class="h-16 w-16 text-purple-600 dark:text-purple-400"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return section;
  }

  private createFeaturesSection(): HTMLElement {
    const section = createElement("section", "py-16 border-b");

    section.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center space-y-3">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <i data-lucide="truck" class="h-6 w-6 text-primary"></i>
            </div>
            <h3 class="font-semibold">Free Shipping</h3>
            <p class="text-sm text-muted-foreground">
              Free shipping on orders over $50
            </p>
          </div>
          <div class="text-center space-y-3">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <i data-lucide="shield" class="h-6 w-6 text-primary"></i>
            </div>
            <h3 class="font-semibold">Secure Payment</h3>
            <p class="text-sm text-muted-foreground">
              100% secure payment processing
            </p>
          </div>
          <div class="text-center space-y-3">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <i data-lucide="refresh-cw" class="h-6 w-6 text-primary"></i>
            </div>
            <h3 class="font-semibold">Easy Returns</h3>
            <p class="text-sm text-muted-foreground">
              30-day hassle-free returns
            </p>
          </div>
          <div class="text-center space-y-3">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <i data-lucide="star" class="h-6 w-6 text-primary"></i>
            </div>
            <h3 class="font-semibold">Premium Quality</h3>
            <p class="text-sm text-muted-foreground">
              Carefully curated products
            </p>
          </div>
        </div>
      </div>
    `;

    return section;
  }

  private createCategoriesSection(): HTMLElement {
    const section = createElement("section", "py-16");

    section.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Shop by Category</h2>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collections designed to suit every style and occasion
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="#/products?category=men's clothing" class="group">
            <div class="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-transform group-hover:scale-105">
              <h3 class="text-white font-semibold text-lg mb-2">Men's Fashion</h3>
              <div class="flex items-center text-white/80 text-sm">
                Shop now
                <i data-lucide="arrow-right" class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"></i>
              </div>
            </div>
          </a>

          <a href="#/products?category=women's clothing" class="group">
            <div class="relative h-48 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-transform group-hover:scale-105">
              <h3 class="text-white font-semibold text-lg mb-2">Women's Fashion</h3>
              <div class="flex items-center text-white/80 text-sm">
                Shop now
                <i data-lucide="arrow-right" class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"></i>
              </div>
            </div>
          </a>

          <a href="#/products?category=jewelery" class="group">
            <div class="relative h-48 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-transform group-hover:scale-105">
              <h3 class="text-white font-semibold text-lg mb-2">Jewelry</h3>
              <div class="flex items-center text-white/80 text-sm">
                Shop now
                <i data-lucide="arrow-right" class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"></i>
              </div>
            </div>
          </a>
        </div>
      </div>
    `;

    return section;
  }

  private createProductsSection(): HTMLElement {
    const section = createElement("section", "py-16 bg-muted/30");

    section.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Featured Products</h2>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            Handpicked items that our customers love most
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" id="featured-products">
          </div>

        <div class="text-center mt-12">
          <a href="#/products" class="btn btn-primary btn-lg">
            View All Products
            <i data-lucide="arrow-right" class="ml-2 h-5 w-5"></i>
          </a>
        </div>
      </div>
    `;

    return section;
  }

  private async loadProducts(): Promise<void> {
    const container = document.getElementById("featured-products");
    if (!container) return;

    try {
      container.innerHTML = "";
      for (let i = 0; i < 8; i++) {
        const skeleton = new ProductCardSkeleton();
        container.appendChild(skeleton.create());
      }

      this.products = await productApi.getFeaturedProducts(8);

      container.innerHTML = "";
      this.products.forEach((product) => {
        const productCard = new ProductCard(product);
        container.appendChild(productCard.create());
      });

      if (window.lucide) {
        window.lucide.createIcons();
        import("@/utils/darkMode").then(({ DarkMode }) => {
          DarkMode.refreshUI();
        });
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-destructive mb-4">Failed to load products</p>
          <button class="btn btn-outline" onclick="window.location.reload()">
            Try Again
          </button>
        </div>
      `;
    }
  }
}
