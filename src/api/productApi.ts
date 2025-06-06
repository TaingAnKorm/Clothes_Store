import { Product } from "@/types/product";

const BASE_URL = "https://fakestoreapi.com";

export class ProductAPI {
  // Get all products
  static async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw new Error("Failed to fetch products. Please try again.");
    }
  }

  // Get product by ID
  static async getProduct(id: string): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch product:", error);
      throw new Error("Failed to fetch product. Please try again.");
    }
  }

  // Get all categories
  static async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw new Error("Failed to fetch categories. Please try again.");
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch products by category:", error);
      throw new Error(
        "Failed to fetch products by category. Please try again.",
      );
    }
  }
}
