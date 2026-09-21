<script setup lang="ts" generic="T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData">
import { computed } from 'vue';
import { defu } from '../../shared';
import { useFuse, useControllableState, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import { ComboboxCancel as AutocompleteCancel, ComboboxEmpty as AutocompleteEmpty } from '../combobox';
import { Portal } from '../portal';
import { getAutocompleteItemOptions, getAutocompleteSearchOptions, isGroupOption } from './shared';
import AutocompleteAnchor from './autocomplete-anchor.vue';
import AutocompleteContent from './autocomplete-content.vue';
import AutocompleteGroupLabel from './autocomplete-group-label.vue';
import AutocompleteGroup from './autocomplete-group.vue';
import AutocompleteInput from './autocomplete-input.vue';
import AutocompleteItemIndicator from './autocomplete-item-indicator.vue';
import AutocompleteItem from './autocomplete-item.vue';
import AutocompleteRoot from './autocomplete-root.vue';
import AutocompleteSeparator from './autocomplete-separator.vue';
import AutocompleteTrigger from './autocomplete-trigger.vue';
import AutocompleteViewport from './autocomplete-viewport.vue';
import type {
  AutocompleteCompactProps,
  AutocompleteCompactEmits,
  AutocompleteCompactSlots,
  AutocompleteSearchOptionData,
  AutocompleteSingleOptionData
} from './types';

defineOptions({
  name: 'AutocompleteCompact'
});

const props = withDefaults(defineProps<AutocompleteCompactProps<T>>(), {
  modelValue: undefined,
  open: undefined,
  clearable: false
});

const emit = defineEmits<AutocompleteCompactEmits<T>>();

defineSlots<AutocompleteCompactSlots<T>>();

const messages = useLocaleMessages();

const forwardedProps = useOmitProps(props, [
  'items',
  'modelValue',
  'defaultValue',
  'placeholder',
  'clearable',
  'clearLabel',
  'emptyLabel',
  'fuseOptions',
  'anchorProps',
  'inputProps',
  'triggerProps',
  'portalProps',
  'contentProps',
  'viewportProps',
  'groupProps',
  'groupLabelProps',
  'itemProps',
  'itemIndicatorProps',
  'separatorProps'
]);

const modelValue = useControllableState(
  () => props.modelValue,
  value => {
    emit('update:modelValue', value);
  },
  props.defaultValue ?? ''
);

const fuseOptions = computed(() =>
  defu(props.fuseOptions, {
    fuseOptions: {
      keys: ['label', 'value', 'keywords', 'groupLabel']
    },
    matchAllWhenSearchEmpty: true
  })
);

const searchItems = computed(() => getAutocompleteSearchOptions(props.items));

const { results } = useFuse(
  computed(() => modelValue.value),
  searchItems,
  fuseOptions
);

const filteredItems = computed(() =>
  getAutocompleteItemOptions<T>(results.value.map(result => result.item as AutocompleteSearchOptionData))
);

const inputProps = computed(() => ({
  ...props.inputProps,
  id: props.inputProps?.id ?? props.id,
  placeholder: props.placeholder ?? props.inputProps?.placeholder
}));

const viewportProps = computed(() => ({
  ...props.viewportProps,
  'aria-label': props.viewportProps?.['aria-label'] ?? messages.value.autocomplete.options
}));

const getItemKey = (item: (typeof filteredItems.value)[number]) => {
  if (isGroupOption(item)) {
    return `group-${item.label}`;
  }

  return `item-${item.value}`;
};

const handleSelect = (item: T) => {
  emit('select', item);
};
</script>

<template>
  <AutocompleteRoot
    v-bind="forwardedProps"
    :model-value="modelValue"
    @highlight="emit('highlight', $event)"
    @update:model-value="modelValue = $event"
    @update:open="emit('update:open', $event)"
  >
    <AutocompleteAnchor v-bind="anchorProps">
      <AutocompleteInput v-bind="inputProps">
        <template #leading>
          <slot name="input-leading">
            <Icon icon="lucide:search" />
          </slot>
        </template>
        <template #trailing="{ clear }">
          <AutocompleteCancel
            v-if="clearable && modelValue"
            :aria-label="props.clearLabel ?? messages.autocomplete.clearInput"
            data-vean-autocomplete-cancel
            @click="clear"
          >
            <Icon icon="lucide:x" />
          </AutocompleteCancel>
          <slot name="input-trailing" />
        </template>
      </AutocompleteInput>
      <AutocompleteTrigger
        v-slot="{ triggerIconClass }"
        v-bind="triggerProps"
        :aria-label="messages.autocomplete.toggleSuggestions"
      >
        <slot name="trigger-icon">
          <Icon icon="lucide:chevrons-up-down" :class="triggerIconClass" />
        </slot>
      </AutocompleteTrigger>
    </AutocompleteAnchor>
    <Portal v-bind="portalProps">
      <AutocompleteContent v-bind="contentProps">
        <AutocompleteViewport v-bind="viewportProps">
          <AutocompleteEmpty v-if="!filteredItems.length">
            <slot name="empty">{{ props.emptyLabel ?? messages.autocomplete.noResults }}</slot>
          </AutocompleteEmpty>
          <template v-for="item in filteredItems" :key="getItemKey(item)">
            <template v-if="isGroupOption(item)">
              <AutocompleteGroup v-bind="groupProps">
                <AutocompleteGroupLabel v-bind="groupLabelProps">
                  <slot name="group-label" :item="item">{{ item.label }}</slot>
                </AutocompleteGroupLabel>
                <template v-for="child in item.items" :key="child.value">
                  <AutocompleteItem
                    v-bind="itemProps"
                    :value="child.value"
                    :disabled="child.disabled"
                    @select="handleSelect(child)"
                  >
                    <slot name="item-leading" :item="child">
                      <Icon v-if="child.icon" :icon="child.icon" />
                    </slot>
                    <slot name="item-text" :item="child">{{ child.label ?? child.value }}</slot>
                    <slot name="item-trailing" :item="child" />
                    <AutocompleteItemIndicator v-bind="itemIndicatorProps">
                      <slot name="item-indicator" :item="child">
                        <Icon icon="lucide:check" />
                      </slot>
                    </AutocompleteItemIndicator>
                  </AutocompleteItem>
                  <AutocompleteSeparator v-if="child.separator" v-bind="separatorProps" />
                </template>
              </AutocompleteGroup>
              <AutocompleteSeparator v-if="item.separator" v-bind="separatorProps" />
            </template>
            <template v-else>
              <AutocompleteItem
                v-bind="itemProps"
                :value="item.value"
                :disabled="item.disabled"
                @select="handleSelect(item)"
              >
                <slot name="item-leading" :item="item">
                  <Icon v-if="item.icon" :icon="item.icon" />
                </slot>
                <slot name="item-text" :item="item">{{ item.label ?? item.value }}</slot>
                <slot name="item-trailing" :item="item" />
                <AutocompleteItemIndicator v-bind="itemIndicatorProps">
                  <slot name="item-indicator" :item="item">
                    <Icon icon="lucide:check" />
                  </slot>
                </AutocompleteItemIndicator>
              </AutocompleteItem>
              <AutocompleteSeparator v-if="item.separator" v-bind="separatorProps" />
            </template>
          </template>
        </AutocompleteViewport>
      </AutocompleteContent>
    </Portal>
  </AutocompleteRoot>
</template>
