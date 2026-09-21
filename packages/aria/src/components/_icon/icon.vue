<script setup lang="ts">
import { computed, inject } from 'vue';
import type { VNode } from 'vue';
import { CONFIG_PROVIDER_CONTEXT_KEY } from '../../constants/attr';
import type { IconProps, IconValue } from './types';

defineOptions({
  name: 'Icon'
});

const props = defineProps<IconProps>();

interface IconContext {
  /**
   * A function to render the icon. This is useful when you want to use a custom icon library or want to wrap the icon with a custom component.
   *
   * @param icon The icon to be rendered. It can be a string, a VNode, or a Component.
   */
  iconRender?: (icon: IconValue) => VNode;
}

const context = inject<IconContext>(CONFIG_PROVIDER_CONTEXT_KEY, {});

const Icon = computed(() => context?.iconRender?.(props.icon));
</script>

<template>
  <component :is="Icon" v-if="Icon" />
</template>
