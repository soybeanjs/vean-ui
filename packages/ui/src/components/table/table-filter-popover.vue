<script setup lang="ts" generic="T extends TableBaseData = TableBaseData">
import { computed } from 'vue';
import { useLocaleMessages } from '@vean/aria';
import { interpolate } from '@vean/aria/shared';
import { getTableColumnLabel } from '@vean/aria/table';
import { miniSizeMap } from '@/theme';
import SButtonIcon from '../button/button-icon.vue';
import SButton from '../button/button.vue';
import SCheckbox from '../checkbox/checkbox.vue';
import SInput from '../input/input.vue';
import SPopover from '../popover/popover.vue';
import type { TableBaseData, TableFilterPopoverProps } from './types';

defineOptions({
  name: 'STableFilterPopover'
});

const props = defineProps<TableFilterPopoverProps<T>>();

const messages = useLocaleMessages();

const columnLabel = computed(() => getTableColumnLabel(props.column));

const filteredOptions = computed(() => {
  const keyword = props.filterValue.trim().toLowerCase();

  if (!keyword) {
    return props.filterOptions;
  }

  return props.filterOptions.filter(option => {
    return option.label.toLowerCase().includes(keyword) || option.value.toLowerCase().includes(keyword);
  });
});

const hasVisibleOptions = computed(() => filteredOptions.value.length > 0);

const filterSummary = computed(() => {
  if (props.filterValues.length > 0) {
    return interpolate(messages.value.table.filterSelected, {
      count: String(props.filterValues.length)
    });
  }

  if (props.filterValue.trim().length > 0) {
    return messages.value.table.filterKeywordActive;
  }

  return props.filterOptions.length > 0
    ? interpolate(messages.value.table.filterOptionsCount, {
        count: String(props.filterOptions.length)
      })
    : messages.value.table.filterNoOptions;
});

const triggerLabel = computed(() => {
  const template = props.filtered ? messages.value.table.filterEdit : messages.value.table.filter;

  return interpolate(template, { column: columnLabel.value });
});

const searchAriaLabel = computed(() => interpolate(messages.value.table.filterSearch, { column: columnLabel.value }));

const searchPlaceholder = computed(() =>
  interpolate(messages.value.table.filterSearchPlaceholder, { column: columnLabel.value })
);

const miniSize = computed(() => miniSizeMap[props.size ?? 'md']);

function updateKeyword(value: string | number | undefined) {
  props.setFilterValue(String(value ?? ''));
}
</script>

<template>
  <SPopover :class="ui.filterPopup" :size="size" placement="bottom-end" :show-arrow="false">
    <template #trigger>
      <SButtonIcon
        icon="lucide:funnel"
        :data-filtered="props.filtered ? '' : undefined"
        :class="ui.filterTrigger"
        :size="miniSize"
        :aria-label="triggerLabel"
        :aria-pressed="filtered || undefined"
      />
    </template>

    <SInput
      :class="ui.filterSearch"
      :size="miniSize"
      :model-value="filterValue"
      :control-props="{ 'aria-label': searchAriaLabel, placeholder: searchPlaceholder }"
      @update:model-value="updateKeyword"
    />

    <div v-if="filterOptions.length > 0" :class="ui.filterOptions">
      <SCheckbox
        v-for="option in filteredOptions"
        :key="option.value"
        :class="ui.filterOption"
        :size="miniSize"
        :disabled="option.disabled"
        :model-value="isFilterOptionSelected(option.value)"
        :label="option.label"
        :ui="{ label: ui.filterOptionLabel }"
        :control-props="{
          'aria-label': interpolate(messages.table.filterSelect, { label: option.label })
        }"
        @update:model-value="toggleFilterOption(option.value)"
      />

      <div v-if="!hasVisibleOptions" :class="ui.filterEmpty">
        {{ messages.table.filterNoMatching }}
      </div>
    </div>

    <div :class="ui.filterFooter">
      <span :class="ui.filterCount">{{ filterSummary }}</span>
      <SButton
        v-if="filtered"
        variant="ghost"
        color="accent"
        fit-content
        :size="miniSize"
        :class="ui.filterAction"
        @click="clearFilter"
      >
        {{ messages.table.filterClear }}
      </SButton>
    </div>
  </SPopover>
</template>
