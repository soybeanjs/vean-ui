<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { EditableCompact, provideEditableUi } from '@vean/aria/editable';
import { keysOf } from '@vean/aria/shared';
import { editableVariants } from '@/styles/editable';
import type { EditableProps, EditableEmits, EditableSlots } from './types';

defineOptions({
  name: 'SEditable'
});

const props = defineProps<EditableProps>();

const emit = defineEmits<EditableEmits>();

const slots = defineSlots<EditableSlots>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => editableVariants({ size: props.size }, props.ui, { root: props.class }));

provideEditableUi(ui);
</script>

<template>
  <EditableCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </EditableCompact>
</template>
