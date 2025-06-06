import {
  createElement,
  getUrlParams,
  updateUrlParams,
  formatPrice,
  getCategoryColor,
  debounce,
} from "@/utils/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { PageLoader } from "@/components/LoadingSpinner";
import { ProductAPI } from "@/api/productApi";
import { Product } from "@/types/product";

type SortOption = "default" | "price-low" | "price-high" | "rating" | "name";
type ViewMode = "grid" | "list";

export class ProductListPage {
  private products: Product[] = [];
  private filteredProducts: Product[] = [];
  private categories: string[] = [];
  private loading = true;
  private error: string | null = null;
  private viewMode: ViewMode = "grid";
  private sortBy: SortOption = "default";

  async create(): Promise<HTMLElement> {
    const page = createElement("div", "min-h-screen flex flex-col");

    // Create navbar and footer
    const navbar = new Navbar();
    const footer = new Footer();

    page.appendChild(navbar.create());

    // Main content
    const main = createElement("div", "container mx-auto px-4 py-8 flex-1");

    // Header
    const header = this.createHeader();
    main.appendChild(header);

    // Filters and controls
    const controls = this.createControls();
    main.appendChild(controls);

    // Products grid
    const productsGrid = this.createProductsGrid();
    main.appendChild(productsGrid);

    page.appendChild(main);
    page.appendChild(footer.create());

    // Load data
    await this.loadData();

    return page;
  }

  private createHeader(): HTMLElement {
    const urlParams = getUrlParams();
    const category = urlParams.get("category");
    const search = urlParams.get("search");

    const header = createElement("div", "mb-8");

    header.innerHTML = `
      <h1 class="text-3xl font-bold mb-2">
        ${
          category
            ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Products`
            : "All Products"
        }
      </h1>
      <p class="text-muted-foreground" id="products-count">
        Loading products...
        ${search ? ` for "${search}"` : ""}
      </p>
    `;

    return header;
  }

  private createControls(): HTMLElement {
    const controls = createElement("div", "mb-6 space-y-4");

    controls.innerHTML = `
      <!-- Search -->
      <div class="flex gap-2">
        <div class="flex-1 max-w-md">
          <div class="flex">
            <input
              type="text"
              placeholder="Search products..."
              class="input rounded-r-none flex-1"
              id="search-input"
            />
            <button class="btn btn-primary rounded-l-none" id="search-button">
              <i data-lucide="search" class="h-4 w-4"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters and Controls -->
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Category Filter -->
          <div class="space-y-1">
            <label class="text-sm font-medium">Category</label>
            <select class="input w-48" id="category-select">
              <option value="">All Categories</option>
            </select>
          </div>

          <!-- Price Filters -->
          <div class="space-y-1">
            <label class="text-sm font-medium">Min Price</label>
            <input type="number" placeholder="$0" class="input w-24" id="min-price">
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Max Price</label>
            <input type="number" placeholder="$1000" class="input w-24" id="max-price">
          </div>

          <!-- Clear Filters -->
          <button class="btn btn-outline btn-sm hidden" id="clear-filters">
            <i data-lucide="x" class="h-4 w-4 mr-2"></i>
            Clear Filters
          </button>
        </div>

        <div class="flex items-center gap-4">
          <!-- Sort -->
          <select class="input w-48" id="sort-select">
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>

          <!-- View Mode -->
          <div class="flex border rounded-lg">
            <button
              class="btn btn-ghost btn-sm rounded-r-none"
              id="grid-view"
              data-active="true"
            >
              <i data-lucide="grid-3x3" class="h-4 w-4"></i>
            </button>
            <button
              class="btn btn-ghost btn-sm rounded-l-none"
              id="list-view"
              data-active="false"
            >
              <i data-lucide="list" class="h-4 w-4"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Active Filters -->
      <div class="flex flex-wrap gap-2 hidden" id="active-filters">
        <!-- Active filters will be shown here -->
      </div>
    `;

    this.attachControlsEventListeners(controls);
    return controls;
  }

  private createProductsGrid(): HTMLElement {
    const container = createElement("div", "");

    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="products-container">
        <!-- Products will be loaded here -->
      </div>
    `;

    return container;
  }

  private attachControlsEventListeners(controls: HTMLElement): void {
    // Search functionality
    const searchInput = controls.querySelector(
      "#search-input",
    ) as HTMLInputElement;
    const searchButton = controls.querySelector(
      "#search-button",
    ) as HTMLButtonElement;

    const performSearch = () => {
      const query = searchInput.value.trim();
      updateUrlParams({ search: query || null });
      this.filterAndSortProducts();
      this.updateActiveFilters();
    };

    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") performSearch();
    });

    // Category filter
    const categorySelect = controls.querySelector(
      "#category-select",
    ) as HTMLSelectElement;
    categorySelect.addEventListener("change", () => {
      updateUrlParams({ category: categorySelect.value || null });
      this.filterAndSortProducts();
      this.updateActiveFilters();
    });

    // Price filters
    const minPriceInput = controls.querySelector(
      "#min-price",
    ) as HTMLInputElement;
    const maxPriceInput = controls.querySelector(
      "#max-price",
    ) as HTMLInputElement;

    const updatePriceFilter = debounce(() => {
      this.filterAndSortProducts();
    }, 500);

    minPriceInput.addEventListener("input", updatePriceFilter);
    maxPriceInput.addEventListener("input", updatePriceFilter);

    // Sort functionality
    const sortSelect = controls.querySelector(
      "#sort-select",
    ) as HTMLSelectElement;
    sortSelect.addEventListener("change", () => {
      this.sortBy = sortSelect.value as SortOption;
      this.filterAndSortProducts();
    });

    // View mode
    const gridView = controls.querySelector("#grid-view") as HTMLButtonElement;
    const listView = controls.querySelector("#list-view") as HTMLButtonElement;

    gridView.addEventListener("click", () => {
      this.viewMode = "grid";
      this.updateViewMode(gridView, listView);
      this.renderProducts();
    });

    listView.addEventListener("click", () => {
      this.viewMode = "list";
      this.updateViewMode(listView, gridView);
      this.renderProducts();
    });

    // Clear filters
    const clearFilters = controls.querySelector(
      "#clear-filters",
    ) as HTMLButtonElement;
    clearFilters.addEventListener("click", () => {
      // Clear URL params
      updateUrlParams({ category: null, search: null });

      // Reset form values
      searchInput.value = "";
      categorySelect.value = "";
      minPriceInput.value = "";
      maxPriceInput.value = "";
      sortSelect.value = "default";
      this.sortBy = "default";

      // Update display
      this.filterAndSortProducts();
      this.updateActiveFilters();
    });
  }

  private updateViewMode(
    activeButton: HTMLButtonElement,
    inactiveButton: HTMLButtonElement,
  ): void {
    activeButton.classList.remove("btn-ghost");
    activeButton.classList.add("btn-primary");
    activeButton.dataset.active = "true";

    inactiveButton.classList.remove("btn-primary");
    inactiveButton.classList.add("btn-ghost");
    inactiveButton.dataset.active = "false";
  }

  private async loadData(): Promise<void> {
    try {
      // Load products and categories
      const [products, categories] = await Promise.all([
        ProductAPI.getProducts(),
        ProductAPI.getCategories(),
      ]);

      this.products = products;
      this.categories = categories;

      // Populate category dropdown
      this.populateCategoryDropdown();

      // Set initial values from URL
      this.setInitialValues();

      // Filter and display products
      this.filterAndSortProducts();
      this.updateActiveFilters();

      this.loading = false;
    } catch (error) {
      console.error("Failed to load data:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load data";
      this.showError();
    }
  }

  private populateCategoryDropdown(): void {
    const categorySelect = document.querySelector(
      "#category-select",
    ) as HTMLSelectElement;
    if (!categorySelect) return;

    // Clear existing options except "All Categories"
    categorySelect.innerHTML = '<option value="">All Categories</option>';

    this.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categorySelect.appendChild(option);
    });
  }

  private setInitialValues(): void {
    const urlParams = getUrlParams();

    // Set search input
    const searchInput = document.querySelector(
      "#search-input",
    ) as HTMLInputElement;
    if (searchInput && urlParams.get("search")) {
      searchInput.value = urlParams.get("search") || "";
    }

    // Set category dropdown
    const categorySelect = document.querySelector(
      "#category-select",
    ) as HTMLSelectElement;
    if (categorySelect && urlParams.get("category")) {
      categorySelect.value = urlParams.get("category") || "";
    }
  }

  private filterAndSortProducts(): void {
    const urlParams = getUrlParams();
    const searchTerm = urlParams.get("search")?.toLowerCase();
    const categoryFilter = urlParams.get("category");

    const minPriceInput = document.querySelector(
      "#min-price",
    ) as HTMLInputElement;
    const maxPriceInput = document.querySelector(
      "#max-price",
    ) as HTMLInputElement;
    const minPrice = minPriceInput?.value
      ? parseFloat(minPriceInput.value)
      : null;
    const maxPrice = maxPriceInput?.value
      ? parseFloat(maxPriceInput.value)
      : null;

    // Filter products
    let filtered = [...this.products];

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm),
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter,
      );
    }

    if (minPrice !== null) {
      filtered = filtered.filter((product) => product.price >= minPrice);
    }

    if (maxPrice !== null) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }

    // Sort products
    switch (this.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    this.filteredProducts = filtered;
    this.updateProductsCount();
    this.renderProducts();
  }

  private updateProductsCount(): void {
    const countElement = document.querySelector("#products-count");
    if (countElement) {
      const urlParams = getUrlParams();
      const search = urlParams.get("search");

      countElement.textContent = `${this.filteredProducts.length} products found${search ? ` for "${search}"` : ""}`;
    }
  }

  private renderProducts(): void {
    const container = document.querySelector("#products-container");
    if (!container) return;

    if (this.loading) {
      // Show loading skeletons
      container.innerHTML = "";
      for (let i = 0; i < 12; i++) {
        const skeleton = new ProductCardSkeleton();
        container.appendChild(skeleton.create());
      }
      return;
    }

    if (this.error) {
      this.showError();
      return;
    }

    // Update grid classes based on view mode
    container.className =
      this.viewMode === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4";

    if (this.filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold mb-2">No products found</h3>
          <p class="text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <button class="btn btn-primary" onclick="document.querySelector('#clear-filters')?.click()">
            Clear Filters
          </button>
        </div>
      `;
      return;
    }

    // Render products
    container.innerHTML = "";
    this.filteredProducts.forEach((product) => {
      const productCard = new ProductCard(product);
      container.appendChild(productCard.create());
    });

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  private updateActiveFilters(): void {
    const activeFiltersContainer = document.querySelector("#active-filters");
    const clearFiltersButton = document.querySelector("#clear-filters");
    if (!activeFiltersContainer || !clearFiltersButton) return;

    const urlParams = getUrlParams();
    const search = urlParams.get("search");
    const category = urlParams.get("category");

    const minPriceInput = document.querySelector(
      "#min-price",
    ) as HTMLInputElement;
    const maxPriceInput = document.querySelector(
      "#max-price",
    ) as HTMLInputElement;
    const hasPrice = minPriceInput?.value || maxPriceInput?.value;

    const hasFilters = search || category || hasPrice;

    if (hasFilters) {
      activeFiltersContainer.classList.remove("hidden");
      clearFiltersButton.classList.remove("hidden");

      let filtersHTML = "";

      if (search) {
        filtersHTML += `
          <span class="badge badge-secondary">
            Search: "${search}"
            <button class="ml-1 hover:text-foreground" onclick="this.closest('.badge').remove(); document.querySelector('#search-input').value = ''; document.querySelector('#search-button').click();">
              ✕
            </button>
          </span>
        `;
      }

      if (category) {
        filtersHTML += `
          <span class="badge badge-secondary">
            Category: ${category}
            <button class="ml-1 hover:text-foreground" onclick="this.closest('.badge').remove(); document.querySelector('#category-select').value = ''; document.querySelector('#category-select').dispatchEvent(new Event('change'));">
              ✕
            </button>
          </span>
        `;
      }

      activeFiltersContainer.innerHTML = filtersHTML;
    } else {
      activeFiltersContainer.classList.add("hidden");
      clearFiltersButton.classList.add("hidden");
    }
  }

  private showError(): void {
    const container = document.querySelector("#products-container");
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-destructive mb-4">${this.error || "Failed to load products"}</p>
          <button class="btn btn-outline" onclick="window.location.reload()">
            Try Again
          </button>
        </div>
      `;
    }
  }
}
