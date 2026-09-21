<script setup lang="ts">
import { useControllableState } from '../../composables';
import { provideAlertRootContext, useAlertUi } from './context';
import type { AlertRootProps, AlertRootEmits } from './types';

defineOptions({
  name: 'AlertRoot'
});

const props = withDefaults(defineProps<AlertRootProps>(), {
  open: undefined,
  role: 'alert'
});

const emit = defineEmits<AlertRootEmits>();

const cls = useAlertUi('root');

const open = useControllableState(
  () => props.open,
  value => {
    emit('update:open', value);
  },
  true
);

provideAlertRootContext({
  open
});
</script>

<template>
  <div v-if="open" data-vean-alert-root :class="cls" :role="role">
    <slot />
  </div>
</template>
