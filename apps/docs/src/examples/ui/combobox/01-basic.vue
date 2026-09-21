<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SCombobox, SInput, SSelect, SSwitch } from '@vean/ui';
import type { ComboboxOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  multiple: boolean;
  clearable: boolean;
  openOnFocus: boolean;
  openOnClick: boolean;
  disabled: boolean;
  placeholder: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  multiple: false,
  clearable: false,
  openOnFocus: false,
  openOnClick: false,
  disabled: false,
  placeholder: 'Select a fruit'
};

const items: ComboboxOptionData[] = [
  { label: 'Apple', value: 'apple', icon: 'lucide:apple' },
  { label: 'Banana', value: 'banana', icon: 'lucide:banana' },
  { label: 'Orange', value: 'orange', icon: 'lucide:citrus' }
];

const size = shallowRef(DEFAULTS.size);
const multiple = shallowRef(DEFAULTS.multiple);
const clearable = shallowRef(DEFAULTS.clearable);
const openOnFocus = shallowRef(DEFAULTS.openOnFocus);
const openOnClick = shallowRef(DEFAULTS.openOnClick);
const disabled = shallowRef(DEFAULTS.disabled);
const placeholder = shallowRef(DEFAULTS.placeholder);

/** 两种选择模式的值域不同，各自持有一份模型值。 */
const singleValue = shallowRef<string>();
const multipleValue = shallowRef<string[]>([]);

/** 两种选择模式共享同一份非模型属性，避免模板里重复绑定。 */
const comboboxProps = computed(() => ({
  items,
  searchPlaceholder: 'Search fruits',
  size: size.value,
  clearable: clearable.value,
  openOnFocus: openOnFocus.value,
  openOnClick: openOnClick.value,
  disabled: disabled.value,
  placeholder: placeholder.value
}));

const selectedText = computed(() => (multiple.value ? multipleValue.value.join(', ') : singleValue.value || 'None'));

const reset = (): void => {
  size.value = DEFAULTS.size;
  multiple.value = DEFAULTS.multiple;
  clearable.value = DEFAULTS.clearable;
  openOnFocus.value = DEFAULTS.openOnFocus;
  openOnClick.value = DEFAULTS.openOnClick;
  disabled.value = DEFAULTS.disabled;
  placeholder.value = DEFAULTS.placeholder;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="multiple">
        <div class="h-8 flex items-center">
          <SSwitch v-model="multiple" :control-props="{ 'aria-label': 'Multiple' }" />
        </div>
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
      <FieldItem label="placeholder">
        <SInput v-model="placeholder" aria-label="Placeholder" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto flex-c gap-2">
      <SCombobox v-if="multiple" v-model="multipleValue" multiple v-bind="comboboxProps" />
      <SCombobox v-else v-model="singleValue" v-bind="comboboxProps" />
      <p class="text-sm text-muted-foreground">Selected: {{ selectedText }}</p>
    </div>
  </div>
</template>
