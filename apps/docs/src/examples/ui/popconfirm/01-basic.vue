<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButton, SButtonIcon, SPopconfirm, SInput, SSelect, SSwitch } from '@vean/ui';
import type { Placement, SelectOptionData, ThemeSize } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * `PopconfirmType` 未从 `@vean/ui` 导出，这里用本地字面量联合代替
 * （与 headless `packages/headless/src/components/popconfirm/types.ts` 的定义一致）。
 */
type PopconfirmType = 'error' | 'success' | 'warning' | 'info';

/** `showCancel` 的可选值是 `'onlyWarning' | boolean`，选项表用字符串承载，绑定前再换算回真实值。 */
type ShowCancelOption = 'onlyWarning' | 'true' | 'false';

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  type: PopconfirmType;
  placement: Placement;
  size: ThemeSize;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  showArrow: boolean;
  showIcon: boolean;
  showCancel: ShowCancelOption;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  type: 'error',
  placement: 'top',
  size: 'md',
  title: 'Delete Item?',
  description: 'This action cannot be undone. Are you sure you want to delete this item?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  showArrow: true,
  showIcon: true,
  showCancel: 'onlyWarning'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const TYPE_KEYS: readonly PopconfirmType[] = ['error', 'success', 'warning', 'info'];
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
const SIZE_KEYS: readonly ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const SHOW_CANCEL_KEYS: readonly ShowCancelOption[] = ['onlyWarning', 'true', 'false'];

const typeItems: SelectOptionData<PopconfirmType>[] = toOptions(TYPE_KEYS);
const placementItems: SelectOptionData<Placement>[] = toOptions(PLACEMENT_KEYS);
const sizeItems: SelectOptionData<ThemeSize>[] = toOptions(SIZE_KEYS);
const showCancelItems: SelectOptionData<ShowCancelOption>[] = toOptions(SHOW_CANCEL_KEYS);

const type = shallowRef(DEFAULTS.type);
const placement = shallowRef(DEFAULTS.placement);
const size = shallowRef(DEFAULTS.size);
const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);
const confirmText = shallowRef(DEFAULTS.confirmText);
const cancelText = shallowRef(DEFAULTS.cancelText);
const showArrow = shallowRef(DEFAULTS.showArrow);
const showIcon = shallowRef(DEFAULTS.showIcon);
const showCancel = shallowRef(DEFAULTS.showCancel);

/** 字符串选项换算回组件真实的 `'onlyWarning' | boolean` prop。 */
const showCancelValue = computed<'onlyWarning' | boolean>(() => {
  if (showCancel.value === 'true') {
    return true;
  }

  if (showCancel.value === 'false') {
    return false;
  }

  return 'onlyWarning';
});

const reset = (): void => {
  type.value = DEFAULTS.type;
  placement.value = DEFAULTS.placement;
  size.value = DEFAULTS.size;
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  confirmText.value = DEFAULTS.confirmText;
  cancelText.value = DEFAULTS.cancelText;
  showArrow.value = DEFAULTS.showArrow;
  showIcon.value = DEFAULTS.showIcon;
  showCancel.value = DEFAULTS.showCancel;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="type">
        <SSelect v-model="type" :items="typeItems" :trigger-props="{ 'aria-label': 'Type' }" class="w-30" />
      </FieldItem>
      <FieldItem label="placement">
        <SSelect
          v-model="placement"
          :items="placementItems"
          :trigger-props="{ 'aria-label': 'Placement' }"
          class="w-33"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="sizeItems" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" class="w-40" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" class="w-50" />
      </FieldItem>
      <FieldItem label="confirmText">
        <SInput v-model="confirmText" aria-label="Confirm text" class="w-33" />
      </FieldItem>
      <FieldItem label="cancelText">
        <SInput v-model="cancelText" aria-label="Cancel text" class="w-33" />
      </FieldItem>
      <FieldItem label="showArrow">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showArrow" :control-props="{ 'aria-label': 'Show arrow' }" />
        </div>
      </FieldItem>
      <FieldItem label="showIcon">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showIcon" :control-props="{ 'aria-label': 'Show icon' }" />
        </div>
      </FieldItem>
      <FieldItem label="showCancel">
        <SSelect
          v-model="showCancel"
          :items="showCancelItems"
          :trigger-props="{ 'aria-label': 'Show cancel' }"
          class="w-38"
        />
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SPopconfirm
      class="max-w-2xl"
      :type="type"
      :placement="placement"
      :size="size"
      :title="title"
      :description="description"
      :confirm-text="confirmText"
      :cancel-text="cancelText"
      :show-arrow="showArrow"
      :show-icon="showIcon"
      :show-cancel="showCancelValue"
      :ui="{ description: 'max-w-50' }"
    >
      <template #trigger>
        <SButton color="destructive">Delete</SButton>
      </template>
    </SPopconfirm>
  </div>
</template>
