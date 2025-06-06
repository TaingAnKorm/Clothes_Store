import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productApi } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "default" | "price-low" | "price-high" | "rating" | "name";
type ViewMode = "grid" | "list";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || "",
  );

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: productApi.getCategories,
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];
    const searchTerm = searchParams.get("search")?.toLowerCase();
    const categoryFilter = searchParams.get("category");

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm),
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter,
      );
    }

    // Apply price filters
    if (minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(minPrice),
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(maxPrice),
      );
    }

    // Apply sorting
    switch (sortBy) {
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
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [products, searchParams, sortBy, minPrice, maxPrice]);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      newParams.set("search", localSearch.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category && category !== "all") {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
  };

  const activeFiltersCount = [
    searchParams.get("search"),
    searchParams.get("category"),
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {searchParams.get("category")
              ? `${searchParams.get("category")?.charAt(0).toUpperCase()}${searchParams.get("category")?.slice(1)} Products`
              : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {filteredAndSortedProducts.length} products found
            {searchParams.get("search") &&
              ` for "${searchParams.get("search")}"`}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 max-w-md">
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="rounded-r-none"
                />
                <Button onClick={handleSearch} className="rounded-l-none">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    More Filters
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        Price Range
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="min-price" className="text-sm">
                            Min Price
                          </Label>
                          <Input
                            id="min-price"
                            type="number"
                            placeholder="$0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="max-price" className="text-sm">
                            Max Price
                          </Label>
                          <Input
                            id="max-price"
                            type="number"
                            placeholder="$1000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters ({activeFiltersCount})
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchParams.get("search") || searchParams.get("category")) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {searchParams.get("search") && (
              <Badge variant="secondary" className="px-3 py-1">
                Search: "{searchParams.get("search")}"
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("search");
                    setSearchParams(newParams);
                    setLocalSearch("");
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchParams.get("category") && (
              <Badge variant="secondary" className="px-3 py-1">
                Category: {searchParams.get("category")}
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("category");
                    setSearchParams(newParams);
                    setSelectedCategory("");
                  }}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Products Grid/List */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load products</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4",
            )}
          >
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={viewMode === "list" ? "max-w-none" : ""}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
