<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { isIndeterminate } from '../../shared';
import { useForwardElement, usePresence } from '../../composables';
import { Primitive } from '../primitive';
import { useMenuItemIndicatorContext, useMenuUi } from './context';
import type { MenuItemIndicatorProps } from './types';

defineOptions({
  name: 'MenuItemIndicator'
});

const props = withDefaults(defineProps<MenuItemIndicatorProps>(), {
  as: 'span'
});

const cls = useMenuUi('itemIndicator');

const [indicatorElement, setIndicatorElement] = useForwardElement();

const { modelValue } = useMenuItemIndicatorContext('MenuItemIndicator');

const checked = computed(() => isIndeterminate(modelValue.value) || modelValue.value === true);

const isPresent = props.forceMount ? shallowRef(true) : usePresence(indicatorElement, checked);
</script>

<template>
  <Primitive
    v-if="isPresent"
    :ref="setIndicatorElement"
    :as="as"
    :as-child="asChild"
    data-vean-menu-item-indicator
    :class="cls"
  >
    <slot />
  </Primitive>
</template>
