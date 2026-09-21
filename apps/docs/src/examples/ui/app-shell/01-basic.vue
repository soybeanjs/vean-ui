<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SAppShell, SButtonIcon, SIcon, SSelect, SSwitch } from '@vean/ui';
import type {
  AppShellLogoPlacement,
  AppShellMode,
  AppShellProps,
  LayoutScrollBehavior,
  LayoutSide,
  LayoutVariant,
  PageTabsOptionData,
  SelectOptionData,
  ThemeSize,
  TreeMenuExpandStrategy
} from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';
import { appShellItems } from './menu';

/**
 * Opt in to the gallery's out-of-frame region: these controls configure the demo,
 * they are not part of the viewport being simulated. Left inside the frame they
 * crowd out the shell itself on the mobile device.
 */
interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/**
 * 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。
 *
 * 前一段是外壳自身的属性；后一段是 `layoutProps` —— 外壳转发给内部 `SLayout` 的
 * 布局配置。外壳自有的骨架选项（`orientation` / `sidebarVisible` / `collapsible` /
 * `isMobile` / `pxToRem`）由 `mode` 推导并在内部覆盖，因此不作为可配置项暴露。
 *
 * `fullContent` 也刻意不在此列：它把内容区变成 `fixed inset-0` 的全屏层，会盖住框外的
 * 控制区、连自己的开关一起挡住。该能力由带壳内开关的 layout 基础示例演示。
 */
interface CustomizerState {
  mode: AppShellMode;
  side: LayoutSide;
  size: ThemeSize;
  logoPlacement: AppShellLogoPlacement;
  expandStrategy: TreeMenuExpandStrategy;
  open: boolean;
  triggerVisible: boolean;
  breadcrumbVisible: boolean;
  variant: LayoutVariant;
  scrollBehavior: LayoutScrollBehavior;
  fixedTop: boolean;
  fixedFooter: boolean;
  stretchFooter: boolean;
  headerVisible: boolean;
  tabVisible: boolean;
  footerVisible: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态；取值即各组件自身的默认值。 */
const DEFAULTS: CustomizerState = {
  mode: 'sidebar',
  side: 'left',
  size: 'md',
  logoPlacement: 'auto',
  expandStrategy: 'selected',
  open: true,
  triggerVisible: true,
  breadcrumbVisible: true,
  variant: 'sidebar',
  scrollBehavior: 'content',
  fixedTop: true,
  fixedFooter: true,
  stretchFooter: true,
  headerVisible: true,
  tabVisible: true,
  footerVisible: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免六份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const MODE_KEYS: readonly AppShellMode[] = [
  'sidebar',
  'top',
  'dual-vertical',
  'vertical-horizontal',
  'horizontal-vertical',
  'horizontal-dual-vertical'
];
const SIDE_KEYS: readonly LayoutSide[] = ['left', 'right'];
const LOGO_PLACEMENT_KEYS: readonly AppShellLogoPlacement[] = ['auto', 'sidebar', 'sidebar-bottom', 'header'];
const EXPAND_STRATEGY_KEYS: readonly TreeMenuExpandStrategy[] = ['selected', 'keep'];
const VARIANT_KEYS: readonly LayoutVariant[] = ['sidebar', 'floating', 'inset'];
const SCROLL_BEHAVIOR_KEYS: readonly LayoutScrollBehavior[] = ['content', 'wrapper'];

const modeItems: SelectOptionData<AppShellMode>[] = toOptions(MODE_KEYS);
const sideItems: SelectOptionData<LayoutSide>[] = toOptions(SIDE_KEYS);
const logoPlacementItems: SelectOptionData<AppShellLogoPlacement>[] = toOptions(LOGO_PLACEMENT_KEYS);
const expandStrategyItems: SelectOptionData<TreeMenuExpandStrategy>[] = toOptions(EXPAND_STRATEGY_KEYS);
const variantItems: SelectOptionData<LayoutVariant>[] = toOptions(VARIANT_KEYS);
const scrollBehaviorItems: SelectOptionData<LayoutScrollBehavior>[] = toOptions(SCROLL_BEHAVIOR_KEYS);

const tabs: PageTabsOptionData[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: 'lucide:layout-dashboard',
    pinned: true,
    hidePinnedIcon: true
  },
  {
    value: 'projects',
    label: 'Projects',
    icon: 'lucide:folder-kanban'
  }
];

/**
 * 预览内容行数：内容必须高于演示框，`scrollBehavior` / `fixedTop` / `fixedFooter`
 * 这些滚动相关属性才有可观察的差异。
 */
const CONTENT_ROWS = 40;

const active = shallowRef('overview');

const mode = shallowRef(DEFAULTS.mode);
const side = shallowRef(DEFAULTS.side);
const size = shallowRef(DEFAULTS.size);
const logoPlacement = shallowRef(DEFAULTS.logoPlacement);
const expandStrategy = shallowRef(DEFAULTS.expandStrategy);
const open = shallowRef(DEFAULTS.open);
const triggerVisible = shallowRef(DEFAULTS.triggerVisible);
const breadcrumbVisible = shallowRef(DEFAULTS.breadcrumbVisible);

const variant = shallowRef(DEFAULTS.variant);
const scrollBehavior = shallowRef(DEFAULTS.scrollBehavior);
const fixedTop = shallowRef(DEFAULTS.fixedTop);
const fixedFooter = shallowRef(DEFAULTS.fixedFooter);
const stretchFooter = shallowRef(DEFAULTS.stretchFooter);
const headerVisible = shallowRef(DEFAULTS.headerVisible);
const tabVisible = shallowRef(DEFAULTS.tabVisible);
const footerVisible = shallowRef(DEFAULTS.footerVisible);

/** 转发给内部 `SLayout` 的一组配置：整体派生并保持稳定引用，避免每次渲染都重建对象。 */
const layoutConfig = computed<NonNullable<AppShellProps['layoutProps']>>(() => ({
  variant: variant.value,
  scrollBehavior: scrollBehavior.value,
  fixedTop: fixedTop.value,
  fixedFooter: fixedFooter.value,
  stretchFooter: stretchFooter.value,
  headerVisible: headerVisible.value,
  tabVisible: tabVisible.value,
  footerVisible: footerVisible.value
}));

const reset = (): void => {
  mode.value = DEFAULTS.mode;
  side.value = DEFAULTS.side;
  size.value = DEFAULTS.size;
  logoPlacement.value = DEFAULTS.logoPlacement;
  expandStrategy.value = DEFAULTS.expandStrategy;
  open.value = DEFAULTS.open;
  triggerVisible.value = DEFAULTS.triggerVisible;
  breadcrumbVisible.value = DEFAULTS.breadcrumbVisible;
  variant.value = DEFAULTS.variant;
  scrollBehavior.value = DEFAULTS.scrollBehavior;
  fixedTop.value = DEFAULTS.fixedTop;
  fixedFooter.value = DEFAULTS.fixedFooter;
  stretchFooter.value = DEFAULTS.stretchFooter;
  headerVisible.value = DEFAULTS.headerVisible;
  tabVisible.value = DEFAULTS.tabVisible;
  footerVisible.value = DEFAULTS.footerVisible;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="mode">
        <SSelect v-model="mode" :items="modeItems" :trigger-props="{ 'aria-label': 'Mode' }" class="w-50" />
      </FieldItem>
      <FieldItem label="side">
        <SSelect v-model="side" :items="sideItems" :trigger-props="{ 'aria-label': 'Side' }" class="w-25" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-25" />
      </FieldItem>
      <FieldItem label="scrollBehavior">
        <SSelect
          v-model="scrollBehavior"
          :items="scrollBehaviorItems"
          :trigger-props="{ 'aria-label': 'Scroll behavior' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="logoPlacement">
        <SSelect
          v-model="logoPlacement"
          :items="logoPlacementItems"
          :trigger-props="{ 'aria-label': 'Logo placement' }"
          class="w-40"
        />
      </FieldItem>
      <FieldItem label="expandStrategy">
        <SSelect
          v-model="expandStrategy"
          :items="expandStrategyItems"
          :trigger-props="{ 'aria-label': 'Expand strategy' }"
          class="w-30"
        />
      </FieldItem>
      <FieldItem label="open">
        <div class="h-8 flex items-center">
          <SSwitch v-model="open" :control-props="{ 'aria-label': 'Open' }" />
        </div>
      </FieldItem>
      <FieldItem label="triggerVisible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="triggerVisible" :control-props="{ 'aria-label': 'Trigger visible' }" />
        </div>
      </FieldItem>
      <FieldItem label="breadcrumbVisible">
        <div class="h-8 flex items-center">
          <SSwitch v-model="breadcrumbVisible" :control-props="{ 'aria-label': 'Breadcrumb visible' }" />
        </div>
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

  <div class="h-120 border border-border border-solid rounded-md overflow-hidden">
    <SAppShell
      v-model="active"
      v-model:open="open"
      :mode="mode"
      :side="side"
      :size="size"
      :logo-placement="logoPlacement"
      :expand-strategy="expandStrategy"
      :trigger-visible="triggerVisible"
      :breadcrumb-visible="breadcrumbVisible"
      :layout-props="layoutConfig"
      :items="appShellItems"
      :tabs="tabs"
    >
      <template #logo>
        <SIcon icon="lucide:hexagon" class="size-6 text-primary" />
      </template>
      <template #title>
        <span class="truncate font-semibold">Vean UI</span>
      </template>
      <template #header-end>
        <SButtonIcon icon="lucide:bell" />
        <SButtonIcon icon="lucide:sun-medium" />
      </template>
      <template #footer>© 2026 Vean UI</template>
      <div class="p-4">
        <p class="text-muted-foreground">Active menu: {{ active }}</p>
        <p v-for="row in CONTENT_ROWS" :key="row" class="mt-2 text-muted-foreground text-sm">Content row {{ row }}</p>
      </div>
    </SAppShell>
  </div>
</template>
