<script setup lang="ts">
import { useAttrs } from 'vue';
import { useNavMenuUi } from './context';
import type { NavMenuListProps } from './types';

defineOptions({
  name: 'NavMenuList',
  inheritAttrs: false
});

defineProps<NavMenuListProps>();

const attrs = useAttrs();

const cls = useNavMenuUi('list');
</script>

<template>
  <ul v-bind="attrs" :class="cls" data-vean-nav-menu-list>
    <slot />
  </ul>
</template>
