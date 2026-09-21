<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SKbd, SSelect, SSwitch } from '@vean/ui';
import type { KbdVariant, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: KbdVariant;
  size: ThemeSize;
  raised: boolean;
  symbolize: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  variant: 'outline',
  size: 'md',
  raised: true,
  symbolize: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly KbdVariant[] = ['solid', 'outline', 'ghost'];

const variantItems: SelectOptionData<KbdVariant>[] = toOptions(VARIANT_KEYS);

const variant = shallowRef(DEFAULTS.variant);
const size = shallowRef(DEFAULTS.size);
const raised = shallowRef(DEFAULTS.raised);
const symbolize = shallowRef(DEFAULTS.symbolize);

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  size.value = DEFAULTS.size;
  raised.value = DEFAULTS.raised;
  symbolize.value = DEFAULTS.symbolize;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-27.5" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="raised">
        <div class="h-8 flex items-center">
          <SSwitch v-model="raised" :control-props="{ 'aria-label': 'Raised' }" />
        </div>
      </FieldItem>
      <FieldItem label="symbolize">
        <div class="h-8 flex items-center">
          <SSwitch v-model="symbolize" :control-props="{ 'aria-label': 'Symbolize' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="flex flex-wrap items-center justify-center gap-3">
      <SKbd :variant="variant" :size="size" :raised="raised" :symbolize="symbolize" value="command" />
      <SKbd :variant="variant" :size="size" :raised="raised" :symbolize="symbolize" value="K" />
      <SKbd :variant="variant" :size="size" :raised="raised" :symbolize="symbolize" :value="['ctrl', 'alt']" />
      <SKbd :variant="variant" :size="size" :raised="raised" :symbolize="symbolize" :value="['ctrl', 'shift', 'A']" />
    </div>
  </div>
</template>
