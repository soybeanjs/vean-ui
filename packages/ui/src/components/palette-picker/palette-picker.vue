<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import {
  generateNearestPalette,
  generatePalette,
  paletteColorLevels,
  tailwindPalette
} from '@soybeanjs/colord/palette';
import type { PaletteColorLevel, SimplePaletteKey, TailwindPaletteKey } from '@soybeanjs/colord/palette';
import type { ColorValue } from '@vean/theme';
import SColorPicker from '../color-picker/color-picker.vue';
import SSelect from '../select/select.vue';
import type { SelectOptionData } from '../select/types';
import SSwitch from '../switch/switch.vue';
import { useThemeLocale } from '../theme-customizer/locale';
import STooltip from '../tooltip/tooltip.vue';
import {
  DEFAULT_LEVEL,
  SIMPLE_KEYS,
  TAILWIND_KEYS,
  deriveNearestLevel,
  deriveSelectValue,
  deriveTailLevel,
  isSimpleKey,
  isTailwindKey,
  itemColorKeyOf,
  outputFormatOf,
  serializeColor,
  simpleCssColor,
  toCssColor
} from './shared';
import type { PalettePickerProps, PaletteChangePayload, PalettePickerEmits, PaletteSelectValue } from './types';

defineOptions({
  name: 'SPalettePicker'
});

const props = withDefaults(defineProps<PalettePickerProps>(), {
  size: 'md',
  format: 'hsl'
});

const model = defineModel<ColorValue>({
  required: true
});

const emit = defineEmits<PalettePickerEmits>();

const messages = useThemeLocale();
const palettePickerMessages = computed(() => messages.value.palettePicker);

// —— 顶层选择：custom（通过切换开关进入）或内置 key（通过下拉选项选择） ——
const selectValue = ref<PaletteSelectValue>(deriveSelectValue(model.value));
const isCustom = computed(() => selectValue.value === 'custom');
const isTailwind = computed(() => isTailwindKey(selectValue.value));
const selectedKey = computed<TailwindPaletteKey | null>(() =>
  isTailwindKey(selectValue.value) ? selectValue.value : null
);

// 退出自定义模式时恢复的内置 key；初始为 custom 时回退到 blue
const initialSelectValue = deriveSelectValue(model.value);
const lastKey = ref<TailwindPaletteKey | SimplePaletteKey>(
  isTailwindKey(initialSelectValue) || isSimpleKey(initialSelectValue) ? initialSelectValue : 'blue'
);

const tailLevel = ref<PaletteColorLevel>(deriveTailLevel(model.value));

// —— custom 面板内部状态 ——
const customColor = ref<string>(isCustom.value ? String(model.value) : '#6366f1');
const recommended = ref(false);
const customLevel = ref<PaletteColorLevel>(DEFAULT_LEVEL);

// 受控模式：外部写入 modelValue 回填内部状态期间置为 true，抑制 emitChange 回写
const syncingFromModel = ref(false);

const outputFormat = computed(() => outputFormatOf(props.format));
const itemColorKey = computed(() => itemColorKeyOf(props.format));

// —— 触发器标签：内置颜色展示 key.level（无 level 时仅 key）；自定义直接展示原始字符串 ——
const triggerLabel = computed(() => {
  if (isCustom.value) {
    return String(model.value);
  }

  if (isTailwind.value) {
    return `${selectValue.value}.${tailLevel.value}`;
  }

  return selectValue.value;
});

// 下拉选项仅包含内置 key（custom 由独立开关控制，不作为选项）
const options = computed<SelectOptionData<PaletteSelectValue>[]>(() => [
  ...TAILWIND_KEYS.map(key => ({ label: key, value: key })),
  ...SIMPLE_KEYS.map(key => ({ label: key, value: key }))
]);

const currentCss = computed(() => toCssColor(model.value));

// —— custom 生成：推荐色板开启时吸附到最近 tailwind 色板，否则自由生成 ——
const nearest = computed(() => (recommended.value ? generateNearestPalette(customColor.value, 'oklchString') : null));

const customPalette = computed<Partial<Record<PaletteColorLevel, string>>>(() => {
  if (nearest.value) {
    return nearest.value.palette;
  }

  return generatePalette(customColor.value, outputFormat.value);
});

const tailwindPaletteLevels = computed<Partial<Record<PaletteColorLevel, string>>>(() => {
  const key = selectedKey.value;

  if (!key) {
    return {};
  }

  return Object.fromEntries(paletteColorLevels.map(level => [level, tailwindPalette[key][level][itemColorKey.value]]));
});

// —— 结果推导：提交到 modelValue ——
const result = computed<ColorValue>(() => {
  if (isCustom.value) {
    // 推荐色板开启时提交最近 tailwind 色板的 key.level；否则提交原始色值序列化结果
    if (nearest.value) {
      return `${nearest.value.paletteKey}.${customLevel.value}` as ColorValue;
    }

    return serializeColor(customColor.value, props.format);
  }

  if (isTailwind.value) {
    return `${selectValue.value}.${tailLevel.value}` as ColorValue;
  }

  return selectValue.value as ColorValue;
});

const activePalette = computed<Partial<Record<PaletteColorLevel, string>>>(() => {
  if (isCustom.value) {
    return customPalette.value;
  }

  if (isTailwind.value) {
    return tailwindPaletteLevels.value;
  }

  return {};
});

const emitChange = (): void => {
  model.value = result.value;

  const payload: PaletteChangePayload = {
    value: result.value,
    palette: activePalette.value,
    recommended: recommended.value
  };

  emit('paletteChange', payload);
};

const optionColor = (value: PaletteSelectValue): string => {
  if (isTailwindKey(value)) {
    return tailwindPalette[value][DEFAULT_LEVEL].hsl;
  }

  return isSimpleKey(value) ? simpleCssColor(value) : 'transparent';
};

// —— 自定义开关：开启时记住当前内置 key 并把原色作为自定义初始值 ——
const onToggleCustom = (isOn: boolean): void => {
  if (!isOn) {
    selectValue.value = lastKey.value;
    return;
  }

  if (selectValue.value !== 'custom') {
    lastKey.value = selectValue.value;
  }

  customColor.value = toCssColor(model.value);
  customLevel.value = deriveNearestLevel(String(model.value), props.format);
  selectValue.value = 'custom';
};

// —— 选择内置颜色时，level 重置为 500 ——
// 受控模式（外部 model 变化）期间跳过：此时 level 由派生值决定（如 zinc.950），
// 不应被重置为 500。
watch(selectValue, value => {
  if (syncingFromModel.value) {
    return;
  }

  if (isTailwindKey(value)) {
    tailLevel.value = DEFAULT_LEVEL;
  }
});

watch([selectValue, tailLevel, customColor, recommended, customLevel], () => {
  if (syncingFromModel.value) {
    return;
  }

  emitChange();
});

// —— 推荐色板开关从开启切到关闭时，基于当前颜色重新生成色板（computed 自动重算），
//     主色即当前颜色(500)，因此把高亮重置到 500 ——
watch(recommended, (value, prev) => {
  if (prev && !value) {
    customLevel.value = DEFAULT_LEVEL;
  }
});

// —— 色块点击时抑制颜色选择器触发的层级推导，避免覆盖主动选择的层级 ——
const applyingSwatch = ref(false);

// —— 通过颜色选择器选色时，高亮最接近的色板层级 ——
watch(customColor, value => {
  if (isCustom.value && !applyingSwatch.value) {
    customLevel.value = deriveNearestLevel(value, props.format);
  }
});

// —— 点击自定义色板色块 ——
const onCustomLevelClick = (level: PaletteColorLevel): void => {
  // 推荐色板模式：色板固定吸附到某个 tailwind 色板，点击色块同步选中层级，
  // 并把颜色选择器联动到该色块颜色（色块是吸附色板的精确颜色，重新吸附仍
  // 落在同一色板，因此色板保持稳定）。
  if (recommended.value) {
    const target = customPalette.value[level];

    if (target) {
      applyingSwatch.value = true;
      customColor.value = target;
      customLevel.value = level;
      void nextTick(() => {
        applyingSwatch.value = false;
      });
    }

    return;
  }

  // 自由生成模式：点击的色块成为新的主色(500)，基于它重新调用
  // generatePalette 生成新色板。色块点击是主动选择，颜色选择器变化
  // 触发的层级推导不应被触发，避免覆盖刚设为 500 的主色。
  const target = customPalette.value[level];

  if (target) {
    applyingSwatch.value = true;
    customColor.value = target;
    customLevel.value = DEFAULT_LEVEL;
    void nextTick(() => {
      applyingSwatch.value = false;
    });
  }
};

// —— 受控模式：外部写入 modelValue 时回填内部状态 ——
// 回填期间 `syncingFromModel` 为 true，抑制 emitChange，避免把外部同步得到的
// 内部表示（如最近的 tailwind key / 重新序列化的颜色）回写为 override。
watch(
  () => model.value,
  value => {
    if (value === result.value) {
      return;
    }

    syncingFromModel.value = true;
    selectValue.value = deriveSelectValue(value);
    tailLevel.value = deriveTailLevel(value);

    if (deriveSelectValue(value) === 'custom') {
      customColor.value = String(value);
      customLevel.value = deriveNearestLevel(String(value), props.format);
    }

    void nextTick(() => {
      syncingFromModel.value = false;
    });
  }
);
</script>

<template>
  <SSelect
    v-model="selectValue"
    :items="isCustom ? [] : options"
    :size="size"
    :show-trigger-icon="false"
    placement="bottom-end"
    :viewport-props="isCustom ? { class: '!p-0' } : undefined"
  >
    <template #trigger-leading>
      <span class="size-4 shrink-0 rounded-full border border-border" :style="{ backgroundColor: currentCss }" />
    </template>
    <template #trigger-value>
      <span class="grow truncate text-start">{{ triggerLabel }}</span>
    </template>

    <!-- top 插槽：自定义切换开关 +（非自定义时）当前主题颜色的色板 -->
    <template #top>
      <div class="border-b border-border px-2 py-1.5">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-medium text-muted-foreground">{{ palettePickerMessages.custom }}</span>
          <SSwitch
            data-palette-custom-toggle
            :model-value="isCustom"
            :size="size"
            @update:model-value="onToggleCustom"
          />
        </div>
        <div v-if="isTailwind" class="mt-1.5 flex items-center gap-1">
          <STooltip v-for="level in paletteColorLevels" :key="level" :size="size">
            <template #trigger>
              <button
                type="button"
                class="size-4 rounded-full border border-border transition"
                :class="level === tailLevel ? 'ring-2 ring-primary ring-offset-1' : ''"
                :style="{ backgroundColor: tailwindPaletteLevels[level] }"
                :aria-label="`level ${level}`"
                :aria-pressed="level === tailLevel"
                @click="tailLevel = level"
              />
            </template>
            <span class="text-xs">{{ level }}</span>
          </STooltip>
        </div>
      </div>
    </template>

    <template #item-leading="{ item }">
      <span
        class="size-4 shrink-0 rounded-full border border-border"
        :style="{ backgroundColor: optionColor(item.value) }"
      />
    </template>

    <!-- bottom 插槽：自定义模式下的颜色选择器 + 色板 -->
    <template #bottom>
      <div v-if="isCustom" class="space-y-1.5 border-t border-border px-2 py-1.5">
        <SColorPicker v-model="customColor" :size="size" :modal="false" class="w-full" />
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-muted-foreground">{{ palettePickerMessages.recommendedPalette }}</span>
          <SSwitch v-model="recommended" data-palette-recommended-switch :size="size" />
        </div>
        <div class="flex items-center gap-1">
          <STooltip v-for="level in paletteColorLevels" :key="level" :size="size">
            <template #trigger>
              <button
                type="button"
                class="size-4 rounded-full border border-border transition"
                :class="level === customLevel ? 'ring-2 ring-primary ring-offset-1' : ''"
                :style="{ backgroundColor: customPalette[level] }"
                :aria-label="`level ${level}`"
                :aria-pressed="level === customLevel"
                @click="onCustomLevelClick(level)"
              />
            </template>
            <span class="text-xs">{{ level }}</span>
          </STooltip>
        </div>
      </div>
    </template>
  </SSelect>
</template>
