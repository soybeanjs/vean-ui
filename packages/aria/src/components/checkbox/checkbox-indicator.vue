<script setup lang="ts">
import { shallowRef } from 'vue';
import { isIndeterminate } from '../../shared';
import { useForwardElement, usePresence } from '../../composables';
import { Primitive } from '../primitive';
import { useCheckboxRootContext, useCheckboxUi } from './context';
import type { CheckboxIndicatorProps } from './types';

defineOptions({
  name: 'CheckboxIndicator'
});

const props = withDefaults(defineProps<CheckboxIndicatorProps>(), {
  as: 'span'
});

const cls = useCheckboxUi('indicator');

const [indicatorElement, setIndicatorElement] = useForwardElement();

const { state, dataDisabled, dataState } = useCheckboxRootContext('CheckboxIndicator');

const isPresent = props.forceMount
  ? shallowRef(true)
  : usePresence(indicatorElement, () => isIndeterminate(state.value) || state.value === true);
</script>

<template>
  <Primitive
    v-if="isPresent"
    :ref="setIndicatorElement"
    :as="as"
    :as-child="asChild"
    data-vean-checkbox-indicator
    :class="cls"
    :data-disabled="dataDisabled"
    :data-state="dataState"
    style="pointer-events: none"
  >
    <slot />
  </Primitive>
</template>
