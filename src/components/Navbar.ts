import { createElement } from "@/utils/utils";
import { DarkMode } from "@/utils/darkMode";

export class Navbar {
  private isMenuOpen = false;
  private isProfileMenuOpen = false;

  create(): HTMLElement {
    const nav = createElement(
      "nav",
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    );

    nav.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <a href="#/" class="flex items-center space-x-2">
            <i data-lucide="shopping-bag" class="h-8 w-8 text-primary"></i>
            <span class="text-xl font-bold text-primary">The Violet</span>
          </a>

          <div class="hidden md:flex items-center space-x-8">
            <a href="#/products" class="text-foreground hover:text-primary transition-colors">
              All Products
            </a>
            <a href="#/products?category=men's clothing" class="text-foreground hover:text-primary transition-colors">
              Men
            </a>
            <a href="#/products?category=women's clothing" class="text-foreground hover:text-primary transition-colors">
              Women
            </a>
            <a href="#/products?category=jewelery" class="text-foreground hover:text-primary transition-colors">
              Jewelry
            </a>
          </div>

          <div class="hidden md:flex flex-1 max-w-md mx-8">
            <form class="flex w-full" id="search-form">
              <input
                type="text"
                placeholder="Search products..."
                class="input rounded-r-none flex-1"
                id="search-input"
              />
              <button
                type="submit"
                class="btn btn-outline btn-icon rounded-l-none border-l-0"
              >
                <i data-lucide="search" class="h-4 w-4"></i>
              </button>
            </form>
          </div>

          <div class="flex items-center space-x-4">
            <button
              class="btn btn-ghost btn-icon hidden md:flex"
              data-theme-toggle
              title="Toggle theme"
            >
              <i data-lucide="sun" data-sun-icon class="h-4 w-4"></i>
              <i data-lucide="moon" data-moon-icon class="h-4 w-4 hidden"></i>
            </button>

            <div class="relative" id="profile-dropdown">
              <button class="btn btn-ghost btn-icon" id="user-menu-button" aria-haspopup="true" aria-expanded="false">
                <i data-lucide="user" class="h-4 w-4"></i>
              </button>

              <div class="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50 hidden" id="profile-menu">
                <div class="py-2">
                  <button class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" id="login-option">
                    <i data-lucide="log-in" class="h-4 w-4 mr-3"></i>
                    Login
                  </button>
                  <button class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" id="logout-option">
                    <i data-lucide="log-out" class="h-4 w-4 mr-3"></i>
                    Logout
                  </button>
                  <hr class="my-2 border-border">
                  <button class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors" id="settings-option">
                    <i data-lucide="settings" class="h-4 w-4 mr-3"></i>
                    Settings
                  </button>
                </div>
              </div>
            </div>

            <button class="btn btn-ghost btn-icon relative" id="cart-button">
              <i data-lucide="shopping-cart" class="h-4 w-4"></i>
              <span class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs items-center justify-center hidden" id="cart-count">
                0
              </span>
            </button>

            <button
              class="btn btn-ghost btn-icon md:hidden"
              id="mobile-menu-toggle"
            >
              <i data-lucide="menu" class="h-4 w-4" id="menu-icon"></i>
              <i data-lucide="x" class="h-4 w-4 hidden" id="close-icon"></i>
            </button>
          </div>
        </div>

        <div class="md:hidden border-t py-4 space-y-4 hidden" id="mobile-menu">
          <form class="flex space-x-2" id="mobile-search-form">
            <input
              type="text"
              placeholder="Search products..."
              class="input flex-1"
              id="mobile-search-input"
            />
            <button type="submit" class="btn btn-primary btn-icon">
              <i data-lucide="search" class="h-4 w-4"></i>
            </button>
          </form>

          <div class="flex flex-col space-y-2">
            <a
              href="#/products"
              class="py-2 text-foreground hover:text-primary transition-colors"
            >
              All Products
            </a>
            <a
              href="#/products?category=men's clothing"
              class="py-2 text-foreground hover:text-primary transition-colors"
            >
              Men's Clothing
            </a>
            <a
              href="#/products?category=women's clothing"
              class="py-2 text-foreground hover:text-primary transition-colors"
            >
              Women's Clothing
            </a>
            <a
              href="#/products?category=jewelery"
              class="py-2 text-foreground hover:text-primary transition-colors"
            >
              Jewelry
            </a>
          </div>

          <button
            class="btn btn-ghost justify-start"
            data-theme-toggle
          >
            <i data-lucide="sun" data-sun-icon class="h-4 w-4 mr-2"></i>
            <i data-lucide="moon" data-moon-icon class="h-4 w-4 mr-2 hidden"></i>
            Toggle theme
          </button>

          <hr class="border-border">

          <div class="space-y-2">
            <button class="btn btn-ghost justify-start w-full" id="mobile-login-option">
              <i data-lucide="log-in" class="h-4 w-4 mr-2"></i>
              Login
            </button>
            <button class="btn btn-ghost justify-start w-full" id="mobile-logout-option">
              <i data-lucide="log-out" class="h-4 w-4 mr-2"></i>
              Logout
            </button>
            <button class="btn btn-ghost justify-start w-full" id="mobile-settings-option">
              <i data-lucide="settings" class="h-4 w-4 mr-2"></i>
              Settings
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(nav);
    return nav;
  }

  private attachEventListeners(nav: HTMLElement): void {
    const searchForm = nav.querySelector("#search-form") as HTMLFormElement;
    const mobileSearchForm = nav.querySelector(
      "#mobile-search-form"
    ) as HTMLFormElement;

    searchForm?.addEventListener("submit", (e) => this.handleSearch(e));
    mobileSearchForm?.addEventListener("submit", (e) => this.handleSearch(e));

    const mobileMenuToggle = nav.querySelector("#mobile-menu-toggle");
    mobileMenuToggle?.addEventListener("click", () =>
      this.toggleMobileMenu(nav)
    );

    const themeToggles = nav.querySelectorAll("[data-theme-toggle]");
    themeToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        DarkMode.toggle();
        if (window.lucide) {
          window.lucide.createIcons();
        }
      });
    });

    setTimeout(() => {
      DarkMode.refreshUI();
    }, 50);

    const mobileLinks = nav.querySelectorAll("#mobile-menu a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu(nav));
    });

    const cartButton = nav.querySelector("#cart-button");
    cartButton?.addEventListener("click", () => {
      (window as any).openCart();
    });

    const profileButton = nav.querySelector("#user-menu-button");
    const profileMenu = nav.querySelector("#profile-menu");

    profileButton?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleProfileMenu(nav);
    });

    const loginOption = nav.querySelector("#login-option");
    const logoutOption = nav.querySelector("#logout-option");
    const settingsOption = nav.querySelector("#settings-option");

    loginOption?.addEventListener("click", () => {
      this.handleLogin();
      this.closeProfileMenu(nav);
    });

    logoutOption?.addEventListener("click", () => {
      this.handleLogout();
      this.closeProfileMenu(nav);
    });

    settingsOption?.addEventListener("click", () => {
      this.handleSettings();
      this.closeProfileMenu(nav);
    });

    document.addEventListener("click", (e) => {
      const profileDropdown = nav.querySelector("#profile-dropdown");
      if (profileDropdown && !profileDropdown.contains(e.target as Node)) {
        this.closeProfileMenu(nav);
      }
    });

    const mobileLoginOption = nav.querySelector("#mobile-login-option");
    const mobileLogoutOption = nav.querySelector("#mobile-logout-option");
    const mobileSettingsOption = nav.querySelector("#mobile-settings-option");

    mobileLoginOption?.addEventListener("click", () => {
      this.handleLogin();
      this.closeMobileMenu(nav);
    });

    mobileLogoutOption?.addEventListener("click", () => {
      this.handleLogout();
      this.closeMobileMenu(nav);
    });

    mobileSettingsOption?.addEventListener("click", () => {
      this.handleSettings();
      this.closeMobileMenu(nav);
    });
  }

  private handleSearch(e: Event): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    const query = input.value.trim();

    if (query) {
      window.location.hash = `#/products?search=${encodeURIComponent(query)}`;
      input.value = "";
      this.closeMobileMenu(form.closest("nav") as HTMLElement);
    }
  }

  private toggleMobileMenu(nav: HTMLElement): void {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.closeProfileMenu(nav);
    }

    const mobileMenu = nav.querySelector("#mobile-menu");
    const menuIcon = nav.querySelector("#menu-icon");
    const closeIcon = nav.querySelector("#close-icon");

    if (this.isMenuOpen) {
      mobileMenu?.classList.remove("hidden");
      menuIcon?.classList.add("hidden");
      closeIcon?.classList.remove("hidden");
    } else {
      mobileMenu?.classList.add("hidden");
      menuIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
    }
  }

  private closeMobileMenu(nav: HTMLElement): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;

      const mobileMenu = nav.querySelector("#mobile-menu");
      const menuIcon = nav.querySelector("#menu-icon");
      const closeIcon = nav.querySelector("#close-icon");

      mobileMenu?.classList.add("hidden");
      menuIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
    }
  }

  private toggleProfileMenu(nav: HTMLElement): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;

    if (this.isProfileMenuOpen) {
      this.closeMobileMenu(nav);
    }

    const profileMenu = nav.querySelector("#profile-menu");
    const profileButton = nav.querySelector("#user-menu-button");

    if (this.isProfileMenuOpen) {
      profileMenu?.classList.remove("hidden");
      profileButton?.setAttribute("aria-expanded", "true");
    } else {
      profileMenu?.classList.add("hidden");
      profileButton?.setAttribute("aria-expanded", "false");
    }
  }

  private closeProfileMenu(nav: HTMLElement): void {
    if (this.isProfileMenuOpen) {
      this.isProfileMenuOpen = false;

      const profileMenu = nav.querySelector("#profile-menu");
      const profileButton = nav.querySelector("#user-menu-button");

      profileMenu?.classList.add("hidden");
      profileButton?.setAttribute("aria-expanded", "false");
    }
  }

  private handleLogin(): void {
    import("@/utils/utils").then(({ showToast }) => {
      showToast("Login functionality would be implemented here", "info");
    });
    console.log("Login clicked");
  }

  private handleLogout(): void {
    import("@/utils/utils").then(({ showToast }) => {
      showToast("Logout functionality would be implemented here", "info");
    });
    console.log("Logout clicked");
  }

  private handleSettings(): void {
    import("@/utils/utils").then(({ showToast }) => {
      showToast("Settings functionality would be implemented here", "info");
    });
    console.log("Settings clicked");
  }
}
