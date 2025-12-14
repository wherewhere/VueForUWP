<template>
  <div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUpdated } from 'vue';

function process() {
  const links = document.querySelectorAll('a');
  for (let i = 0; i < links.length; i++) {
    links[i].classList.add("win-link");
  }
};

onMounted(process);
onUpdated(process);
</script>

<style lang="scss" scoped>
:deep(h1) {
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
}

:deep(h2) {
  font-size: 20px;
  font-weight: normal;
  margin: 15px 0;
}

:deep(h3) {
  font-size: 17px;
  font-weight: bold;
  margin: 10px 0;
}

:deep(h4) {
  font-size: 17px;
  font-weight: normal;
  margin: 10px 0;
}

:deep(h5) {
  font-size: 15px;
  font-weight: bold;
  margin: 10px 0 5px 0;
}

:deep(h6) {
  font-size: 15px;
  font-weight: normal;
  margin: 10px 0 0 0;
}

:deep(ol),
:deep(ul) {
  margin: 5px 0;
  padding-inline-start: 32px;
}

:deep(p) {
  margin: 5px 0;
}
</style>