<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import Icon from '../_icon/icon.vue';
import { useStepperUi } from './context';
import StepperDescription from './stepper-description.vue';
import StepperIndicator from './stepper-indicator.vue';
import StepperItem from './stepper-item.vue';
import StepperRoot from './stepper-root.vue';
import StepperSeparator from './stepper-separator.vue';
import StepperTitle from './stepper-title.vue';
import StepperTrigger from './stepper-trigger.vue';
import type { StepperCompactProps, StepperCompactEmits, StepperCompactSlots } from './types';

defineOptions({
  name: 'StepperCompact'
});

const props = defineProps<StepperCompactProps>();

const emit = defineEmits<StepperCompactEmits>();

const slots = defineSlots<StepperCompactSlots>();

const forwardedProps = useOmitProps(props, [
  'items',
  'itemProps',
  'triggerProps',
  'indicatorProps',
  'separatorProps',
  'titleProps',
  'descriptionProps'
]);

const listeners = useForwardListeners(emit);

const resolvedItems = computed(() => props.items.map((item, index) => ({ ...item, step: index + 1 })));

const ui = useStepperUi();
</script>

<template>
  <StepperRoot v-slot="rootSlotProps" v-bind="forwardedProps" v-on="listeners">
    <template v-for="(item, index) in resolvedItems" :key="item.step">
      <StepperItem
        v-slot="itemSlotProps"
        v-bind="itemProps"
        :step="item.step"
        :disabled="item.disabled"
        :completed="item.completed"
        :data-first="index === 0 ? '' : undefined"
        :data-last="index === resolvedItems.length - 1 ? '' : undefined"
      >
        <slot name="item" v-bind="{ ...item, ...rootSlotProps, ...itemSlotProps }">
          <StepperTrigger v-bind="triggerProps">
            <StepperIndicator v-bind="indicatorProps">
              <slot name="indicator" v-bind="{ ...item, ...rootSlotProps, ...itemSlotProps }">
                <Icon
                  v-if="itemSlotProps.state === 'completed'"
                  icon="lucide:check"
                  :class="ui.indicatorIcon"
                  :aria-hidden="true"
                />
                <span v-else>{{ item.step }}</span>
              </slot>
            </StepperIndicator>
            <div :class="ui.itemContent">
              <StepperTitle v-bind="titleProps">
                <slot name="title" v-bind="{ ...item, ...rootSlotProps, ...itemSlotProps }">
                  {{ item.title ?? `Step ${item.step}` }}
                </slot>
              </StepperTitle>
              <StepperDescription v-if="item.description || slots.description" v-bind="descriptionProps">
                <slot name="description" v-bind="{ ...item, ...rootSlotProps, ...itemSlotProps }">
                  {{ item.description }}
                </slot>
              </StepperDescription>
            </div>
          </StepperTrigger>
          <slot
            v-if="index < resolvedItems.length - 1"
            name="separator"
            v-bind="{ ...item, ...rootSlotProps, ...itemSlotProps }"
          >
            <StepperSeparator v-bind="separatorProps" />
          </slot>
        </slot>
      </StepperItem>
    </template>
  </StepperRoot>
</template>
