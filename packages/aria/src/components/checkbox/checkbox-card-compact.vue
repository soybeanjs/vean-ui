<script setup lang="ts">
import { computed, useId, useSlots } from 'vue';
import { useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { useCheckboxCardUi } from './context';
import CheckboxControl from './checkbox-control.vue';
import CheckboxIndicator from './checkbox-indicator.vue';
import CheckboxLabel from './checkbox-label.vue';
import CheckboxRoot from './checkbox-root.vue';
import type { CheckboxCardCompactProps, CheckboxCardCompactEmits } from './types';

defineOptions({
  name: 'CheckboxCardCompact'
});

const props = withDefaults(defineProps<CheckboxCardCompactProps>(), {
  modelValue: undefined
});

const emit = defineEmits<CheckboxCardCompactEmits>();

const slots = useSlots();

const forwardedProps = useOmitProps(props, [
  'label',
  'icon',
  'description',
  'controlProps',
  'indicatorProps',
  'labelProps'
]);

const ui = useCheckboxCardUi();

const defaultId = useId();

const checkboxId = computed(() => props.id || `checkbox-${defaultId}`);

const isIndeterminate = computed(() => props.modelValue === 'indeterminate');
</script>

<template>
  <CheckboxRoot v-bind="forwardedProps" @update:model-value="emit('update:modelValue', $event)">
    <div :class="ui.content">
      <Icon :icon="icon" :class="ui.icon" />
      <div :class="ui.textContent">
        <CheckboxLabel v-bind="labelProps" :for="checkboxId">
          <slot :id="checkboxId">{{ label }}</slot>
        </CheckboxLabel>
        <p v-if="slots.description || description" :class="ui.description">
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
    </div>
    <CheckboxControl v-bind="controlProps" :id="checkboxId">
      <CheckboxIndicator v-slot="slotProps" v-bind="indicatorProps">
        <slot name="indicator" v-bind="slotProps">
          <Icon :icon="isIndeterminate ? 'lucide:minus' : 'lucide:check'" :class="ui['indicator-icon']" />
        </slot>
      </CheckboxIndicator>
    </CheckboxControl>
  </CheckboxRoot>
</template>
