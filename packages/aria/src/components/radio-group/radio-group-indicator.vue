<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { getCheckedState } from '../../shared';
import { useForwardElement, usePresence } from '../../composables';
import { Primitive } from '../primitive';
import { useRadioGroupItemContext, useRadioGroupUi } from './context';
import type { RadioGroupIndicatorProps } from './types';

defineOptions({
  name: 'RadioGroupIndicator'
});

const props = withDefaults(defineProps<RadioGroupIndicatorProps>(), {
  as: 'span'
});

const cls = useRadioGroupUi('indicator');

const [indicatorElement, setIndicatorElement] = useForwardElement();
const { checked, disabled } = useRadioGroupItemContext('RadioGroupIndicator');

const isPresent = props.forceMount ? shallowRef(true) : usePresence(indicatorElement, () => checked.value === true);

const dataState = computed(() => getCheckedState(checked.value));
</script>

<template>
  <Primitive
    v-if="isPresent"
    :ref="setIndicatorElement"
    :as="as"
    :as-child="asChild"
    data-vean-radio-group-indicator
    :class="cls"
    :data-state="dataState"
    :data-disabled="disabled ? '' : undefined"
  >
    <slot />
  </Primitive>
</template>
