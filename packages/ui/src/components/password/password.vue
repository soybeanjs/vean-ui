<script setup lang="ts">
import { computed } from 'vue';
import { useOmitProps } from '@vean/aria/composables';
import { PasswordCompact, providePasswordUi } from '@vean/aria/password';
import { keysOf } from '@vean/aria/shared';
import { passwordVariants } from '@/styles/password';
import type { PasswordProps, PasswordEmits, PasswordSlots } from './types';

defineOptions({
  name: 'SPassword'
});

const props = withDefaults(defineProps<PasswordProps>(), {
  visible: undefined
});

const emit = defineEmits<PasswordEmits>();

const forwardedProps = useOmitProps(props, ['class', 'size', 'ui']);

const slots = defineSlots<PasswordSlots>();

const slotNames = computed(() => keysOf(slots));

const ui = computed(() => passwordVariants({ size: props.size }, props.ui, { root: props.class }));

providePasswordUi(ui);
</script>

<template>
  <PasswordCompact
    v-bind="forwardedProps"
    @update:model-value="emit('update:modelValue', $event)"
    @update:visible="emit('update:visible', $event)"
    @clear="emit('clear', $event)"
  >
    <template v-for="slotName in slotNames" :key="slotName" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </PasswordCompact>
</template>
