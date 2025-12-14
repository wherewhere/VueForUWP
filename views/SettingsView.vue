<template>
    <div class="row-gap-24 root">
        <span class="win-type-title">Settings</span>
        <div class="scroll-viewer">
            <SettingsGroup>
                <template #header>Theme</template>
                <div>
                    <label class="stack-horizontal">
                        <input class="win-radio" type="radio" name="theme" value="light" v-model="theme" />
                        Light
                    </label>
                    <label class="stack-horizontal">
                        <input class="win-radio" type="radio" name="theme" value="dark" v-model="theme" />
                        Dark
                    </label>
                    <label class="stack-horizontal">
                        <input class="win-radio" type="radio" name="theme" value="system" v-model="theme" />
                        System default
                    </label>
                </div>
            </SettingsGroup>
            <SettingsGroup v-if="isWindows">
                <template #header>Display</template>
                <div class="stack-vertical row-gap-4">
                    <div class="stack-horizontal column-gap-4">
                        <button class="win-button" @click="enterFullWindow">Enter Full Screen</button>
                        <button class="win-button" @click="exitFullWindow">Exit</button>
                    </div>
                    <div v-if="isApplicationViewViewModeSupported" class="stack-horizontal column-gap-4">
                        <button class="win-button" @click="enterPIP">Enter PIP Mode</button>
                        <button class="win-button" @click="exitPIP">Exit</button>
                    </div>
                    <button v-if="isSettingsPaneSupported" class="win-button" @click="settingsFlyout">
                        Open Charm Settings
                    </button>
                </div>
            </SettingsGroup>
            <SettingsGroup>
                <template #header>Device</template>
                <table>
                    <tbody>
                        <tr>
                            <td>Device Family</td>
                            <td>{{ device }}</td>
                        </tr>
                        <tr>
                            <td>OS Version</td>
                            <td>{{ osVersion }}</td>
                        </tr>
                        <tr>
                            <td>User Agent</td>
                            <td>{{ userAgent }}</td>
                        </tr>
                    </tbody>
                </table>
            </SettingsGroup>
            <SettingsGroup>
                <template #header>Others</template>
                <a class="win-link" :href="bugs.url" target="_blank" rel="noopener noreferrer">
                    Feedback on GitHub
                </a>
            </SettingsGroup>
            <SettingsGroup>
                <template #header>About</template>
                {{ version }}
                <Markdown>
                    <About />
                </Markdown>
            </SettingsGroup>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "../types";
import { shallowRef, watch } from "vue";
import { getTheme, setTheme, type Theme } from "../helpers/theme";
import { name, version as code, bugs } from "../package.json";
import { isWindows, isSettingsPaneSupported, isApplicationViewViewModeSupported } from "../helpers/utils";
import SettingsGroup from "../components/SettingsGroup.vue";
import Markdown from "../components/Markdown.vue";
import About from "../About.md"

const theme = shallowRef<Theme>(getTheme());
watch(theme, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        setTheme(newValue);
    }
});

const device = shallowRef("Browser");
const osVersion = shallowRef("Unknown");
const userAgent = navigator.userAgent;
const version = shallowRef(`${name} v${code}`);
if (isWindows) {
    const versionInfo = Windows.System.Profile.AnalyticsInfo.versionInfo;
    device.value = versionInfo.deviceFamily.replace('.', ' ');
    const deviceFamilyVersion = +versionInfo.deviceFamilyVersion;
    osVersion.value = `10.${deviceFamilyVersion & 0x0000FFFF00000000}.${(deviceFamilyVersion & 0x00000000FFFF0000) >> 16}.${deviceFamilyVersion & 0x000000000000FFFF}`;
    const _package = Windows.ApplicationModel.Package.current;
    version.value = `${_package.displayName} v${_package.id.version.major}.${_package.id.version.minor}.${_package.id.version.build}`;
}

function exitPIP() {
    if (isApplicationViewViewModeSupported) {
        const viewManagement: any = Windows.UI.ViewManagement;
        const view = viewManagement.ApplicationView.getForCurrentView();
        if (view.isViewModeSupported(viewManagement.ApplicationViewMode.default)) {
            view.tryEnterViewModeAsync(viewManagement.ApplicationViewMode.default);
        }
    }
}

function enterPIP() {
    if (isApplicationViewViewModeSupported) {
        const viewManagement: any = Windows.UI.ViewManagement;
        const view = viewManagement.ApplicationView.getForCurrentView();
        if (view.isViewModeSupported(viewManagement.ApplicationViewMode.compactOverlay)) {
            view.tryEnterViewModeAsync(viewManagement.ApplicationViewMode.compactOverlay);
        }
    }
}

function exitFullWindow() {
    if (isWindows) {
        Windows.UI.ViewManagement.ApplicationView.getForCurrentView().exitFullScreenMode();
    }
}

function settingsFlyout() {
    if (isSettingsPaneSupported) {
        Windows.UI.ApplicationSettings.SettingsPane.show();
    }
}

function enterFullWindow() {
    if (isWindows) {
        Windows.UI.ViewManagement.ApplicationView.getForCurrentView().tryEnterFullScreenMode();
    }
}
</script>

<style lang="scss" scoped>
@use "../styles/utils";

table {
    font-size: inherit;

    td,
    th {
        padding: 2px 4.5px;
    }
}

.root {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 20px;

    .scroll-viewer {
        flex: 1;
        display: flex;
        overflow: auto;
        flex-direction: column;
        padding: 0 20px 48px 0;
    }
}

.stack-horizontal {
    align-items: center;
}

@include utils.row-gap(24);
@include utils.row-gap(4);
@include utils.column-gap(4);
</style>