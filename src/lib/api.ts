import { Product } from "@/types/product";

const BASE_URL = "https://fakestoreapi.com";

export const productApi = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },

  // Get product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }
    return response.json();
  },
};
