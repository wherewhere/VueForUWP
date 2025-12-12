import "./types";

import { createHead } from "@unhead/vue/client";
const head = createHead();

import { useHead } from "unhead";
import { isDarkTheme } from "./helpers/theme";
import uiDarkUrl from "winjs/css/ui-dark.css?url";
import uiLightUrl from "winjs/css/ui-light.css?url";
function setThemeStyleSheet(isDark: boolean) {
    useHead(head, {
        link: [{
            id: "winjs-theme-style-sheet",
            href: isDark ? uiDarkUrl : uiLightUrl,
            rel: "stylesheet"
        }]
    });
}
addEventListener("theme-changed", x => setThemeStyleSheet((x as CustomEvent<boolean>).detail));
setThemeStyleSheet(isDarkTheme());

import { useScriptAsync } from "./helpers/unhead";
import baseJsUrl from "winjs/js/base.js?url";
await useScriptAsync(head, {
    src: baseJsUrl
});
import uiJsUrl from "winjs/js/ui.js?url";
await useScriptAsync(head, {
    src: uiJsUrl
});

const app = WinJS.Application;
app.start();

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(head).use(router).mount("#vue-app");