import {
  createElement,
  getUrlParams,
  updateUrlParams,
  debounce,
} from "@/utils/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { productApi } from "@/api/api";
import { Product } from "@/types/product";

type SortOption = "default" | "price-low" | "price-high" | "rating" | "name";
type ViewMode = "grid" | "list";

export class ProductListPage {
  private page: HTMLElement;
  private productsContainer: HTMLElement;

  private allProducts: Product[] = [];
  private filteredProducts: Product[] = [];
  private categories: string[] = [];
  private loading = true;
  private error: string | null = null;
  private viewMode: ViewMode = "grid";
  private sortBy: SortOption = "default";

  constructor() {
    this.page = this.createShell();
    this.productsContainer = this.page.querySelector("#products-container")!;
  }

  public async create(): Promise<HTMLElement> {
    this.attachControlsEventListeners();
    await this.loadInitialData();
    return this.page;
  }

  private createShell(): HTMLElement {
    const page = createElement("div", "min-h-screen flex flex-col");
    const navbar = new Navbar();
    const footer = new Footer();

    const main = createElement("div", "container mx-auto px-4 py-8 flex-1");
    main.innerHTML = `
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2" id="page-title">All Products</h1>
        <p class="text-muted-foreground" id="products-count">Loading products...</p>
      </div>
      <div class="mb-6 space-y-4" id="controls">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div class="w-full md:max-w-md">
            <input type="text" placeholder="Search products..." class="input w-full" id="search-input" />
          </div>
          <div class="flex items-center gap-4">
            <select class="input w-48" id="sort-select">
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>
            <div class="flex border rounded-lg bg-background">
              <button class="btn btn-primary btn-sm rounded-r-none" id="grid-view"><i data-lucide="grid-3x3" class="h-4 w-4"></i></button>
              <button class="btn btn-ghost btn-sm rounded-l-none" id="list-view"><i data-lucide="list" class="h-4 w-4"></i></button>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <select class="input w-full md:w-48" id="category-select"><option value="">All Categories</option></select>
          <input type="number" placeholder="Min Price" class="input w-full md:w-24" id="min-price" />
          <input type="number" placeholder="Max Price" class="input w-full md:w-24" id="max-price" />
          <button class="btn btn-outline btn-sm hidden" id="clear-filters">Clear All Filters</button>
        </div>
        <div class="flex flex-wrap gap-2" id="active-filters"></div>
      </div>
      <div id="products-container"></div>
    `;

    page.appendChild(navbar.create());
    page.appendChild(main);
    page.appendChild(footer.create());

    return page;
  }

  private attachControlsEventListeners(): void {
    const controls = this.page.querySelector("#controls")!;
    const searchInput = controls.querySelector(
      "#search-input"
    ) as HTMLInputElement;
    const categorySelect = controls.querySelector(
      "#category-select"
    ) as HTMLSelectElement;
    const minPriceInput = controls.querySelector(
      "#min-price"
    ) as HTMLInputElement;
    const maxPriceInput = controls.querySelector(
      "#max-price"
    ) as HTMLInputElement;
    const sortSelect = controls.querySelector(
      "#sort-select"
    ) as HTMLSelectElement;
    const gridView = controls.querySelector("#grid-view") as HTMLButtonElement;
    const listView = controls.querySelector("#list-view") as HTMLButtonElement;
    const clearFilters = controls.querySelector(
      "#clear-filters"
    ) as HTMLButtonElement;

    const debouncedSearchUpdate = debounce(() => {
      updateUrlParams({ search: searchInput.value || null });
    }, 500);
    searchInput.addEventListener("input", debouncedSearchUpdate);

    const debouncedPriceUpdate = debounce(() => {
      updateUrlParams({
        min: minPriceInput.value || null,
        max: maxPriceInput.value || null,
      });
    }, 500);
    minPriceInput.addEventListener("input", debouncedPriceUpdate);
    maxPriceInput.addEventListener("input", debouncedPriceUpdate);

    categorySelect.addEventListener("change", () => {
      updateUrlParams({
        category: categorySelect.value || null,
        search: null,
        min: null,
        max: null,
      });
    });

    sortSelect.addEventListener("change", () => {
      this.sortBy = sortSelect.value as SortOption;
      this.filterAndSortProducts();
    });

    gridView.addEventListener("click", () => this.setViewMode("grid"));
    listView.addEventListener("click", () => this.setViewMode("list"));

    clearFilters.addEventListener("click", () => {
      updateUrlParams({ category: null, search: null, min: null, max: null });
    });
  }

  private async loadInitialData(): Promise<void> {
    this.setInitialValuesFromUrl();
    await this.fetchCategories();
    await this.fetchProducts();
  }

  private async fetchCategories(): Promise<void> {
    try {
      this.categories = await productApi.getCategories();
      this.populateCategoryDropdown();
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }

  private async fetchProducts(): Promise<void> {
    this.loading = true;
    this.renderProducts();
    this.updateHeader();

    const category = getUrlParams().get("category");

    try {
      this.allProducts = category
        ? await productApi.getProductsByCategory(category)
        : await productApi.getProducts();

      this.error = null;
    } catch (error) {
      console.error(error);
      this.error = "Failed to load products.";
    } finally {
      this.loading = false;
      this.filterAndSortProducts();
    }
  }

  private filterAndSortProducts(): void {
    if (this.error) {
      this.showError();
      return;
    }

    const params = getUrlParams();
    const searchTerm = params.get("search")?.toLowerCase();
    const minPrice = params.get("min") ? parseFloat(params.get("min")!) : null;
    const maxPrice = params.get("max") ? parseFloat(params.get("max")!) : null;

    let filtered = [...this.allProducts];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }
    if (minPrice !== null) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== null) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

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
    this.updateActiveFilters();
  }

  private renderProducts(): void {
    this.productsContainer.className =
      this.viewMode === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4";

    if (this.loading) {
      this.productsContainer.innerHTML = Array(12)
        .fill(0)
        .map(() => new ProductCardSkeleton().create().outerHTML)
        .join("");
      return;
    }
    if (this.error) {
      this.showError();
      return;
    }
    if (this.filteredProducts.length === 0) {
      this.productsContainer.innerHTML = `<div class="col-span-full text-center py-12"><h3 class="text-xl font-semibold">No products found</h3><p class="text-muted-foreground">Try adjusting your filters.</p></div>`;
      return;
    }

    this.productsContainer.innerHTML = this.filteredProducts
      .map((p) => new ProductCard(p).create().outerHTML)
      .join("");
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  private updateHeader(): void {
    const category = getUrlParams().get("category");
    const titleEl = this.page.querySelector("#page-title")!;
    const capitalized = category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "All Products";
    titleEl.textContent = `${capitalized}`;
    document.title = `${capitalized} - The Violet`;
  }

  private updateProductsCount(): void {
    const countEl = this.page.querySelector("#products-count")!;
    countEl.textContent = `${this.filteredProducts.length} products found`;
  }

  private setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    const gridBtn = this.page.querySelector("#grid-view")!;
    const listBtn = this.page.querySelector("#list-view")!;
    gridBtn.classList.toggle("btn-primary", mode === "grid");
    gridBtn.classList.toggle("btn-ghost", mode !== "grid");
    listBtn.classList.toggle("btn-primary", mode === "list");
    listBtn.classList.toggle("btn-ghost", mode !== "list");
    this.renderProducts();
  }

  private populateCategoryDropdown(): void {
    const select = this.page.querySelector(
      "#category-select"
    ) as HTMLSelectElement;
    if (!select) return;
    select.innerHTML = '<option value="">All Categories</option>';
    this.categories.forEach((c) => {
      const option = document.createElement("option");
      option.value = c;
      option.textContent = c.charAt(0).toUpperCase() + c.slice(1);
      select.appendChild(option);
    });
    select.value = getUrlParams().get("category") || "";
  }

  private setInitialValuesFromUrl(): void {
    const params = getUrlParams();
    (this.page.querySelector("#search-input") as HTMLInputElement).value =
      params.get("search") || "";
    (this.page.querySelector("#min-price") as HTMLInputElement).value =
      params.get("min") || "";
    (this.page.querySelector("#max-price") as HTMLInputElement).value =
      params.get("max") || "";
  }

  private updateActiveFilters(): void {
    const container = this.page.querySelector("#active-filters")!;
    const clearBtn = this.page.querySelector("#clear-filters")!;
    if (!container || !clearBtn) return;

    const params = getUrlParams();
    const hasFilters =
      params.has("search") ||
      params.has("category") ||
      params.has("min") ||
      params.has("max");

    container.classList.toggle("hidden", !hasFilters);
    clearBtn.classList.toggle("hidden", !hasFilters);
  }

  private showError(): void {
    this.productsContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
            <p class="text-destructive mb-4">${
              this.error || "Failed to load products"
            }</p>
            <button class="btn btn-outline" onclick="window.location.reload()">
            Try Again
            </button>
        </div>
        `;
  }
}
