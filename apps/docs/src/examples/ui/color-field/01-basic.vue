<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import type { ColorChannel, ColorFormat, ColorSpace } from '@vean/aria/types';
import { SButtonIcon, SColorField, SColorSwatch, SSelect, SSwitch } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** `none` 表示不锁定通道，直接编辑完整的颜色字符串。 */
type ChannelKey = ColorChannel | 'none';

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  channel: ChannelKey;
  colorSpace: ColorSpace;
  format: ColorFormat;
  size: ThemeSize;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  channel: 'none',
  colorSpace: 'hsl',
  format: 'hex',
  size: 'md',
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const CHANNEL_KEYS: readonly ChannelKey[] = [
  'none',
  'hue',
  'saturation',
  'lightness',
  'brightness',
  'red',
  'green',
  'blue',
  'alpha',
  'chroma'
];
const COLOR_SPACE_KEYS: readonly ColorSpace[] = ['hsl', 'hsv', 'oklch'];
const FORMAT_KEYS: readonly ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch'];

const channelItems = toOptions(CHANNEL_KEYS);
const colorSpaceItems = toOptions(COLOR_SPACE_KEYS);
const formatItems = toOptions(FORMAT_KEYS);

// 被编辑的颜色本身不是「怎么渲染」的状态，保持为独立的模型值。
const color = shallowRef('#0ea5e9');

const channel = shallowRef(DEFAULTS.channel);
const colorSpace = shallowRef(DEFAULTS.colorSpace);
const format = shallowRef(DEFAULTS.format);
const size = shallowRef(DEFAULTS.size);
const disabled = shallowRef(DEFAULTS.disabled);

/** `none` 不对应组件的真实通道，映射回组件的 `channel: undefined`。 */
const activeChannel = computed(() => (channel.value === 'none' ? undefined : channel.value));

const reset = (): void => {
  channel.value = DEFAULTS.channel;
  colorSpace.value = DEFAULTS.colorSpace;
  format.value = DEFAULTS.format;
  size.value = DEFAULTS.size;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="channel">
        <SSelect v-model="channel" :items="channelItems" :trigger-props="{ 'aria-label': 'Channel' }" class="w-33" />
      </FieldItem>
      <FieldItem label="colorSpace">
        <SSelect
          v-model="colorSpace"
          :items="colorSpaceItems"
          :trigger-props="{ 'aria-label': 'Color space' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="format">
        <SSelect v-model="format" :items="formatItems" :trigger-props="{ 'aria-label': 'Format' }" class="w-27" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
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
    <div class="flex flex-col gap-3 w-60 lt-md:w-auto">
      <SColorField
        v-model="color"
        :channel="activeChannel"
        :color-space="colorSpace"
        :format="format"
        :size="size"
        :disabled="disabled"
      />
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <SColorSwatch :color="color" />
        <span>{{ color }}</span>
      </div>
    </div>
  </div>
</template>
