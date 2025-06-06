export interface Route {
  path: string;
  component: () => Promise<HTMLElement>;
  title?: string;
}

export class Router {
  private routes: Route[] = [];
  private currentRoute: Route | null = null;

  constructor(private container: HTMLElement) {
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
    const hash = window.location.hash.slice(1) || "/";
    const route = this.findRoute(hash);

    if (!route) {
      this.navigate("/404");
      return;
    }

    this.currentRoute = route;

    // Update page title
    if (route.title) {
      document.title = `${route.title} - StyleStore`;
    }

    // Show loading
    this.showLoading();

    try {
      // Load component
      const component = await route.component();

      // Clear container and add new component
      this.container.innerHTML = "";
      this.container.appendChild(component);

      // Initialize Lucide icons for the new content
      if (window.lucide) {
        window.lucide.createIcons();
      }
    } catch (error) {
      console.error("Error loading route:", error);
      this.showError("Failed to load page");
    } finally {
      this.hideLoading();
    }
  }

  private findRoute(path: string): Route | null {
    // Exact match first
    let route = this.routes.find((r) => r.path === path);

    if (!route) {
      // Try pattern matching for dynamic routes
      route = this.routes.find((r) => {
        const routeParts = r.path.split("/");
        const pathParts = path.split("/");

        if (routeParts.length !== pathParts.length) return false;

        return routeParts.every((part, index) => {
          return part.startsWith(":") || part === pathParts[index];
        });
      });
    }

    return route || null;
  }

  getRouteParams(): Record<string, string> {
    if (!this.currentRoute) return {};

    const hash = window.location.hash.slice(1) || "/";
    const routeParts = this.currentRoute.path.split("/");
    const pathParts = hash.split("/");
    const params: Record<string, string> = {};

    routeParts.forEach((part, index) => {
      if (part.startsWith(":")) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[index];
      }
    });

    return params;
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
