import "./types";

import { createHead } from "@unhead/vue/client";
const head = createHead();

import { useHead } from "unhead";
import { isDarkTheme } from "./helpers/theme";
import uiDarkUrl from "winjs/css/ui-dark.min.css?url";
import uiLightUrl from "winjs/css/ui-light.min.css?url";
import darkCss from "./styles/dark.css?inline";
import lightCss from "./styles/light.css?inline";
function setThemeStyleSheet(isDark: boolean) {
    useHead(head, {
        link: [{
            id: "winjs-theme-style-sheet",
            href: isDark ? uiDarkUrl : uiLightUrl,
            rel: "stylesheet"
        }],
        style: [{
            id: "color-scheme-style",
            textContent: isDark ? darkCss : lightCss
        }]
    });
    if (isDark) {
        document.documentElement.classList.add("win-ui-dark");
        document.documentElement.classList.remove("win-ui-light");
    }
    else {
        document.documentElement.classList.remove("win-ui-dark");
        document.documentElement.classList.add("win-ui-light");
    }
}
addEventListener("theme-changed", x => setThemeStyleSheet((x as CustomEvent<boolean>).detail));
setThemeStyleSheet(isDarkTheme());

import { useScriptAsync } from "./helpers/unhead";
import baseJsUrl from "winjs/js/base.min.js?url";
await useScriptAsync(head, {
    src: baseJsUrl
});
import uiJsUrl from "winjs/js/ui.min.js?url";
await useScriptAsync(head, {
    src: uiJsUrl
});

const app = WinJS.Application;
import { isWindows } from "./helpers/utils";
if (isWindows) {
    app.onactivated = function (args) {
        const kinds = Windows.ApplicationModel.Activation.ActivationKind;
        switch (args.detail.kind) {
            case kinds.protocol:
            case kinds.protocolForResults:
                const protocol: Windows.UI.WebUI.WebUIProtocolActivatedEventArgs = args.detail;
                const uri = protocol.uri;
                if (uri) {
                    location.hash = `${uri.host}${uri.path}`;
                }
                break;
        }
    };
}
app.start();

const accents = (WinJS.UI as any)._Accents;
accents.createAccentRule(
    ".nav-commands a.router-link-active.router-link-exact-active::before",
    [{ name: "background", value: accents.ColorTypes.accent }]
);

import "./helpers/pane";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(head).use(router).mount("#vue-app");