<script setup lang="ts" generic="T extends DefinedValue = DefinedValue, M extends boolean = false">
import { computed } from 'vue';
import { isNullish } from '../../shared';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import type { MaybeArray, DefinedValue } from '../../types';
import Icon from '../_icon/icon.vue';
import { Portal } from '../portal';
import { isGroupOption } from './shared';
import SelectArrow from './select-arrow.vue';
import SelectClear from './select-clear.vue';
import SelectContent from './select-content.vue';
import SelectGroupLabel from './select-group-label.vue';
import SelectGroup from './select-group.vue';
import SelectItemIndicator from './select-item-indicator.vue';
import SelectItemText from './select-item-text.vue';
import SelectItem from './select-item.vue';
import SelectRoot from './select-root.vue';
import SelectScrollDownButton from './select-scroll-down-button.vue';
import SelectScrollUpButton from './select-scroll-up-button.vue';
import SelectSeparator from './select-separator.vue';
import SelectTriggerIcon from './select-trigger-icon.vue';
import SelectTrigger from './select-trigger.vue';
import SelectValue from './select-value.vue';
import SelectViewport from './select-viewport.vue';
import type {
  SelectCompactProps,
  SelectCompactTriggerValueSlotProps,
  SelectCompactEmits,
  SelectCompactSlots,
  SelectItemEvent,
  SelectOptionData
} from './types';

defineOptions({
  name: 'SelectCompact'
});

const props = withDefaults(defineProps<SelectCompactProps<T, M>>(), {
  open: undefined,
  showTriggerIcon: true,
  clearable: true
});

const emit = defineEmits<SelectCompactEmits<T, M>>();

defineSlots<SelectCompactSlots<T, M>>();

const messages = useLocaleMessages();

const forwardedProps = useOmitProps(props, [
  'items',
  'showArrow',
  'triggerProps',
  'triggerIconProps',
  'showTriggerIcon',
  'placeholder',
  'clearLabel',
  'clearProps',
  'valueProps',
  'portalProps',
  'contentProps',
  'placement',
  'popupProps',
  'viewportProps',
  'scrollDownButtonProps',
  'scrollUpButtonProps',
  'groupProps',
  'groupLabelProps',
  'itemProps',
  'itemTextProps',
  'itemIndicatorProps',
  'separatorProps',
  'arrowProps'
]);

const valueProps = computed(() => ({
  ...props.valueProps,
  placeholder: props.placeholder ?? props.valueProps?.placeholder
}));

const contentProps = computed(() => ({
  ...props.contentProps,
  placement: props.placement ?? props.contentProps?.placement,
  popupProps: props.popupProps ?? props.contentProps?.popupProps
}));

const getItemKey = (item: SelectOptionData<T>) => {
  if (isGroupOption(item)) {
    return `group-${item.label}`;
  }

  return `item-${String(item.value)}`;
};

const getTriggerValueSlotProps = (slotProps: {
  modelValue: MaybeArray<DefinedValue> | undefined;
  selectedLabel: string[];
  slotText: string;
}) => {
  return slotProps as SelectCompactTriggerValueSlotProps<T, M>;
};

const isEmptyValue = (value: MaybeArray<DefinedValue> | undefined) =>
  isNullish(value) || (Array.isArray(value) && value.length === 0);

/**
 * The collection-backed label lookup only works once the popup content has mounted
 * (options are registered by `SelectItem` on mount). Before the first open this
 * leaves the trigger empty even when `defaultValue`/`modelValue` is set, so we
 * resolve the label from the data-driven `items` as a fallback.
 */
const resolveLabelFromItems = (value: MaybeArray<DefinedValue> | undefined) => {
  if (isEmptyValue(value)) {
    return '';
  }

  const values = (Array.isArray(value) ? value : [value]) as DefinedValue[];

  const labelOf = (target: DefinedValue) => {
    for (const item of props.items) {
      if (isGroupOption(item)) {
        const match = item.items.find(child => child.value === target);
        if (match) return match.label;
        continue;
      }

      if (item.value === target) return item.label;
    }
    return '';
  };

  return values.map(labelOf).filter(Boolean).join(', ');
};

const getDisplayedTriggerText = (slotProps: {
  modelValue: MaybeArray<DefinedValue> | undefined;
  selectedLabel: string[];
  slotText: string;
}) => {
  if (isEmptyValue(slotProps.modelValue)) {
    return slotProps.slotText;
  }

  if (slotProps.selectedLabel.length) {
    return slotProps.slotText;
  }

  return resolveLabelFromItems(slotProps.modelValue) || slotProps.slotText;
};

const handleModelValueChange = (value: MaybeArray<DefinedValue> | undefined) => {
  emit('update:modelValue', value as NonNullable<SelectCompactProps<T, M>['modelValue']>);
};

const handleSelect = (event: SelectItemEvent<DefinedValue>) => {
  emit('select', event as SelectItemEvent<T>);
};
</script>

<template>
  <SelectRoot
    v-bind="forwardedProps"
    @update:model-value="handleModelValueChange"
    @update:open="emit('update:open', $event)"
  >
    <SelectTrigger v-bind="triggerProps">
      <slot name="trigger-leading" />
      <SelectValue v-slot="slotProps" v-bind="valueProps">
        <slot name="trigger-value" v-bind="getTriggerValueSlotProps(slotProps)">
          {{ getDisplayedTriggerText(slotProps) }}
        </slot>
      </SelectValue>
      <slot name="trigger-trailing" />
      <SelectClear v-if="clearable" v-bind="clearProps" :aria-label="clearLabel ?? messages.select.clear" />
      <SelectTriggerIcon v-if="showTriggerIcon" v-bind="triggerIconProps">
        <slot name="trigger-icon">
          <Icon icon="lucide:chevrons-up-down" />
        </slot>
      </SelectTriggerIcon>
    </SelectTrigger>
    <Portal v-bind="portalProps">
      <SelectContent
        v-bind="contentProps"
        @close-auto-focus="emit('closeAutoFocus', $event)"
        @escape-key-down="emit('escapeKeyDown', $event)"
        @pointer-down-outside="emit('pointerDownOutside', $event)"
      >
        <slot name="top" />
        <SelectScrollUpButton v-bind="scrollUpButtonProps">
          <slot name="scroll-up-button">
            <Icon icon="lucide:chevron-up" />
          </slot>
        </SelectScrollUpButton>
        <SelectViewport v-bind="viewportProps">
          <template v-for="item in items" :key="getItemKey(item)">
            <template v-if="isGroupOption(item)">
              <SelectGroup v-bind="groupProps">
                <SelectGroupLabel v-bind="groupLabelProps">
                  <slot name="group-label" :item="item">{{ item.label }}</slot>
                </SelectGroupLabel>
                <SelectSeparator v-if="item.separator" v-bind="separatorProps" />
                <template v-for="child in item.items" :key="String(child.value)">
                  <SelectItem
                    v-bind="itemProps"
                    :value="child.value"
                    :text-value="child.textValue"
                    :disabled="child.disabled"
                    @select="handleSelect($event)"
                  >
                    <slot name="item-leading" :item="child">
                      <Icon v-if="child.icon" :icon="child.icon" />
                    </slot>
                    <SelectItemText v-bind="itemTextProps">
                      <slot name="item-text" :item="child">{{ child.label }}</slot>
                    </SelectItemText>
                    <slot name="item-trailing" :item="child" />
                    <SelectItemIndicator v-bind="itemIndicatorProps">
                      <slot name="item-indicator" :item="child">
                        <Icon icon="lucide:check" />
                      </slot>
                    </SelectItemIndicator>
                  </SelectItem>
                  <SelectSeparator v-if="child.separator" v-bind="separatorProps" />
                </template>
              </SelectGroup>
            </template>
            <template v-else>
              <SelectItem
                v-bind="itemProps"
                :value="item.value"
                :text-value="item.textValue"
                :disabled="item.disabled"
                @select="handleSelect($event)"
              >
                <slot name="item-leading" :item="item">
                  <Icon v-if="item.icon" :icon="item.icon" />
                </slot>
                <SelectItemText v-bind="itemTextProps">
                  <slot name="item-text" :item="item">{{ item.label }}</slot>
                </SelectItemText>
                <slot name="item-trailing" :item="item" />
                <SelectItemIndicator v-bind="itemIndicatorProps">
                  <slot name="item-indicator" :item="item">
                    <Icon icon="lucide:check" />
                  </slot>
                </SelectItemIndicator>
              </SelectItem>
              <SelectSeparator v-if="item.separator" v-bind="separatorProps" />
            </template>
          </template>
        </SelectViewport>
        <SelectScrollDownButton v-bind="scrollDownButtonProps">
          <slot name="scroll-down-button">
            <Icon icon="lucide:chevron-down" />
          </slot>
        </SelectScrollDownButton>
        <slot name="bottom" />
        <SelectArrow v-if="showArrow" v-bind="arrowProps" />
      </SelectContent>
    </Portal>
  </SelectRoot>
</template>
