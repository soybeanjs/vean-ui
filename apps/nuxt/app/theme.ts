import { computed, ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { useContext } from '@vean/aria/composables';
import type { ConfigProviderProps, ConfigProviderThemeOptions, Direction } from '@vean/ui';

/**
 * 页面级配置上下文：dir / locale + 主题生成器覆盖。
 *
 * 主题状态（base / primary / radius / size / mode）与自定义 preset 已收敛到
 * 库内 `SConfigProvider`（见 `@vean/ui` 的 `useTheme`），由 `persistTheme`
 * 负责 localStorage + cookie 持久化。这里只保留不属于主题的国际化状态
 * （dir / locale），并产出传给 `SConfigProvider` 的 props。
 *
 * `themeOverride` 由 `ThemeGenerator` 受控写入：一旦设置即作为 `theme` prop
 * 传入 `SConfigProvider` 实时覆盖派生主题，未设置时保持库内默认行为。
 */
export const [provideThemeContext, usePageContext] = useContext('UiPageContext', () => {
  const direction = useStorage<Direction>('direction', 'ltr');
  const locale = useStorage('locale', 'en');
  const themeOverride = ref<ConfigProviderThemeOptions | undefined>(undefined);

  const setDirection = (value: Direction) => {
    direction.value = value;
  };

  const setLocale = (value: string) => {
    locale.value = value;
  };

  const configProviderProps = computed<ConfigProviderProps>(() => ({
    dir: direction.value,
    locale: locale.value,
    theme: themeOverride.value,
    // 主题状态由库内 SConfigProvider 统一持久化（localStorage + cookie）
    persistTheme: true
  }));

  return {
    direction,
    locale,
    themeOverride,
    setDirection,
    setLocale,
    configProviderProps
  };
});
