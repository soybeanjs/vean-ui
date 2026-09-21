<script setup lang="ts" generic="T extends AcceptableBooleanValue = boolean">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { SwitchCompact, provideSwitchUi } from '@vean/aria/switch';
import type { AcceptableBooleanValue } from '@vean/aria/types';
import { switchVariants } from '@/styles/switch';
import type { SwitchProps, SwitchEmits, SwitchSlots } from './types';

defineOptions({
  name: 'SSwitch'
});

const props = withDefaults(defineProps<SwitchProps<T>>(), {
  modelValue: undefined
});

const emit = defineEmits<SwitchEmits<T>>();

const slots = defineSlots<SwitchSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'color', 'size', 'shape']);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  switchVariants(
    {
      color: props.color,
      size: props.size,
      shape: props.shape
    },
    props.ui,
    { root: props.class }
  )
);

provideSwitchUi(ui);
</script>

<template>
  <SwitchCompact v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </SwitchCompact>
</template>
