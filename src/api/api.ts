import { Product } from "@/types/product";

const FAKESTORE_API_URL = "https://fakestoreapi.com";
const DUMMYJSON_API_URL = "https://dummyjson.com";

function normalizeFakeStoreAPI(item: any): Product {
  return {
    id: `fs-${item.id}`,
    title: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    image: item.image,
    rating: {
      rate: item.rating.rate,
      count: item.rating.count,
    },
  };
}

function normalizeDummyJSON(item: any): Product {
  return {
    id: `dj-${item.id}`,
    title: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    image: item.thumbnail,
    rating: {
      rate: item.rating,
      count: item.reviews?.length || 100,
    },
  };
}

async function fetchAllProducts(): Promise<Product[]> {
  const clothingCategories = [
    "men's clothing",
    "women's clothing",
    "mens-shirts",
    "womens-dresses",
    "tops",
  ];
  const jewelryCategories = ["jewelery", "womens-jewellery"];

  const [fakeStoreRes, dummyJsonRes] = await Promise.all([
    fetch(`${FAKESTORE_API_URL}/products`).then((res) => res.json()),
    fetch(`${DUMMYJSON_API_URL}/products?limit=100`).then((res) => res.json()),
  ]);

  const fakeStoreProducts = fakeStoreRes.map(normalizeFakeStoreAPI);
  const dummyJsonProducts = dummyJsonRes.products.map(normalizeDummyJSON);

  const allProducts = [...fakeStoreProducts, ...dummyJsonProducts];

  const finalProducts = allProducts.filter((p) =>
    [...clothingCategories, ...jewelryCategories].includes(
      p.category.toLowerCase()
    )
  );

  return finalProducts;
}

let productCache: Product[] | null = null;
async function getCachedProducts(): Promise<Product[]> {
  if (productCache) {
    return productCache;
  }
  productCache = await fetchAllProducts();
  return productCache;
}

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    return getCachedProducts();
  },
  getProduct: async (id: string): Promise<Product | undefined> => {
    const products = await getCachedProducts();
    return products.find((p) => p.id === id);
  },
  getCategories: async (): Promise<string[]> => {
    const products = await getCachedProducts();
    const categories = [...new Set(products.map((p) => p.category))];
    return categories;
  },
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const products = await getCachedProducts();
    return products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  },
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const products = await getCachedProducts();
    return products
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, limit);
  },
  getRelatedProducts: async (
    productId: string,
    category: string,
    limit: number = 4
  ): Promise<Product[]> => {
    const products = await productApi.getProductsByCategory(category);
    return products
      .filter((product) => product.id !== productId)
      .slice(0, limit);
  },
};
