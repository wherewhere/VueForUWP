import { createRouter, createWebHashHistory } from "vue-router";

export default createRouter({
    history: createWebHashHistory(),
    routes: [{
        name: "index",
        path: '/',
        alias: ["/index.html"],
        component: () => import("./views/IndexView.vue")
    }, {
        name: "settings",
        path: '/settings',
        component: () => import("./views/SettingsView.vue")
    }, {
        name: "404",
        path: "/:pathMatch(.*)*",
        component: () => import("./views/NotFoundView.vue")
    }]
});