<script setup lang="ts">
import { computed, useAttrs, watch } from 'vue';
import { isNullish } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useControllableState, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import { Primitive } from '../primitive';
import { DEFAULT_MAX, getValueLabel, getValidMax, getValidModelValue } from './shared';
import { provideProgressRootContext, useProgressUi } from './context';
import type { ProgressRootProps, ProgressRootEmits, ProgressState } from './types';

defineOptions({
  name: 'ProgressRoot',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ProgressRootProps>(), {
  getValueLabel
});

const emit = defineEmits<ProgressRootEmits>();

const attrs = useAttrs();

const messages = useLocaleMessages();

const cls = useProgressUi('root');

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  null
);

const max = useControllableState(
  () => props.max,
  value => {
    emit('update:max', value);
  },
  DEFAULT_MAX
);

const dir = useDirection(() => props.dir);

const normalizedMax = computed(() => getValidMax(max.value));

const normalizedModelValue = computed(() => getValidModelValue(modelValue.value, normalizedMax.value));

const ariaValueNowProps = computed(() =>
  typeof normalizedModelValue.value === 'number' ? { 'aria-valuenow': normalizedModelValue.value } : {}
);

const forwardedProps = useOmitProps(
  props,
  ['modelValue', 'max', 'getValueLabel', 'getValueText'],
  attrs,
  ariaValueNowProps
);

const progressState = computed<ProgressState>(() => {
  if (isNullish(normalizedModelValue.value)) {
    return 'indeterminate';
  }

  if (normalizedModelValue.value === normalizedMax.value) {
    return 'complete';
  }

  return 'loading';
});

const valuePercent = computed(() => {
  if (isNullish(normalizedModelValue.value)) {
    return null;
  }

  return (normalizedModelValue.value / normalizedMax.value) * DEFAULT_MAX;
});

const valueLabel = computed(() => props.getValueLabel?.(normalizedModelValue.value, normalizedMax.value));

const valueText = computed(() => props.getValueText?.(normalizedModelValue.value, normalizedMax.value));

function getNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}
function getStringAttr(name: 'aria-label' | 'aria-valuetext') {
  return getNonEmptyString(attrs[name]);
}
const ariaLabel = computed(
  () => getStringAttr('aria-label') ?? getNonEmptyString(valueLabel.value) ?? messages.value.progress.ariaLabel
);

const ariaValueText = computed(() => getStringAttr('aria-valuetext') ?? getNonEmptyString(valueText.value));

watch(
  normalizedMax,
  value => {
    if (value !== max.value) {
      max.value = value;
    }
  },
  { immediate: true }
);

watch(
  normalizedModelValue,
  value => {
    if (value !== modelValue.value) {
      modelValue.value = value;
    }
  },
  { immediate: true }
);

provideProgressRootContext({
  dir,
  modelValue: normalizedModelValue,
  max: normalizedMax,
  progressState,
  valuePercent
});
</script>

<template>
  <Primitive
    v-bind="forwardedProps"
    data-vean-progress-root
    :class="cls"
    role="progressbar"
    :aria-label="ariaLabel"
    :aria-valuemin="0"
    :aria-valuemax="normalizedMax"
    :aria-valuetext="ariaValueText"
    :data-state="progressState"
    :data-value="normalizedModelValue ?? undefined"
    :data-max="normalizedMax"
  >
    <slot
      :model-value="normalizedModelValue"
      :max="normalizedMax"
      :progress-state="progressState"
      :value-percent="valuePercent"
    />
  </Primitive>
</template>
