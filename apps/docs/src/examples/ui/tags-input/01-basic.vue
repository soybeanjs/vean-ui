<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SInputNumber, SSelect, SSwitch, STagsInput } from '@vean/ui';
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
  clearable: boolean;
  duplicate: boolean;
  addOnBlur: boolean;
  addOnTab: boolean;
  addOnPaste: boolean;
  max: number | null;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  clearable: false,
  duplicate: false,
  addOnBlur: false,
  addOnTab: false,
  addOnPaste: false,
  max: null,
  disabled: false
};

const size = shallowRef(DEFAULTS.size);
const clearable = shallowRef(DEFAULTS.clearable);
const duplicate = shallowRef(DEFAULTS.duplicate);
const addOnBlur = shallowRef(DEFAULTS.addOnBlur);
const addOnTab = shallowRef(DEFAULTS.addOnTab);
const addOnPaste = shallowRef(DEFAULTS.addOnPaste);
const max = shallowRef<number | null>(DEFAULTS.max);
const disabled = shallowRef(DEFAULTS.disabled);

const tags = shallowRef(['Vue', 'React', 'Angular']);

/** 数值控件允许空输入：空值表示不设上限，按组件约定映射回 `0`。 */
const resolvedMax = computed(() => max.value ?? 0);

const reset = (): void => {
  size.value = DEFAULTS.size;
  clearable.value = DEFAULTS.clearable;
  duplicate.value = DEFAULTS.duplicate;
  addOnBlur.value = DEFAULTS.addOnBlur;
  addOnTab.value = DEFAULTS.addOnTab;
  addOnPaste.value = DEFAULTS.addOnPaste;
  max.value = DEFAULTS.max;
  disabled.value = DEFAULTS.disabled;
  tags.value = ['Vue', 'React', 'Angular'];
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="max">
        <SInputNumber
          v-model="max"
          :min="0"
          placeholder="Unlimited"
          :control-props="{ 'aria-label': 'Max tags' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="clearable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="clearable" :control-props="{ 'aria-label': 'Clearable' }" />
        </div>
      </FieldItem>
      <FieldItem label="duplicate">
        <div class="h-8 flex items-center">
          <SSwitch v-model="duplicate" :control-props="{ 'aria-label': 'Allow duplicate' }" />
        </div>
      </FieldItem>
      <FieldItem label="addOnBlur">
        <div class="h-8 flex items-center">
          <SSwitch v-model="addOnBlur" :control-props="{ 'aria-label': 'Add on blur' }" />
        </div>
      </FieldItem>
      <FieldItem label="addOnTab">
        <div class="h-8 flex items-center">
          <SSwitch v-model="addOnTab" :control-props="{ 'aria-label': 'Add on tab' }" />
        </div>
      </FieldItem>
      <FieldItem label="addOnPaste">
        <div class="h-8 flex items-center">
          <SSwitch v-model="addOnPaste" :control-props="{ 'aria-label': 'Add on paste' }" />
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
    <STagsInput
      v-model="tags"
      :size="size"
      :max="resolvedMax"
      :clearable="clearable"
      :duplicate="duplicate"
      :add-on-blur="addOnBlur"
      :add-on-tab="addOnTab"
      :add-on-paste="addOnPaste"
      :disabled="disabled"
      :control-props="{ 'aria-label': 'Add tag', placeholder: 'Add a tag' }"
      class="w-120 lt-md:w-full"
    />
  </div>
</template>
