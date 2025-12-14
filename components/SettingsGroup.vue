<template>
    <div class="settings-group">
        <div class="header-presenter" v-check-solt="$slots.header">
            <slot name="header"></slot>
        </div>
        <div class="items-presenter" v-check-solt="$slots.default">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import vCheckSolt from "../directives/checkSolt";
</script>

<style lang="scss" scoped>
.settings-group {
    --body-strong-text-block-font-size: var(--type-ramp-base-font-size);

    :deep(div.header-presenter) {
        margin: 10px 0 6px 1px;
        font-size: 20px;
        font-weight: normal;
    }

    :deep(div.items-presenter) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        >*:not(:last-child) {
            margin-bottom: 10px;
        }
    }
}
</style>