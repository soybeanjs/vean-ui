<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { TextareaCompact, provideTextareaUi } from '@vean/aria/textarea';
import { textareaVariants } from '@/styles/textarea';
import type { TextareaProps, TextareaEmits, TextareaSlots } from './types';

defineOptions({
  name: 'STextarea'
});

const props = defineProps<TextareaProps>();

const emit = defineEmits<TextareaEmits>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui', 'resize']);

const slots = defineSlots<TextareaSlots>();

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  textareaVariants(
    {
      size: props.size,
      resize: !props.autosize ? props.resize : false
    },
    props.ui,
    { root: props.class }
  )
);

provideTextareaUi(ui);
</script>

<template>
  <TextareaCompact v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </TextareaCompact>
</template>
