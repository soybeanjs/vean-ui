<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SAccordion, SButtonIcon, SSelect, SSwitch } from '@vean/ui';
import type { AccordionOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  multiple: boolean;
  collapsible: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  multiple: false,
  collapsible: true,
  disabled: false
};

const items: AccordionOptionData[] = [
  {
    value: '1',
    title: 'Is it accessible?',
    description: 'Yes. It adheres to the WAI-ARIA design pattern.',
    icon: 'lucide:info'
  },
  {
    value: '2',
    title: 'Is it unstyled?',
    description: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
    icon: 'lucide:rocket'
  },
  {
    value: '3',
    title: 'Can it be animated?',
    description: 'Yes! You can use the transition prop to configure the animation.',
    icon: 'lucide:earth'
  }
];

const size = shallowRef(DEFAULTS.size);
const multiple = shallowRef(DEFAULTS.multiple);
const collapsible = shallowRef(DEFAULTS.collapsible);
const disabled = shallowRef(DEFAULTS.disabled);

/** 单选收集字符串、多选收集数组，两份状态按 `multiple` 各自归位，避免交叉污染。 */
const single = shallowRef('');
const multi = shallowRef<string[]>([]);

const modelValue = computed(() => (multiple.value ? multi.value : single.value));

const handleModelUpdate = (value: string | string[]): void => {
  if (multiple.value) {
    multi.value = Array.isArray(value) ? value : [value];
    return;
  }

  single.value = Array.isArray(value) ? (value[0] ?? '') : value;
};

const reset = (): void => {
  size.value = DEFAULTS.size;
  multiple.value = DEFAULTS.multiple;
  collapsible.value = DEFAULTS.collapsible;
  disabled.value = DEFAULTS.disabled;
  single.value = '';
  multi.value = [];
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="multiple">
        <div class="h-8 flex items-center">
          <SSwitch v-model="multiple" :control-props="{ 'aria-label': 'Multiple' }" />
        </div>
      </FieldItem>
      <FieldItem label="collapsible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="collapsible" :control-props="{ 'aria-label': 'Collapsible' }" />
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

  <SAccordion
    :items="items"
    :size="size"
    :multiple="multiple"
    :collapsible="collapsible"
    :disabled="disabled"
    :model-value="modelValue"
    @update:model-value="handleModelUpdate"
  />
</template>
