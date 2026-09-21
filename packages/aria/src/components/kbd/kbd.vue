<script setup lang="ts">
import { computed } from 'vue';
import { useKbd } from '../../composables';
import type { KbdProps } from './types';

defineOptions({
  name: 'Kbd'
});

const props = withDefaults(defineProps<KbdProps>(), {
  symbolize: true
});

const { getKeyboardKey } = useKbd();

const formattedValue = computed(() => {
  const values = Array.isArray(props.value) ? props.value : [props.value];

  return values
    .map(value => {
      if (props.symbolize) {
        return getKeyboardKey(value);
      }

      return value;
    })
    .join('');
});
</script>

<template>
  <kbd data-vean-kbd :data-group="Array.isArray(value) ? '' : undefined">
    <slot>{{ formattedValue }}</slot>
  </kbd>
</template>
