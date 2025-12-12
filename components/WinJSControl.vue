<template>
    <component :is="tag" ref="element">
        <slot></slot>
    </component>
</template>

<script generic="TElement extends IWinJSControl" lang="ts" setup>
import { onMounted, shallowRef, useTemplateRef, watch } from "vue";
import { IWinJSControl } from "../types";

const { tag = "div", control, options } = defineProps<{
    tag?: string,
    control: TElement,
    options?: Partial<{
        [K in keyof Omit<InstanceType<TElement>, "element"> as InstanceType<TElement>[K] extends Function ? never : K]: InstanceType<TElement>[K]
    }>
}>();

const element = useTemplateRef<HTMLElement>("element");
const instance = shallowRef<InstanceType<TElement>>();
defineExpose({ control: instance });

onMounted(() => {
    watch(
        element,
        (newValue, oldValue) => {
            if (newValue != oldValue) {
                instance.value = new control(element.value!, options)
            }
        }, {
        immediate: true,
        flush: "post"
    });
    watch(
        () => options,
        (newValue, oldValue) => {
            if (newValue != oldValue) {
                Object.assign(instance.value!, newValue);
            }
        }, {
        deep: true,
        flush: "post"
    });
});
</script>