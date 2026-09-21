<script setup lang="ts" generic="T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData">
import { computed } from 'vue';
import { AutocompleteCompact, provideAutocompleteUi } from '@vean/aria/autocomplete';
import type { AutocompleteSingleOptionData } from '@vean/aria/autocomplete';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { autocompleteVariants } from '@/styles/autocomplete';
import type { AutocompleteProps, AutocompleteEmits, AutocompleteSlots } from './types';

defineOptions({
  name: 'SAutocomplete'
});

const props = withDefaults(defineProps<AutocompleteProps<T>>(), {
  modelValue: undefined,
  open: undefined,
  clearable: false,
  clearLabel: 'Clear input',
  emptyLabel: 'No results found.'
});

const emit = defineEmits<AutocompleteEmits<T>>();

const slots = defineSlots<AutocompleteSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() =>
  autocompleteVariants(
    {
      size: props.size
    },
    props.ui,
    { root: props.class }
  )
);

provideAutocompleteUi(ui);
</script>

<template>
  <AutocompleteCompact v-bind="forwardedProps" :items="items" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <!-- @vue-ignore ignore vue slot props type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </AutocompleteCompact>
</template>
