import { computed } from 'vue';
import { useThemeLocale } from './locale';

export type OptionCategory = 'mode' | 'size' | 'spacing' | 'fontFamilies' | 'feedback' | 'sidebar' | 'surfaceStyle';

/** 把 kebab-case 选项值（如 `inverted-dark` / `noto-sans`）转换为消息对象里的 camelCase 键（`invertedDark`）。 */
const kebabToCamel = (key: string): string => key.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/** 消息键：kebab → camel；`2xl` 尺寸值映射为 `xl2` 键。 */
const toMessageKey = (category: OptionCategory, value: string): string => {
  if (category === 'size') {
    return value === '2xl' ? 'xl2' : value;
  }

  if (value === 'system') {
    return 'system';
  }

  return kebabToCamel(value);
};

/**
 * ThemeCustomizer 文案解析：跟随 ConfigProvider.locale 响应式刷新（仅 zh/en）。
 * `resolveLabel` 解析 sections / groups / variants，`resolveOption` 解析各下拉选项标签。
 */
export function useThemeCustomizerLocale() {
  const messages = useThemeLocale();
  const tc = computed(() => messages.value);

  const resolveLabel = (key: string): string => {
    const m = tc.value;

    if (key.startsWith('theme.group.')) {
      return m.groups[key.slice('theme.group.'.length) as keyof typeof m.groups] ?? key;
    }

    if (key.startsWith('theme.variant.')) {
      return m.variants[key.slice('theme.variant.'.length) as keyof typeof m.variants] ?? key;
    }

    return m.sections[key as keyof typeof m.sections] ?? key;
  };

  const resolveOption = (category: OptionCategory, key: string): string => {
    const map = tc.value.options[category] as Record<string, string>;

    return map[toMessageKey(category, key)] ?? key;
  };

  return { tc, resolveLabel, resolveOption };
}
