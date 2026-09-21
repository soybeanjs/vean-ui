<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { createDate } from '@vean/aria/date';
import type { DateValue } from '@vean/aria/date';
import { SButtonIcon, SDatePicker, SInputNumber, SSelect, SSwitch } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  disabled: boolean;
  readonly: boolean;
  pagedNavigation: boolean;
  preventDeselect: boolean;
  fixedWeeks: boolean;
  numberOfMonths: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  disabled: false,
  readonly: false,
  pagedNavigation: false,
  preventDeselect: false,
  fixedWeeks: false,
  numberOfMonths: 1
};

const selectedDate = shallowRef<DateValue>();

const size = shallowRef(DEFAULTS.size);
const disabled = shallowRef(DEFAULTS.disabled);
const readonly = shallowRef(DEFAULTS.readonly);
const pagedNavigation = shallowRef(DEFAULTS.pagedNavigation);
const preventDeselect = shallowRef(DEFAULTS.preventDeselect);
const fixedWeeks = shallowRef(DEFAULTS.fixedWeeks);
const numberOfMonths = shallowRef(DEFAULTS.numberOfMonths);

/** 空输入回落到组件默认值 1。 */
const numberOfMonthsValue = computed(() => numberOfMonths.value ?? 1);

const reset = (): void => {
  size.value = DEFAULTS.size;
  disabled.value = DEFAULTS.disabled;
  readonly.value = DEFAULTS.readonly;
  pagedNavigation.value = DEFAULTS.pagedNavigation;
  preventDeselect.value = DEFAULTS.preventDeselect;
  fixedWeeks.value = DEFAULTS.fixedWeeks;
  numberOfMonths.value = DEFAULTS.numberOfMonths;
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
          :max="3"
          :control-props="{ 'aria-label': 'Number of months' }"
          class="w-25"
        />
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
      <FieldItem label="preventDeselect">
        <div class="h-8 flex items-center">
          <SSwitch v-model="preventDeselect" :control-props="{ 'aria-label': 'Prevent deselect' }" />
        </div>
      </FieldItem>
      <FieldItem label="fixedWeeks">
        <div class="h-8 flex items-center">
          <SSwitch v-model="fixedWeeks" :control-props="{ 'aria-label': 'Fixed weeks' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex flex-col items-center justify-center w-full gap-3">
    <SDatePicker
      v-model="selectedDate"
      class="max-w-2xl"
      :default-placeholder="createDate(2024, 1, 1)"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :paged-navigation="pagedNavigation"
      :prevent-deselect="preventDeselect"
      :fixed-weeks="fixedWeeks"
      :number-of-months="numberOfMonthsValue"
    />
    <p v-if="selectedDate" class="text-sm text-muted-foreground">Selected: {{ selectedDate.toString() }}</p>
  </div>
</template>
