<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SInputNumber, SSelect, SSwitch, STextarea } from '@vean/ui';
import type { SelectOptionData, TextareaResize, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  resize: ResizeOption;
  autosize: boolean;
  minRows: number | null;
  maxRows: number | null;
  clearable: boolean;
  showCounter: boolean;
  maxlength: number | null;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  resize: 'vertical',
  autosize: false,
  minRows: null,
  maxRows: null,
  clearable: false,
  showCounter: false,
  maxlength: null,
  disabled: false
};

/**
 * 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。
 * `resize` 的布尔字面量在选项表里不直观，用 `both` / `none` 表意，预览时再映射回去。
 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const RESIZE_KEYS = ['vertical', 'horizontal', 'both', 'none'] as const;

type ResizeOption = (typeof RESIZE_KEYS)[number];

const resizeItems: SelectOptionData<ResizeOption>[] = toOptions(RESIZE_KEYS);

const value = shallowRef('The SoybeanUI textarea keeps every keystroke.');
const size = shallowRef(DEFAULTS.size);
const resize = shallowRef<ResizeOption>(DEFAULTS.resize);
const autosize = shallowRef(DEFAULTS.autosize);
const minRows = shallowRef<number | null>(DEFAULTS.minRows);
const maxRows = shallowRef<number | null>(DEFAULTS.maxRows);
const clearable = shallowRef(DEFAULTS.clearable);
const showCounter = shallowRef(DEFAULTS.showCounter);
const maxlength = shallowRef<number | null>(DEFAULTS.maxlength);
const disabled = shallowRef(DEFAULTS.disabled);

/** 把选项表的字面量映射回组件的 `TextareaResize` 联合类型。 */
const resolvedResize = computed<TextareaResize | undefined>(() => {
  if (resize.value === 'both') return true;
  if (resize.value === 'none') return false;
  return resize.value;
});

/** autosize 开启且填了行数时才下发 options，未填行数则退化为纯 `true`。 */
const resolvedAutosize = computed(() => {
  if (!autosize.value) return false;
  if (minRows.value === null && maxRows.value === null) return true;
  return {
    ...(minRows.value === null ? {} : { minRows: minRows.value }),
    ...(maxRows.value === null ? {} : { maxRows: maxRows.value })
  };
});

const reset = (): void => {
  value.value = 'The SoybeanUI textarea keeps every keystroke.';
  size.value = DEFAULTS.size;
  resize.value = DEFAULTS.resize;
  autosize.value = DEFAULTS.autosize;
  minRows.value = DEFAULTS.minRows;
  maxRows.value = DEFAULTS.maxRows;
  clearable.value = DEFAULTS.clearable;
  showCounter.value = DEFAULTS.showCounter;
  maxlength.value = DEFAULTS.maxlength;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="resize">
        <SSelect v-model="resize" :items="resizeItems" :trigger-props="{ 'aria-label': 'Resize' }" class="w-35" />
      </FieldItem>
      <FieldItem label="maxlength">
        <SInputNumber
          v-model="maxlength"
          :min="1"
          :step="20"
          :control-props="{ 'aria-label': 'Max length' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="autosize">
        <div class="h-8 flex items-center">
          <SSwitch v-model="autosize" :control-props="{ 'aria-label': 'Autosize' }" />
        </div>
      </FieldItem>
      <FieldItem label="minRows">
        <SInputNumber v-model="minRows" :min="1" :control-props="{ 'aria-label': 'Min rows' }" class="w-25" />
      </FieldItem>
      <FieldItem label="maxRows">
        <SInputNumber v-model="maxRows" :min="1" :control-props="{ 'aria-label': 'Max rows' }" class="w-25" />
      </FieldItem>
      <FieldItem label="clearable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="clearable" :control-props="{ 'aria-label': 'Clearable' }" />
        </div>
      </FieldItem>
      <FieldItem label="showCounter">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showCounter" :control-props="{ 'aria-label': 'Show counter' }" />
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
    <STextarea
      v-model="value"
      :size="size"
      :resize="resolvedResize"
      :autosize="resolvedAutosize"
      :clearable="clearable"
      :show-counter="showCounter"
      :maxlength="maxlength ?? undefined"
      :disabled="disabled"
      placeholder="Please input"
      class="w-80 lt-md:w-auto"
    />
  </div>
</template>
