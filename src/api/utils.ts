export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getUrlParams(): URLSearchParams {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) {
    return new URLSearchParams("");
  }
  return new URLSearchParams(hash.slice(queryIndex + 1));
}

export function updateUrlParams(params: Record<string, string | null>): void {
  const [path] = window.location.hash.slice(1).split("?");
  const urlParams = getUrlParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      urlParams.set(key, value);
    } else {
      urlParams.delete(key);
    }
  }

  const newQueryString = urlParams.toString();
  window.location.hash = newQueryString ? `${path}?${newQueryString}` : path;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attributes?: Record<string, string>
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

export function showToast(
  message: string,
  type: "success" | "error" | "info" = "info"
): void {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = createElement(
    "div",
    `
    fixed bg-card border rounded-lg shadow-lg p-4 min-w-[300px] animate-in slide-in-from-right fade-in
    ${
      type === "success"
        ? "border-green-500"
        : type === "error"
        ? "border-red-500"
        : "border-border"
    }
  `
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

  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}
