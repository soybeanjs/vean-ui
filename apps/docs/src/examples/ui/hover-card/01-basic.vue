<script setup lang="ts">
import { shallowRef } from 'vue';
import { SAvatar, SButtonIcon, SHoverCard, SInputNumber, SLink, SSelect, SSwitch } from '@vean/ui';
import type { Placement, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  placement: Placement;
  size: ThemeSize;
  openDelay: number;
  closeDelay: number;
  showArrow: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  placement: 'bottom',
  size: 'md',
  openDelay: 700,
  closeDelay: 300,
  showArrow: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const PLACEMENT_KEYS: readonly Placement[] = [
  'top-start',
  'top',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end'
];

const placementItems: SelectOptionData<Placement>[] = toOptions(PLACEMENT_KEYS);

const placement = shallowRef(DEFAULTS.placement);
const size = shallowRef(DEFAULTS.size);
const openDelay = shallowRef(DEFAULTS.openDelay);
const closeDelay = shallowRef(DEFAULTS.closeDelay);
const showArrow = shallowRef(DEFAULTS.showArrow);

const reset = (): void => {
  placement.value = DEFAULTS.placement;
  size.value = DEFAULTS.size;
  openDelay.value = DEFAULTS.openDelay;
  closeDelay.value = DEFAULTS.closeDelay;
  showArrow.value = DEFAULTS.showArrow;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="placement">
        <SSelect
          v-model="placement"
          :items="placementItems"
          :trigger-props="{ 'aria-label': 'Placement' }"
          class="w-35"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="openDelay">
        <SInputNumber
          v-model="openDelay"
          :min="0"
          :step="100"
          :control-props="{ 'aria-label': 'Open delay' }"
          class="w-27.5"
        />
      </FieldItem>
      <FieldItem label="closeDelay">
        <SInputNumber
          v-model="closeDelay"
          :min="0"
          :step="100"
          :control-props="{ 'aria-label': 'Close delay' }"
          class="w-27.5"
        />
      </FieldItem>
      <FieldItem label="showArrow">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showArrow" :control-props="{ 'aria-label': 'Show arrow' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SHoverCard
      class="max-w-2xl"
      :placement="placement"
      :size="size"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      :show-arrow="showArrow"
    >
      <template #trigger>
        <SLink href="https://github.com/soybeanjs" target="_blank" rel="noopener noreferrer">@soybeanjs</SLink>
      </template>
      <div class="flex gap-4">
        <SAvatar src="https://github.com/soybeanjs.png" fallback="SB" class="size-10 rounded-full" />
        <div class="space-y-1">
          <h4 class="text-sm font-semibold">Vean</h4>
          <p class="text-sm text-muted-foreground">A Vue 3 component library built on top of Vean Aria.</p>
          <p class="text-xs text-muted-foreground">@soybeanjs • GitHub</p>
        </div>
      </div>
    </SHoverCard>
  </div>
</template>
