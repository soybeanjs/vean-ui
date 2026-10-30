import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { THEME_STORAGE_KEY } from '@vean/theme/storage';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SIcon from '@/components/icon/icon.vue';
import SThemeModeToggle from '@/components/theme-mode-toggle/theme-mode-toggle.vue';

const mountInProvider = (persistTheme = false, extraProps: Record<string, unknown> = {}) =>
  mount(
    {
      components: { SConfigProvider, SThemeModeToggle },
      data: () => ({ persistTheme, extraProps }),
      template:
        '<SConfigProvider :persist-theme="persistTheme"><SThemeModeToggle v-bind="extraProps" /></SConfigProvider>'
    },
    { attachTo: document.body }
  );

const getButton = (wrapper: VueWrapper) => wrapper.get('button');

const getIcon = (wrapper: VueWrapper) => wrapper.getComponent(SIcon).props('icon');

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.classList.remove('dark');
  window.localStorage.clear();
});

describe('SThemeModeToggle', () => {
  describe('rendering', () => {
    it('renders a button inside the theme context', () => {
      const wrapper = mountInProvider();

      expect(wrapper.find('button').exists()).toBe(true);

      wrapper.unmount();
    });

    it('shows the sun icon for the default light preference', () => {
      const wrapper = mountInProvider();

      expect(getIcon(wrapper)).toBe('lucide:sun');

      wrapper.unmount();
    });

    it('shows the moon icon for a persisted dark preference', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark' }));
      const wrapper = mountInProvider(true);

      expect(getIcon(wrapper)).toBe('lucide:moon');

      wrapper.unmount();
    });

    it('shows the monitor icon for the auto preference', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'auto' }));
      const wrapper = mountInProvider(true);

      expect(getIcon(wrapper)).toBe('lucide:monitor');

      wrapper.unmount();
    });

    it('names the current preference in the accessible label', () => {
      const wrapper = mountInProvider();

      expect(getButton(wrapper).attributes('aria-label')).toBe('Scheme: light');
      expect(getButton(wrapper).attributes('title')).toBe('Scheme: light');

      wrapper.unmount();
    });

    it('uses the ariaLabel override as accessible label and tooltip', () => {
      const wrapper = mountInProvider(false, { ariaLabel: 'Cycle scheme' });

      expect(getButton(wrapper).attributes('aria-label')).toBe('Cycle scheme');
      expect(getButton(wrapper).attributes('title')).toBe('Cycle scheme');

      wrapper.unmount();
    });

    it('defaults to the square shape', () => {
      const wrapper = mountInProvider();

      expect(getButton(wrapper).classes()).toContain('rounded-md');

      wrapper.unmount();
    });
  });

  describe('interaction', () => {
    it('cycles light -> dark -> auto -> light', async () => {
      const wrapper = mountInProvider();

      await getButton(wrapper).trigger('click');
      expect(getIcon(wrapper)).toBe('lucide:moon');
      expect(getButton(wrapper).attributes('aria-label')).toBe('Scheme: dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      await getButton(wrapper).trigger('click');
      expect(getIcon(wrapper)).toBe('lucide:monitor');
      expect(getButton(wrapper).attributes('aria-label')).toBe('Scheme: auto');

      await getButton(wrapper).trigger('click');
      expect(getIcon(wrapper)).toBe('lucide:sun');
      expect(getButton(wrapper).attributes('aria-label')).toBe('Scheme: light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      wrapper.unmount();
    });

    it('persists the cycled preference', async () => {
      const wrapper = mountInProvider(true);

      await getButton(wrapper).trigger('click');

      // 信封写入是防抖的（250ms），卸载时同步 flush
      wrapper.unmount();

      const envelope = JSON.parse(window.localStorage.getItem(THEME_STORAGE_KEY) ?? '{}');

      expect(envelope.mode).toBe('dark');
    });

    it('keeps the inline color-scheme in step with the class toggle', async () => {
      const wrapper = mountInProvider();

      await getButton(wrapper).trigger('click');
      expect(document.documentElement.style.colorScheme).toBe('dark');

      await getButton(wrapper).trigger('click');
      expect(document.documentElement.style.colorScheme).toBe('light');

      wrapper.unmount();
    });
  });
});
