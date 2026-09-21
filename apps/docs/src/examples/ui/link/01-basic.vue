<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SInput, SLink, SSelect, SSwitch } from '@vean/ui';
import type { SelectOptionData } from '@vean/ui';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * `target` 的字面量分支与 `LinkProps['target']` 保持一致；ui 包没有单独导出这个联合，
 * 这里用本地字面量，不动 packages。
 */
type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  mode: 'href' | 'to';
  text: string;
  href: string;
  target: LinkTarget;
  external: boolean;
  disabled: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  mode: 'href',
  text: 'SoybeanJS',
  href: 'https://soybeanjs.cn',
  target: '_blank',
  external: false,
  disabled: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免多份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const MODE_KEYS: readonly CustomizerState['mode'][] = ['href', 'to'];
const TARGET_KEYS: readonly LinkTarget[] = ['_blank', '_self', '_parent', '_top'];

const modeItems: SelectOptionData<CustomizerState['mode']>[] = toOptions(MODE_KEYS);
const targetItems: SelectOptionData<LinkTarget>[] = toOptions(TARGET_KEYS);

const mode = shallowRef(DEFAULTS.mode);
const text = shallowRef(DEFAULTS.text);
const href = shallowRef(DEFAULTS.href);
const target = shallowRef(DEFAULTS.target);
const external = shallowRef(DEFAULTS.external);
const disabled = shallowRef(DEFAULTS.disabled);

const reset = (): void => {
  mode.value = DEFAULTS.mode;
  text.value = DEFAULTS.text;
  href.value = DEFAULTS.href;
  target.value = DEFAULTS.target;
  external.value = DEFAULTS.external;
  disabled.value = DEFAULTS.disabled;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="mode">
        <SSelect v-model="mode" :items="modeItems" :trigger-props="{ 'aria-label': 'Mode' }" class="w-25" />
      </FieldItem>
      <FieldItem label="text">
        <SInput v-model="text" aria-label="Text" placeholder="Link text" />
      </FieldItem>
      <FieldItem label="href">
        <SInput v-model="href" aria-label="Href" placeholder="https:// or /route" />
      </FieldItem>
      <FieldItem label="target">
        <SSelect v-model="target" :items="targetItems" :trigger-props="{ 'aria-label': 'Target' }" class="w-30" />
      </FieldItem>
      <FieldItem label="external">
        <div class="h-8 flex items-center">
          <SSwitch v-model="external" :control-props="{ 'aria-label': 'External' }" />
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

  <div class="flex items-center justify-center w-full">
    <SLink v-if="mode === 'to'" class="max-w-2xl" :to="href" :disabled="disabled">{{ text }}</SLink>
    <SLink v-else :href="href" :target="target" :external="external" :disabled="disabled">{{ text }}</SLink>
  </div>
</template>
