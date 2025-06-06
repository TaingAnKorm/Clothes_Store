import { Product } from "@/types/product";
import { createElement, formatPrice, getCategoryColor } from "@/utils/utils";

export class ProductCard {
  constructor(private product: Product) {}

  create(): HTMLElement {
    const card = createElement(
      "div",
      "card group overflow-hidden transition-all hover:shadow-lg",
    );

    const stars = this.renderStars(this.product.rating.rate);

    card.innerHTML = `
      <a href="#/products/${this.product.id}">
        <div class="relative overflow-hidden">
          <img
            src="${this.product.image}"
            alt="${this.product.title}"
            class="aspect-square w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute top-2 left-2">
            <span class="badge badge-secondary text-xs ${getCategoryColor(this.product.category)}">
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

      <div class="p-4">
        <a href="#/products/${this.product.id}">
          <h3 class="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
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

        <button 
          class="btn btn-primary w-full btn-sm"
          onclick="window.addToCart(${this.product.id})"
        >
          <i data-lucide="shopping-cart" class="h-4 w-4 mr-2"></i>
          Add to Cart
        </button>
      </div>
    `;

    return card;
  }

  private renderStars(rating: number): string {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        '<i data-lucide="star" class="h-4 w-4 fill-yellow-400 text-yellow-400"></i>',
      );
    }

    if (hasHalfStar) {
      stars.push(
        '<i data-lucide="star" class="h-4 w-4 fill-yellow-400/50 text-yellow-400"></i>',
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('<i data-lucide="star" class="h-4 w-4 text-gray-300"></i>');
    }

    return stars.join("");
  }
}

export class ProductCardSkeleton {
  create(): HTMLElement {
    const skeleton = createElement(
      "div",
      "card border p-4 space-y-4 animate-pulse",
    );

    skeleton.innerHTML = `
      <div class="aspect-square bg-muted rounded-lg"></div>
      <div class="space-y-2">
        <div class="h-4 bg-muted rounded"></div>
        <div class="h-4 bg-muted rounded w-3/4"></div>
        <div class="h-6 bg-muted rounded w-1/4"></div>
      </div>
    `;

    return skeleton;
  }
}
