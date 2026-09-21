<script setup lang="ts">
import { shallowRef } from 'vue';
import { SAutocomplete, SButtonIcon, SInput, SSelect, SSwitch } from '@vean/ui';
import type { AutocompleteOptionData, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  placeholder: string;
  clearable: boolean;
  openOnFocus: boolean;
  openOnClick: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  placeholder: 'Search a fruit',
  clearable: false,
  openOnFocus: false,
  openOnClick: false,
  disabled: false
};

const items: AutocompleteOptionData[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'grape', label: 'Grape' },
  { value: 'pineapple', label: 'Pineapple' }
];

const sizeItems: SelectOptionData<ThemeSize>[] = themeSizeOptions;

const size = shallowRef(DEFAULTS.size);
const placeholder = shallowRef(DEFAULTS.placeholder);
const clearable = shallowRef(DEFAULTS.clearable);
const openOnFocus = shallowRef(DEFAULTS.openOnFocus);
const openOnClick = shallowRef(DEFAULTS.openOnClick);
const disabled = shallowRef(DEFAULTS.disabled);
const value = shallowRef('');

const reset = (): void => {
  size.value = DEFAULTS.size;
  placeholder.value = DEFAULTS.placeholder;
  clearable.value = DEFAULTS.clearable;
  openOnFocus.value = DEFAULTS.openOnFocus;
  openOnClick.value = DEFAULTS.openOnClick;
  disabled.value = DEFAULTS.disabled;
  value.value = '';
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="sizeItems" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="placeholder">
        <SInput v-model="placeholder" aria-label="Placeholder" />
      </FieldItem>
      <FieldItem label="clearable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="clearable" :control-props="{ 'aria-label': 'Clearable' }" />
        </div>
      </FieldItem>
      <FieldItem label="openOnFocus">
        <div class="h-8 flex items-center">
          <SSwitch v-model="openOnFocus" :control-props="{ 'aria-label': 'Open on focus' }" />
        </div>
      </FieldItem>
      <FieldItem label="openOnClick">
        <div class="h-8 flex items-center">
          <SSwitch v-model="openOnClick" :control-props="{ 'aria-label': 'Open on click' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="w-72 space-y-2 lt-md:w-auto">
      <SAutocomplete
        v-model="value"
        :items="items"
        :size="size"
        :placeholder="placeholder"
        :clearable="clearable"
        :open-on-focus="openOnFocus"
        :open-on-click="openOnClick"
        :disabled="disabled"
      />
      <p class="text-sm text-muted">Value: {{ value || '—' }}</p>
    </div>
  </div>
</template>
