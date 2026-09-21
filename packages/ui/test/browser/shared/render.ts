import { defineComponent, h } from 'vue';
import type { Component } from 'vue';
import { render } from 'vitest-browser-vue';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import type { ConfigProviderProps } from '@/components/config-provider/types';

export interface RenderOptions {
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
  /**
   * Wrap the component in `SConfigProvider` so theme CSS variables are injected
   * into the document as a `<style>` tag.
   *
   * Required for real color-contrast a11y checks: axe's `color-contrast` rule
   * needs computed styles, and the theme CSS vars are what give Vean
   * components their actual colors. Without `withTheme`, components render with
   * no/defaults colors and color-contrast results are not meaningful.
   *
   * Pass `true` for the default theme, or a partial theme config to customize
   * base / primary / feedback / radius / size.
   */
  withTheme?: boolean | Partial<ConfigProviderProps['theme']>;
}

/**
 * Render a component into the real browser DOM using `vitest-browser-vue`.
 *
 * Returns whatever `vitest-browser-vue`'s `render` returns (`container`,
 * `unmount`, `rerender`, …). Use `page` / `userEvent` from `vitest/browser` for
 * locators and interactions, and `expect.element(locator)` for assertions.
 *
 * `vitest-browser-vue` auto-unmounts the previous render before each test, but
 * calling `unmount()` explicitly at the end of each `it()` keeps the DOM clean
 * within a single test when multiple renders happen.
 */
export function renderComponent<T extends Component>(component: T, options: RenderOptions = {}) {
  const { withTheme, props, slots } = options;

  if (!withTheme) {
    return render(component, { props, slots } as Parameters<typeof render<T>>[1]);
  }

  const theme = typeof withTheme === 'object' ? withTheme : {};

  const Wrapper = defineComponent({
    name: 'SoybeanTestThemeProvider',
    setup() {
      return () =>
        h(
          SConfigProvider,
          { theme },
          {
            default: () => h(component as Component, props as Record<string, unknown>, slots as Record<string, unknown>)
          }
        );
    }
  });

  return render(Wrapper);
}
