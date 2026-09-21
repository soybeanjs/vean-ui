<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { SButtonIcon, SInput, SInputNumber, SInputOtp, SSelect, SSwitch, toast } from '@vean/ui';
import type { Align, InputOtpInputMode, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  align: Align;
  maxlength: number;
  inputmode: InputOtpInputMode;
  placeholder: string;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  align: 'start',
  maxlength: 6,
  inputmode: 'numeric',
  placeholder: '',
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ALIGN_KEYS: readonly Align[] = ['start', 'center', 'end'];
const INPUTMODE_KEYS: readonly InputOtpInputMode[] = ['numeric', 'text'];

const alignItems: SelectOptionData<Align>[] = toOptions(ALIGN_KEYS);
const inputmodeItems: SelectOptionData<InputOtpInputMode>[] = toOptions(INPUTMODE_KEYS);

const size = shallowRef(DEFAULTS.size);
const align = shallowRef(DEFAULTS.align);
const maxlength = shallowRef(DEFAULTS.maxlength);
const inputmode = shallowRef(DEFAULTS.inputmode);
const placeholder = shallowRef(DEFAULTS.placeholder);
const disabled = shallowRef(DEFAULTS.disabled);
const otp = ref('');

function handleComplete() {
  toast(`OTP complete! Value: ${otp.value}`);
}

const reset = (): void => {
  size.value = DEFAULTS.size;
  align.value = DEFAULTS.align;
  maxlength.value = DEFAULTS.maxlength;
  inputmode.value = DEFAULTS.inputmode;
  placeholder.value = DEFAULTS.placeholder;
  disabled.value = DEFAULTS.disabled;
  otp.value = '';
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="align">
        <SSelect v-model="align" :items="alignItems" :trigger-props="{ 'aria-label': 'Align' }" class="w-27.5" />
      </FieldItem>
      <FieldItem label="inputmode">
        <SSelect
          v-model="inputmode"
          :items="inputmodeItems"
          :trigger-props="{ 'aria-label': 'Input mode' }"
          class="w-27.5"
        />
      </FieldItem>
      <FieldItem label="maxlength">
        <SInputNumber
          v-model="maxlength"
          :min="1"
          :max="8"
          :step="1"
          :control-props="{ 'aria-label': 'Max length' }"
          class="w-25"
        />
      </FieldItem>
      <FieldItem label="placeholder">
        <SInput v-model="placeholder" aria-label="Placeholder" placeholder="Input placeholder" />
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

  <div class="flex flex-col items-center justify-center w-full gap-3">
    <div class="w-70 lt-md:w-auto">
      <SInputOtp
        v-model="otp"
        :size="size"
        :align="align"
        :maxlength="maxlength"
        :inputmode="inputmode"
        :placeholder="placeholder"
        :disabled="disabled"
        aria-label="Verification code"
        @complete="handleComplete"
      />
    </div>
    <p class="text-sm text-muted-foreground">Value: {{ otp || '-' }}</p>
  </div>
</template>
