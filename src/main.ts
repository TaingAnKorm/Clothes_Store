import { Router } from "./utils/router";
import { DarkMode } from "./utils/darkMode";
import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { showToast } from "./utils/utils";

let cartItems: any[] = [];

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

    const appContainer = document.getElementById("app");
    const loadingElement = document.getElementById("loading");

    if (appContainer && loadingElement) {
      appContainer.style.display = "flex";
      loadingElement.style.display = "none";
    }

    if (window.lucide) {
      window.lucide.createIcons();
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
