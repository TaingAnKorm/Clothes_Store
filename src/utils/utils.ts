/**
 * Utility function to combine class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format price as currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get category color classes
 */
export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "men's clothing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "women's clothing":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
    case "electronics":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "jewelery":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get URL parameters
 */
export function getUrlParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Update URL parameters
 */
export function updateUrlParams(params: Record<string, string | null>): void {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  window.history.pushState({}, "", url.toString());
}

/**
 * Create DOM element with classes and attributes
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attributes?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}

/**
 * Show toast notification
 */
export function showToast(
  message: string,
  type: "success" | "error" | "info" = "info",
): void {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = createElement(
    "div",
    `
    fixed bg-card border rounded-lg shadow-lg p-4 min-w-[300px] animate-in slide-in-from-right fade-in
    ${type === "success" ? "border-green-500" : type === "error" ? "border-red-500" : "border-border"}
  `,
  );

  const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <span class="text-lg">${icon}</span>
      <span class="text-sm">${message}</span>
      <button class="ml-auto text-muted-foreground hover:text-foreground" onclick="this.parentElement.parentElement.remove()">
        ✕
      </button>
    </div>
  `;

  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}
