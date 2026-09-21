<script setup lang="ts">
import { computed, useId } from 'vue';
import { useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { useCheckboxUi } from './context';
import CheckboxControl from './checkbox-control.vue';
import CheckboxIndicator from './checkbox-indicator.vue';
import CheckboxLabel from './checkbox-label.vue';
import CheckboxRoot from './checkbox-root.vue';
import type { CheckboxCompactProps, CheckboxCompactEmits } from './types';

defineOptions({
  name: 'CheckboxCompact'
});

const props = withDefaults(defineProps<CheckboxCompactProps>(), {
  modelValue: undefined
});

const emit = defineEmits<CheckboxCompactEmits>();

const forwardedProps = useOmitProps(props, ['label', 'controlProps', 'indicatorProps', 'labelProps']);

const defaultId = useId();

const checkboxId = computed(() => props.id || `checkbox-${defaultId}`);

const ui = useCheckboxUi();
</script>

<template>
  <CheckboxRoot v-slot="slotProps" v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <CheckboxControl v-bind="controlProps" :id="checkboxId">
      <CheckboxIndicator v-bind="indicatorProps">
        <slot name="indicator" v-bind="slotProps">
          <Icon
            :icon="slotProps.state === 'indeterminate' ? 'lucide:minus' : 'lucide:check'"
            :class="ui['indicator-icon']"
          />
        </slot>
      </CheckboxIndicator>
    </CheckboxControl>
    <CheckboxLabel v-if="$slots.default || label" v-bind="labelProps" :for="checkboxId">
      <slot v-bind="slotProps" :id="checkboxId">{{ label }}</slot>
    </CheckboxLabel>
  </CheckboxRoot>
</template>
