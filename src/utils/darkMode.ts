export class DarkMode {
  private static readonly STORAGE_KEY = "dark-mode";

  static init(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (stored === "true" || (stored === null && prefersDark)) {
      this.enable();
    } else {
      this.disable();
    }
  }

  static enable(): void {
    document.documentElement.classList.add("dark");
    localStorage.setItem(this.STORAGE_KEY, "true");
    this.updateToggleIcon();
  }

  static disable(): void {
    document.documentElement.classList.remove("dark");
    localStorage.setItem(this.STORAGE_KEY, "false");
    this.updateToggleIcon();
  }

  static toggle(): void {
    if (this.isDark()) {
      this.disable();
    } else {
      this.enable();
    }
  }

  static isDark(): boolean {
    return document.documentElement.classList.contains("dark");
  }

  public static refreshUI(): void {
    this.updateToggleIcon();
  }

  private static updateToggleIcon(): void {
    const toggles = document.querySelectorAll("[data-theme-toggle]");
    toggles.forEach((toggle) => {
      const sunIcon = toggle.querySelector("[data-sun-icon]");
      const moonIcon = toggle.querySelector("[data-moon-icon]");

      if (this.isDark()) {
        sunIcon?.classList.remove("hidden");
        moonIcon?.classList.add("hidden");
      } else {
        sunIcon?.classList.add("hidden");
        moonIcon?.classList.remove("hidden");
      }
    });
  }
}
