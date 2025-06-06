import { DarkMode } from "./darkMode";

export interface Route {
  path: string;
  component: () => Promise<HTMLElement>;
  title?: string;
}

export class Router {
  private routes: Route[] = [];
  private currentRoute: Route | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    window.addEventListener("hashchange", () => this.handleRoute());
    window.addEventListener("load", () => this.handleRoute());
  }

  addRoute(route: Route): void {
    this.routes.push(route);
  }

  navigate(path: string): void {
    window.location.hash = path;
  }

  private async handleRoute(): Promise<void> {
    const path = window.location.hash.slice(1) || "/";
    const route = this.findRoute(path);

    if (!route) {
      this.navigate("/404");
      return;
    }

    this.currentRoute = route;

    if (route.title) {
      document.title = `${route.title} - The Violet`;
    }

    this.showLoading();

    try {
      const component = await route.component();
      this.container.innerHTML = "";
      this.container.appendChild(component);

      if (window.lucide) {
        window.lucide.createIcons();
      }
      // This is the new line that fixes the dark mode button
      DarkMode.refreshUI();
    } catch (error) {
      console.error("Error loading route:", error);
      this.showError("Failed to load page");
    } finally {
      this.hideLoading();
    }
  }

  private findRoute(path: string): Route | null {
    const [pathWithoutQuery] = path.split("?");

    let route = this.routes.find((r) => r.path === pathWithoutQuery);

    if (route) {
      return route;
    }

    route = this.routes.find((r) => {
      const routeParts = r.path.split("/");
      const pathParts = pathWithoutQuery.split("/");

      if (routeParts.length !== pathParts.length) return false;

      return routeParts.every((part, index) => {
        return part.startsWith(":") || part === pathParts[index];
      });
    });

    return route || null;
  }

  private showLoading(): void {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = "flex";
    }
  }

  private hideLoading(): void {
    const loading = document.getElementById("loading");
    if (loading) {
      loading.style.display = "none";
    }
  }

  private showError(message: string): void {
    this.container.innerHTML = `
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4 text-destructive">Error</h2>
          <p class="text-muted-foreground mb-4">${message}</p>
          <button class="btn btn-primary" onclick="window.location.reload()">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
