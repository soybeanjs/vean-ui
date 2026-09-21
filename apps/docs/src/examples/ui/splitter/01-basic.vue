<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SSelect, SSplitterGroup, SSplitterPanel, SSplitterResizeHandle, SSwitch } from '@vean/ui';
import type { DataOrientation, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  direction: DataOrientation;
  size: ThemeSize;
  withHandle: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  direction: 'horizontal',
  size: 'md',
  withHandle: true,
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const DIRECTION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];

const directionItems: SelectOptionData<DataOrientation>[] = toOptions(DIRECTION_KEYS);

const direction = shallowRef<DataOrientation>(DEFAULTS.direction);
const size = shallowRef<ThemeSize>(DEFAULTS.size);
const withHandle = shallowRef(DEFAULTS.withHandle);
const disabled = shallowRef(DEFAULTS.disabled);

const reset = (): void => {
  direction.value = DEFAULTS.direction;
  size.value = DEFAULTS.size;
  withHandle.value = DEFAULTS.withHandle;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="direction">
        <SSelect
          v-model="direction"
          :items="directionItems"
          :trigger-props="{ 'aria-label': 'Direction' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="withHandle">
        <div class="h-8 flex items-center">
          <SSwitch v-model="withHandle" :control-props="{ 'aria-label': 'With handle' }" />
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

  <SSplitterGroup :direction="direction" :size="size" class="h-60 rd-md border">
    <SSplitterPanel :default-size="25">
      <div class="flex h-full items-center justify-center bg-muted/40 text-sm text-muted-foreground">Navigation</div>
    </SSplitterPanel>
    <SSplitterResizeHandle
      :with-handle="withHandle"
      :disabled="disabled"
      aria-label="Resize navigation and content panels"
    />
    <SSplitterPanel :default-size="50">
      <div class="flex h-full items-center justify-center bg-background text-sm">Content</div>
    </SSplitterPanel>
    <SSplitterResizeHandle
      :with-handle="withHandle"
      :disabled="disabled"
      aria-label="Resize content and details panels"
    />
    <SSplitterPanel :default-size="25">
      <div class="flex h-full items-center justify-center bg-muted/40 text-sm text-muted-foreground">Details</div>
    </SSplitterPanel>
  </SSplitterGroup>
</template>
