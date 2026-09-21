<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SInput, SInputNumber, SSelect, SSwitch } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  center: boolean;
  clearable: boolean;
  disabled: boolean;
  step: number;
  placeholder: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  center: false,
  clearable: false,
  disabled: false,
  step: 1,
  placeholder: 'Please input'
};

const size = shallowRef(DEFAULTS.size);
const center = shallowRef(DEFAULTS.center);
const clearable = shallowRef(DEFAULTS.clearable);
const disabled = shallowRef(DEFAULTS.disabled);
const step = shallowRef(DEFAULTS.step);
const placeholder = shallowRef(DEFAULTS.placeholder);
const modelValue = shallowRef<number | null>(null);

const reset = (): void => {
  size.value = DEFAULTS.size;
  center.value = DEFAULTS.center;
  clearable.value = DEFAULTS.clearable;
  disabled.value = DEFAULTS.disabled;
  step.value = DEFAULTS.step;
  placeholder.value = DEFAULTS.placeholder;
  modelValue.value = null;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="step">
        <SInputNumber v-model="step" :min="1" :step="1" :control-props="{ 'aria-label': 'Step' }" class="w-25" />
      </FieldItem>
      <FieldItem label="placeholder">
        <SInput v-model="placeholder" aria-label="Placeholder" placeholder="Input placeholder" />
      </FieldItem>
      <FieldItem label="center">
        <div class="h-8 flex items-center">
          <SSwitch v-model="center" :control-props="{ 'aria-label': 'Center' }" />
        </div>
      </FieldItem>
      <FieldItem label="clearable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="clearable" :control-props="{ 'aria-label': 'Clearable' }" />
        </div>
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
    <div class="w-60 lt-md:w-auto">
      <SInputNumber
        v-model="modelValue"
        :size="size"
        :center="center"
        :clearable="clearable"
        :disabled="disabled"
        :step="step"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>
