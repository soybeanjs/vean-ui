<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import {
  SBreadcrumb,
  SButtonIcon,
  SDropdownMenu,
  SIcon,
  SLayout,
  SLayoutTrigger,
  SSelect,
  SSwitch,
  SSeparator,
  STreeMenu,
  STreeMenuStyledItem
} from '@vean/ui';
import type {
  DataOrientation,
  BreadcrumbOptionData,
  LayoutCollapsible,
  LayoutSide,
  LayoutVariant,
  LayoutScrollBehavior,
  MenuOptionData,
  SelectOptionData,
  ThemeSize
} from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';
import { treeMenuItems } from '../tree-menu/data';

/**
 * Opt in to the gallery's out-of-frame region: these controls configure the demo,
 * they are not part of the viewport being simulated. Left inside the frame they
 * wrap into twice as many rows on the mobile device and crowd out the layout
 * itself.
 */
interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。
 *
 * 取值即 `SLayout` 自身各属性的默认值，`reset` 回到这份快照，所以它是常量而不是状态。
 *
 * `fullContent` 由框内 tab 区的开关驱动（放到框外会被它自己盖住），这里只保留默认值，
 * 让 `reset` 能一并还原。`isMobile` 刻意不暴露：布局跟随视口，demo 不写任何媒体查询
 * 就能在移动端收进抽屉。
 */
interface CustomizerState {
  orientation: DataOrientation;
  side: LayoutSide;
  size: ThemeSize;
  variant: LayoutVariant;
  collapsible: LayoutCollapsible;
  scrollBehavior: LayoutScrollBehavior;
  open: boolean;
  sidebarVisible: boolean;
  headerVisible: boolean;
  tabVisible: boolean;
  footerVisible: boolean;
  fixedTop: boolean;
  fixedFooter: boolean;
  stretchFooter: boolean;
  fullContent: boolean;
  framework: string;
}

const DEFAULTS: CustomizerState = {
  orientation: 'horizontal',
  side: 'left',
  size: 'md',
  variant: 'sidebar',
  collapsible: 'icon',
  scrollBehavior: 'wrapper',
  open: true,
  sidebarVisible: true,
  headerVisible: true,
  tabVisible: true,
  footerVisible: true,
  fixedTop: true,
  fixedFooter: false,
  stretchFooter: true,
  fullContent: false,
  framework: 'soybean-unify'
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免多份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];
const SIDE_KEYS: readonly LayoutSide[] = ['left', 'right'];
const VARIANT_KEYS: readonly LayoutVariant[] = ['sidebar', 'inset', 'floating'];
const COLLAPSIBLE_KEYS: readonly LayoutCollapsible[] = ['icon', 'offcanvas'];
const SCROLL_BEHAVIOR_KEYS: readonly LayoutScrollBehavior[] = ['content', 'wrapper'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const sideItems: SelectOptionData<LayoutSide>[] = toOptions(SIDE_KEYS);
const variantItems: SelectOptionData<LayoutVariant>[] = toOptions(VARIANT_KEYS);
const collapsibleItems: SelectOptionData<LayoutCollapsible>[] = toOptions(COLLAPSIBLE_KEYS);
const scrollBehaviorItems: SelectOptionData<LayoutScrollBehavior>[] = toOptions(SCROLL_BEHAVIOR_KEYS);

const frameworks = [
  {
    label: 'Soybean Unify',
    value: 'soybean-unify',
    icon: 'lucide:activity'
  },
  {
    label: 'Soybean Admin',
    value: 'soybean-admin',
    icon: 'lucide:audio-waveform'
  },
  {
    label: 'Soybean Studio',
    value: 'soybean-studio',
    icon: 'lucide:command'
  }
] satisfies MenuOptionData<string>[];

const breadcrumbItems: BreadcrumbOptionData[] = [
  {
    label: 'Components',
    value: 'components',
    icon: 'lucide:component'
  },
  {
    label: 'Breadcrumb',
    value: 'breadcrumb',
    icon: 'lucide:dock'
  }
];

const orientation = shallowRef(DEFAULTS.orientation);
const side = shallowRef(DEFAULTS.side);
const size = shallowRef(DEFAULTS.size);
const variant = shallowRef(DEFAULTS.variant);
const collapsible = shallowRef(DEFAULTS.collapsible);
const scrollBehavior = shallowRef(DEFAULTS.scrollBehavior);
const open = shallowRef(DEFAULTS.open);
const sidebarVisible = shallowRef(DEFAULTS.sidebarVisible);
const headerVisible = shallowRef(DEFAULTS.headerVisible);
const tabVisible = shallowRef(DEFAULTS.tabVisible);
const footerVisible = shallowRef(DEFAULTS.footerVisible);
const fixedTop = shallowRef(DEFAULTS.fixedTop);
const fixedFooter = shallowRef(DEFAULTS.fixedFooter);
const stretchFooter = shallowRef(DEFAULTS.stretchFooter);
const fullContent = shallowRef(DEFAULTS.fullContent);
const framework = shallowRef(DEFAULTS.framework);

const activeFramework = computed(() => frameworks.find(item => item.value === framework.value)!);

function setActiveFramework(item: MenuOptionData<string>) {
  framework.value = item.value;
}

/**
 * `fullContent` 把内容区钉成覆盖整个视口的层：此时框外的控制区被它盖住，指针点不到开关，
 * 只有键盘还能触发。隐藏 tab 就一并退出 `fullContent`，否则「tab 出口没了 + 面板被盖住」
 * 会让预览无路可退。
 */
watch(tabVisible, visible => {
  if (!visible) {
    fullContent.value = false;
  }
});

function toggleFullContent() {
  fullContent.value = !fullContent.value;
}

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  side.value = DEFAULTS.side;
  size.value = DEFAULTS.size;
  variant.value = DEFAULTS.variant;
  collapsible.value = DEFAULTS.collapsible;
  scrollBehavior.value = DEFAULTS.scrollBehavior;
  open.value = DEFAULTS.open;
  sidebarVisible.value = DEFAULTS.sidebarVisible;
  headerVisible.value = DEFAULTS.headerVisible;
  tabVisible.value = DEFAULTS.tabVisible;
  footerVisible.value = DEFAULTS.footerVisible;
  fixedTop.value = DEFAULTS.fixedTop;
  fixedFooter.value = DEFAULTS.fixedFooter;
  stretchFooter.value = DEFAULTS.stretchFooter;
  fullContent.value = DEFAULTS.fullContent;
  framework.value = DEFAULTS.framework;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="side">
        <SSelect v-model="side" :items="sideItems" :trigger-props="{ 'aria-label': 'Side' }" class="w-30" />
      </FieldItem>
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-30" />
      </FieldItem>
      <FieldItem label="collapsible">
        <SSelect
          v-model="collapsible"
          :items="collapsibleItems"
          :trigger-props="{ 'aria-label': 'Collapsible' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-30" />
      </FieldItem>
      <FieldItem label="scrollBehavior">
        <SSelect
          v-model="scrollBehavior"
          :items="scrollBehaviorItems"
          :trigger-props="{ 'aria-label': 'Scroll behavior' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="fixedTop">
        <div class="h-8 flex items-center">
          <SSwitch v-model="fixedTop" :control-props="{ 'aria-label': 'Fixed top' }" />
        </div>
      </FieldItem>
      <FieldItem label="fixedFooter">
        <div class="h-8 flex items-center">
          <SSwitch v-model="fixedFooter" :control-props="{ 'aria-label': 'Fixed footer' }" />
        </div>
      </FieldItem>
      <FieldItem label="stretchFooter">
        <div class="h-8 flex items-center">
          <SSwitch v-model="stretchFooter" :control-props="{ 'aria-label': 'Stretch footer' }" />
        </div>
      </FieldItem>
      <FieldItem label="open">
        <div class="h-8 flex items-center">
          <SSwitch v-model="open" :control-props="{ 'aria-label': 'Open' }" />
        </div>
      </FieldItem>
      <FieldItem label="sidebarVisible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="sidebarVisible" :control-props="{ 'aria-label': 'Sidebar visible' }" />
        </div>
      </FieldItem>
      <FieldItem label="headerVisible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="headerVisible" :control-props="{ 'aria-label': 'Header visible' }" />
        </div>
      </FieldItem>
      <FieldItem label="tabVisible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="tabVisible" :control-props="{ 'aria-label': 'Tab visible' }" />
        </div>
      </FieldItem>
      <FieldItem label="footerVisible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="footerVisible" :control-props="{ 'aria-label': 'Footer visible' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="h-120 border border-border border-solid rounded-md">
    <SLayout
      v-model:open="open"
      :size="size"
      :orientation="orientation"
      :side="side"
      :variant="variant"
      :collapsible="collapsible"
      :full-content="fullContent"
      :scroll-behavior="scrollBehavior"
      :sidebar-visible="sidebarVisible"
      :header-visible="headerVisible"
      :tab-visible="tabVisible"
      :footer-visible="footerVisible"
      :fixed-top="fixedTop"
      :fixed-footer="fixedFooter"
      :stretch-footer="stretchFooter"
      :ui="{
        header: 'border-b border-border',
        tab: 'border-b border-border',
        content: 'px-[--sl-spacing]',
        footer: 'border-t border-border'
      }"
    >
      <template #sidebar="{ collapsed, collapsedSidebarWidth }">
        <STreeMenu
          :size="size"
          :side="side"
          :collapsed="collapsed"
          :items="treeMenuItems"
          :collapsed-width="collapsedSidebarWidth"
        >
          <template v-if="orientation === 'horizontal'" #top>
            <SDropdownMenu
              :size="size"
              :side="collapsed ? 'right' : 'bottom'"
              :items="frameworks"
              :ui="{ popup: 'w-[var(--vean-popper-anchor-width)]' }"
              @select="setActiveFramework"
            >
              <template #trigger>
                <STreeMenuStyledItem>
                  <SIcon :icon="activeFramework.icon" class="text-primary" />
                  <span class="truncate font-medium">{{ activeFramework.label }}</span>
                  <SIcon icon="lucide:chevrons-up-down" class="ms-auto" />
                </STreeMenuStyledItem>
              </template>
            </SDropdownMenu>
          </template>
        </STreeMenu>
      </template>
      <template #header>
        <div class="w-full flex items-center gap-2">
          <SDropdownMenu
            v-if="orientation === 'vertical'"
            :size="size"
            side="bottom"
            :items="frameworks"
            @select="setActiveFramework"
          >
            <template #trigger>
              <div class="flex-y-center gap-3 w-[--vean-sidebar-width] px-[--sl-spacing] cursor-pointer">
                <SIcon :icon="activeFramework.icon" class="text-primary" />
                <span class="truncate font-medium">{{ activeFramework.label }}</span>
                <SIcon icon="lucide:chevrons-up-down" class="ms-auto" />
              </div>
            </template>
          </SDropdownMenu>
          <SLayoutTrigger v-if="side === 'left'" class="ml-4" />
          <SSeparator orientation="vertical" class="h-4" />
          <SBreadcrumb :items="breadcrumbItems" :size="size" :ui="{ list: 'gap-2' }" />
          <SLayoutTrigger v-if="side === 'right'" class="ms-auto" />
        </div>
      </template>
      <template #tab>
        <div class="flex-y-center justify-between h-full px-[--sl-spacing]">
          <span>This is Tab</span>
          <SButtonIcon :icon="fullContent ? 'lucide:shrink' : 'lucide:expand'" @click="toggleFullContent" />
        </div>
      </template>
      <div>
        <p v-for="i in 100" :key="i">This is Content {{ i }}</p>
      </div>
      <template #footer>
        <div class="flex-y-center h-full px-[--sl-spacing]">This is Footer</div>
      </template>
    </SLayout>
  </div>
</template>
