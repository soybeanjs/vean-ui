<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SSelect, STabs, SSwitch } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * `TabsShape` / `TabsFill` live in the UI package's style recipe (`styles/tabs.ts`)
 * and are not re-exported from `@vean/ui`, so the customizer tracks them with
 * local literal unions instead of reaching into package internals.
 */
type TabsShapeOption = 'square' | 'rounded';
type TabsFillOption = 'auto' | 'full';

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  orientation: DataOrientation;
  size: ThemeSize;
  shape: TabsShapeOption;
  fill: TabsFillOption;
  enableIndicator: boolean;
  tabValue: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'horizontal',
  size: 'md',
  shape: 'square',
  fill: 'auto',
  enableIndicator: true,
  tabValue: '1'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];
const SHAPE_KEYS: readonly TabsShapeOption[] = ['square', 'rounded'];
const FILL_KEYS: readonly TabsFillOption[] = ['auto', 'full'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const shapeItems: SelectOptionData<TabsShapeOption>[] = toOptions(SHAPE_KEYS);
const fillItems: SelectOptionData<TabsFillOption>[] = toOptions(FILL_KEYS);

const orientation = shallowRef<DataOrientation>(DEFAULTS.orientation);
const size = shallowRef<ThemeSize>(DEFAULTS.size);
const shape = shallowRef<TabsShapeOption>(DEFAULTS.shape);
const fill = shallowRef<TabsFillOption>(DEFAULTS.fill);
const enableIndicator = shallowRef(DEFAULTS.enableIndicator);
const tabValue = shallowRef(DEFAULTS.tabValue);

const tabs = [
  { value: '1', label: 'Tab 1' },
  { value: '2', label: 'Tab 2' },
  { value: '3', label: 'Tab 3' }
];

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  size.value = DEFAULTS.size;
  shape.value = DEFAULTS.shape;
  fill.value = DEFAULTS.fill;
  enableIndicator.value = DEFAULTS.enableIndicator;
  tabValue.value = DEFAULTS.tabValue;
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
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="w-320px lt-md:w-auto">
      <STabs
        v-model="tabValue"
        :orientation="orientation"
        :size="size"
        :shape="shape"
        :fill="fill"
        :enable-indicator="enableIndicator"
        :items="tabs"
        :ui="{ content: 'p-4 border border-border rounded-1' }"
      >
        <template #content="{ value }">
          <div>The Tab Content: {{ value }}</div>
        </template>
      </STabs>
    </div>
  </div>
</template>
