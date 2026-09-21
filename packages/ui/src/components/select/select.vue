<script setup lang="ts" generic="T extends DefinedValue, M extends boolean = false">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { SelectCompact, provideSelectUi } from '@vean/aria/select';
import { keysOf } from '@vean/aria/shared';
import type { DefinedValue } from '@vean/aria/types';
import { selectVariants } from '@/styles/select';
import type { SelectProps, SelectEmits, SelectSlots } from './types';

defineOptions({
  name: 'SSelect',
  inheritAttrs: false
});

const props = withDefaults(defineProps<SelectProps<T, M>>(), {
  open: undefined,
  showTriggerIcon: true
});

const emit = defineEmits<SelectEmits<T, M>>();

const slots = defineSlots<SelectSlots<T, M>>();

const forwardedProps = useOmitProps(props, ['class', 'ui', 'size']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => selectVariants({ size: props.size }, props.ui, { trigger: props.class }));

provideSelectUi(ui);
</script>

<template>
  <SelectCompact v-bind="forwardedProps" :items="items" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <!-- @vue-ignore ignore vue slot props type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </SelectCompact>
</template>
