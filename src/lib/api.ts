import { Product } from "@/types/product";

const BASE_URL = "https://fakestoreapi.com";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors, JSON parsing errors, etc.
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      0,
      "Network Error",
    );
  }
}

export const productApi = {
  /**
   * Fetch all products from the API
   * @returns Promise<Product[]> Array of all products
   */
  getProducts: async (): Promise<Product[]> => {
    return apiRequest<Product[]>("/products");
  },

  /**
   * Fetch a single product by ID
   * @param id Product ID as string
   * @returns Promise<Product> Single product object
   */
  getProduct: async (id: string): Promise<Product> => {
    if (!id || id.trim() === "") {
      throw new Error("Product ID is required");
    }
    return apiRequest<Product>(`/products/${encodeURIComponent(id)}`);
  },

  /**
   * Fetch all available categories
   * @returns Promise<string[]> Array of category names
   */
  getCategories: async (): Promise<string[]> => {
    return apiRequest<string[]>("/products/categories");
  },

  /**
   * Fetch products by category
   * @param category Category name
   * @returns Promise<Product[]> Array of products in the specified category
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    if (!category || category.trim() === "") {
      throw new Error("Category is required");
    }
    return apiRequest<Product[]>(
      `/products/category/${encodeURIComponent(category)}`,
    );
  },

  /**
   * Search products by title (client-side filtering)
   * @param query Search query
   * @returns Promise<Product[]> Array of matching products
   */
  searchProducts: async (query: string): Promise<Product[]> => {
    const products = await productApi.getProducts();

    if (!query || query.trim() === "") {
      return products;
    }

    const searchTerm = query.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    );
  },

  /**
   * Filter products by price range
   * @param minPrice Minimum price (optional)
   * @param maxPrice Maximum price (optional)
   * @returns Promise<Product[]> Array of products within price range
   */
  getProductsByPriceRange: async (
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Product[]> => {
    const products = await productApi.getProducts();

    return products.filter((product) => {
      if (minPrice !== undefined && product.price < minPrice) {
        return false;
      }
      if (maxPrice !== undefined && product.price > maxPrice) {
        return false;
      }
      return true;
    });
  },

  /**
   * Get featured products (top rated products)
   * @param limit Number of products to return (default: 8)
   * @returns Promise<Product[]> Array of featured products
   */
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const products = await productApi.getProducts();

    return products
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, limit);
  },

  /**
   * Get related products based on category
   * @param productId Current product ID to exclude
   * @param category Product category
   * @param limit Number of related products (default: 4)
   * @returns Promise<Product[]> Array of related products
   */
  getRelatedProducts: async (
    productId: number,
    category: string,
    limit: number = 4,
  ): Promise<Product[]> => {
    const products = await productApi.getProductsByCategory(category);

    return products
      .filter((product) => product.id !== productId)
      .slice(0, limit);
  },
};

// Utility functions for working with product data
export const productUtils = {
  /**
   * Format price as currency string
   * @param price Price number
   * @param currency Currency code (default: USD)
   * @returns Formatted price string
   */
  formatPrice: (price: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  },

  /**
   * Calculate discount percentage
   * @param originalPrice Original price
   * @param salePrice Sale price
   * @returns Discount percentage
   */
  calculateDiscount: (originalPrice: number, salePrice: number): number => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  },

  /**
   * Get category display name
   * @param category Category slug
   * @returns Formatted category name
   */
  getCategoryDisplayName: (category: string): string => {
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  /**
   * Check if product is in stock (mock function)
   * @param product Product object
   * @returns Boolean indicating stock status
   */
  isInStock: (product: Product): boolean => {
    // Mock implementation - in real app this would check actual inventory
    return Math.random() > 0.1; // 90% chance of being in stock
  },

  /**
   * Get product rating as stars array
   * @param rating Rating number
   * @returns Array of star objects
   */
  getStarsArray: (
    rating: number,
  ): Array<{ filled: boolean; half: boolean }> => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push({ filled: true, half: false });
    }

    if (hasHalfStar) {
      stars.push({ filled: false, half: true });
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push({ filled: false, half: false });
    }

    return stars;
  },
};
