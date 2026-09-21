<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SEditable, SInput, SSelect, SSwitch } from '@vean/ui';
import type {
  EditableActivationMode,
  EditableEventState,
  EditableSubmitMode,
  SelectOptionData,
  ThemeSize
} from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  value: string;
  placeholder: string;
  size: ThemeSize;
  activationMode: EditableActivationMode;
  submitMode: EditableSubmitMode;
  selectOnFocus: boolean;
  autoResize: boolean;
  disabled: boolean;
  readonly: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  value: 'Click to edit your display name',
  placeholder: 'Enter your display name',
  size: 'md',
  activationMode: 'focus',
  submitMode: 'blur',
  selectOnFocus: false,
  autoResize: false,
  disabled: false,
  readonly: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ACTIVATION_MODE_KEYS: readonly EditableActivationMode[] = ['focus', 'dblclick', 'none'];
const SUBMIT_MODE_KEYS: readonly EditableSubmitMode[] = ['blur', 'enter', 'none', 'both'];

const activationModeItems: SelectOptionData<EditableActivationMode>[] = toOptions(ACTIVATION_MODE_KEYS);
const submitModeItems: SelectOptionData<EditableSubmitMode>[] = toOptions(SUBMIT_MODE_KEYS);

const value = shallowRef(DEFAULTS.value);
const placeholder = shallowRef(DEFAULTS.placeholder);
const size = shallowRef(DEFAULTS.size);
const activationMode = shallowRef(DEFAULTS.activationMode);
const submitMode = shallowRef(DEFAULTS.submitMode);
const selectOnFocus = shallowRef(DEFAULTS.selectOnFocus);
const autoResize = shallowRef(DEFAULTS.autoResize);
const disabled = shallowRef(DEFAULTS.disabled);
const readonly = shallowRef(DEFAULTS.readonly);

const state = shallowRef<EditableEventState | 'preview'>('preview');

const handleStateChange = (nextState: EditableEventState): void => {
  state.value = nextState;
};

const handleSubmit = (): void => {
  state.value = 'preview';
};

const reset = (): void => {
  value.value = DEFAULTS.value;
  placeholder.value = DEFAULTS.placeholder;
  size.value = DEFAULTS.size;
  activationMode.value = DEFAULTS.activationMode;
  submitMode.value = DEFAULTS.submitMode;
  selectOnFocus.value = DEFAULTS.selectOnFocus;
  autoResize.value = DEFAULTS.autoResize;
  disabled.value = DEFAULTS.disabled;
  readonly.value = DEFAULTS.readonly;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="value">
        <SInput v-model="value" aria-label="Value" placeholder="Editable value" class="w-45" />
      </FieldItem>
      <FieldItem label="placeholder">
        <SInput v-model="placeholder" aria-label="Placeholder" placeholder="Placeholder text" class="w-45" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="activationMode">
        <SSelect
          v-model="activationMode"
          :items="activationModeItems"
          :trigger-props="{ 'aria-label': 'Activation mode' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="submitMode">
        <SSelect
          v-model="submitMode"
          :items="submitModeItems"
          :trigger-props="{ 'aria-label': 'Submit mode' }"
          class="w-28"
        />
      </FieldItem>
      <FieldItem label="selectOnFocus">
        <div class="h-8 flex items-center">
          <SSwitch v-model="selectOnFocus" :control-props="{ 'aria-label': 'Select on focus' }" />
        </div>
      </FieldItem>
      <FieldItem label="autoResize">
        <div class="h-8 flex items-center">
          <SSwitch v-model="autoResize" :control-props="{ 'aria-label': 'Auto resize' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem label="readonly">
        <div class="h-8 flex items-center">
          <SSwitch v-model="readonly" :control-props="{ 'aria-label': 'Readonly' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex flex-col items-center justify-center w-full gap-3">
    <SEditable
      v-model="value"
      class="w-100 lt-md:w-auto"
      :placeholder="placeholder"
      :size="size"
      :activation-mode="activationMode"
      :submit-mode="submitMode"
      :select-on-focus="selectOnFocus"
      :auto-resize="autoResize"
      :disabled="disabled"
      :readonly="readonly"
      @submit="handleSubmit"
      @update:state="handleStateChange"
    />
    <p class="text-sm text-muted-foreground">Value: {{ value }}</p>
    <p class="text-xs text-muted-foreground">State: {{ state }}</p>
  </div>
</template>
