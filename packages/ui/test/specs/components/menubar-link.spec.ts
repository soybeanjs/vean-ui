import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import type { MenuOptionData } from '@/components/menu';
import { SMenubar } from '@/components/menubar';

const items: MenuOptionData<string>[] = [
  {
    value: 'file',
    label: 'File',
    children: [{ value: 'new-tab', label: 'New Tab' }]
  },
  {
    value: 'github',
    label: 'GitHub',
    href: 'https://github.com/soybeanjs/vean-ui'
  }
];

function mountMenubar() {
  return mount(
    {
      components: {
        SConfigProvider,
        SMenubar
      },
      setup() {
        return {
          items
        };
      },
      template: `
        <SConfigProvider>
          <SMenubar :items="items" :portal-props="{ disabled: true }" />
        </SConfigProvider>
      `
    },
    {
      attachTo: document.body
    }
  );
}

function waitForDismissableLayer() {
  return new Promise(resolve => {
    window.setTimeout(resolve, 0);
  });
}

describe('SMenubar link trigger', () => {
  it('does not prevent default on pointerdown for link triggers', async () => {
    const wrapper = mountMenubar();
    const linkTrigger = wrapper.find('[data-vean-menubar-trigger][data-value="github"]');
    const event = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 });

    linkTrigger.element.dispatchEvent(event);
    await nextTick();

    expect(event.defaultPrevented).toBe(false);
    expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('keeps focus on the link trigger when hovering from an open menu', async () => {
    const wrapper = mountMenubar();
    const triggers = wrapper.findAll('[data-vean-menubar-trigger]');
    const fileTrigger = triggers[0];
    const linkTrigger = triggers[1];

    await fileTrigger.trigger('pointerdown', { button: 0, ctrlKey: false });
    await nextTick();
    await nextTick();

    expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(true);

    await linkTrigger.trigger('pointerenter');
    await nextTick();
    await nextTick();
    await waitForDismissableLayer();

    expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);
    expect(document.activeElement).toBe(linkTrigger.element);
    expect(linkTrigger.attributes('data-highlighted')).toBe('');
    wrapper.unmount();
  });

  it('keeps focus on the link trigger when arrow navigation leaves an open menu', async () => {
    const wrapper = mountMenubar();
    const triggers = wrapper.findAll('[data-vean-menubar-trigger]');
    const fileTrigger = triggers[0];
    const linkTrigger = triggers[1];

    (fileTrigger.element as HTMLElement).focus();

    await fileTrigger.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    await nextTick();
    await waitForDismissableLayer();

    const content = wrapper.find('[role="menu"][data-state="open"]');

    expect(content.exists()).toBe(true);

    await content.trigger('keydown', { key: 'ArrowRight' });
    await nextTick();
    await nextTick();
    await waitForDismissableLayer();

    expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);
    expect(document.activeElement).toBe(linkTrigger.element);
    expect(linkTrigger.attributes('data-highlighted')).toBe('');
    wrapper.unmount();
  });
});
