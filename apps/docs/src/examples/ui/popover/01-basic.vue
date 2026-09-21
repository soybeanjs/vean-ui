<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, SButtonIcon, SInput, SPopover, SSelect, SSwitch } from '@vean/ui';
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
  showArrow: boolean;
  content: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  placement: 'bottom',
  size: 'md',
  showArrow: true,
  content: 'Popover content'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const PLACEMENT_KEYS: readonly Placement[] = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end'
];

const placementItems: SelectOptionData<Placement>[] = toOptions(PLACEMENT_KEYS);

const placement = shallowRef(DEFAULTS.placement);
const size = shallowRef(DEFAULTS.size);
const showArrow = shallowRef(DEFAULTS.showArrow);
const content = shallowRef(DEFAULTS.content);

const reset = (): void => {
  placement.value = DEFAULTS.placement;
  size.value = DEFAULTS.size;
  showArrow.value = DEFAULTS.showArrow;
  content.value = DEFAULTS.content;
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
          class="w-33"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="content">
        <SInput v-model="content" aria-label="Content" class="w-40" />
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
    <SPopover class="max-w-2xl" :placement="placement" :size="size" :show-arrow="showArrow">
      <template #trigger>
        <SButton variant="pure">Trigger popover</SButton>
      </template>
      <p>{{ content }}</p>
    </SPopover>
  </div>
</template>
