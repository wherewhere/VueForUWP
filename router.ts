import { createRouter, createWebHashHistory } from "vue-router";

export default createRouter({
    history: createWebHashHistory(new URL(document.baseURI).pathname),
    routes: [{
        name: "index",
        path: '/',
        alias: ["/index.html"],
        component: () => import("./views/IndexView.vue")
    }, {
        name: "settings",
        path: '/settings',
        component: () => import("./views/SettingsView.vue")
    }]
});