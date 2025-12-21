<template>
    <WinJSControl class="splitview" :control="SplitView" :options="{ paneOpened }" ref="splitview">
        <div class="pane">
            <div class="header">
                <WinJSControl tag="button" :control="SplitViewPaneToggle"
                    :options="{ splitView: splitView?.control?.element }" />
                <div v-if="!isWindows" class="title">
                    <h3 class="win-splitviewcommand-label">{{ title }}</h3>
                </div>
            </div>
            <div class="nav-commands">
                <div>
                    <RouterLink :to="{ name: 'index' }" style="text-decoration: none;">
                        <WinJSControl :control="SplitViewCommand" :options="{ label: 'Home', icon: 'home' }" />
                    </RouterLink>
                </div>
                <div>
                    <RouterLink :to="{ name: 'settings' }" style="text-decoration: none;">
                        <WinJSControl :control="SplitViewCommand" :options="{ label: 'Settings', icon: 'settings' }" />
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="content-host">
            <div v-if="isCompactOverlay" class="header">
                <WinJSControl tag="button" :control="SplitViewPaneToggle"
                    :options="{ splitView: splitView?.control?.element }" />
                <div v-if="!isWindows" class="title">
                    <h3 class="win-splitviewcommand-label">VueForUWP</h3>
                </div>
            </div>
            <div class="content">
                <RouterView v-slot="{ Component, route }">
                    <Transition :name="route.meta.transition as string ?? 'drill-in'" mode="out-in">
                        <component :is="Component" />
                    </Transition>
                </RouterView>
            </div>
        </div>
    </WinJSControl>
</template>

<script lang="ts" setup>
import "./types";
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from "vue";
import { useHead, useSeoMeta } from "@unhead/vue";
import { useRouter } from "vue-router";
import { isWindows, isUserActivityChannelSupported } from "./helpers/utils";
import { description, keywords } from "./package.json";
import WinJSControl from "./components/WinJSControl.vue";
const { SplitView, SplitViewCommand, SplitViewPaneToggle } = WinJS.UI;

const assetsUrl = isWindows ? "../assets" : "https://cdn.jsdelivr.net/gh/wherewhere/VueForUWP@main/assets";
useHead({
    link: [{
        href: `${assetsUrl}/StoreLogo.scale-100.png`,
        rel: "icon",
        sizes: "50x50",
        type: "image/png"
    }, {
        href: `${assetsUrl}/StoreLogo.scale-125.png`,
        rel: "icon",
        sizes: "63x63",
        type: "image/png"
    }, {
        href: `${assetsUrl}/StoreLogo.scale-150.png`,
        rel: "icon",
        sizes: "75x75",
        type: "image/png"
    }, {
        href: `${assetsUrl}/StoreLogo.scale-200.png`,
        rel: "icon",
        sizes: "100x100",
        type: "image/png"
    }, {
        href: `${assetsUrl}/StoreLogo.scale-400.png`,
        rel: "icon",
        sizes: "200x200",
        type: "image/png"
    }]
});

const title = "VueForUWP";
const author = "wherewhere";
useSeoMeta({
    // Basic SEO
    title,
    description,
    author: author,
    keywords: keywords.join(", "),

    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogLocale: "en_US",
    ogSiteName: title,

    // Twitter
    twitterCard: "summary",
    twitterSite: "@wherewhere7",

    // Product specific (structured data will be generated)
    articleAuthor: [author],
    articleTag: keywords
});

const paneOpened = shallowRef(window.innerWidth >= 1008);
const isCompactOverlay = shallowRef(window.innerWidth < 641);
const isExpandedMode = shallowRef(window.innerWidth >= 1008);
const splitView = useTemplateRef("splitview");
function handleResize() {
    const control = splitView.value!.control!;
    if (window.innerWidth >= 1008) {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.inline;
        control.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.inline;
        isCompactOverlay.value = false;
        isExpandedMode.value = true;
        paneOpened.value = true;
    }
    else if (window.innerWidth >= 641) {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
        control.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.inline;
        isCompactOverlay.value = false;
        isExpandedMode.value = false;
        paneOpened.value = false;
    }
    else {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
        control.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.none;
        isCompactOverlay.value = true;
        isExpandedMode.value = false;
        paneOpened.value = false;
    }
}

const router = useRouter();
router.afterEach((to, from) => {
    function getPathDepth(path: string) {
        return path === '/' ? 0 : path.split('/').length;
    }
    const toDepth = getPathDepth(to.path);
    const fromDepth = getPathDepth(from.path);
    to.meta.transition = toDepth < fromDepth ? "drill-out" : "drill-in";
    if (!isExpandedMode.value) {
        splitView.value!.control!.closePane();
    }
});

if (isWindows) {
    const manager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
    function setBackVisibility() {
        manager.appViewBackButtonVisibility = router.options.history.state.back ? Windows.UI.Core.AppViewBackButtonVisibility.visible : Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
    }
    setBackVisibility();
    WinJS.Application.onbackclick = router.back;
    if (isUserActivityChannelSupported) {
        let _currentActivity: any;
        router.afterEach(async to => {
            setBackVisibility();
            const channel = (Windows.ApplicationModel as any).UserActivities.UserActivityChannel.getDefault();
            const url = `vue-uwp://${to.path}`;
            const userActivity = await channel.getOrCreateUserActivityAsync(url);
            userActivity.visualElements.displayText = to.name;
            userActivity.activationUri = new Windows.Foundation.Uri(url);
            await userActivity.saveAsync();
            _currentActivity?.close();
            _currentActivity = userActivity.createSession();
        });
    }
}

onMounted(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
});
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<style lang="scss">
.win-ui-light {
    color-scheme: light;
}

.win-ui-dark {
    color-scheme: dark;
}

body {
    font-family: "Segoe UI", sans-serif, "Segoe MDL2 Assets", "Symbols", "Segoe UI Emoji";
    font-size: 15px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#vue-app {
    width: 100%;
    height: 100%;
}

.win-button {
    min-width: auto;
}
</style>

<style lang="scss" scoped>
:deep(.stack-vertical) {
    display: flex;
    flex-direction: column;
}

:deep(.stack-horizontal) {
    display: flex;
    flex-direction: row;
}

:deep(button.win-splitviewpanetoggle:after) {
    font-size: 16px;
}

.splitview {
    height: 100%;
    width: 100%;

    .header {
        height: 48px;
        white-space: nowrap;

        .title {
            height: 100%;
            vertical-align: middle;
            display: inline-block;

            h3 {
                margin-top: 10px;
            }
        }
    }

    .pane {
        display: flex;
        flex-direction: column;

        .nav-commands {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            a.router-link-active.router-link-exact-active {
                position: relative;

                &::before {
                    content: '';
                    position: absolute;
                    width: 4px;
                    display: block;
                    height: 24px;
                    left: 0;
                    top: 12px;
                }

                :deep(.win-splitviewcommand-icon) {
                    margin-top: 16px;
                }
            }
        }
    }

    .content-host {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        .content {
            flex: 1;
            display: flex;
            padding-left: 20px;
            padding-top: 6px;
            overflow: auto;
        }
    }
}

.drill-in-enter-active,
.drill-out-leave-active {
    transition: transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.15s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.drill-in-leave-active,
.drill-out-enter-active {
    transition: transform 0.075s cubic-bezier(0.7, 0, 1, 0.5), opacity 0.075s cubic-bezier(0.7, 0, 1, 0.5);
}

.drill-in-enter-from,
.drill-out-leave-to {
    transform: scale(0.9);
}

.drill-in-leave-to,
.drill-out-enter-from {
    transform: scale(1.15);
}

.drill-in-enter-from,
.drill-out-enter-from,
.drill-in-leave-to,
.drill-out-leave-to {
    opacity: 0;
}
</style>