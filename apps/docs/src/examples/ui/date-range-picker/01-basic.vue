<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { createDate } from '@vean/aria/date';
import type { DateRange } from '@vean/aria/date';
import type { Placement } from '@vean/aria/types';
import { SButtonIcon, SDateRangePicker, SInputNumber, SSelect, SSwitch } from '@vean/ui';
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
  placement: Placement;
  showArrow: boolean;
  disabled: boolean;
  readonly: boolean;
  pagedNavigation: boolean;
  numberOfMonths: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  placement: 'bottom',
  showArrow: false,
  disabled: false,
  readonly: false,
  pagedNavigation: false,
  numberOfMonths: 1
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const PLACEMENT_KEYS: readonly Placement[] = [
  'top',
  'right',
  'bottom',
  'left',
  'top-start',
  'top-end',
  'right-start',
  'right-end',
  'bottom-start',
  'bottom-end',
  'left-start',
  'left-end'
];

const placementItems: SelectOptionData<Placement>[] = toOptions(PLACEMENT_KEYS);

const range = shallowRef<DateRange>({
  start: createDate(2026, 4, 19),
  end: createDate(2026, 4, 26)
});

const size = shallowRef(DEFAULTS.size);
const placement = shallowRef(DEFAULTS.placement);
const showArrow = shallowRef(DEFAULTS.showArrow);
const disabled = shallowRef(DEFAULTS.disabled);
const readonly = shallowRef(DEFAULTS.readonly);
const pagedNavigation = shallowRef(DEFAULTS.pagedNavigation);
const numberOfMonths = shallowRef(DEFAULTS.numberOfMonths);

/** 空输入回落到组件默认值 1。 */
const numberOfMonthsValue = computed(() => numberOfMonths.value ?? 1);

const formatDate = (date: DateRange['start']): string => date?.toString() ?? '-';

const reset = (): void => {
  size.value = DEFAULTS.size;
  placement.value = DEFAULTS.placement;
  showArrow.value = DEFAULTS.showArrow;
  disabled.value = DEFAULTS.disabled;
  readonly.value = DEFAULTS.readonly;
  pagedNavigation.value = DEFAULTS.pagedNavigation;
  numberOfMonths.value = DEFAULTS.numberOfMonths;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="placement">
        <SSelect
          v-model="placement"
          :items="placementItems"
          :trigger-props="{ 'aria-label': 'Placement' }"
          class="w-35"
        />
      </FieldItem>
      <FieldItem label="numberOfMonths">
        <SInputNumber
          v-model="numberOfMonths"
          :min="1"
          :max="3"
          :control-props="{ 'aria-label': 'Number of months' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem label="showArrow">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showArrow" :control-props="{ 'aria-label': 'Show arrow' }" />
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
      <FieldItem label="pagedNavigation">
        <div class="h-8 flex items-center">
          <SSwitch v-model="pagedNavigation" :control-props="{ 'aria-label': 'Paged navigation' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex flex-col items-center justify-center w-full gap-3">
    <SDateRangePicker
      v-model="range"
      class="max-w-2xl"
      :size="size"
      :placement="placement"
      :show-arrow="showArrow"
      :disabled="disabled"
      :readonly="readonly"
      :paged-navigation="pagedNavigation"
      :number-of-months="numberOfMonthsValue"
      aria-label="Stay date range picker"
    />
    <p class="text-sm text-muted-foreground">Selected: {{ formatDate(range.start) }} to {{ formatDate(range.end) }}</p>
  </div>
</template>
