<template>
    <div class="row-gap-24 root">
        <span class="win-type-title">{{ title }}</span>
        <div class="scroll-viewer">
            <span>
                {{ description }}<br />
                <span v-if="countTime > 0">预计将在约 {{ countTime }} 秒后返回首页。</span>
                <span v-else-if="!countTime">即将跳转到首页。</span>
                <span v-else="countTime < 0">自动跳转失败。</span><br />
                您可以<RouterLink class="win-link" :to="{ name: 'index' }"><b>点这里</b></RouterLink>直接返回首页。
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, shallowRef } from "vue";
import { useSeoMeta } from "@unhead/vue";
import { useRouter } from "vue-router";
import { setTimeoutAsync } from "../helpers/utils";
import { name } from "../package.json";

const title = "404 找不到页面";
const description = "对不起，您所访问的页面不存在或者已删除。";
useSeoMeta({
    // Basic SEO
    title: `${title} | ${name}`,
    description,

    // Open Graph
    ogTitle: title,
    ogDescription: description,
    ogSiteName: name
});

const router = useRouter();
const countTime = shallowRef(5);

onMounted(async () => {
    for (; countTime.value > 0; countTime.value--) {
        await setTimeoutAsync(1000);
    }
    router.push({ name: "index" });
});
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

@include utils.row-gap(24);
</style>