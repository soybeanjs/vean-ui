<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { createDate } from '@vean/aria/date';
import type { DateRange, DateValue, Granularity, HourCycle } from '@vean/aria/date';
import { SButtonIcon, SDateRangeField, SInput, SSelect, SSwitch } from '@vean/ui';
import type { SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 小时制选项：`default` 表示不传该 prop，跟随 locale 决定 12/24 小时制。 */
const HOUR_CYCLE_KEYS = ['default', '12', '24'] as const;

type HourCycleOption = (typeof HOUR_CYCLE_KEYS)[number];

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  granularity: Granularity;
  hourCycle: HourCycleOption;
  separator: string;
  disabled: boolean;
  readonly: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  granularity: 'day',
  hourCycle: 'default',
  separator: '–',
  disabled: false,
  readonly: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const GRANULARITY_KEYS: readonly Granularity[] = ['day', 'hour', 'minute', 'second'];

const granularityItems: SelectOptionData<Granularity>[] = toOptions(GRANULARITY_KEYS);
const hourCycleItems: SelectOptionData<HourCycleOption>[] = toOptions(HOUR_CYCLE_KEYS);

const value = shallowRef<DateRange>({
  start: createDate(2026, 4, 19),
  end: createDate(2026, 4, 26)
});

const size = shallowRef(DEFAULTS.size);
const granularity = shallowRef(DEFAULTS.granularity);
const hourCycle = shallowRef(DEFAULTS.hourCycle);
const separator = shallowRef(DEFAULTS.separator);
const disabled = shallowRef(DEFAULTS.disabled);
const readonly = shallowRef(DEFAULTS.readonly);

/** 把 `default` 选项映射回 `undefined`，其余还原成字面量小时制。 */
const resolvedHourCycle = computed<HourCycle>(() => {
  if (hourCycle.value === '12') return 12;
  if (hourCycle.value === '24') return 24;
  return undefined;
});

const formatDate = (date: DateValue | null | undefined): string => date?.toString() ?? '-';

const reset = (): void => {
  size.value = DEFAULTS.size;
  granularity.value = DEFAULTS.granularity;
  hourCycle.value = DEFAULTS.hourCycle;
  separator.value = DEFAULTS.separator;
  disabled.value = DEFAULTS.disabled;
  readonly.value = DEFAULTS.readonly;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="granularity">
        <SSelect
          v-model="granularity"
          :items="granularityItems"
          :trigger-props="{ 'aria-label': 'Granularity' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="hourCycle">
        <SSelect
          v-model="hourCycle"
          :items="hourCycleItems"
          :trigger-props="{ 'aria-label': 'Hour cycle' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="separator">
        <SInput v-model="separator" aria-label="Separator" placeholder="–" class="w-20" />
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
    <SDateRangeField
      v-model="value"
      class="max-w-2xl"
      :size="size"
      :granularity="granularity"
      :hour-cycle="resolvedHourCycle"
      :separator="separator"
      :disabled="disabled"
      :readonly="readonly"
      aria-label="Stay date range"
    />
    <p class="text-sm text-muted-foreground">Selected: {{ formatDate(value.start) }} to {{ formatDate(value.end) }}</p>
  </div>
</template>
