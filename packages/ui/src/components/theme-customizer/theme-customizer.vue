<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import {
  THEME_RADIUS,
  THEME_FONT_HEADING,
  THEME_FONT_MONO,
  THEME_FONT_SANS,
  THEME_FONT_SERIF,
  themeRadiusKeys,
  themeSizeKeys,
  themeSpacingKeys,
  themeFontHeadingKeys,
  themeFontMonoKeys,
  themeFontSansKeys,
  themeFontSerifKeys
} from '@vean/theme';
import type {
  FeedbackSchemeKey,
  PaletteKey,
  SemanticToken,
  SurfaceStyle,
  ThemeFont,
  ThemeRadius,
  ThemeSize,
  ThemeSpacing
} from '@vean/theme';
import { themeCustomizerVariants } from '@/styles/theme-customizer';
import { useThemeSettings } from '@/theme/use-theme-settings';
import { useThemeVariants } from '@/theme/use-theme-variants';
import SButton from '../button/button.vue';
import { useTheme } from '../config-provider/use-theme';
import SPalettePicker from '../palette-picker/palette-picker.vue';
import SSegment from '../segment/segment.vue';
import type { SegmentOptionData } from '../segment/types';
import SSelect from '../select/select.vue';
import type { SelectOptionData } from '../select/types';
import SSlider from '../slider/slider.vue';
import STabs from '../tabs/tabs.vue';
import type { TabsOptionData } from '../tabs/types';
import ThemeModeSegment from '../theme-mode-segment/theme-mode-segment.vue';
import BasePaletteSelect from './base-palette-select.vue';
import FeedbackSchemaSelect from './feedback-schema-select.vue';
import PrimaryPaletteSelect from './primary-palette-select.vue';
import SectionItem from './section-item.vue';
import type { ThemeCustomizerProps, ThemeCustomizerSection } from './types';
import { useThemeCustomizerLocale } from './use-locale';

defineOptions({
  name: 'SThemeCustomizer'
});

const props = withDefaults(defineProps<ThemeCustomizerProps>(), {
  sections: () => ['mode', 'palette', 'radius', 'size', 'spacing', 'font', 'scheme', 'advanced'],
  size: 'md',
  persist: true,
  showActions: true
});

// —— 外壳样式：单一 recipe 出全部 slot，`ui.root` 是外层盒子的唯一出口 ——
const ui = computed(() => themeCustomizerVariants({}, props.ui, { root: props.class }));

// —— 文案国际化：跟随 ConfigProvider.locale，切换语言即时刷新 ——
const { resolveLabel: resolveBaseLabel, resolveOption } = useThemeCustomizerLocale();

const resolveLabel = (key: string): string => (props.labelResolver ? props.labelResolver(key) : resolveBaseLabel(key));

// —— 运行时主题上下文 ——
const theme = useTheme('ThemeCustomizer');

// —— 状态核心：初始化自当前主题，改动即时 commit 到运行时 ——
// 持久化由 SConfigProvider 的单一信封写入者负责（apply → setThemeState → 派生
// 载荷写入 `__VEAN_THEME`），这里不再自行写存储，避免多写者竞争。
const settings = useThemeSettings({
  initial: {
    ...theme.theme.value,
    mode: theme.mode.value
  },
  apply: state => {
    theme.setThemeState(state);
  }
});

// —— 基础 token 绑定 ——
// mode 偏好由 <ThemeModeSegment> 直接绑定主题上下文，此处无需重复状态。
const baseValue = computed<PaletteKey>({
  get: () => settings.state.value.base ?? 'zinc',
  set: value => settings.setState({ base: value })
});

const primaryValue = computed<PaletteKey>({
  get: () => settings.state.value.primary ?? 'indigo',
  set: value => settings.setState({ primary: value })
});

const radiusValue = computed<ThemeRadius>({
  get: () => (settings.state.value.radius ?? 'md') as ThemeRadius,
  set: value => settings.setState({ radius: value })
});
const radiusIndex = computed(() => [themeRadiusKeys.indexOf(radiusValue.value)]);
const radiusFromIndex = computed(() => themeRadiusKeys[radiusIndex.value[0]] ?? 'md');
const radiusLabel = computed(() => `${THEME_RADIUS[radiusFromIndex.value]}`);
const setRadiusValue = (values: number[]) => {
  const index = values[0];
  radiusValue.value = themeRadiusKeys[index] ?? 'md';
};

const sizeValue = computed<ThemeSize>({
  get: () => (settings.state.value.size ?? 'md') as ThemeSize,
  set: value => settings.setState({ size: value })
});

// 间距刻度：只动 padding / margin / gap（与 `size` 正交，不改字号与控件高度），
// 与 size 同一下拉形态，选项走 i18n（compact / default / relaxed / spacious）。
const spacingValue = computed<ThemeSpacing>({
  get: () => (settings.state.value.spacing ?? 'default') as ThemeSpacing,
  set: value => settings.setState({ spacing: value })
});

const feedbackValue = computed<FeedbackSchemeKey>({
  get: () => settings.state.value.feedback ?? 'classic',
  set: value => settings.setState({ feedback: value })
});

const borderOpacityValue = computed<number>({
  get: () => settings.state.value.borderOpacity ?? 1,
  set: value => settings.setState({ borderOpacity: value })
});

const surfaceStyleValue = computed<SurfaceStyle>({
  get: () => settings.state.value.surfaceStyle ?? 'layered',
  set: value => settings.setState({ surfaceStyle: value })
});

const surfaceStyleOptions = computed<SegmentOptionData<SurfaceStyle>[]>(() => [
  { label: resolveOption('surfaceStyle', 'layered'), value: 'layered' },
  { label: resolveOption('surfaceStyle', 'flat'), value: 'flat' }
]);

const sizeOptions = computed<SelectOptionData<ThemeSize>[]>(() =>
  themeSizeKeys.map(key => ({
    label: resolveOption('size', key),
    value: key
  }))
);

const spacingOptions = computed<SelectOptionData<ThemeSpacing>[]>(() =>
  themeSpacingKeys.map(key => ({
    label: resolveOption('spacing', key),
    value: key
  }))
);

// —— 字体四臂：sans / heading / mono / serif ——
// 对齐 shadcn 的字体模型：三条**根角色**（`--font-sans` / `--font-serif` /
// `--font-mono`）+ 一条独立的 `--font-heading`（可指向任意字族）。四臂只是同一套
// 逻辑作用在不同的预设表上，所以用一张表驱动，不逐臂复制粘贴。
// system → undefined（引擎回落 LITERAL_DEFAULTS）；字体文件的加载不由组件负责。
/** 反查预设键：家族名 → 表内 key；未命中保留原字符串（自定义 stack），空值回落 `system`。 */
const reverseFontKey = (table: Record<string, string | undefined>, family: string | undefined): string => {
  if (!family) {
    return 'system';
  }

  const hit = Object.entries(table).find(([, value]) => value === family);

  return hit?.[0] ?? family;
};

/** 合并写入 `font` 的某一臂；值为 `undefined` 时删掉该臂以便回落默认。 */
const setFontArm = (arm: keyof ThemeFont, family: string | undefined): void => {
  const current: ThemeFont = { ...settings.state.value.font };
  Reflect.deleteProperty(current, arm);

  if (family !== undefined) {
    current[arm] = family;
  }

  const hasArm = Object.values(current).some(value => value !== undefined);

  settings.setState({ font: hasArm ? current : undefined });
};

/** 预设键 → 存储值；`system` → undefined；未命中的键按自定义 stack 原样写入。 */
const toFontFamily = (table: Record<string, string | undefined>, key: string): string | undefined =>
  Object.hasOwn(table, key) ? table[key] : key;

/**
 * 四条臂的定义：每条一个引擎选项键、一张预设表、一个文案 key。
 *
 * 顺序即 UI 顺序：先三条根角色（sans / serif / mono），再独立的 heading。
 * `keys` 刻意放宽为 `readonly string[]`：预设键是字面量联合，但这里的「当前值」
 * 可能是一个不在表内的自定义字族（用户手写的 stack），所以两侧都按 string 处理。
 */
const FONT_ARMS: readonly {
  arm: keyof ThemeFont;
  labelKey: string;
  table: Record<string, string | undefined>;
  keys: readonly string[];
}[] = [
  { arm: 'sans', labelKey: 'fontSans', table: THEME_FONT_SANS, keys: themeFontSansKeys },
  { arm: 'serif', labelKey: 'fontSerif', table: THEME_FONT_SERIF, keys: themeFontSerifKeys },
  { arm: 'mono', labelKey: 'fontMono', table: THEME_FONT_MONO, keys: themeFontMonoKeys },
  {
    arm: 'heading',
    labelKey: 'fontHeading',
    table: THEME_FONT_HEADING,
    keys: themeFontHeadingKeys
  }
];

/**
 * 四条臂：每条的当前选择值 + 下拉选项，供模板直接绑定。
 *
 * `value` 是预设键（`system` 表示回落引擎默认），`options` 含「当前自定义家族」
 * 的兜底项。两者都随 `settings.state.font` 响应式刷新。
 */
const fontArms = computed(() =>
  FONT_ARMS.map(({ arm, labelKey, table, keys }) => {
    const selected: string = reverseFontKey(table, settings.state.value.font?.[arm]);
    const options: SelectOptionData<string>[] = keys.map(key => ({
      label: resolveOption('fontFamilies', key),
      value: key
    }));

    if (!keys.includes(selected)) {
      options.push({ label: selected, value: selected });
    }

    return { arm, labelKey, table, value: selected, options };
  })
);

/** 选中某一臂的字族：`system` → 回落默认，其余按预设表/自定义 stack 写回。 */
const selectFontArm = (table: Record<string, string | undefined>, arm: keyof ThemeFont, key: string): void =>
  setFontArm(arm, toFontFamily(table, key));

/** 模板绑定：边框浓度滑块（0 – 100 的百分数 → 0 – 1）。 */
const onBorderOpacityChange = (values: number[]): void => {
  borderOpacityValue.value = (values[0] ?? 0) / 100;
};

// —— 编辑分片：custom（variant 分组）独立选择 light/dark ——
const customMode = ref<'light' | 'dark'>('light');

const variantModeOptions = computed<SegmentOptionData<'light' | 'dark'>[]>(() => [
  { label: resolveOption('mode', 'light'), value: 'light' },
  { label: resolveOption('mode', 'dark'), value: 'dark' }
]);

const variants = useThemeVariants({ settings, mode: customMode });

/** 写入某个 variant token 的 override（配合 `final` 值显示，反映当前派生结果） */
const setVariant = (key: SemanticToken, value: string): void => {
  settings.setOverride(customMode.value, key, value);
};

// —— 顶层 Tabs：Theme（常规设置） / Custom（高级自定义）——
// Custom 同步挂载约 41 个 SPalettePicker（各含完整 SSelect），单帧全量 mount 会卡顿：
// 1) unmountOnHide=false：来回切换不再卸载重建；
// 2) 按组分帧挂载：首屏只出第一组，其余 rAF 追加；
// 3) 进入 Custom 前先触发 derived（resolveThemeMap），避免与 mount 挤在同一帧。
const sectionVisible = (section: ThemeCustomizerSection): boolean => props.sections.includes(section);

type MainTab = 'theme' | 'custom';

const mainTab = ref<MainTab>('theme');

const mainTabs = computed<TabsOptionData[]>(() => [
  { label: resolveLabel('theme'), value: 'theme' },
  { label: resolveLabel('custom'), value: 'custom' }
]);

const mountedGroupCount = shallowRef(0);
let groupMountFrame = 0;

const cancelGroupMount = (): void => {
  if (groupMountFrame) {
    cancelAnimationFrame(groupMountFrame);
    groupMountFrame = 0;
  }
};

const continueGroupMount = (): void => {
  groupMountFrame = 0;

  if (mainTab.value !== 'custom' || !sectionVisible('advanced')) {
    return;
  }

  const total = variants.groups.length;

  if (mountedGroupCount.value >= total) {
    return;
  }

  mountedGroupCount.value += 1;
  groupMountFrame = requestAnimationFrame(continueGroupMount);
};

const startGroupMount = (): void => {
  if (!sectionVisible('advanced')) {
    return;
  }

  // 预热引擎映射表：Theme 页不读 final，首次进 Custom 才会 resolveThemeMap
  void variants.final.value;

  cancelGroupMount();

  if (mountedGroupCount.value === 0) {
    mountedGroupCount.value = 1;
  }

  if (mountedGroupCount.value < variants.groups.length) {
    groupMountFrame = requestAnimationFrame(continueGroupMount);
  }
};

const customGroups = computed(() =>
  sectionVisible('advanced') ? variants.groups.slice(0, mountedGroupCount.value) : []
);

watch(settings.state, () => settings.commit());

watch(mainTab, tab => {
  if (tab === 'custom') {
    startGroupMount();
    return;
  }

  cancelGroupMount();
});

onBeforeUnmount(cancelGroupMount);

// —— mode 偏好由 <ThemeModeSegment> 直接绑定主题上下文（theme.mode），settings.state.mode
//    仅在初始化时快照。若不随 theme.mode 同步，则任何配置改动（如切换 base）触发 commit
//    时会把过期的 settings.state.mode（light）写回 theme，导致 mode 被重置 ——
watch(
  () => theme.mode.value,
  value => {
    settings.setState({ mode: value });
  }
);
</script>

<template>
  <div data-vean-theme-customizer :class="ui.root">
    <!-- 顶层 Tabs：Theme（常规设置） / Custom（高级自定义） -->
    <STabs
      v-model="mainTab"
      :items="mainTabs"
      :size="size"
      :unmount-on-hide="false"
      :ui="{ root: ui.tabs, content: ui.content }"
    >
      <template #content="{ value: mainValue }">
        <!-- Theme 面板：常规设置 + levels -->
        <div v-if="mainValue === 'theme'" :class="ui.panel">
          <!-- mode -->
          <SectionItem v-if="sectionVisible('mode')" :title="resolveLabel('mode')">
            <ThemeModeSegment />
          </SectionItem>

          <!-- palette -->
          <SectionItem v-if="sectionVisible('palette')" :title="resolveLabel('palette')" orientation="vertical">
            <SectionItem :label="resolveLabel('base')">
              <BasePaletteSelect v-model="baseValue" class="w-50" />
            </SectionItem>

            <SectionItem :label="resolveLabel('primary')">
              <PrimaryPaletteSelect v-model="primaryValue" class="w-50" />
            </SectionItem>
          </SectionItem>

          <!-- scheme -->
          <SectionItem v-if="sectionVisible('scheme')" :title="resolveLabel('scheme')" orientation="vertical">
            <SectionItem :label="resolveLabel('feedback')">
              <FeedbackSchemaSelect v-model="feedbackValue" class="w-50" />
            </SectionItem>
            <!-- 图表色不再是 scheme：由 primary 派生（charts 分组在 Custom 面板可逐 token 覆盖） -->
            <!-- 区域（侧栏）不再是 scheme：v2 中它由全局角色镜像而来，逐 token 覆盖在 Custom 面板 -->
          </SectionItem>

          <!-- size -->
          <SectionItem v-if="sectionVisible('size')" :title="resolveLabel('size')">
            <SSelect v-model="sizeValue" :items="sizeOptions" class="w-50" />
          </SectionItem>

          <!-- spacing -->
          <SectionItem v-if="sectionVisible('spacing')" :title="resolveLabel('spacing')">
            <SSelect v-model="spacingValue" :items="spacingOptions" class="w-50" />
          </SectionItem>

          <!-- font -->
          <SectionItem v-if="sectionVisible('font')" :title="resolveLabel('font')" orientation="vertical">
            <SectionItem v-for="item in fontArms" :key="item.arm" :label="resolveLabel(item.labelKey)">
              <SSelect
                :model-value="item.value"
                :items="item.options"
                class="w-50"
                @update:model-value="selectFontArm(item.table, item.arm, $event)"
              />
            </SectionItem>
          </SectionItem>

          <!-- radius -->
          <SectionItem v-if="sectionVisible('radius')" :title="resolveLabel('radius')">
            <div class="w-2/3 flex items-center gap-3">
              <SSlider
                :model-value="radiusIndex"
                :min="0"
                :max="themeRadiusKeys.length - 1"
                :step="1"
                class="w-full"
                @update:model-value="setRadiusValue"
              />
              <span class="w-15 shrink-0 text-right text-xs text-muted-foreground">{{ radiusLabel }}</span>
            </div>
          </SectionItem>

          <!-- border opacity -->
          <SectionItem v-if="sectionVisible('advanced')" :label="resolveLabel('borderOpacity')">
            <div class="w-2/3 flex items-center gap-3">
              <SSlider
                :model-value="[borderOpacityValue * 100]"
                :min="0"
                :max="100"
                :step="5"
                class="w-full"
                @update:model-value="onBorderOpacityChange"
              />
              <span class="w-10 shrink-0 text-right text-xs text-muted-foreground">
                {{ Math.round(borderOpacityValue * 100) }}%
              </span>
            </div>
          </SectionItem>

          <!-- surface style -->
          <SectionItem v-if="sectionVisible('advanced')" :label="resolveLabel('surfaceStyle')">
            <SSegment v-model="surfaceStyleValue" :items="surfaceStyleOptions" size="sm" />
          </SectionItem>
        </div>

        <!-- Custom 面板：各 variant 分组平铺，独立选择 light/dark 分片 -->
        <div v-else :class="ui.panel">
          <template v-if="sectionVisible('advanced')">
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium text-foreground">{{ resolveLabel('cssVars') }}</span>
              <SSegment v-model="customMode" :items="variantModeOptions" size="sm" shape="rounded" />
            </div>

            <section v-for="group in customGroups" :key="group.key" class="space-y-2">
              <h4 class="text-xs font-medium text-foreground">{{ resolveLabel(group.i18n) }}</h4>
              <div v-for="meta in group.tokens" :key="meta.key" class="flex justify-between items-center gap-3">
                <span class="text-xs text-muted-foreground">{{ resolveLabel(meta.i18n) }}</span>
                <SPalettePicker
                  :size="size"
                  :model-value="variants.final.value[meta.key]"
                  class="w-40"
                  @update:model-value="setVariant(meta.key, $event)"
                />
              </div>
            </section>
          </template>
        </div>
      </template>
    </STabs>

    <!-- actions -->
    <section v-if="showActions" :class="ui.actions">
      <SButton :size="size" color="destructive" variant="outline" class="w-full" @click="settings.reset">
        {{ resolveLabel('reset') }}
      </SButton>
    </section>
  </div>
</template>
