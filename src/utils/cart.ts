import { Product } from "@/types/product";
import { showToast } from "./utils";

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

export class CartManager {
  private static readonly STORAGE_KEY = "shopping-cart";
  private static items: CartItem[] = [];
  private static listeners: Array<() => void> = [];

  static init(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.items = JSON.parse(stored);
      }
      this.updateCartCount();
    } catch (error) {
      console.error("Failed to initialize cart:", error);
      this.items = [];
    }
  }

  static addToCart(product: Product, quantity: number = 1): void {
    try {
      const existingItemIndex = this.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        this.items[existingItemIndex].quantity += quantity;
        showToast(`Updated ${product.title} quantity in cart!`, "success");
      } else {
        this.items.push({
          product,
          quantity,
          addedAt: Date.now(),
        });
        showToast(`${product.title} added to cart!`, "success");
      }

      this.saveToStorage();
      this.updateCartCount();
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      showToast("Failed to add item to cart", "error");
    }
  }

  static removeFromCart(productId: string): void {
    try {
      const initialLength = this.items.length;
      this.items = this.items.filter((item) => item.product.id !== productId);

      if (this.items.length < initialLength) {
        showToast("Item removed from cart", "success");
        this.saveToStorage();
        this.updateCartCount();
        this.notifyListeners();
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      showToast("Failed to remove item from cart", "error");
    }
  }

  static updateQuantity(productId: string, quantity: number): void {
    try {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }

      const item = this.items.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
        this.saveToStorage();
        this.updateCartCount();
        this.notifyListeners();
      }
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      showToast("Failed to update item quantity", "error");
    }
  }

  static getItems(): CartItem[] {
    return [...this.items];
  }

  static getItemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  static getTotalPrice(): number {
    return this.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  static clearCart(): void {
    try {
      this.items = [];
      this.saveToStorage();
      this.updateCartCount();
      this.notifyListeners();
      showToast("Cart cleared", "success");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      showToast("Failed to clear cart", "error");
    }
  }

  static isInCart(productId: string): boolean {
    return this.items.some((item) => item.product.id === productId);
  }

  static getItemQuantity(productId: string): number {
    const item = this.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  static addListener(callback: () => void): void {
    this.listeners.push(callback);
  }

  static removeListener(callback: () => void): void {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  private static saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }

  private static updateCartCount(): void {
    const count = this.getItemCount();
    const cartCountElements = document.querySelectorAll("#cart-count");

    cartCountElements.forEach((element) => {
      if (count > 0) {
        element.textContent = count.toString();
        element.classList.remove("hidden");
        element.classList.add("flex");
      } else {
        element.classList.add("hidden");
        element.classList.remove("flex");
      }
    });
  }

  private static notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Cart listener error:", error);
      }
    });
  }
}
