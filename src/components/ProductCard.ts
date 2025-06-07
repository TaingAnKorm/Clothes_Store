import { Product } from "@/types/product";
import { createElement, formatPrice, getCategoryColor } from "@/utils/utils";
import { CartManager } from "@/utils/cart";

export class ProductCard {
  constructor(private product: Product) {}

  create(): HTMLElement {
    const card = createElement(
      "div",
      "card group overflow-hidden transition-all hover:shadow-lg h-full flex flex-col"
    );

    const stars = this.renderStars(this.product.rating.rate);

    card.innerHTML = `
      <a href="#/products/${this.product.id}" class="flex-shrink-0">
        <div class="relative overflow-hidden">
          <img
            src="${this.product.image}"
            alt="${this.product.title}"
            class="aspect-square w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute top-2 left-2">
            <span class="badge badge-secondary text-xs ${getCategoryColor(
              this.product.category
            )}">
              ${this.product.category}
            </span>
          </div>
          <button
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity btn btn-ghost btn-icon bg-white/80 hover:bg-white"
            onclick="event.preventDefault(); event.stopPropagation();"
          >
            <i data-lucide="heart" class="h-4 w-4"></i>
          </button>
        </div>
      </a>

      <div class="p-4 flex flex-col flex-grow">
        <div class="flex-grow">
          <a href="#/products/${this.product.id}">
            <h3 class="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors min-h-[2.5rem]">
              ${this.product.title}
            </h3>
          </a>

          <div class="flex items-center space-x-1 mb-2">
            ${stars}
            <span class="text-sm text-muted-foreground ml-1">
              (${this.product.rating.count})
            </span>
          </div>

          <div class="flex items-center justify-between mb-4">
            <span class="text-lg font-bold text-primary">
              ${formatPrice(this.product.price)}
            </span>
          </div>
        </div>

        <button
          class="btn btn-primary w-full btn-sm add-to-cart-btn mt-auto"
          onclick="window.addToCart('${this.product.id}')"
          data-product-id="${this.product.id}"
        >
          <i data-lucide="shopping-cart" class="h-4 w-4 mr-2"></i>
          <span class="btn-text">Add to Cart</span>
        </button>
      </div>
    `;

    this.updateCartButtonState(card);

    const updateHandler = () => this.updateCartButtonState(card);
    CartManager.addListener(updateHandler);

    return card;
  }

  private renderStars(rating: number): string {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        '<i data-lucide="star" class="h-4 w-4 fill-yellow-400 text-yellow-400"></i>'
      );
    }

    if (hasHalfStar) {
      stars.push(
        '<i data-lucide="star" class="h-4 w-4 fill-yellow-400/50 text-yellow-400"></i>'
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('<i data-lucide="star" class="h-4 w-4 text-gray-300"></i>');
    }

    return stars.join("");
  }

  private updateCartButtonState(card: HTMLElement): void {
    const button = card.querySelector(".add-to-cart-btn") as HTMLButtonElement;
    const buttonText = button?.querySelector(".btn-text");

    if (!button || !buttonText) return;

    const quantity = CartManager.getItemQuantity(this.product.id);

    if (quantity > 0) {
      button.classList.remove("btn-primary");
      button.classList.add("btn-secondary");
      buttonText.textContent = `In Cart (${quantity})`;
    } else {
      button.classList.remove("btn-secondary");
      button.classList.add("btn-primary");
      buttonText.textContent = "Add to Cart";
    }
  }
}

export class ProductCardSkeleton {
  create(): HTMLElement {
    const skeleton = createElement(
      "div",
      "card border h-full flex flex-col animate-pulse"
    );

    skeleton.innerHTML = `
      <div class="aspect-square bg-muted rounded-t-lg flex-shrink-0"></div>
      <div class="p-4 flex flex-col flex-grow">
        <div class="flex-grow space-y-2">
          <div class="h-4 bg-muted rounded"></div>
          <div class="h-4 bg-muted rounded w-3/4"></div>
          <div class="h-6 bg-muted rounded w-1/4 mt-4"></div>
        </div>
        <div class="h-8 bg-muted rounded mt-4"></div>
      </div>
    `;

    return skeleton;
  }
}
