import { beforeEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import SClipboard from '@/components/clipboard/clipboard.vue';
import type { ClipboardProps, ClipboardSlotProps } from '@/components/clipboard/types';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import { copyTextToClipboard } from '../../../../aria/src/components/clipboard/shared';
import { getA11yViolations } from '../../shared/a11y';

const writeText = vi.fn(async () => undefined);
const execCommand = vi.fn(() => true);
const createPermissionStatus = () => ({
  state: 'granted' as const,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
});

type ClipboardTestSlotValue = string | ((props: ClipboardSlotProps) => string);

type ClipboardTestSlots = Record<string, ClipboardTestSlotValue> & {
  leading?: ClipboardTestSlotValue;
  default?: ClipboardTestSlotValue;
  trailing?: ClipboardTestSlotValue;
};

function mountClipboard(props: Partial<ClipboardProps> = {}, slots: ClipboardTestSlots = {}) {
  return mount(SClipboard, {
    attachTo: document.body,
    props: {
      value: 'vean-ui',
      ...props
    },
    slots
  });
}

beforeEach(() => {
  writeText.mockClear();
  execCommand.mockClear();

  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText
    }
  });

  Object.defineProperty(window.navigator, 'permissions', {
    configurable: true,
    value: {
      query: vi.fn(async () => createPermissionStatus())
    }
  });

  Object.defineProperty(window, 'isSecureContext', {
    configurable: true,
    value: true
  });

  Object.defineProperty(document, 'execCommand', {
    configurable: true,
    value: execCommand
  });
});

describe('clipboard shared', () => {
  it('falls back to legacy copy when writeText fails', async () => {
    writeText.mockRejectedValueOnce(new Error('permission denied'));

    await copyTextToClipboard('vean-ui', true);

    expect(writeText).toHaveBeenCalledWith('vean-ui');
    expect(execCommand).toHaveBeenCalledWith('copy');
  });
});

describe('SClipboard', () => {
  describe('rendering', () => {
    it('renders default icon/text content from the Aria layer', () => {
      const wrapper = mount(
        {
          components: {
            SClipboard,
            SConfigProvider
          },
          setup() {
            return {
              iconRender: (icon: string) => h('span', { 'data-testid': 'icon' }, icon)
            };
          },
          template: `
            <SConfigProvider :icon-render="iconRender">
              <SClipboard value="vean-ui" />
            </SConfigProvider>
          `
        },
        {
          attachTo: document.body
        }
      );

      expect(wrapper.text()).toContain('Copy');
      expect(wrapper.find('[data-testid="icon"]').text()).toBe('lucide:copy');
      wrapper.unmount();
    });

    it('uses custom icon props when provided', async () => {
      const wrapper = mount(
        {
          components: {
            SClipboard,
            SConfigProvider
          },
          setup() {
            return {
              iconRender: (icon: string) => h('span', { 'data-testid': 'icon' }, icon)
            };
          },
          template: `
            <SConfigProvider :icon-render="iconRender">
              <SClipboard value="vean-ui" copy-icon="lucide:clipboard" copied-icon="lucide:badge-check" />
            </SConfigProvider>
          `
        },
        {
          attachTo: document.body
        }
      );

      expect(wrapper.find('[data-testid="icon"]').text()).toBe('lucide:clipboard');

      await wrapper.find('button').trigger('click');
      await Promise.resolve();
      await nextTick();

      expect(wrapper.find('[data-testid="icon"]').text()).toBe('lucide:badge-check');
      wrapper.unmount();
    });

    it('applies custom class', () => {
      const wrapper = mountClipboard({ class: 'my-clipboard-class' }, { default: 'Copy' });

      expect(wrapper.find('button').classes()).toContain('my-clipboard-class');
      wrapper.unmount();
    });

    it('renders leading and trailing slots', () => {
      const wrapper = mountClipboard(
        {},
        {
          leading: '<span data-testid="leading">L</span>',
          default: 'Copy',
          trailing: '<span data-testid="trailing">T</span>'
        }
      );

      expect(wrapper.find('[data-testid="leading"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="trailing"]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('allows overriding the default icon and text via slots', () => {
      const wrapper = mountClipboard(
        {},
        {
          leading: '<span data-testid="leading">override-icon</span>',
          default: 'override-text'
        }
      );

      expect(wrapper.find('[data-testid="leading"]').text()).toBe('override-icon');
      expect(wrapper.text()).toContain('override-text');
      wrapper.unmount();
    });
  });

  describe('localization', () => {
    const mountWithProvider = (providerProps = {}, componentProps: Partial<ClipboardProps> = {}, defaultSlot = '') => {
      return mount(
        {
          components: {
            SClipboard,
            SConfigProvider
          },
          setup() {
            return {
              providerProps,
              componentProps,
              iconRender: (icon: string) => h('span', { 'data-testid': 'icon' }, icon)
            };
          },
          template: `
            <SConfigProvider :icon-render="iconRender" v-bind="providerProps">
              <SClipboard value="vean-ui" v-bind="componentProps">
                ${defaultSlot}
              </SClipboard>
            </SConfigProvider>
          `
        },
        {
          attachTo: document.body
        }
      );
    };

    it('uses the localized copy/copied text from ConfigProvider locale', async () => {
      const wrapper = mountWithProvider({ locale: 'zh-CN' });

      expect(wrapper.text()).toContain('复制');

      await wrapper.find('button').trigger('click');
      await Promise.resolve();
      await nextTick();

      expect(wrapper.text()).toContain('已复制');
      wrapper.unmount();
    });

    it('lets explicit copy-text/copied-text props override locale messages', async () => {
      const wrapper = mountWithProvider({ locale: 'zh-CN' }, { copyText: 'Copy', copiedText: 'Copied' });

      expect(wrapper.text()).toContain('Copy');
      expect(wrapper.text()).not.toContain('复制');

      await wrapper.find('button').trigger('click');
      await Promise.resolve();
      await nextTick();

      expect(wrapper.text()).toContain('Copied');
      wrapper.unmount();
    });

    it('honors ConfigProvider messages overrides for clipboard', () => {
      const wrapper = mountWithProvider({
        messages: { clipboard: { copy: 'Yank', copied: 'Yanked' } }
      });

      expect(wrapper.text()).toContain('Yank');
      expect(wrapper.text()).not.toContain('Copy');
      wrapper.unmount();
    });

    it('exposes the localized text through slot props', () => {
      const wrapper = mountWithProvider({ locale: 'zh-CN' }, {}, '<template #default="{ text }">{{ text }}</template>');

      expect(wrapper.text()).toContain('复制');
      wrapper.unmount();
    });
  });

  describe('copied state', () => {
    it('copies the value and reflects copied state', async () => {
      const wrapper = mountClipboard();

      expect(wrapper.find('button').attributes('data-state')).toBe('ready');

      await wrapper.find('button').trigger('click');
      await Promise.resolve();
      await nextTick();

      expect(wrapper.find('button').attributes('data-state')).toBe('copied');
      expect(wrapper.text()).toContain('Copied');
      expect(wrapper.emitted('copied')?.[0]).toEqual(['vean-ui']);
      wrapper.unmount();
    });

    it('copies an empty string value', async () => {
      const wrapper = mountClipboard({ value: '' }, { default: 'Copy empty' });

      await wrapper.find('button').trigger('click');
      await Promise.resolve();
      await nextTick();

      expect(writeText).toHaveBeenCalledWith('');
      expect(wrapper.emitted('copied')?.[0]).toEqual(['']);
      wrapper.unmount();
    });

    it('falls back to legacy copy when clipboard writing fails', async () => {
      writeText.mockRejectedValueOnce(new Error('permission denied'));

      const wrapper = mountClipboard({ legacy: true }, { default: 'Copy' });

      await wrapper.find('button').trigger('click');
      await flushPromises();

      expect(writeText).toHaveBeenCalledWith('vean-ui');
      expect(execCommand).toHaveBeenCalledWith('copy');
      expect(wrapper.find('button').attributes('data-state')).toBe('copied');
      expect(wrapper.emitted('copied')?.[0]).toEqual(['vean-ui']);
      wrapper.unmount();
    });

    it('emits copyError and keeps ready state when copy fails', async () => {
      writeText.mockRejectedValueOnce(new Error('permission denied'));

      const wrapper = mountClipboard({ legacy: false }, { default: 'Copy' });

      await wrapper.find('button').trigger('click');
      await Promise.resolve();
      await nextTick();

      expect(wrapper.find('button').attributes('data-state')).toBe('ready');
      expect(wrapper.emitted('copied')).toBeFalsy();
      expect(wrapper.emitted('copyError')?.[0]?.[0]).toBeInstanceOf(Error);
      wrapper.unmount();
    });
  });

  describe('unsupported state', () => {
    it('disables interaction and exposes unsupported state when clipboard is unavailable', async () => {
      Object.defineProperty(window.navigator, 'clipboard', {
        configurable: true,
        value: undefined
      });

      Object.defineProperty(window, 'isSecureContext', {
        configurable: true,
        value: false
      });

      const wrapper = mountClipboard({ legacy: false }, { default: 'Copy' });
      const button = wrapper.find('button');

      expect(button.attributes('data-state')).toBe('unsupported');
      expect(button.attributes('aria-disabled')).toBe('true');

      await button.trigger('click');

      expect(execCommand).not.toHaveBeenCalled();
      expect(wrapper.emitted('copied')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents copy interaction when disabled', async () => {
      const wrapper = mountClipboard({ disabled: true }, { default: 'Copy' });

      const button = wrapper.find('button');

      expect(button.attributes('aria-disabled')).toBe('true');
      await button.trigger('click');

      expect(writeText).not.toHaveBeenCalled();
      expect(wrapper.emitted('click')).toBeFalsy();
      expect(wrapper.emitted('copied')).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mountClipboard({}, { default: 'Copy command' });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
