<script setup lang="ts" generic="T extends CommandSingleOptionData = CommandSingleOptionData">
import { computed } from 'vue';
import { CommandCompact, provideCommandUi } from '@vean/aria/command';
import type { CommandSingleOptionData } from '@vean/aria/command';
import { useForwardListeners, useOmitProps } from '@vean/aria/composables';
import { keysOf } from '@vean/aria/shared';
import { commandVariants } from '@/styles/command';
import type { CommandProps, CommandEmits, CommandSlots } from './types';

defineOptions({
  name: 'SCommand'
});

const props = defineProps<CommandProps<T>>();

const emit = defineEmits<CommandEmits>();

const slots = defineSlots<CommandSlots<T>>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const listeners = useForwardListeners(emit);

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => commandVariants({ size: props.size }, props.ui, { root: props.class }));

provideCommandUi(ui);
</script>

<template>
  <CommandCompact v-bind="forwardedProps" :items="items" v-on="listeners">
    <template v-for="slotName in slotNames" #[slotName]="slotProps">
      <!-- @vue-ignore ignore vue slot props type -->
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </CommandCompact>
</template>
