<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SSelect, SSwitch, SToolbar, SToolbarButton, SToolbarSeparator } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeSize } from '@vean/ui';
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
  loop: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'horizontal',
  size: 'md',
  loop: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);

const orientation = shallowRef(DEFAULTS.orientation);
const size = shallowRef(DEFAULTS.size);
const loop = shallowRef(DEFAULTS.loop);

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  size.value = DEFAULTS.size;
  loop.value = DEFAULTS.loop;
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
          class="w-35"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="loop">
        <div class="h-8 flex items-center">
          <SSwitch v-model="loop" :control-props="{ 'aria-label': 'Loop' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SToolbar class="max-w-2xl" :orientation="orientation" :size="size" :loop="loop">
      <SToolbarButton>Cut</SToolbarButton>
      <SToolbarButton>Copy</SToolbarButton>
      <SToolbarButton>Paste</SToolbarButton>
      <SToolbarSeparator />
      <SToolbarButton>Undo</SToolbarButton>
      <SToolbarButton>Redo</SToolbarButton>
    </SToolbar>
  </div>
</template>
