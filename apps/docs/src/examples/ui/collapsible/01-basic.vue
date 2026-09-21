<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SCollapsible, SCollapsibleContent, SCollapsibleTrigger, SSelect, SSwitch } from '@vean/ui';
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
  disabled: boolean;
  unmountOnHide: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  disabled: false,
  unmountOnHide: true
};

const size = shallowRef(DEFAULTS.size);
const disabled = shallowRef(DEFAULTS.disabled);
const unmountOnHide = shallowRef(DEFAULTS.unmountOnHide);

const reset = (): void => {
  size.value = DEFAULTS.size;
  disabled.value = DEFAULTS.disabled;
  unmountOnHide.value = DEFAULTS.unmountOnHide;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem label="unmountOnHide">
        <div class="h-8 flex items-center">
          <SSwitch v-model="unmountOnHide" :control-props="{ 'aria-label': 'Unmount on hide' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SCollapsible
      v-slot="{ open }"
      class="w-350px lt-md:w-auto space-y-2"
      :size="size"
      :disabled="disabled"
      :unmount-on-hide="unmountOnHide"
      :ui="{
        content: 'space-y-2'
      }"
    >
      <div class="flex-y-center justify-between px-2 space-x-4">
        <div class="text-sm font-semibold">@soybeanjs starred 3 repositories</div>
        <SCollapsibleTrigger as-child>
          <SButtonIcon :icon="open ? 'lucide:chevron-up' : 'lucide:chevron-down'" />
        </SCollapsibleTrigger>
      </div>
      <div class="border rounded-md px-4 py-3 text-sm font-mono">vean-aria</div>
      <SCollapsibleContent>
        <div class="border rounded-md px-4 py-3 text-sm font-mono">vean-ui</div>
        <div class="border rounded-md px-4 py-3 text-sm font-mono">soybean-market</div>
      </SCollapsibleContent>
    </SCollapsible>
  </div>
</template>
