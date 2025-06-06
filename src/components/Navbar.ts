import { createElement, updateUrlParams } from "@/utils/utils";
import { DarkMode } from "@/utils/darkMode";

export class Navbar {
  private isMenuOpen = false;
  private searchQuery = "";

  create(): HTMLElement {
    const nav = createElement(
      "nav",
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    );

    nav.innerHTML = `
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <a href="#/" class="flex items-center space-x-2">
            <i data-lucide="shopping-bag" class="h-8 w-8 text-primary"></i>
            <span class="text-xl font-bold text-primary">StyleStore</span>
          </a>

          <!-- Desktop Navigation -->
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
            <a href="#/products?category=electronics" class="text-foreground hover:text-primary transition-colors">
              Electronics
            </a>
            <a href="#/products?category=jewelery" class="text-foreground hover:text-primary transition-colors">
              Jewelry
            </a>
          </div>

          <!-- Search Bar -->
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

          <!-- Right side actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              class="btn btn-ghost btn-icon hidden md:flex"
              data-theme-toggle
              title="Toggle theme"
            >
              <i data-lucide="sun" data-sun-icon class="h-4 w-4"></i>
              <i data-lucide="moon" data-moon-icon class="h-4 w-4 hidden"></i>
            </button>

            <!-- User Menu -->
            <div class="relative">
              <button class="btn btn-ghost btn-icon" id="user-menu-button">
                <i data-lucide="user" class="h-4 w-4"></i>
              </button>
            </div>

            <!-- Cart -->
            <button class="btn btn-ghost btn-icon relative" id="cart-button">
              <i data-lucide="shopping-cart" class="h-4 w-4"></i>
              <span class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center hidden" id="cart-count">
                0
              </span>
            </button>

            <!-- Mobile menu button -->
            <button
              class="btn btn-ghost btn-icon md:hidden"
              id="mobile-menu-toggle"
            >
              <i data-lucide="menu" class="h-4 w-4" id="menu-icon"></i>
              <i data-lucide="x" class="h-4 w-4 hidden" id="close-icon"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div class="md:hidden border-t py-4 space-y-4 hidden" id="mobile-menu">
          <!-- Mobile Search -->
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

          <!-- Mobile Navigation Links -->
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
              href="#/products?category=electronics" 
              class="py-2 text-foreground hover:text-primary transition-colors"
            >
              Electronics
            </a>
            <a 
              href="#/products?category=jewelery" 
              class="py-2 text-foreground hover:text-primary transition-colors"
            >
              Jewelry
            </a>
          </div>

          <!-- Mobile Theme Toggle -->
          <button
            class="btn btn-ghost justify-start"
            data-theme-toggle
          >
            <i data-lucide="sun" data-sun-icon class="h-4 w-4 mr-2"></i>
            <i data-lucide="moon" data-moon-icon class="h-4 w-4 mr-2 hidden"></i>
            Toggle theme
          </button>
        </div>
      </div>
    `;

    this.attachEventListeners(nav);
    return nav;
  }

  private attachEventListeners(nav: HTMLElement): void {
    // Search form handlers
    const searchForm = nav.querySelector("#search-form") as HTMLFormElement;
    const mobileSearchForm = nav.querySelector(
      "#mobile-search-form",
    ) as HTMLFormElement;

    searchForm?.addEventListener("submit", (e) => this.handleSearch(e));
    mobileSearchForm?.addEventListener("submit", (e) => this.handleSearch(e));

    // Mobile menu toggle
    const mobileMenuToggle = nav.querySelector("#mobile-menu-toggle");
    mobileMenuToggle?.addEventListener("click", () =>
      this.toggleMobileMenu(nav),
    );

    // Theme toggle
    const themeToggles = nav.querySelectorAll("[data-theme-toggle]");
    themeToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => DarkMode.toggle());
    });

    // Mobile menu links - close menu when clicked
    const mobileLinks = nav.querySelectorAll("#mobile-menu a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu(nav));
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
}
