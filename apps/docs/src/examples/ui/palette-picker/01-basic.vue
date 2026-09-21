<script setup lang="ts">
import { shallowRef } from 'vue';
import type { ColorFormat, ColorValue } from '@vean/theme';
import { SPalettePicker } from '@vean/ui';
import type { PaletteChangePayload, SelectOptionData, ThemeSize } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  format: ColorFormat;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  format: 'hsl'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SIZE_KEYS: readonly ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const FORMAT_KEYS: readonly ColorFormat[] = ['hsl', 'oklch'];

const sizeItems: SelectOptionData<ThemeSize>[] = toOptions(SIZE_KEYS);
const formatItems: SelectOptionData<ColorFormat>[] = toOptions(FORMAT_KEYS);

const size = shallowRef(DEFAULTS.size);
const format = shallowRef(DEFAULTS.format);

const value = shallowRef<ColorValue>('white');
const payload = shallowRef<PaletteChangePayload | null>(null);

const reset = (): void => {
  size.value = DEFAULTS.size;
  format.value = DEFAULTS.format;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="sizeItems" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="format">
        <SSelect v-model="format" :items="formatItems" :trigger-props="{ 'aria-label': 'Format' }" class="w-25" />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="space-y-4">
      <SPalettePicker v-model="value" :size="size" :format="format" class="w-62" @palette-change="payload = $event" />
      <p class="text-xs text-muted-foreground">value: {{ value }}</p>
      <p class="text-xs text-muted-foreground">
        palette levels: {{ payload ? Object.keys(payload.palette).join(', ') : '—' }}
      </p>
    </div>
  </div>
</template>
