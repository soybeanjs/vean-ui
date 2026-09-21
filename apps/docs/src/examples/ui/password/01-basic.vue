<script setup lang="ts">
import { shallowRef } from 'vue';
import { SInput, SPassword, SSelect, SSwitch } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
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
  disabled: boolean;
  readonly: boolean;
  clearable: boolean;
  visible: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  value: 'abc123',
  placeholder: 'Please input',
  size: 'md',
  disabled: false,
  readonly: false,
  clearable: false,
  visible: false
};

const size = shallowRef(DEFAULTS.size);
const value = shallowRef(DEFAULTS.value);
const placeholder = shallowRef(DEFAULTS.placeholder);
const disabled = shallowRef(DEFAULTS.disabled);
const readonly = shallowRef(DEFAULTS.readonly);
const clearable = shallowRef(DEFAULTS.clearable);
const visible = shallowRef(DEFAULTS.visible);

const reset = (): void => {
  size.value = DEFAULTS.size;
  value.value = DEFAULTS.value;
  placeholder.value = DEFAULTS.placeholder;
  disabled.value = DEFAULTS.disabled;
  readonly.value = DEFAULTS.readonly;
  clearable.value = DEFAULTS.clearable;
  visible.value = DEFAULTS.visible;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="value">
        <SInput v-model="value" aria-label="Value" placeholder="Password value" class="w-40" />
      </FieldItem>
      <FieldItem label="placeholder">
        <SInput v-model="placeholder" aria-label="Placeholder" placeholder="Please input" class="w-40" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
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
      <FieldItem label="clearable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="clearable" :control-props="{ 'aria-label': 'Clearable' }" />
        </div>
      </FieldItem>
      <FieldItem label="visible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="visible" :control-props="{ 'aria-label': 'Visible' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SPassword
      v-model="value"
      v-model:visible="visible"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :clearable="clearable"
      class="w-60 lt-md:w-auto"
    />
  </div>
</template>
