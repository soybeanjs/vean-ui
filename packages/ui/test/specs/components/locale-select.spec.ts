import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import { registerLocale } from '@vean/aria/locale';
import ja from '@vean/aria/locale/ja';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SIcon from '@/components/icon/icon.vue';
import SLocaleSelect from '@/components/locale-select/locale-select.vue';
import { MockResizeObserver, setupMock } from '../../shared';

const mousePointerDown = {
  button: 0,
  ctrlKey: false,
  pageX: 0,
  pageY: 0,
  pointerId: 1,
  pointerType: 'mouse'
};

const cleanup = setupMock('ResizeObserver', MockResizeObserver as typeof ResizeObserver);

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

const mountSelect = (props: Record<string, unknown> = {}, providerProps: Record<string, unknown> = {}) =>
  mount(
    {
      components: { SConfigProvider, SLocaleSelect },
      data: () => ({ props, providerProps }),
      template: '<SConfigProvider v-bind="providerProps"><SLocaleSelect v-bind="props" /></SConfigProvider>'
    },
    { attachTo: document.body }
  );

const openListbox = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('button').trigger('pointerdown', mousePointerDown);
  await nextTick();
};

const optionLabels = (): string[] =>
  Array.from(document.body.querySelectorAll('[role="option"]')).map(node => node.textContent?.trim() ?? '');

describe('SLocaleSelect', () => {
  describe('registry-driven options', () => {
    it('offers every registered locale, showing its native name', async () => {
      const wrapper = mountSelect();
      await openListbox(wrapper);

      const labels = optionLabels();

      expect(labels).toContain('English');
      expect(labels).toContain('简体中文');

      wrapper.unmount();
    });

    it('picks up a locale registered after mount', async () => {
      const wrapper = mountSelect();
      await openListbox(wrapper);

      const before = optionLabels().length;

      registerLocale(ja);
      await nextTick();

      expect(optionLabels().length).toBe(before + 1);
      expect(optionLabels()).toContain('日本語');

      wrapper.unmount();
    });

    it('narrows and reorders options through the `locales` prop', async () => {
      const wrapper = mountSelect({ locales: ['zh-CN'] });
      await openListbox(wrapper);

      expect(optionLabels()).toEqual(['简体中文']);

      wrapper.unmount();
    });

    it('drops `locales` keys that are not registered', async () => {
      const wrapper = mountSelect({ locales: ['en', 'not-registered'] });
      await openListbox(wrapper);

      expect(optionLabels()).toEqual(['English']);

      wrapper.unmount();
    });
  });

  describe('value binding', () => {
    it('falls back to the ConfigProvider locale for display', () => {
      const wrapper = mountSelect({}, { locale: 'zh-CN' });

      expect(wrapper.get('button').text()).toContain('简体中文');

      wrapper.unmount();
    });

    it('shows the placeholder when the resolved locale is not registered', () => {
      const wrapper = mountSelect({}, { locale: 'xx-YY' });

      expect(wrapper.get('button').text()).toContain('Select a locale');

      wrapper.unmount();
    });

    it('renders an accessible trigger name', () => {
      const wrapper = mountSelect({}, { locale: 'zh-CN' });

      expect(wrapper.get('button').attributes('aria-label')).toBe('Language');

      wrapper.unmount();
    });

    it('updates the trigger label after an uncontrolled pick', async () => {
      const wrapper = mountSelect();
      await openListbox(wrapper);

      const option = Array.from(document.body.querySelectorAll('[role="option"]')).find(
        node => node.textContent?.trim() === '简体中文'
      );

      await new DOMWrapper(option as Element).trigger('keydown', { key: 'Enter' });
      await flushPromises();
      await nextTick();

      // `SConfigProvider.locale` is a prop and cannot be written back, so the
      // component keeps its own display value; without it the label would stay
      // 'English' after the pick.
      expect(wrapper.get('button').text()).toContain('简体中文');

      wrapper.unmount();
    });

    it('lets a controlled locale prop win over the internal value', async () => {
      const wrapper = mountSelect({ locale: 'en' }, { locale: 'zh-CN' });

      expect(wrapper.get('button').text()).toContain('English');

      wrapper.unmount();
    });

    it('emits update:locale with the picked key', async () => {
      const wrapper = mountSelect();
      await openListbox(wrapper);

      const option = Array.from(document.body.querySelectorAll('[role="option"]')).find(
        node => node.textContent?.trim() === '简体中文'
      );

      expect(option).toBeTruthy();

      await new DOMWrapper(option as Element).trigger('keydown', { key: 'Enter' });
      await flushPromises();
      await nextTick();

      expect(wrapper.findComponent(SLocaleSelect).emitted('update:locale')).toEqual([['zh-CN']]);

      wrapper.unmount();
    });
  });

  describe('icons', () => {
    // `showTriggerIcon: false` isolates SLocaleSelect's own icon from the
    // chevrons SSelect renders in the trigger by default.
    it('renders no icon by default', () => {
      const wrapper = mountSelect({ showTriggerIcon: false });

      expect(wrapper.find('[data-vean-icon]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('renders the trigger icon when showIcon is on', () => {
      const wrapper = mountSelect({ showIcon: true, showTriggerIcon: false });

      expect(wrapper.find('[data-vean-icon]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('prefers a per-locale icon over the generic trigger icon', () => {
      const wrapper = mountSelect(
        { showIcon: true, showTriggerIcon: false, icons: { 'zh-CN': 'circle-flags:cn' } },
        { locale: 'zh-CN' }
      );

      const icons = wrapper.findAllComponents(SIcon);

      expect(icons).toHaveLength(1);
      expect(icons[0].props('icon')).toBe('circle-flags:cn');

      wrapper.unmount();
    });
  });
});
