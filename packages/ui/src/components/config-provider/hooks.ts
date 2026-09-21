import { computed, onMounted, onUnmounted, watch } from 'vue';
import { THEME_STORAGE_KEY, THEME_STYLE_ID, createThemeWriter } from '@vean/theme/storage';
import { buildThemeCss } from '../../theme/adapter';
import type { ConfigProviderProps } from './types';
import { createThemeContext, provideThemeContext } from './use-theme';

/**
 * Owns all theme-related logic for the ConfigProvider: the reactive theme context
 * (created via `createThemeContext`), the derived theme CSS, the single runtime
 * style element and the cross-tab storage refresh.
 *
 * **Style application**: the runtime owns exactly one `<style id="vean-theme">`
 * in `<head>`. The first-paint script may have created it (with the persisted
 * snapshot); the provider adopts that element, or creates it when absent, and
 * keeps its content in sync. Nothing is rendered into the component tree, so
 * there is no server/client style-content mismatch and no `!important` dance —
 * precedence comes from specificity (the static default layer ships
 * `:where(...)`-weakened, docs/theme.md §6.1 / §6.3).
 *
 * **Persistence**: one envelope, one writer. The derived payload (options +
 * mode + style snapshot + custom presets) goes into `__VEAN_THEME` through a
 * single debounced writer; the theme context itself writes nothing.
 */
export function useConfigProviderTheme(props: ConfigProviderProps) {
  const themeContext = createThemeContext(props);
  provideThemeContext(themeContext);

  const themeOptions = computed(() => themeContext.theme.value);
  const themeCss = computed(() => buildThemeCss(themeOptions.value));

  // —— 单一运行时样式元素：head 内的 #vean-theme，由首帧脚本或此处创建 ——
  const styleElement = shallowStyleElement();
  const applyCss = (): void => {
    const element = styleElement.current() ?? styleElement.acquire(props.nonce);

    if (element) {
      element.textContent = themeCss.value;
    }
  };

  onMounted(applyCss);
  watch(themeCss, applyCss);

  // —— 派生载荷写入主题信封（单键 + 防抖 + 单写入者）——
  // preset 表与已应用 preset 同信封携带：写入方只有这里一处，不存在多写者竞争。
  const writer = createThemeWriter();

  watch(
    [themeCss, () => themeContext.mode.value, themeContext.customPresets, themeContext.appliedPresetName],
    () => {
      if (!props.persistTheme || typeof document === 'undefined') {
        return;
      }

      writer.write({
        options: themeOptions.value,
        mode: themeContext.mode.value,
        style: themeCss.value,
        presets: themeContext.customPresets.value,
        ...(themeContext.appliedPresetName.value ? { appliedPreset: themeContext.appliedPresetName.value } : {})
      });
    },
    { immediate: true }
  );

  onUnmounted(() => writer.flush());

  // 跨标签页同步：storage 事件（其他标签页写入主题信封）触发整体重读 ——
  // options / mode / presets / applied preset 一起刷新并强制重派生。
  // 仅当 `persistTheme` 开启时才注册监听。
  const handleStorage = (event: StorageEvent): void => {
    if (event.key === THEME_STORAGE_KEY) {
      themeContext.refreshThemeConfig();
    }
  };

  onMounted(() => {
    if (!props.persistTheme) {
      return;
    }

    window.addEventListener('storage', handleStorage);
  });

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorage);
  });

  /**
   * 写回持久化主题配置并同步内存状态，使下游主题派生无需重读存储。
   * 通过 `defineExpose` 暴露给应用层。
   */
  const commitThemeConfig = (config: Parameters<typeof themeContext.setThemeState>[0]): void => {
    themeContext.setThemeState(config);
  };

  return { themeCss, themeOptions, commitThemeConfig };
}

/**
 * a lazily created holder for the runtime style element.
 *
 * The element is *not* rendered by the component (a head element cannot be
 * rendered from the app tree without a head manager), so the provider looks it
 * up — the first-paint script may already have created it — and creates it once
 * when missing. `styleElement.current()` returns the live element, so a theme
 * change after hydration writes to the same node the script built.
 */
function shallowStyleElement(): {
  current: () => HTMLStyleElement | null;
  acquire: (nonce?: string) => HTMLStyleElement | null;
} {
  let element: HTMLStyleElement | null = null;

  const acquire = (nonce?: string): HTMLStyleElement | null => {
    if (element || typeof document === 'undefined') {
      return element;
    }

    const existing = document.getElementById(THEME_STYLE_ID);

    element = existing instanceof HTMLStyleElement ? existing : document.createElement('style');

    if (!existing) {
      element.id = THEME_STYLE_ID;
      document.head.appendChild(element);
    }

    // CSP 下由脚本创建的元素同样需要 nonce（'nonce-…' 来源的 style-src）
    if (nonce && !element.getAttribute('nonce')) {
      element.setAttribute('nonce', nonce);
    }

    return element;
  };

  return { current: () => element, acquire };
}
