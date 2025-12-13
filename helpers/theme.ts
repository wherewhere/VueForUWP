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

import { isWindows } from "./utils";
if (isWindows) {
    const settings = new Windows.UI.ViewManagement.UISettings();

    function isColorLight(color: Windows.UI.Color) {
        return ((5 * color.g) + (2 * color.r) + color.b) < 8 * 128
    }

    isPrefersDark = () => {
        const color = settings.getColorValue(Windows.UI.ViewManagement.UIColorType.foreground);
        return !isColorLight(color);
    }

    function updateSystemCaptionButtonColors(isDark: boolean) {
        const foregroundColor = isDark ? Windows.UI.Colors.white : Windows.UI.Colors.black;
        const backgroundColor: Windows.UI.Color = isDark ? { r: 23, g: 23, b: 23, a: 255 } : { r: 242, g: 242, b: 242, a: 255 };

        const titleBar = Windows.UI.ViewManagement.ApplicationView.getForCurrentView().titleBar;
        titleBar.foregroundColor = titleBar.buttonForegroundColor = foregroundColor;
        titleBar.backgroundColor = titleBar.inactiveBackgroundColor = backgroundColor;
        titleBar.buttonBackgroundColor = titleBar.buttonInactiveBackgroundColor = backgroundColor;
    }

    onThemeChanged = (isDark: boolean) => {
        dispatchEvent(new CustomEvent<boolean>("theme-changed", { detail: isDark }));
        updateSystemCaptionButtonColors(isDark);
    };
    settings.addEventListener("colorvalueschanged", () => onThemeChanged(isDarkTheme()));
    updateSystemCaptionButtonColors(isDarkTheme());
}
else {
    isPrefersDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
    onThemeChanged = (isDark: boolean) => dispatchEvent(new CustomEvent<boolean>("theme-changed", { detail: isDark }));
    matchMedia("(prefers-color-scheme: dark)").addListener(x => onThemeChanged(isDarkTheme(x.matches)));
}

export { isDarkTheme };