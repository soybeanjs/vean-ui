<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButton, SButtonIcon, SDialog, SInput, SSelect, SSwitch } from '@vean/ui';
import type { SelectOptionData, ThemeSize } from '@vean/ui';
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
  modal: ModalOption;
  isAlert: boolean;
  alertType: 'default' | 'info' | 'success' | 'warning' | 'error';
  draggable: boolean;
  showClose: boolean;
  showFullscreen: boolean;
  pure: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  title: 'Dialog Title',
  description: 'Dialog Description',
  size: 'md',
  modal: 'modal',
  isAlert: false,
  alertType: 'default',
  draggable: false,
  showClose: true,
  showFullscreen: true,
  pure: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ALERT_TYPE_KEYS = ['default', 'info', 'success', 'warning', 'error'] as const;

const alertTypeItems: SelectOptionData<CustomizerState['alertType']>[] = toOptions(ALERT_TYPE_KEYS);

const modalItems: SelectOptionData<ModalOption>[] = toOptions(MODAL_KEYS);

const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);
const size = shallowRef(DEFAULTS.size);
const modal = shallowRef(DEFAULTS.modal);
const isAlert = shallowRef(DEFAULTS.isAlert);
const alertType = shallowRef(DEFAULTS.alertType);
const draggable = shallowRef(DEFAULTS.draggable);
const showClose = shallowRef(DEFAULTS.showClose);
const showFullscreen = shallowRef(DEFAULTS.showFullscreen);
const pure = shallowRef(DEFAULTS.pure);

/** 把字符串编码还原回 `DialogModal` 的三档取值。 */
const resolvedModal = computed(() => {
  if (modal.value === 'trapFocus') return 'trap-focus';
  if (modal.value === 'nonModal') return false;
  return true;
});

const reset = (): void => {
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  size.value = DEFAULTS.size;
  modal.value = DEFAULTS.modal;
  isAlert.value = DEFAULTS.isAlert;
  alertType.value = DEFAULTS.alertType;
  draggable.value = DEFAULTS.draggable;
  showClose.value = DEFAULTS.showClose;
  showFullscreen.value = DEFAULTS.showFullscreen;
  pure.value = DEFAULTS.pure;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" placeholder="Dialog title" class="w-35" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" placeholder="Dialog description" class="w-45" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="modal">
        <SSelect v-model="modal" :items="modalItems" :trigger-props="{ 'aria-label': 'Modal' }" class="w-33" />
      </FieldItem>
      <FieldItem label="alertType">
        <SSelect
          v-model="alertType"
          :items="alertTypeItems"
          :trigger-props="{ 'aria-label': 'Alert type' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="isAlert">
        <div class="h-8 flex items-center">
          <SSwitch v-model="isAlert" :control-props="{ 'aria-label': 'Is alert' }" />
        </div>
      </FieldItem>
      <FieldItem label="draggable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="draggable" :control-props="{ 'aria-label': 'Draggable' }" />
        </div>
      </FieldItem>
      <FieldItem label="showClose">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showClose" :control-props="{ 'aria-label': 'Show close' }" />
        </div>
      </FieldItem>
      <FieldItem label="showFullscreen">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showFullscreen" :control-props="{ 'aria-label': 'Show fullscreen' }" />
        </div>
      </FieldItem>
      <FieldItem label="pure">
        <div class="h-8 flex items-center">
          <SSwitch v-model="pure" :control-props="{ 'aria-label': 'Pure' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SDialog
      class="max-w-2xl"
      :title="title"
      :description="description"
      :size="size"
      :modal="resolvedModal"
      :is-alert="isAlert"
      :alert-type="alertType"
      :draggable="draggable"
      :show-close="showClose"
      :show-fullscreen="showFullscreen"
      :pure="pure"
    >
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>
      <div>Dialog Content</div>
    </SDialog>
  </div>
</template>
