import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { THEME_STORAGE_KEY } from '@vean/theme/storage';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SThemeModeSwitch from '@/components/theme-mode-switch/theme-mode-switch.vue';

const mountInProvider = (persistTheme = false) =>
  mount(
    {
      components: { SConfigProvider, SThemeModeSwitch },
      data: () => ({ persistTheme }),
      template: '<SConfigProvider :persist-theme="persistTheme"><SThemeModeSwitch /></SConfigProvider>'
    },
    { attachTo: document.body }
  );

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.classList.remove('dark');
  window.localStorage.clear();
});

describe('SThemeModeSwitch', () => {
  describe('rendering', () => {
    it('renders a switch control inside the theme context', () => {
      const wrapper = mountInProvider();
      expect(wrapper.find('[role="switch"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('is unchecked and shows an icon in light mode', () => {
      const wrapper = mountInProvider();
      expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBe('false');
      expect(wrapper.find('[data-vean-switch-thumb] [data-vean-icon]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('is checked when the effective scheme is dark', () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark' }));
      const wrapper = mountInProvider(true);
      expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBe('true');
      expect(wrapper.find('[data-vean-switch-thumb] [data-vean-icon]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('forwards an accessible label to the switch control', () => {
      const wrapper = mountInProvider();
      expect(wrapper.find('[role="switch"]').attributes('aria-label')).toBe('Toggle color scheme');
      wrapper.unmount();
    });

    it('does not render an icon when showIcon is false', () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SThemeModeSwitch },
          template: '<SConfigProvider><SThemeModeSwitch :show-icon="false" /></SConfigProvider>'
        },
        { attachTo: document.body }
      );
      expect(wrapper.find('[data-vean-switch-thumb] [data-vean-icon]').exists()).toBe(false);
      wrapper.unmount();
    });
  });

  describe('interaction', () => {
    it('toggles the effective theme to dark on click', async () => {
      const wrapper = mountInProvider();
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      await wrapper.find('[role="switch"]').trigger('click');

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBe('true');
      wrapper.unmount();
    });

    it('toggles back to light on a second click', async () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ mode: 'dark' }));
      const wrapper = mountInProvider(true);

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      await wrapper.find('[role="switch"]').trigger('click');

      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBe('false');
      wrapper.unmount();
    });
  });
});
