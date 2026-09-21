<script setup lang="ts">
import { shallowRef } from 'vue';
import { createDate } from '@vean/aria/date';
import type { DateValue, WeekDayFormat, WeekStartsOn } from '@vean/aria/date';
import { SCalendar, SButtonIcon, SInputNumber, SSelect, SSwitch } from '@vean/ui';
import type { SelectOptionData, ThemeSize } from '@vean/ui';
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
  numberOfMonths: number;
  weekStartsOn: WeekStartsOn;
  weekdayFormat: WeekDayFormat;
  pagedNavigation: boolean;
  fixedWeeks: boolean;
  disabled: boolean;
  readonly: boolean;
}

/**
 * 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。
 * `weekStartsOn` 未配置时组件跟随 locale，这里取 en locale 的 0（周日）作为快照值。
 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  multiple: false,
  numberOfMonths: 1,
  weekStartsOn: 0,
  weekdayFormat: 'narrow',
  pagedNavigation: false,
  fixedWeeks: false,
  disabled: false,
  readonly: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴；label 必须是 string，数字值转成文案。 */
const toOptions = <T extends string | number>(values: readonly T[]): { value: T; label: string }[] =>
  values.map(value => ({ value, label: String(value) }));

const WEEK_STARTS_ON_KEYS: readonly WeekStartsOn[] = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAY_FORMAT_KEYS: readonly WeekDayFormat[] = ['narrow', 'short', 'long'];

const weekStartsOnItems: SelectOptionData<WeekStartsOn>[] = toOptions(WEEK_STARTS_ON_KEYS);
const weekdayFormatItems: SelectOptionData<WeekDayFormat>[] = toOptions(WEEKDAY_FORMAT_KEYS);

const size = shallowRef(DEFAULTS.size);
const multiple = shallowRef(DEFAULTS.multiple);
const numberOfMonths = shallowRef(DEFAULTS.numberOfMonths);
const weekStartsOn = shallowRef(DEFAULTS.weekStartsOn);
const weekdayFormat = shallowRef(DEFAULTS.weekdayFormat);
const pagedNavigation = shallowRef(DEFAULTS.pagedNavigation);
const fixedWeeks = shallowRef(DEFAULTS.fixedWeeks);
const disabled = shallowRef(DEFAULTS.disabled);
const readonly = shallowRef(DEFAULTS.readonly);

const value = shallowRef<DateValue | DateValue[] | undefined>(createDate(2026, 4, 18));

const reset = (): void => {
  size.value = DEFAULTS.size;
  multiple.value = DEFAULTS.multiple;
  numberOfMonths.value = DEFAULTS.numberOfMonths;
  weekStartsOn.value = DEFAULTS.weekStartsOn;
  weekdayFormat.value = DEFAULTS.weekdayFormat;
  pagedNavigation.value = DEFAULTS.pagedNavigation;
  fixedWeeks.value = DEFAULTS.fixedWeeks;
  disabled.value = DEFAULTS.disabled;
  readonly.value = DEFAULTS.readonly;
  value.value = createDate(2026, 4, 18);
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="numberOfMonths">
        <SInputNumber
          v-model="numberOfMonths"
          :min="1"
          :max="4"
          :control-props="{ 'aria-label': 'Number of months' }"
          class="w-27.5"
        />
      </FieldItem>
      <FieldItem label="weekStartsOn">
        <SSelect
          v-model="weekStartsOn"
          :items="weekStartsOnItems"
          :trigger-props="{ 'aria-label': 'Week starts on' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem label="weekdayFormat">
        <SSelect
          v-model="weekdayFormat"
          :items="weekdayFormatItems"
          :trigger-props="{ 'aria-label': 'Weekday format' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="multiple">
        <div class="h-8 flex items-center">
          <SSwitch v-model="multiple" :control-props="{ 'aria-label': 'Multiple' }" />
        </div>
      </FieldItem>
      <FieldItem label="pagedNavigation">
        <div class="h-8 flex items-center">
          <SSwitch v-model="pagedNavigation" :control-props="{ 'aria-label': 'Paged navigation' }" />
        </div>
      </FieldItem>
      <FieldItem label="fixedWeeks">
        <div class="h-8 flex items-center">
          <SSwitch v-model="fixedWeeks" :control-props="{ 'aria-label': 'Fixed weeks' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem label="readonly">
        <div class="h-8 flex items-center">
          <SSwitch v-model="readonly" :control-props="{ 'aria-label': 'Readonly' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SCalendar
      v-model="value"
      class="max-w-2xl"
      :size="size"
      :multiple="multiple"
      :number-of-months="numberOfMonths"
      :week-starts-on="weekStartsOn"
      :weekday-format="weekdayFormat"
      :paged-navigation="pagedNavigation"
      :fixed-weeks="fixedWeeks"
      :disabled="disabled"
      :readonly="readonly"
    />
  </div>
</template>
