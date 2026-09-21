<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButton, SButtonIcon, SDrawer, SInput, SInputNumber, SSelect, SSwitch } from '@vean/ui';
import type { SelectOptionData, Side, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 模态选项用字符串编码，SSelect 的选项值只能是 `string | number`。 */
const MODAL_KEYS = ['modal', 'trapFocus', 'nonModal'] as const;

type ModalOption = (typeof MODAL_KEYS)[number];

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  title: string;
  description: string;
  size: ThemeSize;
  side: Side;
  modal: ModalOption;
  dismissible: boolean;
  handleOnly: boolean;
  swipeable: boolean;
  fullscreen: boolean;
  closeThreshold: number | null;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  title: 'Drawer Title',
  description: 'Drawer Description',
  size: 'md',
  side: 'bottom',
  modal: 'modal',
  dismissible: true,
  handleOnly: false,
  swipeable: false,
  fullscreen: false,
  closeThreshold: 0.25
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const SIDE_KEYS: readonly Side[] = ['top', 'right', 'bottom', 'left'];

const sideItems: SelectOptionData<Side>[] = toOptions(SIDE_KEYS);

const modalItems: SelectOptionData<ModalOption>[] = toOptions(MODAL_KEYS);

const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);
const size = shallowRef(DEFAULTS.size);
const side = shallowRef<Side>(DEFAULTS.side);
const modal = shallowRef(DEFAULTS.modal);
const dismissible = shallowRef(DEFAULTS.dismissible);
const handleOnly = shallowRef(DEFAULTS.handleOnly);
const swipeable = shallowRef(DEFAULTS.swipeable);
const fullscreen = shallowRef(DEFAULTS.fullscreen);
const closeThreshold = shallowRef(DEFAULTS.closeThreshold);

/** 空输入回落到组件默认值 0.25。 */
const resolvedCloseThreshold = computed(() => closeThreshold.value ?? 0.25);

/** 把字符串编码还原回 `DrawerModal` 的三档取值。 */
const resolvedModal = computed(() => {
  if (modal.value === 'trapFocus') return 'trap-focus';
  if (modal.value === 'nonModal') return false;
  return true;
});

const reset = (): void => {
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  size.value = DEFAULTS.size;
  side.value = DEFAULTS.side;
  modal.value = DEFAULTS.modal;
  dismissible.value = DEFAULTS.dismissible;
  handleOnly.value = DEFAULTS.handleOnly;
  swipeable.value = DEFAULTS.swipeable;
  fullscreen.value = DEFAULTS.fullscreen;
  closeThreshold.value = DEFAULTS.closeThreshold;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" placeholder="Drawer title" class="w-35" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" placeholder="Drawer description" class="w-45" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="side">
        <SSelect v-model="side" :items="sideItems" :trigger-props="{ 'aria-label': 'Side' }" class="w-30" />
      </FieldItem>
      <FieldItem label="modal">
        <SSelect v-model="modal" :items="modalItems" :trigger-props="{ 'aria-label': 'Modal' }" class="w-33" />
      </FieldItem>
      <FieldItem label="closeThreshold">
        <SInputNumber
          v-model="closeThreshold"
          :min="0"
          :max="1"
          :step="0.05"
          :control-props="{ 'aria-label': 'Close threshold' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="dismissible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="dismissible" :control-props="{ 'aria-label': 'Dismissible' }" />
        </div>
      </FieldItem>
      <FieldItem label="handleOnly">
        <div class="h-8 flex items-center">
          <SSwitch v-model="handleOnly" :control-props="{ 'aria-label': 'Handle only' }" />
        </div>
      </FieldItem>
      <FieldItem label="swipeable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="swipeable" :control-props="{ 'aria-label': 'Swipeable' }" />
        </div>
      </FieldItem>
      <FieldItem label="fullscreen">
        <div class="h-8 flex items-center">
          <SSwitch v-model="fullscreen" :control-props="{ 'aria-label': 'Fullscreen' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SDrawer
      :title="title"
      :description="description"
      :size="size"
      :side="side"
      :modal="resolvedModal"
      :dismissible="dismissible"
      :handle-only="handleOnly"
      :swipeable="swipeable"
      :fullscreen="fullscreen"
      :close-threshold="resolvedCloseThreshold"
    >
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>
      <div>Drawer Content</div>
    </SDrawer>
  </div>
</template>
