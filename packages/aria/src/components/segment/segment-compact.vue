<script setup lang="ts" generic="T extends SegmentOptionData = SegmentOptionData">
import { useOmitProps } from '../../composables';
import type { AcceptableValue } from '../../types';
import { useSegmentUi } from './context';
import SegmentIndicator from './segment-indicator.vue';
import SegmentList from './segment-list.vue';
import SegmentRoot from './segment-root.vue';
import SegmentTrigger from './segment-trigger.vue';
import type { SegmentCompactProps, SegmentCompactEmits, SegmentCompactSlots, SegmentOptionData } from './types';

defineOptions({
  name: 'SegmentCompact'
});

const props = withDefaults(defineProps<SegmentCompactProps<T>>(), {
  modelValue: undefined,
  unmountOnHide: true,
  loop: true,
  enableIndicator: true
});

const emit = defineEmits<SegmentCompactEmits<T['value']>>();

defineSlots<SegmentCompactSlots<T>>();

const forwardedProps = useOmitProps(props, ['items', 'enableIndicator', 'listProps', 'triggerProps', 'indicatorProps']);

const ui = useSegmentUi();

const handleModelValueChange = (value: AcceptableValue) => {
  emit('update:modelValue', value as T['value']);
};
</script>

<template>
  <SegmentRoot v-bind="forwardedProps" @update:model-value="handleModelValueChange">
    <SegmentList v-bind="listProps">
      <SegmentTrigger
        v-for="item in items"
        :key="item.value"
        v-bind="triggerProps"
        v-slot="slotProps"
        :value="item.value"
        :disabled="item.disabled"
      >
        <slot name="item" v-bind="{ ...item, ...slotProps }">{{ item.label }}</slot>
      </SegmentTrigger>
      <SegmentIndicator v-if="enableIndicator" v-bind="indicatorProps">
        <slot name="indicator">
          <div :class="ui.indicatorContent" />
        </slot>
      </SegmentIndicator>
    </SegmentList>
  </SegmentRoot>
</template>
