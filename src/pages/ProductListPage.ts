import { Product, ProductFilters } from "../types/Product.js";
import { productApi } from "../api/productApi.js";
import { ProductCard } from "../components/ProductCard.js";
import { LoadingSpinner } from "../components/LoadingSpinner.js";
import { router } from "../utils/router.js";

export class ProductListPage {
  private products: Product[] = [];
  private filteredProducts: Product[] = [];
  private categories: string[] = [];
  private filters: ProductFilters = {};
  private element: HTMLElement | null = null;

  async render(params: URLSearchParams): Promise<HTMLElement> {
    const main = document.createElement("main");
    main.className = "flex-1";

    // Extract filters from URL params
    this.filters = {
      search: params.get("search") || undefined,
      category: params.get("category") || undefined,
      minPrice: params.get("minPrice")
        ? parseFloat(params.get("minPrice")!)
        : undefined,
      maxPrice: params.get("maxPrice")
        ? parseFloat(params.get("maxPrice")!)
        : undefined,
      sortBy: (params.get("sortBy") as any) || "default",
    };

    main.innerHTML = `
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            ${
              this.filters.category
                ? productApi.getCategoryDisplayName(this.filters.category) +
                  " Products"
                : "All Products"
            }
          </h1>
          <p id="product-count" class="text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>

        <!-- Search and Filter Bar -->
        <div class="mb-6 space-y-4">
          <!-- Search -->
          <div class="flex gap-2">
            <div class="flex-1 max-w-md">
              <div class="flex">
                <input
                  type="text"
                  id="search-input"
                  placeholder="Search products..."
                  value="${this.filters.search || ""}"
                  class="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  id="search-btn"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-r-md transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Filters and Controls -->
          <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div class="flex flex-wrap gap-4 items-center">
              <!-- Category Filter -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-900 dark:text-gray-100">Category</label>
                <select id="category-filter" class="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Categories</option>
                </select>
              </div>

              <!-- Price Filters -->
              <div class="flex items-center space-x-2">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-900 dark:text-gray-100">Min Price</label>
                  <input
                    type="number"
                    id="min-price"
                    placeholder="$0"
                    value="${this.filters.minPrice || ""}"
                    class="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-900 dark:text-gray-100">Max Price</label>
                  <input
                    type="number"
                    id="max-price"
                    placeholder="$1000"
                    value="${this.filters.maxPrice || ""}"
                    class="w-24 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Clear Filters -->
              <button id="clear-filters" class="btn-secondary hidden">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>

            <div class="flex items-center gap-4">
              <!-- Sort -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-900 dark:text-gray-100">Sort by</label>
                <select id="sort-filter" class="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <!-- View Mode -->
              <div class="flex border rounded-lg">
                <button id="grid-view" class="px-3 py-2 bg-blue-600 text-white rounded-l-lg">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button id="list-view" class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-lg">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div id="active-filters" class="mb-6 flex flex-wrap gap-2 hidden">
        </div>

        <!-- Products Grid -->
        <div id="products-container" class="product-grid">
          <!-- Products will be loaded here -->
        </div>
      </div>
    `;

    this.element = main;
    await this.init();
    return main;
  }

  private async init(): Promise<void> {
    await this.loadData();
    this.setupEventListeners();
    this.updateFilters();
    this.filterAndRenderProducts();
  }

  private async loadData(): Promise<void> {
    try {
      const [products, categories] = await Promise.all([
        productApi.getProducts(),
        productApi.getCategories(),
      ]);

      this.products = products;
      this.categories = categories;

      // Populate category dropdown
      const categoryFilter = this.element?.querySelector(
        "#category-filter",
      ) as HTMLSelectElement;
      if (categoryFilter) {
        this.categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = productApi.getCategoryDisplayName(category);
          option.selected = category === this.filters.category;
          categoryFilter.appendChild(option);
        });
      }

      // Set sort filter value
      const sortFilter = this.element?.querySelector(
        "#sort-filter",
      ) as HTMLSelectElement;
      if (sortFilter) {
        sortFilter.value = this.filters.sortBy || "default";
      }
    } catch (error) {
      console.error("Error loading data:", error);
      this.showError("Failed to load products. Please try again.");
    }
  }

  private setupEventListeners(): void {
    if (!this.element) return;

    // Search
    const searchBtn = this.element.querySelector("#search-btn");
    const searchInput = this.element.querySelector(
      "#search-input",
    ) as HTMLInputElement;

    searchBtn?.addEventListener("click", () => this.handleSearch());
    searchInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });

    // Filters
    const categoryFilter = this.element.querySelector(
      "#category-filter",
    ) as HTMLSelectElement;
    const minPriceInput = this.element.querySelector(
      "#min-price",
    ) as HTMLInputElement;
    const maxPriceInput = this.element.querySelector(
      "#max-price",
    ) as HTMLInputElement;
    const sortFilter = this.element.querySelector(
      "#sort-filter",
    ) as HTMLSelectElement;

    categoryFilter?.addEventListener("change", () => this.handleFilterChange());
    minPriceInput?.addEventListener("input", () =>
      this.debounce(() => this.handleFilterChange(), 500),
    );
    maxPriceInput?.addEventListener("input", () =>
      this.debounce(() => this.handleFilterChange(), 500),
    );
    sortFilter?.addEventListener("change", () => this.handleFilterChange());

    // Clear filters
    const clearFiltersBtn = this.element.querySelector("#clear-filters");
    clearFiltersBtn?.addEventListener("click", () => this.clearFilters());

    // View mode toggle
    const gridViewBtn = this.element.querySelector("#grid-view");
    const listViewBtn = this.element.querySelector("#list-view");

    gridViewBtn?.addEventListener("click", () => this.toggleViewMode("grid"));
    listViewBtn?.addEventListener("click", () => this.toggleViewMode("list"));
  }

  private handleSearch(): void {
    const searchInput = this.element?.querySelector(
      "#search-input",
    ) as HTMLInputElement;
    const query = searchInput?.value.trim();

    this.filters.search = query || undefined;
    this.updateURL();
    this.filterAndRenderProducts();
  }

  private handleFilterChange(): void {
    const categoryFilter = this.element?.querySelector(
      "#category-filter",
    ) as HTMLSelectElement;
    const minPriceInput = this.element?.querySelector(
      "#min-price",
    ) as HTMLInputElement;
    const maxPriceInput = this.element?.querySelector(
      "#max-price",
    ) as HTMLInputElement;
    const sortFilter = this.element?.querySelector(
      "#sort-filter",
    ) as HTMLSelectElement;

    this.filters.category = categoryFilter?.value || undefined;
    this.filters.minPrice = minPriceInput?.value
      ? parseFloat(minPriceInput.value)
      : undefined;
    this.filters.maxPrice = maxPriceInput?.value
      ? parseFloat(maxPriceInput.value)
      : undefined;
    this.filters.sortBy = (sortFilter?.value as any) || "default";

    this.updateURL();
    this.filterAndRenderProducts();
  }

  private clearFilters(): void {
    this.filters = { sortBy: "default" };

    // Reset form elements
    const searchInput = this.element?.querySelector(
      "#search-input",
    ) as HTMLInputElement;
    const categoryFilter = this.element?.querySelector(
      "#category-filter",
    ) as HTMLSelectElement;
    const minPriceInput = this.element?.querySelector(
      "#min-price",
    ) as HTMLInputElement;
    const maxPriceInput = this.element?.querySelector(
      "#max-price",
    ) as HTMLInputElement;
    const sortFilter = this.element?.querySelector(
      "#sort-filter",
    ) as HTMLSelectElement;

    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "";
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    if (sortFilter) sortFilter.value = "default";

    this.updateURL();
    this.filterAndRenderProducts();
  }

  private toggleViewMode(mode: "grid" | "list"): void {
    const gridViewBtn = this.element?.querySelector("#grid-view");
    const listViewBtn = this.element?.querySelector("#list-view");
    const container = this.element?.querySelector("#products-container");

    if (mode === "grid") {
      gridViewBtn?.classList.add("bg-blue-600", "text-white");
      gridViewBtn?.classList.remove(
        "bg-gray-200",
        "dark:bg-gray-700",
        "text-gray-700",
        "dark:text-gray-300",
      );
      listViewBtn?.classList.remove("bg-blue-600", "text-white");
      listViewBtn?.classList.add(
        "bg-gray-200",
        "dark:bg-gray-700",
        "text-gray-700",
        "dark:text-gray-300",
      );
      container?.classList.add("product-grid");
      container?.classList.remove("space-y-4");
    } else {
      listViewBtn?.classList.add("bg-blue-600", "text-white");
      listViewBtn?.classList.remove(
        "bg-gray-200",
        "dark:bg-gray-700",
        "text-gray-700",
        "dark:text-gray-300",
      );
      gridViewBtn?.classList.remove("bg-blue-600", "text-white");
      gridViewBtn?.classList.add(
        "bg-gray-200",
        "dark:bg-gray-700",
        "text-gray-700",
        "dark:text-gray-300",
      );
      container?.classList.remove("product-grid");
      container?.classList.add("space-y-4");
    }
  }

  private updateFilters(): void {
    const hasActiveFilters = Object.values(this.filters).some(
      (value) => value !== undefined && value !== "default" && value !== "",
    );

    const clearFiltersBtn = this.element?.querySelector("#clear-filters");
    if (clearFiltersBtn) {
      if (hasActiveFilters) {
        clearFiltersBtn.classList.remove("hidden");
      } else {
        clearFiltersBtn.classList.add("hidden");
      }
    }

    this.updateActiveFiltersDisplay();
  }

  private updateActiveFiltersDisplay(): void {
    const container = this.element?.querySelector("#active-filters");
    if (!container) return;

    const activeFilters: string[] = [];

    if (this.filters.search) {
      activeFilters.push(`Search: "${this.filters.search}"`);
    }
    if (this.filters.category) {
      activeFilters.push(
        `Category: ${productApi.getCategoryDisplayName(this.filters.category)}`,
      );
    }
    if (this.filters.minPrice) {
      activeFilters.push(
        `Min: ${productApi.formatPrice(this.filters.minPrice)}`,
      );
    }
    if (this.filters.maxPrice) {
      activeFilters.push(
        `Max: ${productApi.formatPrice(this.filters.maxPrice)}`,
      );
    }

    if (activeFilters.length > 0) {
      container.innerHTML = activeFilters
        .map(
          (filter) => `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          ${filter}
        </span>
      `,
        )
        .join("");
      container.classList.remove("hidden");
    } else {
      container.classList.add("hidden");
    }
  }

  private filterAndRenderProducts(): void {
    this.filteredProducts = productApi.filterProducts(
      this.products,
      this.filters,
    );
    this.renderProducts();
    this.updateProductCount();
    this.updateFilters();
  }

  private renderProducts(): void {
    const container = this.element?.querySelector("#products-container");
    if (!container) return;

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No products found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
          <button class="btn-primary" id="clear-all-filters">Clear Filters</button>
        </div>
      `;

      // Add event listener for clear all filters button
      const clearAllBtn = container.querySelector("#clear-all-filters");
      clearAllBtn?.addEventListener("click", () => this.clearFilters());
      return;
    }

    container.innerHTML = "";
    this.filteredProducts.forEach((product) => {
      const productCard = new ProductCard(product);
      container.appendChild(productCard.render());
    });
  }

  private updateProductCount(): void {
    const countElement = this.element?.querySelector("#product-count");
    if (countElement) {
      const count = this.filteredProducts.length;
      const searchText = this.filters.search
        ? ` for "${this.filters.search}"`
        : "";
      countElement.textContent = `${count} product${count !== 1 ? "s" : ""} found${searchText}`;
    }
  }

  private updateURL(): void {
    const params: Record<string, string> = {};

    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.minPrice)
      params.minPrice = this.filters.minPrice.toString();
    if (this.filters.maxPrice)
      params.maxPrice = this.filters.maxPrice.toString();
    if (this.filters.sortBy && this.filters.sortBy !== "default")
      params.sortBy = this.filters.sortBy;

    // Update URL without triggering navigation
    const currentHash = window.location.hash;
    const [path] = currentHash.split("?");
    const queryString = new URLSearchParams(params).toString();
    const newHash = queryString ? `${path}?${queryString}` : path;

    if (newHash !== currentHash) {
      window.history.replaceState(null, "", newHash);
    }
  }

  private debounce(func: Function, wait: number): void {
    clearTimeout((this as any).debounceTimeout);
    (this as any).debounceTimeout = setTimeout(func, wait);
  }

  private showError(message: string): void {
    const container = this.element?.querySelector("#products-container");
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-red-500 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Error</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">${message}</p>
          <button class="btn-primary" onclick="window.location.reload()">Try Again</button>
        </div>
      `;
    }
  }
}
