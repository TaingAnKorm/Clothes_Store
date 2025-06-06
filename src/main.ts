import { Router } from "./utils/router";
import { DarkMode } from "./utils/darkMode";
import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { showToast } from "./utils/utils";

// Global app state
let cartItems: any[] = [];

// Global functions for cart management
(window as any).addToCart = (productId: number) => {
  showToast("Product added to cart!", "success");
  console.log("Added product to cart:", productId);
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
    // Home page
    this.router.addRoute({
      path: "/",
      component: async () => {
        const homePage = new HomePage();
        return await homePage.create();
      },
      title: "Home",
    });

    // Products listing page
    this.router.addRoute({
      path: "/products",
      component: async () => {
        const productsPage = new ProductListPage();
        return await productsPage.create();
      },
      title: "Products",
    });

    // Product detail page
    this.router.addRoute({
      path: "/products/:id",
      component: async () => {
        const productDetailPage = new ProductDetailPage();
        return await productDetailPage.create();
      },
      title: "Product Details",
    });

    // 404 page
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
    // Initialize dark mode
    DarkMode.init();

    // Show the app container
    const appContainer = document.getElementById("app");
    const loadingElement = document.getElementById("loading");

    if (appContainer && loadingElement) {
      appContainer.style.display = "flex";
      loadingElement.style.display = "none";
    }

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    console.log("StyleStore app initialized");
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  showToast("An unexpected error occurred", "error");
});
