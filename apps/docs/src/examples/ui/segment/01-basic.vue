<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SSegment, SSelect, SSwitch } from '@vean/ui';
import type {
  DataOrientation,
  SegmentFill,
  SegmentOptionData,
  SegmentShape,
  SelectOptionData,
  ThemeSize
} from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  orientation: DataOrientation;
  size: ThemeSize;
  shape: SegmentShape;
  fill: SegmentFill;
  enableIndicator: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'horizontal',
  size: 'md',
  shape: 'square',
  fill: 'auto',
  enableIndicator: true,
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];
const SHAPE_KEYS: readonly SegmentShape[] = ['square', 'rounded'];
const FILL_KEYS: readonly SegmentFill[] = ['auto', 'full'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const shapeItems: SelectOptionData<SegmentShape>[] = toOptions(SHAPE_KEYS);
const fillItems: SelectOptionData<SegmentFill>[] = toOptions(FILL_KEYS);

const orientation = shallowRef(DEFAULTS.orientation);
const size = shallowRef(DEFAULTS.size);
const shape = shallowRef(DEFAULTS.shape);
const fill = shallowRef(DEFAULTS.fill);
const enableIndicator = shallowRef(DEFAULTS.enableIndicator);
const disabled = shallowRef(DEFAULTS.disabled);

const day = shallowRef('monday');

const weekdays = [
  {
    value: 'monday',
    label: 'Monday'
  },
  {
    value: 'tuesday',
    label: 'Tuesday'
  },
  {
    value: 'wednesday',
    label: 'Wednesday'
  },
  {
    value: 'thursday',
    label: 'Thursday'
  },
  {
    value: 'friday',
    label: 'Friday'
  },
  {
    value: 'saturday',
    label: 'Saturday'
  },
  {
    value: 'sunday',
    label: 'Sunday'
  }
] satisfies SegmentOptionData[];

/** Segment 没有根级 `disabled`，禁用态由每个选项的 `disabled` 字段驱动。 */
const segmentItems = computed<SegmentOptionData[]>(() => weekdays.map(item => ({ ...item, disabled: disabled.value })));

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  fill.value = DEFAULTS.fill;
  enableIndicator.value = DEFAULTS.enableIndicator;
  disabled.value = DEFAULTS.disabled;
  day.value = 'monday';
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="shape">
        <SSelect v-model="shape" :items="shapeItems" :trigger-props="{ 'aria-label': 'Shape' }" class="w-30" />
      </FieldItem>
      <FieldItem label="fill">
        <SSelect v-model="fill" :items="fillItems" :trigger-props="{ 'aria-label': 'Fill' }" class="w-25" />
      </FieldItem>
      <FieldItem label="enableIndicator">
        <div class="h-8 flex items-center">
          <SSwitch v-model="enableIndicator" :control-props="{ 'aria-label': 'Enable indicator' }" />
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
    <SSegment
      v-model="day"
      class="max-w-2xl"
      :items="segmentItems"
      :orientation="orientation"
      :size="size"
      :shape="shape"
      :fill="fill"
      :enable-indicator="enableIndicator"
    />
  </div>
</template>
