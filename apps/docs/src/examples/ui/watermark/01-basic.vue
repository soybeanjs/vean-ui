<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SInput, SInputNumber, SSelect, SSwitch, SWatermark } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  content: string;
  fontSize: number;
  fontColor: string;
  fontWeight: 'normal' | 'bold';
  rotate: number;
  gapX: number;
  gapY: number;
  cross: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  content: 'CONFIDENTIAL',
  fontSize: 16,
  fontColor: 'rgba(0, 0, 0, 0.15)',
  fontWeight: 'normal',
  rotate: -22,
  gapX: 100,
  gapY: 100,
  cross: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

/** `fontWeight` 接受 `number | string`，这里收敛成演示常用的两档；类型未从 UI 包导出，用本地字面量联合。 */
const FONT_WEIGHT_KEYS: readonly ('normal' | 'bold')[] = ['normal', 'bold'];

const fontWeightItems: SelectOptionData<CustomizerState['fontWeight']>[] = toOptions(FONT_WEIGHT_KEYS);

const content = shallowRef(DEFAULTS.content);
const fontSize = shallowRef(DEFAULTS.fontSize);
const fontColor = shallowRef(DEFAULTS.fontColor);
const fontWeight = shallowRef(DEFAULTS.fontWeight);
const rotate = shallowRef(DEFAULTS.rotate);
const gapX = shallowRef(DEFAULTS.gapX);
const gapY = shallowRef(DEFAULTS.gapY);
const cross = shallowRef(DEFAULTS.cross);

const reset = (): void => {
  content.value = DEFAULTS.content;
  fontSize.value = DEFAULTS.fontSize;
  fontColor.value = DEFAULTS.fontColor;
  fontWeight.value = DEFAULTS.fontWeight;
  rotate.value = DEFAULTS.rotate;
  gapX.value = DEFAULTS.gapX;
  gapY.value = DEFAULTS.gapY;
  cross.value = DEFAULTS.cross;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="content">
        <SInput v-model="content" aria-label="Content" placeholder="Watermark text" />
      </FieldItem>
      <FieldItem label="fontSize">
        <SInputNumber
          v-model="fontSize"
          :min="8"
          :max="48"
          :step="2"
          :control-props="{ 'aria-label': 'Font size' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="fontColor">
        <SInput v-model="fontColor" aria-label="Font color" placeholder="rgba(0, 0, 0, 0.15)" />
      </FieldItem>
      <FieldItem label="fontWeight">
        <SSelect
          v-model="fontWeight"
          :items="fontWeightItems"
          :trigger-props="{ 'aria-label': 'Font weight' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="rotate">
        <SInputNumber
          v-model="rotate"
          :min="-90"
          :max="90"
          :step="1"
          :control-props="{ 'aria-label': 'Rotate' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="gapX">
        <SInputNumber
          v-model="gapX"
          :min="20"
          :max="300"
          :step="10"
          :control-props="{ 'aria-label': 'Gap X' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="gapY">
        <SInputNumber
          v-model="gapY"
          :min="20"
          :max="300"
          :step="10"
          :control-props="{ 'aria-label': 'Gap Y' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="cross">
        <div class="h-8 flex items-center">
          <SSwitch v-model="cross" :control-props="{ 'aria-label': 'Cross' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="relative h-72 overflow-hidden rounded-md border bg-muted/20">
    <SWatermark
      :content="content"
      :font-size="fontSize"
      :font-color="fontColor"
      :font-weight="fontWeight"
      :rotate="rotate"
      :gap="[gapX, gapY]"
      :cross="cross"
      class="h-full"
    >
      <div class="flex items-center justify-center h-full">
        <p class="text-sm text-muted-foreground">This content is protected by a repeating text watermark.</p>
      </div>
    </SWatermark>
  </div>
</template>
