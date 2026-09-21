<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButton, SButtonIcon, SInput, SInputNumber, SSelect, SSwitch, toast } from '@vean/ui';
import type { SelectOptionData, ToastPosition, ToastType } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么发」，发出的 toast 完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  type: ToastType;
  position: ToastPosition;
  duration: number;
  title: string;
  description: string;
  richColor: boolean;
  inverted: boolean;
  showClose: boolean;
  dismissible: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  type: 'default',
  position: 'bottom-right',
  duration: 3200,
  title: 'Release created',
  description: 'The changelog and version tag are ready.',
  richColor: false,
  inverted: false,
  showClose: true,
  dismissible: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const TYPE_KEYS: readonly ToastType[] = ['default', 'success', 'info', 'warning', 'error', 'loading'];
const POSITION_KEYS: readonly ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
];

const typeItems: SelectOptionData<ToastType>[] = toOptions(TYPE_KEYS);
const positionItems: SelectOptionData<ToastPosition>[] = toOptions(POSITION_KEYS);

const type = shallowRef(DEFAULTS.type);
const position = shallowRef(DEFAULTS.position);
/** 数值控件允许空输入：`SInputNumber` 的模型是 `number | null`，空值回落到默认快照。 */
const duration = shallowRef<number | null>(DEFAULTS.duration);
const title = shallowRef(DEFAULTS.title);
const description = shallowRef(DEFAULTS.description);
const richColor = shallowRef(DEFAULTS.richColor);
const inverted = shallowRef(DEFAULTS.inverted);
const showClose = shallowRef(DEFAULTS.showClose);
const dismissible = shallowRef(DEFAULTS.dismissible);

/** `toast()` 基础入口不收 `type`，类型由具名方法决定；按状态分发到对应入口。 */
const openToast = (): void => {
  const options = {
    description: description.value,
    position: position.value,
    duration: duration.value ?? DEFAULTS.duration,
    richColor: richColor.value,
    inverted: inverted.value,
    showClose: showClose.value,
    dismissible: dismissible.value
  };

  switch (type.value) {
    case 'success':
      toast.success(title.value, options);
      return;
    case 'info':
      toast.info(title.value, options);
      return;
    case 'warning':
      toast.warning(title.value, options);
      return;
    case 'error':
      toast.error(title.value, options);
      return;
    case 'loading':
      toast.loading(title.value, options);
      return;
    default:
      toast(title.value, options);
  }
};

const reset = (): void => {
  type.value = DEFAULTS.type;
  position.value = DEFAULTS.position;
  duration.value = DEFAULTS.duration;
  title.value = DEFAULTS.title;
  description.value = DEFAULTS.description;
  richColor.value = DEFAULTS.richColor;
  inverted.value = DEFAULTS.inverted;
  showClose.value = DEFAULTS.showClose;
  dismissible.value = DEFAULTS.dismissible;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="type">
        <SSelect v-model="type" :items="typeItems" :trigger-props="{ 'aria-label': 'Type' }" class="w-30" />
      </FieldItem>
      <FieldItem label="position">
        <SSelect v-model="position" :items="positionItems" :trigger-props="{ 'aria-label': 'Position' }" class="w-35" />
      </FieldItem>
      <FieldItem label="duration">
        <SInputNumber
          v-model="duration"
          :min="0"
          :step="400"
          :control-props="{ 'aria-label': 'Duration' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="title">
        <SInput v-model="title" aria-label="Title" />
      </FieldItem>
      <FieldItem label="description">
        <SInput v-model="description" aria-label="Description" />
      </FieldItem>
      <FieldItem label="richColor">
        <div class="h-8 flex items-center">
          <SSwitch v-model="richColor" :control-props="{ 'aria-label': 'Rich color' }" />
        </div>
      </FieldItem>
      <FieldItem label="inverted">
        <div class="h-8 flex items-center">
          <SSwitch v-model="inverted" :control-props="{ 'aria-label': 'Inverted' }" />
        </div>
      </FieldItem>
      <FieldItem label="showClose">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showClose" :control-props="{ 'aria-label': 'Show close' }" />
        </div>
      </FieldItem>
      <FieldItem label="dismissible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="dismissible" :control-props="{ 'aria-label': 'Dismissible' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SButton class="max-w-2xl" @click="openToast">Show toast</SButton>
  </div>
</template>
