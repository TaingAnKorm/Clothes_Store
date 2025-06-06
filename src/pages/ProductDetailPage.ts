import { Product } from "../types/Product.js";
import { productApi } from "../api/productApi.js";
import { ProductCard } from "../components/ProductCard.js";
import { LoadingSpinner } from "../components/LoadingSpinner.js";
import { router } from "../utils/router.js";

export class ProductDetailPage {
  private product: Product | null = null;
  private relatedProducts: Product[] = [];
  private quantity: number = 1;
  private selectedImageIndex: number = 0;
  private element: HTMLElement | null = null;

  async render(productId: string): Promise<HTMLElement> {
    const main = document.createElement("main");
    main.className = "flex-1";

    try {
      // Load product data
      this.product = await productApi.getProduct(productId);

      main.innerHTML = `
        <div class="container mx-auto px-4 py-6">
          <!-- Breadcrumb -->
          <nav class="mb-6" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#home" class="hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
              <li><span class="mx-2">/</span></li>
              <li><a href="#products" class="hover:text-blue-600 dark:hover:text-blue-400">Products</a></li>
              <li><span class="mx-2">/</span></li>
              <li><a href="#products?category=${encodeURIComponent(this.product.category)}" class="hover:text-blue-600 dark:hover:text-blue-400">${productApi.getCategoryDisplayName(this.product.category)}</a></li>
              <li><span class="mx-2">/</span></li>
              <li class="text-gray-900 dark:text-gray-100 truncate">${this.product.title}</li>
            </ol>
          </nav>

          <!-- Back Button -->
          <button id="back-btn" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <!-- Product Details -->
          <div class="grid lg:grid-cols-2 gap-12 mb-16">
            <!-- Product Images -->
            <div class="space-y-4">
              <div class="aspect-square bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <img
                  id="main-image"
                  src="${this.product.image}"
                  alt="${this.product.title}"
                  class="w-full h-full object-contain p-8"
                />
              </div>
              
              <!-- Thumbnail images -->
              <div class="grid grid-cols-4 gap-2">
                ${Array.from(
                  { length: 4 },
                  (_, index) => `
                  <button
                    class="thumbnail-btn aspect-square bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${index === 0 ? "ring-2 ring-blue-500" : ""}"
                    data-index="${index}"
                  >
                    <img
                      src="${this.product.image}"
                      alt="${this.product.title}"
                      class="w-full h-full object-contain p-2"
                    />
                  </button>
                `,
                ).join("")}
              </div>
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
              <div>
                <span class="${this.getCategoryBadgeClasses(this.product.category)} mb-3">
                  ${productApi.getCategoryDisplayName(this.product.category)}
                </span>
                <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">${this.product.title}</h1>
                
                <div class="flex items-center space-x-4 mb-4">
                  <div class="flex items-center space-x-1">
                    ${this.renderStars(this.product.rating.rate)}
                  </div>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    ${this.product.rating.rate} (${this.product.rating.count} reviews)
                  </span>
                </div>

                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                  ${productApi.formatPrice(this.product.price)}
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 class="font-semibold mb-3 text-gray-900 dark:text-gray-100">Description</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                  ${this.product.description}
                </p>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <!-- Quantity and Add to Cart -->
                <div class="space-y-4">
                  <div class="flex items-center space-x-4">
                    <label class="font-medium text-gray-900 dark:text-gray-100">Quantity:</label>
                    <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button id="decrease-qty" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                      </button>
                      <span id="quantity" class="px-4 py-2 min-w-[3rem] text-center text-gray-900 dark:text-gray-100">${this.quantity}</span>
                      <button id="increase-qty" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="flex space-x-4">
                    <button id="add-to-cart" class="flex-1 btn-primary text-lg py-3">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                      </svg>
                      <span id="cart-btn-text">Add to Cart</span>
                    </button>
                    <button id="wishlist-btn" class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button id="share-btn" class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <!-- Features -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <svg class="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h4 class="font-medium mb-1 text-gray-900 dark:text-gray-100">Free Shipping</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">On orders over $50</p>
                  </div>
                  
                  <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <svg class="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <h4 class="font-medium mb-1 text-gray-900 dark:text-gray-100">Easy Returns</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">30-day return policy</p>
                  </div>
                  
                  <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <svg class="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h4 class="font-medium mb-1 text-gray-900 dark:text-gray-100">Secure Payment</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Products -->
          <section id="related-products-section" class="hidden">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Related Products</h2>
              <a href="#products?category=${encodeURIComponent(this.product.category)}" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                View All
              </a>
            </div>
            
            <div id="related-products-container" class="product-grid">
              <!-- Related products will be loaded here -->
            </div>
          </section>
        </div>
      `;

      this.element = main;
      this.setupEventListeners();
      await this.loadRelatedProducts();
    } catch (error) {
      console.error("Error loading product:", error);
      main.innerHTML = this.renderErrorState();
    }

    return main;
  }

  private getCategoryBadgeClasses(category: string): string {
    const baseClasses =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

    switch (category.toLowerCase()) {
      case "men's clothing":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case "women's clothing":
        return `${baseClasses} bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300`;
      case "electronics":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case "jewelery":
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300`;
    }
  }

  private renderStars(rating: number): string {
    let starsHtml = "";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHtml += `
        <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      `;
    }

    // Half star
    if (hasHalfStar) {
      starsHtml += `
        <svg class="w-5 h-5 text-yellow-400" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half-star-${this.product?.id}">
              <stop offset="50%" stop-color="currentColor" />
              <stop offset="50%" stop-color="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star-${this.product?.id})" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      `;
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += `
        <svg class="w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      `;
    }

    return starsHtml;
  }

  private setupEventListeners(): void {
    if (!this.element || !this.product) return;

    // Back button
    const backBtn = this.element.querySelector("#back-btn");
    backBtn?.addEventListener("click", () => router.goBack());

    // Quantity controls
    const decreaseBtn = this.element.querySelector("#decrease-qty");
    const increaseBtn = this.element.querySelector("#increase-qty");

    decreaseBtn?.addEventListener("click", () => this.adjustQuantity(-1));
    increaseBtn?.addEventListener("click", () => this.adjustQuantity(1));

    // Action buttons
    const addToCartBtn = this.element.querySelector("#add-to-cart");
    const wishlistBtn = this.element.querySelector("#wishlist-btn");
    const shareBtn = this.element.querySelector("#share-btn");

    addToCartBtn?.addEventListener("click", () => this.handleAddToCart());
    wishlistBtn?.addEventListener("click", () => this.handleWishlistToggle());
    shareBtn?.addEventListener("click", () => this.handleShare());

    // Thumbnail images
    const thumbnailBtns = this.element.querySelectorAll(".thumbnail-btn");
    thumbnailBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => this.selectImage(index));
    });
  }

  private adjustQuantity(delta: number): void {
    this.quantity = Math.max(1, this.quantity + delta);
    const quantityEl = this.element?.querySelector("#quantity");
    if (quantityEl) {
      quantityEl.textContent = this.quantity.toString();
    }

    // Update button states
    const decreaseBtn = this.element?.querySelector(
      "#decrease-qty",
    ) as HTMLButtonElement;
    if (decreaseBtn) {
      decreaseBtn.disabled = this.quantity <= 1;
      decreaseBtn.classList.toggle("opacity-50", this.quantity <= 1);
    }
  }

  private handleAddToCart(): void {
    if (!this.product) return;

    const cartBtn = this.element?.querySelector("#add-to-cart");
    const cartBtnText = this.element?.querySelector("#cart-btn-text");

    if (cartBtn && cartBtnText) {
      // Show loading state
      cartBtn.setAttribute("disabled", "true");
      cartBtnText.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Adding...
      `;

      // Simulate adding to cart
      setTimeout(() => {
        cartBtn.removeAttribute("disabled");
        cartBtnText.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart
        `;

        this.showToast(`${this.product!.title} added to cart!`, "success");

        // Reset button after 2 seconds
        setTimeout(() => {
          cartBtnText.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            Add to Cart
          `;
        }, 2000);
      }, 1000);
    }
  }

  private handleWishlistToggle(): void {
    if (!this.product) return;
    this.showToast(`${this.product.title} added to wishlist!`, "success");
  }

  private handleShare(): void {
    if (!this.product) return;

    if (navigator.share) {
      navigator.share({
        title: this.product.title,
        text: this.product.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showToast("Product link copied to clipboard!", "success");
      });
    }
  }

  private selectImage(index: number): void {
    this.selectedImageIndex = index;

    // Update thumbnail selection
    const thumbnails = this.element?.querySelectorAll(".thumbnail-btn");
    thumbnails?.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add("ring-2", "ring-blue-500");
      } else {
        thumb.classList.remove("ring-2", "ring-blue-500");
      }
    });

    // In a real app, you would update the main image here
    // For this demo, we're using the same image for all thumbnails
  }

  private async loadRelatedProducts(): Promise<void> {
    if (!this.product) return;

    try {
      const allProducts = await productApi.getProductsByCategory(
        this.product.category,
      );
      this.relatedProducts = allProducts
        .filter((p) => p.id !== this.product!.id)
        .slice(0, 4);

      if (this.relatedProducts.length > 0) {
        const section = this.element?.querySelector(
          "#related-products-section",
        );
        const container = this.element?.querySelector(
          "#related-products-container",
        );

        if (section && container) {
          section.classList.remove("hidden");

          container.innerHTML = "";
          this.relatedProducts.forEach((product) => {
            const productCard = new ProductCard(product);
            container.appendChild(productCard.render());
          });
        }
      }
    } catch (error) {
      console.error("Error loading related products:", error);
    }
  }

  private renderErrorState(): string {
    return `
      <div class="container mx-auto px-4 py-16">
        <div class="text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Product not found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <div class="space-x-4">
            <button class="btn-primary" onclick="window.location.hash='products'">
              Browse Products
            </button>
            <button class="btn-secondary" onclick="window.history.back()">
              Go Back
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private showToast(message: string, type: "success" | "error"): void {
    const toast = document.getElementById(`${type}-toast`);
    const messageEl = document.getElementById(`${type}-message`);

    if (toast && messageEl) {
      messageEl.textContent = message;
      toast.classList.remove("translate-x-full");
      toast.classList.add("translate-x-0");

      setTimeout(() => {
        toast.classList.remove("translate-x-0");
        toast.classList.add("translate-x-full");
      }, 3000);
    }
  }
}
