import "../types";

export type Theme = "light" | "dark" | "system";
let theme: Theme = "system";
let onThemeChanged: (isDark: boolean) => void;

let isPrefersDark: () => boolean;
function isDarkTheme(isDark?: boolean) {
    switch (theme) {
        case "light":
            return false;
        case "dark":
            return true;
        case "system":
        default:
            return isDark ?? isPrefersDark();
    }
}

export function getTheme() {
    return theme;
}
export function setTheme(newTheme: Theme) {
    if (theme !== newTheme) {
        theme = newTheme;
        onThemeChanged(isDarkTheme());
    }
}

if (typeof Windows === "undefined") {
    isPrefersDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
    onThemeChanged = (isDark: boolean) => dispatchEvent(new CustomEvent<boolean>("theme-changed", { detail: isDark }));
    matchMedia("(prefers-color-scheme: dark)").addListener(x => onThemeChanged(isDarkTheme(x.matches)));
}
else {
    const settings = new Windows.UI.ViewManagement.UISettings();

    function isColorLight(color: Windows.UI.Color) {
        return ((5 * color.g) + (2 * color.r) + color.b) < 8 * 128
    }

    isPrefersDark = () => {
        const color = settings.getColorValue(Windows.UI.ViewManagement.UIColorType.foreground);
        return !isColorLight(color);
    }

    onThemeChanged = (isDark: boolean) => dispatchEvent(new CustomEvent<boolean>("theme-changed", { detail: isDark }));
    settings.addEventListener("colorvalueschanged", () => onThemeChanged(isDarkTheme()));
}

export { isDarkTheme };