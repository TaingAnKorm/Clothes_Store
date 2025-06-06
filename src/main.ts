import { Router } from "./utils/router";
import { DarkMode } from "./utils/darkMode";
import { CartManager } from "./utils/cart";
import { CartModal } from "./components/CartModal";
import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { showToast, formatPrice } from "./utils/utils";
import { productApi } from "./api/api";

let cartModal: CartModal | null = null;

(window as any).addToCart = async (productId: string) => {
  try {
    const product = await productApi.getProduct(productId);
    if (product) {
      CartManager.addToCart(product);
    } else {
      showToast("Product not found", "error");
    }
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    showToast("Failed to add product to cart", "error");
  }
};

(window as any).addToCartWithQuantity = async (
  productId: string,
  quantity: number
) => {
  try {
    const product = await productApi.getProduct(productId);
    if (product) {
      CartManager.addToCart(product, quantity);
    } else {
      showToast("Product not found", "error");
    }
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    showToast("Failed to add product to cart", "error");
  }
};

(window as any).removeFromCart = (productId: string) => {
  CartManager.removeFromCart(productId);
};

(window as any).updateCartQuantity = (productId: string, quantity: number) => {
  CartManager.updateQuantity(productId, quantity);
};

(window as any).openCart = () => {
  cartModal?.open();
};

(window as any).closeCart = () => {
  cartModal?.close();
};

(window as any).proceedToCheckout = () => {
  const items = CartManager.getItems();
  const total = CartManager.getTotalPrice();

  if (items.length === 0) {
    showToast("Your cart is empty", "error");
    return;
  }

  showToast(`Checkout complete! Total: ${formatPrice(total)}`, "success");
  CartManager.clearCart();
  cartModal?.close();
};

class App {
  private router: Router;

  constructor() {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
      throw new Error("App container not found");
    }

    this.router = new Router(appContainer);
    this.setupRoutes();
    this.init();
  }

  private setupRoutes(): void {
    this.router.addRoute({
      path: "/",
      component: async () => {
        const homePage = new HomePage();
        return await homePage.create();
      },
      title: "Home",
    });

    this.router.addRoute({
      path: "/products",
      component: async () => {
        const productsPage = new ProductListPage();
        return await productsPage.create();
      },
      title: "Products",
    });

    this.router.addRoute({
      path: "/products/:id",
      component: async () => {
        const productDetailPage = new ProductDetailPage();
        return await productDetailPage.create();
      },
      title: "Product Details",
    });

    this.router.addRoute({
      path: "/404",
      component: async () => {
        const container = document.createElement("div");
        container.className = "flex-1 flex items-center justify-center";
        container.innerHTML = `
          <div class="text-center">
            <div class="text-8xl mb-4">🔍</div>
            <h1 class="text-4xl font-bold mb-4">Page Not Found</h1>
            <p class="text-muted-foreground mb-6">
              The page you're looking for doesn't exist.
            </p>
            <a href="#/" class="btn btn-primary">
              Go Home
            </a>
          </div>
        `;
        return container;
      },
      title: "Page Not Found",
    });
  }

  private init(): void {
    DarkMode.init();
    CartManager.init();

    const appContainer = document.getElementById("app");
    const loadingElement = document.getElementById("loading");

    if (appContainer && loadingElement) {
      appContainer.style.display = "flex";
      loadingElement.style.display = "none";
    }

    cartModal = new CartModal();
    document.body.appendChild(cartModal.create());

    if (window.lucide) {
      window.lucide.createIcons();
      setTimeout(() => {
        DarkMode.refreshUI();
      }, 100);
    }

    console.log("StyleStore app initialized");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  showToast("An unexpected error occurred", "error");
});
