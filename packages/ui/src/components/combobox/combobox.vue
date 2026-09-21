<script setup lang="ts" generic="M extends boolean = false">
import { computed } from 'vue';
import { ComboboxCompact, provideComboboxUi } from '@vean/aria/combobox';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { comboboxVariants } from '@/styles/combobox';
import type { ComboboxProps, ComboboxEmits, ComboboxSlots } from './types';

defineOptions({
  name: 'SCombobox'
});

const props = withDefaults(defineProps<ComboboxProps<M>>(), {
  open: undefined,
  clearable: true
});

const emit = defineEmits<ComboboxEmits<M>>();

const slots = defineSlots<ComboboxSlots<M>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => comboboxVariants({ size: props.size }, props.ui, { trigger: props.class }));

provideComboboxUi(ui);
</script>

<template>
  <ComboboxCompact v-bind="forwardedProps" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <!-- @vue-expect-error ignore vue slot props type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </ComboboxCompact>
</template>
