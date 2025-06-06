import { createElement, formatPrice } from "@/utils/utils";
import { CartManager, CartItem } from "@/utils/cart";

export class CartModal {
  private modal: HTMLElement | null = null;
  private isOpen = false;

  create(): HTMLElement {
    const overlay = createElement(
      "div",
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden opacity-0 transition-all duration-300"
    );
    overlay.id = "cart-modal-overlay";

    overlay.innerHTML = `
      <div class="fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-xl transform translate-x-full transition-transform duration-300" id="cart-modal">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold">Shopping Cart</h2>
            <button class="btn btn-ghost btn-icon" id="close-cart">
              <i data-lucide="x" class="h-4 w-4"></i>
            </button>
          </div>

          <!-- Cart Items -->
          <div class="flex-1 overflow-y-auto p-4" id="cart-items-container">
            <!-- Items will be inserted here -->
          </div>

          <!-- Footer -->
          <div class="border-t p-4 space-y-4" id="cart-footer">
            <!-- Footer content will be inserted here -->
          </div>
        </div>
      </div>
    `;

    this.modal = overlay;
    this.attachEventListeners();
    this.renderCartItems();

    CartManager.addListener(() => this.renderCartItems());

    return overlay;
  }

  open(): void {
    if (!this.modal) return;

    this.isOpen = true;
    this.renderCartItems();

    this.modal.classList.remove("hidden");

    this.modal.offsetHeight;

    this.modal.classList.remove("opacity-0");
    const cartModal = this.modal.querySelector("#cart-modal");
    cartModal?.classList.remove("translate-x-full");

    document.body.style.overflow = "hidden";
  }

  close(): void {
    if (!this.modal) return;

    this.isOpen = false;

    this.modal.classList.add("opacity-0");
    const cartModal = this.modal.querySelector("#cart-modal");
    cartModal?.classList.add("translate-x-full");

    setTimeout(() => {
      this.modal?.classList.add("hidden");
      document.body.style.overflow = "";
    }, 300);
  }

  private attachEventListeners(): void {
    if (!this.modal) return;

    const closeButton = this.modal.querySelector("#close-cart");
    closeButton?.addEventListener("click", () => this.close());

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  private renderCartItems(): void {
    if (!this.modal) return;

    const container = this.modal.querySelector("#cart-items-container");
    const footer = this.modal.querySelector("#cart-footer");

    if (!container || !footer) return;

    const items = CartManager.getItems();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center">
          <div class="text-6xl mb-4">🛒</div>
          <h3 class="text-lg font-medium mb-2">Your cart is empty</h3>
          <p class="text-muted-foreground mb-4">Add some products to get started!</p>
          <button class="btn btn-primary" onclick="document.getElementById('cart-modal-overlay').querySelector('#close-cart').click()">
            Continue Shopping
          </button>
        </div>
      `;
      footer.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${items.map((item) => this.renderCartItem(item)).join("")}
      </div>
    `;

    const totalPrice = CartManager.getTotalPrice();
    const itemCount = CartManager.getItemCount();

    footer.innerHTML = `
      <div class="space-y-3">
        <div class="flex justify-between items-center text-sm">
          <span class="text-muted-foreground">Items (${itemCount})</span>
          <span class="font-medium">${formatPrice(totalPrice)}</span>
        </div>

        <div class="flex justify-between items-center font-semibold text-lg border-t pt-3">
          <span>Total</span>
          <span class="text-primary">${formatPrice(totalPrice)}</span>
        </div>

        <button class="btn btn-primary w-full" onclick="window.proceedToCheckout()">
          <i data-lucide="credit-card" class="h-4 w-4 mr-2"></i>
          Checkout
        </button>

        <button class="btn btn-outline w-full" onclick="document.getElementById('cart-modal-overlay').querySelector('#close-cart').click()">
          Continue Shopping
        </button>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  private renderCartItem(item: CartItem): string {
    return `
      <div class="flex gap-3 p-3 border rounded-lg">
        <img
          src="${item.product.image}"
          alt="${item.product.title}"
          class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />

        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-sm line-clamp-2 mb-1">${
            item.product.title
          }</h4>
          <p class="text-xs text-muted-foreground mb-2">${
            item.product.category
          }</p>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                class="btn btn-ghost btn-icon h-6 w-6 text-xs"
                onclick="window.updateCartQuantity('${item.product.id}', ${
      item.quantity - 1
    })"
                ${item.quantity <= 1 ? "disabled" : ""}
              >
                <i data-lucide="minus" class="h-3 w-3"></i>
              </button>

              <span class="text-sm font-medium w-8 text-center">${
                item.quantity
              }</span>

              <button
                class="btn btn-ghost btn-icon h-6 w-6 text-xs"
                onclick="window.updateCartQuantity('${item.product.id}', ${
      item.quantity + 1
    })"
              >
                <i data-lucide="plus" class="h-3 w-3"></i>
              </button>
            </div>

            <div class="text-right">
              <div class="text-sm font-medium">${formatPrice(
                item.product.price * item.quantity
              )}</div>
              <div class="text-xs text-muted-foreground">${formatPrice(
                item.product.price
              )} each</div>
            </div>
          </div>
        </div>

        <button
          class="btn btn-ghost btn-icon h-6 w-6 text-destructive flex-shrink-0"
          onclick="window.removeFromCart('${item.product.id}')"
          title="Remove item"
        >
          <i data-lucide="trash-2" class="h-3 w-3"></i>
        </button>
      </div>
    `;
  }
}
