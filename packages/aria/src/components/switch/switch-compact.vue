<script setup lang="ts" generic="T extends AcceptableBooleanValue = boolean">
import { computed, useId } from 'vue';
import { useOmitProps } from '../../composables';
import type { AcceptableBooleanValue } from '../../types';
import SwitchControl from './switch-control.vue';
import SwitchRoot from './switch-root.vue';
import SwitchThumb from './switch-thumb.vue';
import type { SwitchCompactProps, SwitchCompactEmits, SwitchCompactSlots } from './types';

defineOptions({
  name: 'SwitchCompact'
});

const props = withDefaults(defineProps<SwitchCompactProps<T>>(), {
  modelValue: undefined
});

const emit = defineEmits<SwitchCompactEmits<T>>();

defineSlots<SwitchCompactSlots<T>>();

const forwardedProps = useOmitProps(props, ['controlProps', 'thumbProps']);

const defaultId = useId();

const switchId = computed(() => props.controlProps?.id || `switch-${defaultId}`);
</script>

<template>
  <SwitchRoot v-slot="slotProps" v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <slot name="leading" v-bind="slotProps" />
    <SwitchControl v-bind="controlProps" :id="switchId">
      <SwitchThumb v-bind="thumbProps">
        <slot v-bind="slotProps" />
      </SwitchThumb>
    </SwitchControl>
    <slot name="trailing" v-bind="slotProps" />
  </SwitchRoot>
</template>
