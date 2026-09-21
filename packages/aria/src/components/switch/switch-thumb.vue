<script setup lang="ts">
import { Primitive } from '../primitive';
import { useSwitchRootContext, useSwitchUi } from './context';
import type { SwitchThumbProps } from './types';

defineOptions({
  name: 'SwitchThumb'
});

withDefaults(defineProps<SwitchThumbProps>(), {
  as: 'span'
});

const { dataState, dataDisabled } = useSwitchRootContext('SwitchThumb');

const cls = useSwitchUi('thumb');
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-vean-switch-thumb
    :class="cls"
    :data-disabled="dataDisabled"
    :data-state="dataState"
  >
    <slot />
  </Primitive>
</template>
