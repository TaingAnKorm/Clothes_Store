import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { productApi } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Star,
  ArrowRight,
  Zap,
  Heart,
  Award,
} from "lucide-react";

const Index = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featured-products"],
    queryFn: productApi.getProducts,
  });

  const featuredProducts = products?.slice(0, 8) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  <Zap className="h-3 w-3 mr-1" />
                  New Collection 2024
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Discover Your
                  <span className="text-primary block">Perfect Style</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Explore our curated collection of premium clothing,
                  cutting-edge electronics, and stunning jewelry. Quality meets
                  affordability in every piece.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Collections
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">
                    Happy Customers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold text-primary ml-1">
                      4.9
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 rounded-2xl flex items-center justify-center">
                    <Heart className="h-12 w-12 text-pink-600 dark:text-pink-400" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-2xl flex items-center justify-center">
                    <Award className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-2xl flex items-center justify-center">
                    <Star className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                100% secure payment processing
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day hassle-free returns
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Carefully curated products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated collections designed to suit every
              style and occasion
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Men's Fashion",
                category: "men's clothing",
                gradient: "from-blue-500 to-blue-600",
                icon: "👔",
              },
              {
                title: "Women's Fashion",
                category: "women's clothing",
                gradient: "from-pink-500 to-pink-600",
                icon: "👗",
              },
              {
                title: "Electronics",
                category: "electronics",
                gradient: "from-green-500 to-green-600",
                icon: "📱",
              },
              {
                title: "Jewelry",
                category: "jewelery",
                gradient: "from-purple-500 to-purple-600",
                icon: "💎",
              },
            ].map((category) => (
              <Link
                key={category.category}
                to={`/products?category=${encodeURIComponent(category.category)}`}
                className="group"
              >
                <div
                  className={`relative h-48 bg-gradient-to-br ${category.gradient} rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-transform group-hover:scale-105`}
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {category.title}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm">
                      Shop now
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked items that our customers love most
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load products</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
