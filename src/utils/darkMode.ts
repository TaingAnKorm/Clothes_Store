export class DarkMode {
  private static readonly STORAGE_KEY = "dark-mode";

  static init(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      console.log("Dark mode init:", { stored, prefersDark });

      if (stored === "true" || (stored === null && prefersDark)) {
        this.enable();
      } else {
        this.disable();
      }
    } catch (error) {
      console.error("Dark mode initialization error:", error);
      this.disable();
    }
  }

  static enable(): void {
    document.documentElement.classList.add("dark");
    localStorage.setItem(this.STORAGE_KEY, "true");
    console.log("Dark mode enabled");
    this.updateToggleIcon();
  }

  static disable(): void {
    document.documentElement.classList.remove("dark");
    localStorage.setItem(this.STORAGE_KEY, "false");
    console.log("Dark mode disabled");
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
    console.log("Updating toggle icons, found toggles:", toggles.length);

    toggles.forEach((toggle, index) => {
      const sunIcon = toggle.querySelector("[data-sun-icon]");
      const moonIcon = toggle.querySelector("[data-moon-icon]");

      console.log(`Toggle ${index}:`, {
        sunIcon: !!sunIcon,
        moonIcon: !!moonIcon,
        isDark: this.isDark(),
      });

      if (this.isDark()) {
        sunIcon?.classList.add("hidden");
        moonIcon?.classList.remove("hidden");
      } else {
        sunIcon?.classList.remove("hidden");
        moonIcon?.classList.add("hidden");
      }
    });
  }
}
