<script setup lang="ts" generic="T extends CommandSingleOptionData = CommandSingleOptionData">
import { computed } from 'vue';
import { defu } from '../../shared';
import { useFuse, useControllableState, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import Button from '../button/button.vue';
import Kbd from '../kbd/kbd.vue';
import { ListboxContent, ListboxFilter, ListboxGroup, ListboxGroupLabel, ListboxItem, ListboxRoot } from '../listbox';
import SeparatorRoot from '../separator/separator-root.vue';
import { getCommandItemOptions, getCommandSearchOptions, isGroupOption } from './shared';
import { useCommandUi } from './context';
import type {
  CommandCompactProps,
  CommandCompactEmits,
  CommandCompactSlots,
  CommandOptionData,
  CommandSingleOptionData
} from './types';

defineOptions({
  name: 'CommandCompact'
});

const props = withDefaults(defineProps<CommandCompactProps<T>>(), {});

const emit = defineEmits<CommandCompactEmits>();

defineSlots<CommandCompactSlots<T>>();

const forwardedProps = useOmitProps(props, [
  'items',
  'placeholder',
  'searchTerm',
  'externalFilter',
  'fuseOptions',
  'emptyLabel',
  'listProps',
  'itemProps',
  'itemLabelProps',
  'itemDescriptionProps',
  'groupProps',
  'groupLabelProps',
  'shortcutProps',
  'separatorProps',
  'inputProps',
  'emptyProps'
]);

const searchTerm = useControllableState(
  () => props.searchTerm,
  value => {
    emit('update:searchTerm', value);
  },
  props.inputProps?.defaultValue ?? ''
);

const fuseOptions = computed(() =>
  defu(props.fuseOptions, {
    fuseOptions: {
      keys: ['label', 'groupLabel', 'description']
    },
    resultLimit: 12,
    matchAllWhenSearchEmpty: true
  })
);

const searchItems = computed(() => getCommandSearchOptions(props.items));

// `externalFilter` mode: items are already filtered/ranked by an external engine
// (e.g. full-text content search), so the built-in fuzzy filter is skipped and
// items render as-is, keeping the caller's ranking. `searchTerm` still syncs via
// `update:searchTerm` for the caller to drive its own search.
const { results } = props.externalFilter
  ? {
      results: computed(() => searchItems.value.map((item, refIndex) => ({ item, refIndex, score: 1 })))
    }
  : useFuse(searchTerm, searchItems, fuseOptions);

const filteredItems = computed<CommandOptionData<T>[]>(() =>
  getCommandItemOptions(results.value.map(result => result.item))
);

const inputProps = computed(() => ({
  ...props.inputProps,
  placeholder: props.placeholder ?? props.inputProps?.placeholder
}));

const listProps = computed(() => ({
  ...props.listProps,
  'aria-label': props.listProps?.['aria-label'] ?? props.placeholder ?? 'Commands'
}));

const ui = useCommandUi();
const messages = useLocaleMessages();

const getItemKey = (item: CommandOptionData<T>) => {
  if (isGroupOption(item)) {
    return `group-${item.value}`;
  }

  return `item-${item.value}`;
};
</script>

<template>
  <ListboxRoot
    v-bind="forwardedProps"
    @update:model-value="emit('update:modelValue', $event)"
    @highlight="emit('highlight', $event)"
    @entry-focus="emit('entryFocus', $event)"
    @leave="emit('leave', $event)"
  >
    <ListboxFilter v-bind="inputProps" v-model="searchTerm" autofocus>
      <template #leading="{ clear }">
        <slot name="input-leading" :clear="clear">
          <Icon icon="lucide:search" :class="ui.inputIcon" />
        </slot>
      </template>
      <template #trailing="{ clear }">
        <Button v-if="clearable" :class="ui.inputClearable" :aria-label="messages.input.clear" @click="clear">
          <Icon icon="lucide:x" :aria-hidden="true" />
        </Button>
        <slot name="input-trailing" :clear="clear" />
      </template>
    </ListboxFilter>
    <ListboxContent v-bind="listProps">
      <div v-if="!filteredItems.length" v-bind="emptyProps" :class="ui.empty">
        <slot name="empty">{{ props.emptyLabel ?? messages.command.noResults }}</slot>
      </div>
      <template v-for="item in filteredItems" :key="getItemKey(item)">
        <template v-if="isGroupOption(item)">
          <ListboxGroup v-bind="groupProps">
            <ListboxGroupLabel v-bind="groupLabelProps">{{ item.label }}</ListboxGroupLabel>
            <ListboxItem
              v-for="child in item.items"
              :key="String(child.value)"
              v-bind="itemProps"
              :value="child.value"
              :disabled="child.disabled"
              @select="emit('select', $event)"
            >
              <slot name="item-leading" :item="child">
                <Icon v-if="child.icon" :icon="child.icon" />
              </slot>
              <span :class="ui.itemContent" v-bind="itemContentProps">
                <span :class="ui.itemLabel" v-bind="itemLabelProps">
                  <slot name="item-label" :item="child">
                    {{ child.label }}
                  </slot>
                </span>
                <span v-if="child.description" :class="ui.itemDescription" v-bind="itemDescriptionProps">
                  <slot name="item-description" :item="child">{{ child.description }}</slot>
                </span>
              </span>
              <slot name="item-trailing" :item="child" />
              <Kbd v-if="child.shortcut" v-bind="shortcutProps" :value="child.shortcut" :class="ui.shortcut" />
            </ListboxItem>
          </ListboxGroup>
          <SeparatorRoot v-if="item.separator" v-bind="separatorProps" decorative :class="ui.separator" />
        </template>
        <template v-else>
          <ListboxItem
            v-bind="itemProps"
            :value="item.value"
            :disabled="item.disabled"
            @select="emit('select', $event)"
          >
            <slot name="item-leading" :item="item">
              <Icon v-if="item.icon" :icon="item.icon" />
            </slot>
            <span :class="ui.itemContent" v-bind="itemContentProps">
              <span :class="ui.itemLabel" v-bind="itemLabelProps">
                <slot name="item-label" :item="item">
                  {{ item.label }}
                </slot>
              </span>
              <span v-if="item.description" :class="ui.itemDescription" v-bind="itemDescriptionProps">
                <slot name="item-description" :item="item">{{ item.description }}</slot>
              </span>
            </span>
            <slot name="item-trailing" :item="item" />
            <Kbd v-if="item.shortcut" v-bind="shortcutProps" :value="item.shortcut" :class="ui.shortcut" />
          </ListboxItem>
          <SeparatorRoot v-if="item.separator" v-bind="separatorProps" decorative :class="ui.separator" />
        </template>
      </template>
    </ListboxContent>
    <slot name="bottom" />
  </ListboxRoot>
</template>
