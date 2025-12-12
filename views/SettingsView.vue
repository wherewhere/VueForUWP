<template>
    <div class="row-gap-24 root">
        <span class="win-type-title">Settings</span>
        <div class="scroll-viewer">
            <SettingsGroup>
                <template #header>Theme</template>
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
                <template #header>About</template>
                {{ version }}
            </SettingsGroup>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, watch } from "vue";
import { getTheme, setTheme, type Theme } from "../helpers/theme";
import { name, version as code } from "../package.json";
import SettingsGroup from "../components/SettingsGroup.vue";

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
if (typeof Windows !== "undefined") {
    const versionInfo = Windows.System.Profile.AnalyticsInfo.versionInfo;
    device.value = versionInfo.deviceFamily.replace('.', ' ');
    const deviceFamilyVersion = +versionInfo.deviceFamilyVersion;
    osVersion.value = `10.${deviceFamilyVersion & 0x0000FFFF00000000}.${(deviceFamilyVersion & 0x00000000FFFF0000) >> 16}.${deviceFamilyVersion & 0x000000000000FFFF}`;
    const _package = Windows.ApplicationModel.Package.current;
    version.value = `${_package.displayName} v${_package.id.version.major}.${_package.id.version.minor}.${_package.id.version.build}`;

}
</script>

<style lang="scss" scoped>
@use "../styles/utils";

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
</style>