import { createElement } from "@/utils/utils";

export class Footer {
  create(): HTMLElement {
    const footer = createElement("footer", "bg-muted/50 border-t mt-auto");

    footer.innerHTML = `
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <i data-lucide="shopping-bag" class="h-8 w-8 text-primary"></i>
              <span class="text-xl font-bold text-primary">StyleStore</span>
            </div>
            <p class="text-sm text-muted-foreground">
              Your premier destination for fashion, electronics, and lifestyle products. 
              Discover quality items at unbeatable prices.
            </p>
            <div class="flex space-x-4">
              <a 
                href="#" 
                class="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <i data-lucide="facebook" class="h-5 w-5"></i>
              </a>
              <a 
                href="#" 
                class="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <i data-lucide="twitter" class="h-5 w-5"></i>
              </a>
              <a 
                href="#" 
                class="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <i data-lucide="instagram" class="h-5 w-5"></i>
              </a>
              <a 
                href="#" 
                class="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <i data-lucide="mail" class="h-5 w-5"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a 
                  href="#/products" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  All Products
                </a>
              </li>
              <li>
                <a 
                  href="#/products?category=men's clothing" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Men's Fashion
                </a>
              </li>
              <li>
                <a 
                  href="#/products?category=women's clothing" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Women's Fashion
                </a>
              </li>
              <li>
                <a 
                  href="#/products?category=electronics" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a 
                  href="#/products?category=jewelery" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Jewelry
                </a>
              </li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-foreground">Customer Service</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <!-- Company Info -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-foreground">Company</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  Affiliate Program
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p class="text-sm text-muted-foreground">
            © 2024 StyleStore. All rights reserved.
          </p>
          <div class="flex space-x-4 mt-4 sm:mt-0">
            <a 
              href="#" 
              class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a 
              href="#" 
              class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </a>
            <a 
              href="#" 
              class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    `;

    return footer;
  }
}
