<template>
    <WinJSControl class="splitview" :control="SplitView" ref="splitview">
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
            <div class="content">
                <RouterView v-slot="{ Component }">
                    <Transition name="drill" mode="out-in">
                        <component :is="Component" />
                    </Transition>
                </RouterView>
            </div>
        </div>
    </WinJSControl>
</template>

<script lang="ts" setup>
import "./types";
import { onMounted, onUnmounted, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import WinJSControl from "./components/WinJSControl.vue";
const { SplitView, SplitViewCommand, SplitViewPaneToggle } = WinJS.UI;

const splitView = useTemplateRef("splitview");
function handleResize() {
    const control = splitView.value!.control!;
    if (window.innerWidth > 768) {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.inline;
    }
    else {
        control.openedDisplayMode = WinJS.UI.SplitView.OpenedDisplayMode.overlay;
        control.closePane();
    }
}

if (typeof Windows !== "undefined") {
    const router = useRouter();
    const manager = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
    manager.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.visible;
    manager.addEventListener("backrequested", router.back);
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

button.win-splitviewpanetoggle:after {
    font-size: 16px;
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

.splitview {
    height: 100%;
    width: 100%;

    .pane {
        display: flex;
        flex-direction: column;

        .header {
            height: 48px;
            white-space: nowrap;
        }

        .title {
            height: 100%;
            vertical-align: middle;
            display: inline-block;

            h3 {
                margin-top: 10px;
            }
        }

        .nav-commands {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }

    .content-host {
        height: 100%;
        width: 100%;
        display: flex;

        .content {
            flex: 1;
            display: flex;
            padding-left: 20px;
            padding-top: 6px;
        }
    }
}

.drill-enter-active {
    transition: transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.15s cubic-bezier(0.1, 0.9, 0.2, 1);
}

.drill-leave-active {
    transition: transform 0.075s cubic-bezier(0.7, 0, 1, 0.5), opacity 0.075s cubic-bezier(0.7, 0, 1, 0.5);
}

.drill-enter-from {
    transform: scale(0.9);
}

.drill-leave-to {
    transform: scale(1.15);
}

.drill-enter-from,
.drill-leave-to {
    opacity: 0;
}
</style>