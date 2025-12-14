<template>
    <div class="row-gap-24 root">
        <span class="win-type-title">Overview</span>
        <div class="scroll-viewer">
            <div class="stack-vertical row-gap-40">
                <div class="stack-vertical row-gap-20">
                    <span class="win-type-base">Buttons</span>
                    <div class="stack-horizontal column-gap-8">
                        <button class="win-button">Enabled button</button>
                        <button class="win-button" disabled>Disabled button</button>
                    </div>
                </div>
                <div class="stack-vertical row-gap-15">
                    <span class="win-type-base">Checkbox</span>
                    <div class="stack-vertical row-gap-8">
                        <label class="stack-horizontal">
                            <input class="win-checkbox" type="checkbox" /> Unchecked
                        </label>
                        <label class="stack-horizontal">
                            <input class="win-checkbox" type="checkbox" checked /> Checked
                        </label>
                        <label class="stack-horizontal">
                            <input class="win-checkbox" type="checkbox" indeterminate /> Third state
                        </label>
                        <label class="stack-horizontal">
                            <input class="win-checkbox" type="checkbox" checked disabled /> Disabled
                        </label>
                    </div>
                </div>
                <div class="stack-vertical row-gap-14">
                    <span class="win-type-base">Radio button</span>
                    <div class="stack-vertical row-gap-8">
                        <label class="stack-horizontal">
                            <input class="win-radio" type="radio" /> Unchecked
                        </label>
                        <label class="stack-horizontal">
                            <input class="win-radio" type="radio" checked /> Checked
                        </label>
                        <label class="stack-horizontal">
                            <input class="win-radio" type="radio" name="Disabled" checked disabled /> Disabled
                        </label>
                    </div>
                </div>
                <div class="stack-vertical row-gap-11">
                    <span class="win-type-base">Date picker</span>
                    <div class="stack-vertical row-gap-18">
                        <WinJSControl :control="DatePicker" />
                        <WinJSControl :control="DatePicker" :options="{ disabled: true }" />
                    </div>
                </div>
                <div class="stack-vertical row-gap-11">
                    <span class="win-type-base">Time picker</span>
                    <WinJSControl :control="TimePicker" />
                </div>
                <div class="stack-vertical">
                    <span Margin="0,0,0,11" class="win-type-base">Combo box</span>
                    <div class="stack-vertical row-gap-17" style="align-items: stretch;">
                        <select class="win-dropdown" placeholder="Placeholder text">
                            <option>List item</option>
                            <option>List item</option>
                            <option>List item</option>
                            <option>List item</option>
                        </select>
                        <select class="win-dropdown" placeholder="Placeholder text" disabled></select>
                        <button class="win-button" ref="button" @click="openFlyout">Button with flyout</button>
                        <WinJSControl :control="Flyout" :options="{ anchor: button! }" ref="flyout">
                            <div class="stack-vertical row-gap-12">
                                <span class="win-type-base">
                                    All items will be removed. Do you want to continue?
                                </span>
                                <button class="win-button">Yes, empty my cart</button>
                            </div>
                        </WinJSControl>
                    </div>
                </div>
                <div class="stack-vertical row-gap-11">
                    <span class="win-type-base">Textbox</span>
                    <div class="stack-vertical row-gap-17">
                        <input class="win-textbox" placeholder="Placeholder text" />
                        <input class="win-textbox" type="password" placeholder="Placeholder text" />
                    </div>
                </div>
                <div class="stack-vertical row-gap-14">
                    <span class="win-type-base">Toggle switch</span>
                    <div class="gap-12" style="display: grid; grid-template-columns: auto auto;">
                        <WinJSControl :control="ToggleSwitch" />
                        <WinJSControl :control="ToggleSwitch" :options="{ checked: true }" />
                        <WinJSControl :control="ToggleSwitch" :options="{ disabled: true }" />
                        <WinJSControl :control="ToggleSwitch" :options="{ checked: true, disabled: true }" />
                    </div>
                </div>
                <div class="stack-vertical row-gap-14">
                    <span class="win-type-base">Slider</span>
                    <input class="win-slider" type="range" max="100" value="50"></input>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import "../types";
import { useTemplateRef } from "vue";
import WinJSControl from "../components/WinJSControl.vue";

const { DatePicker, Flyout, TimePicker, ToggleSwitch } = WinJS.UI;
const button = useTemplateRef("button");
const flyout = useTemplateRef("flyout");

function openFlyout() {
    flyout.value!.control!.show();
}
</script>

<style lang="scss" scoped>
@use "../styles/utils";

.root {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 20px;
    align-items: stretch;

    .scroll-viewer {
        flex: 1;
        display: flex;
        overflow: auto;
        flex-direction: column;
        padding: 0 20px 48px 0;
    }
}

.stack-vertical {
    align-items: flex-start;
}

.stack-horizontal {
    align-items: center;
}

@include utils.row-gap(40);
@include utils.row-gap(24);
@include utils.row-gap(20);
@include utils.row-gap(18);
@include utils.row-gap(17);
@include utils.row-gap(15);
@include utils.row-gap(14);
@include utils.row-gap(12);
@include utils.row-gap(11);
@include utils.row-gap(8);
@include utils.column-gap(8);
@include utils.gap(12);
</style>