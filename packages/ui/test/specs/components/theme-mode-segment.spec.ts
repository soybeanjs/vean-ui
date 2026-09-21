import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { THEME_STORAGE_KEY } from '@vean/theme/storage';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SThemeModeSegment from '@/components/theme-mode-segment/theme-mode-segment.vue';

const mountInProvider = (persistTheme = false, extraProps: Record<string, unknown> = {}) =>
  mount(
    {
      components: { SConfigProvider, SThemeModeSegment },
      data: () => ({ persistTheme, extraProps }),
      template:
        '<SConfigProvider :persist-theme="persistTheme"><SThemeModeSegment v-bind="extraProps" /></SConfigProvider>'
    },
    { attachTo: document.body }
  );

const getTrigger = (wrapper: VueWrapper, value: string) => {
  const trigger = wrapper.findAll('[role="tab"]').find(node => node.text() === value);

  expect(trigger, `segment trigger "${value}" should be rendered`).toBeTruthy();

  return trigger!;
};

const selectMode = async (wrapper: VueWrapper, value: string) => {
  await getTrigger(wrapper, value).trigger('mousedown', { button: 0 });
};

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.classList.remove('dark');
  window.localStorage.clear();
});

describe('SThemeModeSegment', () => {
  describe('rendering', () => {
    it('renders the three mode options inside the theme context', () => {
      const wrapper = mountInProvider();

      const triggers = wrapper.findAll('[role="tab"]');
      const labels = triggers.map(node => node.text());

      expect(labels).toContain('auto');
      expect(labels).toContain('light');
      expect(labels).toContain('dark');

      wrapper.unmount();
    });

    it('marks the current preference as selected', () => {
      const wrapper = mountInProvider();

      expect(getTrigger(wrapper, 'light').attributes('aria-selected')).toBe('true');
      expect(getTrigger(wrapper, 'dark').attributes('aria-selected')).toBe('false');

      wrapper.unmount();
    });

    it('marks a persisted dark preference as selected', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark' }));
      const wrapper = mountInProvider(true);

      expect(getTrigger(wrapper, 'dark').attributes('aria-selected')).toBe('true');

      wrapper.unmount();
    });

    it('renders a scheme icon in each option by default', () => {
      const wrapper = mountInProvider();

      const icons = wrapper.findAll('[role="tab"] [data-vean-icon]');

      expect(icons.length).toBe(3);

      wrapper.unmount();
    });

    it('defaults to the rounded shape', () => {
      const wrapper = mountInProvider();

      expect(wrapper.get('[data-vean-segment-list]').classes()).toContain('rounded-full');

      wrapper.unmount();
    });

    it('applies the square shape when configured', () => {
      const wrapper = mountInProvider(false, { shape: 'square' });

      expect(wrapper.get('[data-vean-segment-list]').classes()).toContain('rounded-md');
      expect(wrapper.get('[data-vean-segment-list]').classes()).not.toContain('rounded-full');

      wrapper.unmount();
    });

    it('keeps labels visually hidden but accessible by default', () => {
      const wrapper = mountInProvider();

      const srOnlyLabels = wrapper.findAll('[role="tab"] .sr-only');

      expect(srOnlyLabels.length).toBe(3);
      expect(srOnlyLabels.map(node => node.text())).toContain('light');

      wrapper.unmount();
    });

    it('renders visible labels when showLabel is true', () => {
      const wrapper = mountInProvider(false, { showLabel: true });

      expect(wrapper.findAll('[role="tab"] .sr-only').length).toBe(0);
      expect(wrapper.findAll('[role="tab"] [data-vean-icon]').length).toBe(3);

      wrapper.unmount();
    });
  });

  describe('interaction', () => {
    it('switches the theme to dark when Dark is selected', async () => {
      const wrapper = mountInProvider();

      await selectMode(wrapper, 'dark');

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(getTrigger(wrapper, 'dark').attributes('aria-selected')).toBe('true');
      expect(getTrigger(wrapper, 'light').attributes('aria-selected')).toBe('false');

      wrapper.unmount();
    });

    /**
     * `color-scheme` must follow the toggle, not only the `.dark` class.
     *
     * The first-paint script writes it as an **inline** style on `<html>`, and
     * an inline style outranks every selector — so if the runtime only toggled
     * the class, the stale inline value would win over the `.dark` block and
     * UA-drawn surfaces (scrollbars, form controls) would stay light.
     */
    it('keeps the inline color-scheme in step with the class toggle', async () => {
      const wrapper = mountInProvider();

      await selectMode(wrapper, 'dark');
      expect(document.documentElement.style.colorScheme).toBe('dark');

      await selectMode(wrapper, 'light');
      expect(document.documentElement.style.colorScheme).toBe('light');

      wrapper.unmount();
    });

    it('switches back to light when Light is selected', async () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark' }));
      const wrapper = mountInProvider(true);

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      await selectMode(wrapper, 'light');

      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(getTrigger(wrapper, 'light').attributes('aria-selected')).toBe('true');

      wrapper.unmount();
    });

    it('persists the auto preference without pinning an explicit scheme', async () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark' }));
      const wrapper = mountInProvider(true);

      await selectMode(wrapper, 'auto');

      expect(getTrigger(wrapper, 'auto').attributes('aria-selected')).toBe('true');

      // 信封写入是防抖的（250ms），卸载时同步 flush
      wrapper.unmount();

      const envelope = JSON.parse(window.localStorage.getItem(THEME_STORAGE_KEY) ?? '{}');

      expect(envelope.mode).toBe('auto');
    });
  });
});
