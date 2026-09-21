<script setup lang="ts">
import { shallowRef } from 'vue';
import { createDate } from '@vean/aria/date';
import type { DateRange, WeekDayFormat, WeekStartsOn } from '@vean/aria/date';
import { SCalendarRange, SButtonIcon, SInputNumber, SSelect, SSwitch } from '@vean/ui';
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
  numberOfMonths: number;
  weekStartsOn: WeekStartsOn;
  weekdayFormat: WeekDayFormat;
  pagedNavigation: boolean;
  fixedWeeks: boolean;
  allowNonContiguousRanges: boolean;
  disabled: boolean;
  readonly: boolean;
}

/**
 * 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。
 * `weekStartsOn` 未配置时组件跟随 locale，这里取 en locale 的 0（周日）作为快照值。
 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  numberOfMonths: 2,
  weekStartsOn: 0,
  weekdayFormat: 'narrow',
  pagedNavigation: false,
  fixedWeeks: false,
  allowNonContiguousRanges: false,
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
const numberOfMonths = shallowRef(DEFAULTS.numberOfMonths);
const weekStartsOn = shallowRef(DEFAULTS.weekStartsOn);
const weekdayFormat = shallowRef(DEFAULTS.weekdayFormat);
const pagedNavigation = shallowRef(DEFAULTS.pagedNavigation);
const fixedWeeks = shallowRef(DEFAULTS.fixedWeeks);
const allowNonContiguousRanges = shallowRef(DEFAULTS.allowNonContiguousRanges);
const disabled = shallowRef(DEFAULTS.disabled);
const readonly = shallowRef(DEFAULTS.readonly);

const value = shallowRef<DateRange>({
  start: createDate(2026, 4, 18),
  end: createDate(2026, 4, 22)
});

const reset = (): void => {
  size.value = DEFAULTS.size;
  numberOfMonths.value = DEFAULTS.numberOfMonths;
  weekStartsOn.value = DEFAULTS.weekStartsOn;
  weekdayFormat.value = DEFAULTS.weekdayFormat;
  pagedNavigation.value = DEFAULTS.pagedNavigation;
  fixedWeeks.value = DEFAULTS.fixedWeeks;
  allowNonContiguousRanges.value = DEFAULTS.allowNonContiguousRanges;
  disabled.value = DEFAULTS.disabled;
  readonly.value = DEFAULTS.readonly;
  value.value = {
    start: createDate(2026, 4, 18),
    end: createDate(2026, 4, 22)
  };
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
      <FieldItem label="allowNonContiguousRanges">
        <div class="h-8 flex items-center">
          <SSwitch
            v-model="allowNonContiguousRanges"
            :control-props="{ 'aria-label': 'Allow non contiguous ranges' }"
          />
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

  <div class="flex flex-col items-center justify-center w-full gap-3">
    <SCalendarRange
      v-model="value"
      class="max-w-2xl"
      :size="size"
      :number-of-months="numberOfMonths"
      :week-starts-on="weekStartsOn"
      :weekday-format="weekdayFormat"
      :paged-navigation="pagedNavigation"
      :fixed-weeks="fixedWeeks"
      :allow-non-contiguous-ranges="allowNonContiguousRanges"
      :disabled="disabled"
      :readonly="readonly"
    />
    <p class="text-sm text-muted-foreground">
      Range: {{ value.start?.toString() ?? '-' }} ~ {{ value.end?.toString() ?? '-' }}
    </p>
  </div>
</template>
