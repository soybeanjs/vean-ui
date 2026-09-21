import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { resolveThemeMap } from '@vean/theme';
import { THEME_ENVELOPE_VERSION, THEME_STORAGE_KEY, readThemeEnvelope } from '@vean/theme/storage';
import SAccordion from '@/components/accordion/accordion.vue';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SIcon from '@/components/icon/icon.vue';
import { getA11yViolations } from '../../shared/a11y';

// 部分 mock 主题引擎：保留真实实现，仅包装 resolveThemeMap / readThemeEnvelope
// 以便断言派生与存储读取的次数。
vi.mock('@vean/theme', async importOriginal => {
  const actual = await importOriginal<typeof import('@vean/theme')>();

  return {
    ...actual,
    resolveThemeMap: vi.fn(actual.resolveThemeMap)
  };
});

vi.mock('@vean/theme/storage', async importOriginal => {
  const actual = await importOriginal<typeof import('@vean/theme/storage')>();

  return {
    ...actual,
    readThemeEnvelope: vi.fn(actual.readThemeEnvelope)
  };
});

const accordionItems = [{ value: 'item-1', title: 'Section One', description: 'Content for section one.' }];

function getStyleEl(id: string): HTMLStyleElement | null {
  return document.getElementById(id) as HTMLStyleElement | null;
}

describe('SConfigProvider', () => {
  afterEach(() => {
    // the runtime theme <style> lives in <head> by design, so it is cleared
    // between tests to keep assertions independent of earlier mounts.
    getStyleEl('#vean-theme')?.remove();
    getStyleEl('__Vean_Aria_Styles')?.remove();
    getStyleEl('__Vean_toastStyle')?.remove();
  });

  describe('rendering', () => {
    it('renders default slot content', () => {
      const wrapper = mount(SConfigProvider, {
        slots: { default: '<div data-child>Child content</div>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-child]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders nested components', () => {
      const wrapper = mount(SConfigProvider, {
        slots: {
          default: '<button type="button" data-testid="btn">Click</button>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-testid="btn"]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('theme injection', () => {
    it('owns a single runtime style element in <head>', () => {
      document.head.querySelectorAll('#vean-theme').forEach(node => node.remove());

      const wrapper = mount(SConfigProvider, {
        props: { theme: { base: 'gray', primary: 'violet' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      // 运行时元素挂在 head、且只有一个（不渲染进组件树）
      const styleEl = document.head.querySelector('#vean-theme');
      expect(styleEl).toBeTruthy();
      expect(styleEl!.textContent).toContain('--');
      expect(styleEl!.textContent).toContain('--background');
      expect(wrapper.html()).not.toContain('<style');

      wrapper.unmount();
    });

    it('updates the runtime style element when the theme prop changes', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { theme: { base: 'gray', primary: 'violet' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      const firstCss = document.head.querySelector('#vean-theme')?.textContent ?? '';

      await wrapper.setProps({ theme: { base: 'slate', primary: 'blue' } });

      const secondCss = document.head.querySelector('#vean-theme')?.textContent ?? '';
      expect(secondCss).toBeTruthy();
      expect(secondCss).not.toBe(firstCss);
      // 仍是同一个元素（就地更新，不新增）
      expect(document.head.querySelectorAll('#vean-theme').length).toBe(1);

      wrapper.unmount();
    });
  });

  describe('direction and locale', () => {
    it('derives dir from locale (ar → rtl)', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SAccordion },
          data: () => ({ accordionItems }),
          template: '<SConfigProvider locale="ar"><SAccordion :items="accordionItems" /></SConfigProvider>'
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-vean-accordion-root]').attributes('dir')).toBe('rtl');

      wrapper.unmount();
    });

    it('derives dir from locale (en → ltr)', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SAccordion },
          data: () => ({ accordionItems }),
          template: '<SConfigProvider locale="en"><SAccordion :items="accordionItems" /></SConfigProvider>'
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-vean-accordion-root]').attributes('dir')).toBe('ltr');

      wrapper.unmount();
    });

    it('explicit dir overrides locale-derived direction', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SAccordion },
          data: () => ({ accordionItems }),
          template: '<SConfigProvider locale="ar" dir="ltr"><SAccordion :items="accordionItems" /></SConfigProvider>'
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-vean-accordion-root]').attributes('dir')).toBe('ltr');

      wrapper.unmount();
    });

    it('defaults to ltr when locale is unknown', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SAccordion },
          data: () => ({ accordionItems }),
          template: '<SConfigProvider locale="unknown-xx"><SAccordion :items="accordionItems" /></SConfigProvider>'
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-vean-accordion-root]').attributes('dir')).toBe('ltr');

      wrapper.unmount();
    });
  });

  describe('provider composition', () => {
    it('renders ToastProvider by default', () => {
      const wrapper = mount(SConfigProvider, {
        slots: { default: '<div />' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-toast-provider]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('does not render ToastProvider when customToast is true', () => {
      const wrapper = mount(SConfigProvider, {
        props: { customToast: true },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-toast-provider]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('context propagation', () => {
    it('provides default iconify size to child SIcon', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SIcon },
          template: '<SConfigProvider><SIcon icon="mdi:home" /></SConfigProvider>'
        },
        { attachTo: document.body }
      );

      const svg = wrapper.find('svg');
      expect(svg.exists()).toBe(true);
      expect(svg.attributes('width')).toBe('1.25em');
      expect(svg.attributes('height')).toBe('1.25em');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SConfigProvider, {
        slots: { default: '<div>Accessible provider content</div>' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });

  describe('theme persistence', () => {
    const resolveThemeMapMock = vi.mocked(resolveThemeMap);
    const readThemeEnvelopeMock = vi.mocked(readThemeEnvelope);

    beforeEach(() => {
      resolveThemeMapMock.mockClear();
      readThemeEnvelopeMock.mockClear();
      window.localStorage.clear();
    });

    it('reuses the derived theme when props stay stable', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { persistTheme: true, theme: { base: 'gray' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      expect(resolveThemeMapMock).toHaveBeenCalledTimes(1);

      // 无关 prop 变化触发重渲染，但不重新派生主题（内存缓存命中）
      await wrapper.setProps({ dir: 'rtl' });

      expect(resolveThemeMapMock).toHaveBeenCalledTimes(1);

      wrapper.unmount();
    });

    it('invalidates the derived theme when the theme prop changes', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { persistTheme: true, theme: { base: 'gray' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      expect(resolveThemeMapMock).toHaveBeenCalledTimes(1);

      await wrapper.setProps({ theme: { base: 'slate' } });

      expect(resolveThemeMapMock).toHaveBeenCalledTimes(2);

      wrapper.unmount();
    });

    it('invalidates the cache on a storage event for the theme key', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { persistTheme: true, theme: { base: 'gray' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      expect(resolveThemeMapMock).toHaveBeenCalledTimes(1);

      // 跨标签页写入：storage 事件置脏缓存，下一渲染重读存储并重新派生
      window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY }));

      await nextTick();

      expect(resolveThemeMapMock).toHaveBeenCalledTimes(2);

      wrapper.unmount();
    });

    it('fills keys not provided by theme from the injected themeConfig (SSR)', () => {
      const wrapper = mount(SConfigProvider, {
        props: {
          persistTheme: true,
          theme: { base: 'gray' },
          themeConfig: { options: { base: 'slate', format: 'oklch' } }
        },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      // 显式 base 优先（gray）；themeConfig 的 format 补位（oklch）
      const lastTheme = resolveThemeMapMock.mock.calls.at(-1)?.[0];
      expect(lastTheme?.base).toBe('gray');
      expect(lastTheme?.format).toBe('oklch');

      // themeConfig 注入时无需读取 localStorage
      expect(readThemeEnvelopeMock).not.toHaveBeenCalled();

      wrapper.unmount();
    });

    it('prefers an inline preset over a stored { name } reference', () => {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({
          v: 1,
          options: {},
          presets: { stored: { light: { primary: 'red.600' } } }
        })
      );

      const wrapper = mount(SConfigProvider, {
        props: {
          persistTheme: true,
          theme: { preset: { light: { primary: 'blue.600' } } }
        },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      // 内联 preset 直接使用，解析为 overrides；base tokens 取默认值回落到顶层字段
      expect(resolveThemeMapMock.mock.calls.at(-1)?.[0]).toMatchObject({
        base: 'zinc',
        primary: 'indigo',
        size: 'md',
        radius: 'md',
        overrides: { light: { primary: 'blue.600' } }
      });

      wrapper.unmount();
    });

    it('falls back to built-in colors and warns on the server when a preset reference is missing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mount(SConfigProvider, {
        props: {
          persistTheme: true,
          // SSR 语义：preset 缺失是真实问题（会与客户端产生主题闪烁），故告警
          isServer: true,
          theme: { preset: { name: 'missing' } }
        },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('preset "missing" not found'));

      // 回退内置：仍生成主题 CSS（运行时元素在 head）
      expect(document.head.querySelector('#vean-theme')?.textContent).toContain('--');

      warnSpy.mockRestore();
      wrapper.unmount();
    });

    it('ignores persistence props when persistTheme is disabled', () => {
      const wrapper = mount(SConfigProvider, {
        props: {
          persistTheme: false,
          theme: { base: 'gray' },
          themeConfig: { options: { base: 'slate', format: 'oklch' } }
        },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      const lastTheme = resolveThemeMapMock.mock.calls.at(-1)?.[0];
      expect(lastTheme?.base).toBe('gray');
      expect(lastTheme?.format).toBeUndefined();

      // 持久化管道短路：不读取任何存储
      expect(readThemeEnvelopeMock).not.toHaveBeenCalled();

      wrapper.unmount();
    });

    it('persists the derived payload in the theme envelope for the pre-paint script', async () => {
      window.localStorage.removeItem(THEME_STORAGE_KEY);

      const wrapper = mount(SConfigProvider, {
        props: { persistTheme: true, theme: { base: 'gray' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      // 单键 + 防抖：立即读为空，flush 后才有内容
      await new Promise(resolve => setTimeout(resolve, 300));

      const envelope = readThemeEnvelope();

      expect(envelope?.options.base).toBe('gray');
      expect(envelope?.style).toContain('--background');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toContain(`"v":${THEME_ENVELOPE_VERSION}`);

      wrapper.unmount();
    });

    it('never creates a second runtime style element', () => {
      document.head.querySelectorAll('#vean-theme').forEach(node => node.remove());

      const first = mount(SConfigProvider, {
        props: { persistTheme: true, theme: { base: 'gray' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });
      const second = mount(SConfigProvider, {
        props: { persistTheme: true, theme: { base: 'slate' } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      expect(document.head.querySelectorAll('#vean-theme').length).toBe(1);

      first.unmount();
      second.unmount();
    });
  });

  describe('font options', () => {
    it('forwards the theme `font` stacks into the emitted literal tokens', () => {
      document.head.querySelectorAll('#vean-theme').forEach(node => node.remove());

      const wrapper = mount(SConfigProvider, {
        props: {
          theme: { font: { sans: 'Inter', heading: 'Playfair Display', mono: 'JetBrains Mono' } }
        },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      const css = document.head.querySelector('#vean-theme')?.textContent ?? '';

      // 单个家族名会被引擎补上系统栈兜底（`resolveFontValue`），断言前缀即可
      expect(css).toContain('--font-sans: Inter,');
      expect(css).toContain('--font-heading: Playfair Display');
      expect(css).toContain('--font-mono: JetBrains Mono,');

      wrapper.unmount();
    });

    it('re-emits the literal tokens when the theme font changes', async () => {
      const wrapper = mount(SConfigProvider, {
        props: { theme: { font: { sans: 'Inter' } } },
        slots: { default: '<div />' },
        attachTo: document.body
      });

      const before = document.head.querySelector('#vean-theme')?.textContent ?? '';
      expect(before).toContain('--font-sans: Inter,');

      await wrapper.setProps({ theme: { font: { sans: 'Geist' } } });

      const after = document.head.querySelector('#vean-theme')?.textContent ?? '';
      expect(after).toContain('--font-sans: Geist,');
      expect(after).not.toBe(before);

      wrapper.unmount();
    });
  });
});
