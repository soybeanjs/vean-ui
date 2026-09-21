<script setup lang="ts" generic="M extends boolean = false">
import { computed } from 'vue';
import { useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import type { MaybeArray } from '../../types';
import Icon from '../_icon/icon.vue';
import ComboboxPortal from '../portal/portal.vue';
import { getDisplayValue, getSelectedLabels, isGroupOption } from './shared';
import ComboboxAnchor from './combobox-anchor.vue';
import ComboboxCancel from './combobox-cancel.vue';
import ComboboxClear from './combobox-clear.vue';
import ComboboxContent from './combobox-content.vue';
import ComboboxEmpty from './combobox-empty.vue';
import ComboboxGroupLabel from './combobox-group-label.vue';
import ComboboxGroup from './combobox-group.vue';
import ComboboxInput from './combobox-input.vue';
import ComboboxItemIndicator from './combobox-item-indicator.vue';
import ComboboxItem from './combobox-item.vue';
import ComboboxRoot from './combobox-root.vue';
import ComboboxSeparator from './combobox-separator.vue';
import ComboboxTrigger from './combobox-trigger.vue';
import ComboboxValue from './combobox-value.vue';
import ComboboxViewport from './combobox-viewport.vue';
import type { ComboboxCompactProps, ComboboxCompactEmits, ComboboxCompactSlots, ComboboxOptionData } from './types';

defineOptions({
  name: 'ComboboxCompact'
});

const props = withDefaults(defineProps<ComboboxCompactProps<M>>(), {
  open: undefined,
  clearable: true
});

const emit = defineEmits<ComboboxCompactEmits<M>>();

defineSlots<ComboboxCompactSlots<M>>();

const forwardedProps = useOmitProps(props, [
  'items',
  'placeholder',
  'searchPlaceholder',
  'clearLabel',
  'emptyLabel',
  'anchorProps',
  'triggerProps',
  'cancelProps',
  'valueProps',
  'portalProps',
  'contentProps',
  'viewportProps',
  'inputProps',
  'emptyProps',
  'groupProps',
  'groupLabelProps',
  'itemProps',
  'itemIndicatorProps',
  'separatorProps'
]);

const getInputDisplayValue = (modelValue: MaybeArray<string> | undefined) => {
  return !props.multiple ? getDisplayValue(modelValue, props.items) : '';
};

const messages = useLocaleMessages();

const ariaLabel = computed(
  () =>
    props.inputProps?.controlProps?.['aria-label'] ??
    props.searchPlaceholder ??
    props.placeholder ??
    messages.value.combobox.search
);

const inputProps = computed(() => ({
  ...props.inputProps,
  displayValue: props.inputProps?.displayValue ?? getInputDisplayValue,
  controlProps: {
    ...props.inputProps?.controlProps,
    'aria-label': ariaLabel.value
  },
  placeholder: props.searchPlaceholder ?? props.inputProps?.placeholder,
  autofocus: props.inputProps?.autofocus ?? true
}));

const viewportProps = computed(() => ({
  ...props.viewportProps,
  'aria-label': props.viewportProps?.['aria-label'] ?? props.placeholder ?? messages.value.combobox.options
}));

const anchorProps = computed(() => ({
  ...props.anchorProps,
  asChild: props.anchorProps?.asChild ?? true
}));

const getItemKey = (item: ComboboxOptionData, index: number) => {
  if (isGroupOption(item)) {
    return `group-${item.label}-${index}`;
  }

  return item.value;
};

const getSelectedItemLabels = (modelValue: MaybeArray<string> | undefined) => {
  return getSelectedLabels(modelValue, props.items);
};

const getTriggerText = (modelValue: MaybeArray<string> | undefined) => {
  const labels = getSelectedItemLabels(modelValue);

  if (!labels.length) {
    return props.placeholder;
  }

  return labels.join(', ');
};

const getTriggerProps = (modelValue: MaybeArray<string> | undefined) => ({
  ...props.triggerProps,
  'aria-label': props.triggerProps?.['aria-label'] ?? getTriggerText(modelValue),
  'data-placeholder': !getSelectedItemLabels(modelValue).length ? '' : undefined
});

const getValueProps = () => ({
  ...props.valueProps,
  items: props.items,
  placeholder: props.placeholder ?? ''
});
</script>

<template>
  <ComboboxRoot
    v-slot="{ modelValue }"
    v-bind="forwardedProps"
    @highlight="emit('highlight', $event)"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
  >
    <ComboboxAnchor v-bind="anchorProps">
      <ComboboxTrigger v-slot="{ triggerIconClass }" v-bind="getTriggerProps(modelValue)">
        <slot name="trigger-leading" />
        <slot
          name="trigger-value"
          :model-value="modelValue"
          :selected-labels="getSelectedItemLabels(modelValue)"
          :slot-text="getTriggerText(modelValue)"
        >
          <ComboboxValue v-bind="getValueProps()" />
        </slot>
        <slot name="trigger-trailing" />
        <ComboboxClear v-if="clearable" :aria-label="props.clearLabel ?? messages.combobox.clear" />
        <slot name="trigger-icon">
          <Icon icon="lucide:chevrons-up-down" :class="triggerIconClass" />
        </slot>
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal v-bind="portalProps">
      <ComboboxContent
        v-bind="contentProps"
        @close-auto-focus="emit('closeAutoFocus', $event)"
        @escape-key-down="emit('escapeKeyDown', $event)"
        @pointer-down-outside="emit('pointerDownOutside', $event)"
        @focus-outside="emit('focusOutside', $event)"
        @interact-outside="emit('interactOutside', $event)"
      >
        <ComboboxInput v-bind="inputProps">
          <template #leading="slotProps">
            <slot name="input-leading" v-bind="slotProps">
              <Icon icon="lucide:search" />
            </slot>
          </template>
          <template #trailing="slotProps">
            <ComboboxCancel
              v-if="clearable"
              v-bind="cancelProps"
              :aria-label="props.clearLabel ?? messages.combobox.clearInput"
            >
              <Icon icon="lucide:x" />
            </ComboboxCancel>
            <slot name="input-trailing" v-bind="slotProps" />
          </template>
        </ComboboxInput>
        <ComboboxEmpty v-bind="emptyProps">
          <slot name="empty">{{ props.emptyLabel ?? messages.combobox.noResults }}</slot>
        </ComboboxEmpty>
        <ComboboxViewport v-bind="viewportProps">
          <template v-for="(item, index) in items" :key="getItemKey(item, index)">
            <template v-if="isGroupOption(item)">
              <ComboboxSeparator v-if="item.separator" v-bind="separatorProps" />
              <ComboboxGroup v-bind="groupProps">
                <ComboboxGroupLabel v-bind="groupLabelProps">
                  <slot name="group-label" :item="item">{{ item.label }}</slot>
                </ComboboxGroupLabel>
                <template v-for="child in item.items" :key="child.value">
                  <ComboboxSeparator v-if="child.separator" v-bind="separatorProps" />
                  <ComboboxItem
                    v-bind="itemProps"
                    :value="child.value"
                    :text-value="child.textValue ?? child.label"
                    :disabled="child.disabled"
                    @select="emit('select', $event)"
                  >
                    <slot name="item-leading" :item="child">
                      <Icon v-if="child.icon" :icon="child.icon" />
                    </slot>
                    <slot name="item-text" :item="child">{{ child.label }}</slot>
                    <slot name="item-trailing" :item="child" />
                    <ComboboxItemIndicator v-bind="itemIndicatorProps">
                      <slot name="item-indicator" :item="child">
                        <Icon icon="lucide:check" />
                      </slot>
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </template>
              </ComboboxGroup>
            </template>
            <template v-else>
              <ComboboxSeparator v-if="item.separator" v-bind="separatorProps" />
              <ComboboxItem
                v-bind="itemProps"
                :value="item.value"
                :text-value="item.textValue ?? item.label"
                :disabled="item.disabled"
                @select="emit('select', $event)"
              >
                <slot name="item-leading" :item="item">
                  <Icon v-if="item.icon" :icon="item.icon" />
                </slot>
                <slot name="item-text" :item="item">{{ item.label }}</slot>
                <slot name="item-trailing" :item="item" />
                <ComboboxItemIndicator v-bind="itemIndicatorProps">
                  <slot name="item-indicator" :item="item">
                    <Icon icon="lucide:check" />
                  </slot>
                </ComboboxItemIndicator>
              </ComboboxItem>
            </template>
          </template>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
