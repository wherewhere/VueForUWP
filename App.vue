<template>
    <WinJSControl class="splitview" :control="SplitView" :options="{ paneOpened }" ref="splitview">
        <div class="pane">
            <div class="header">
                <WinJSControl tag="button" :control="SplitViewPaneToggle"
                    :options="{ splitView: splitView?.control?.element }" />
                <div class="title">
                    <h3 class="win-splitviewcommand-label">VueForUWP</h3>
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
                <div class="title">
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
import { useRouter } from "vue-router";
import { isWindows, isUserActivityChannelSupported } from "./helpers/utils";
import WinJSControl from "./components/WinJSControl.vue";
const { SplitView, SplitViewCommand, SplitViewPaneToggle } = WinJS.UI;

const router = useRouter();
router.afterEach((to, from) => {
    function getPathDepth(path: string) {
        return path === '/' ? 0 : path.split('/').length;
    }
    const toDepth = getPathDepth(to.path);
    const fromDepth = getPathDepth(from.path);
    to.meta.transition = toDepth < fromDepth ? "drill-out" : "drill-in";
});

const paneOpened = shallowRef(window.innerWidth >= 1008);
const isCompactOverlay = shallowRef(false);
const splitView = useTemplateRef("splitview");
function handleResize() {
    const control = splitView.value!.control!;
    if (window.innerWidth >= 1008) {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.inline;
        control.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.inline;
        isCompactOverlay.value = false;
        paneOpened.value = true;
    }
    else if (window.innerWidth >= 641) {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
        control.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.inline;
        isCompactOverlay.value = false;
        paneOpened.value = false;
    }
    else {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
        control.closedDisplayMode = WinJS.UI.SplitView.ClosedDisplayMode.none;
        isCompactOverlay.value = true;
        paneOpened.value = false;
    }
}

if (isWindows) {
    const manager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
    manager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
    manager.addEventListener("backrequested", router.back);
    if (isUserActivityChannelSupported) {
        let _currentActivity: any;
        router.afterEach(async to => {
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
:root {
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
                    width: 2px;
                    display: block;
                    height: 24px;
                    left: 4px;
                    top: 10px;
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