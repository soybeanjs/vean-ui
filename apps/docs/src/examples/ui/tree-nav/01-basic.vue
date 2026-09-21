<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SInput, SSelect, SSwitch, STreeNav } from '@vean/ui';
import type { SelectOptionData, ThemeSize, TreeNavOptionData } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  size: ThemeSize;
  trigger: 'click' | 'hover';
  showArrow: boolean;
  disabled: boolean;
  collapsible: boolean;
  moreLabel: string;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  size: 'md',
  trigger: 'hover',
  showArrow: false,
  disabled: false,
  collapsible: false,
  moreLabel: 'More'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免四份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

/** `trigger` 的类型来自 headless 的 `DropdownMenuTriggerType`，UI 包未单独导出别名，这里用本地字面量联合。 */
const TRIGGER_KEYS: readonly ('click' | 'hover')[] = ['click', 'hover'];

const triggerItems: SelectOptionData<CustomizerState['trigger']>[] = toOptions(TRIGGER_KEYS);

const size = shallowRef(DEFAULTS.size);
const trigger = shallowRef(DEFAULTS.trigger);
const showArrow = shallowRef(DEFAULTS.showArrow);
const disabled = shallowRef(DEFAULTS.disabled);
const collapsible = shallowRef(DEFAULTS.collapsible);
const moreLabel = shallowRef(DEFAULTS.moreLabel);

const reset = (): void => {
  size.value = DEFAULTS.size;
  trigger.value = DEFAULTS.trigger;
  showArrow.value = DEFAULTS.showArrow;
  disabled.value = DEFAULTS.disabled;
  collapsible.value = DEFAULTS.collapsible;
  moreLabel.value = DEFAULTS.moreLabel;
};

const items: TreeNavOptionData[] = [
  {
    value: 'docs',
    label: 'Docs',
    icon: 'lucide:book',
    children: [
      { value: 'getting-started', label: 'Getting Started', icon: 'lucide:rocket' },
      {
        value: 'components',
        label: 'Components',
        icon: 'lucide:blocks',
        children: [
          { value: 'button', label: 'Button' },
          { value: 'input', label: 'Input' }
        ]
      },
      { value: 'themes', label: 'Themes', icon: 'lucide:palette', disabled: true }
    ]
  },
  {
    value: 'blog',
    label: 'Blog',
    icon: 'lucide:newspaper',
    children: [
      { value: 'announcements', label: 'Announcements' },
      { value: 'changelog', label: 'Changelog', shortcut: '⌘K' }
    ]
  },
  { value: 'pricing', label: 'Pricing', icon: 'lucide:credit-card' },
  {
    value: 'github',
    label: 'GitHub',
    icon: 'lucide:github',
    href: 'https://github.com/soybeanjs/vean-ui'
  },
  { value: 'discord', label: 'Discord', icon: 'lucide:message-circle', href: 'https://discord.gg/soybeanjs' },
  { value: 'releases', label: 'Releases', icon: 'lucide:tags' },
  { value: 'faq', label: 'FAQ', icon: 'lucide:help-circle' }
];

/** 折叠模式需要一个确实装不下所有顶层的窄容器，溢出项才会收进尾部 "more" 弹出分支。 */
const previewBoxClass = computed(() => (collapsible.value ? 'w-100 overflow-hidden rounded-md border p-2' : ''));
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="trigger">
        <SSelect v-model="trigger" :items="triggerItems" :trigger-props="{ 'aria-label': 'Trigger' }" class="w-28" />
      </FieldItem>
      <FieldItem label="moreLabel">
        <SInput v-model="moreLabel" aria-label="More label" placeholder="More" />
      </FieldItem>
      <FieldItem label="showArrow">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showArrow" :control-props="{ 'aria-label': 'Show arrow' }" />
        </div>
      </FieldItem>
      <FieldItem label="disabled">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disabled" :control-props="{ 'aria-label': 'Disabled' }" />
        </div>
      </FieldItem>
      <FieldItem label="collapsible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="collapsible" :control-props="{ 'aria-label': 'Collapsible' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div :class="previewBoxClass">
      <STreeNav
        :size="size"
        :trigger="trigger"
        :show-arrow="showArrow"
        :disabled="disabled"
        :collapsible="collapsible"
        :more-label="moreLabel"
        default-value="getting-started"
        :items="items"
      />
    </div>
  </div>
</template>
