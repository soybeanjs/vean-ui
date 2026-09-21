<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { InputNumberCompact, provideInputNumberUi } from '@vean/aria/input-number';
import { keysOf } from '@vean/aria/shared';
import { inputNumberVariants } from '@/styles/input-number';
import type { InputNumberProps, InputNumberEmits, InputNumberSlots } from './types';

defineOptions({
  name: 'SInputNumber'
});

const props = defineProps<InputNumberProps>();

const emit = defineEmits<InputNumberEmits>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'center']);

const slots = defineSlots<InputNumberSlots>();

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  inputNumberVariants(
    {
      size: props.size,
      center: props.center
    },
    props.ui,
    { root: props.class }
  )
);

provideInputNumberUi(ui);
</script>

<template>
  <InputNumberCompact v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </InputNumberCompact>
</template>
