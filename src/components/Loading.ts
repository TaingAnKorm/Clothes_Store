import { createElement } from "@/utils/utils";

export class Loading {
  constructor(private size: "sm" | "md" | "lg" = "md") {}

  create(): HTMLElement {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    const spinner = createElement(
      "div",
      `animate-spin ${sizeClasses[this.size]}`
    );

    spinner.innerHTML = `
      <svg viewBox="0 0 50 50" class="text-primary">
        <circle
          class="opacity-30"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          stroke-width="5"
          fill="none"
        />
        <circle
          class="opacity-80"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          stroke-width="5"
          fill="none"
          stroke-dasharray="100"
          stroke-dashoffset="75"
        />
      </svg>
    `;

    return spinner;
  }
}

export class PageLoader {
  static show(): HTMLElement {
    const loader = createElement(
      "div",
      "flex-1 flex items-center justify-center py-20"
    );

    const spinner = new Loading("lg");
    loader.appendChild(spinner.create());

    return loader;
  }

  static showError(message: string = "Something went wrong"): HTMLElement {
    const error = createElement(
      "div",
      "flex-1 flex items-center justify-center py-20"
    );

    error.innerHTML = `
      <div class="text-center">
        <div class="text-6xl mb-4">😕</div>
        <h3 class="text-xl font-semibold mb-2 text-destructive">Error</h3>
        <p class="text-muted-foreground mb-4">${message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    `;

    return error;
  }
}
