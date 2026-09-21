import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import type { MenuOptionData } from '@/components/menu';
import { SMenubar } from '@/components/menubar';
import { getA11yViolations } from '../../shared/a11y';

const items: MenuOptionData<string>[] = [
  {
    value: 'file',
    label: 'File',
    children: [
      { value: 'new-tab', label: 'New Tab', shortcut: '⌘T' },
      { value: 'share', label: 'Share', children: [{ value: 'email', label: 'Email' }] },
      { value: 'print', label: 'Print', disabled: true }
    ]
  },
  {
    value: 'edit',
    label: 'Edit',
    children: [{ value: 'undo', label: 'Undo' }]
  },
  {
    value: 'github',
    label: 'GitHub',
    href: 'https://github.com/soybeanjs/vean-ui'
  }
];

function mountMenubar(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { SConfigProvider, SMenubar },
      setup() {
        return { items };
      },
      template: `
        <SConfigProvider>
          <SMenubar :items="items" :portal-props="{ disabled: true }" v-bind="extraProps" />
        </SConfigProvider>
      `,
      data() {
        return { extraProps: props };
      }
    },
    { attachTo: document.body }
  );
}

describe('SMenubar', () => {
  describe('rendering', () => {
    it('renders the menubar root and trigger items', () => {
      const wrapper = mountMenubar();

      expect(wrapper.find('[role="menubar"]').exists()).toBe(true);
      expect(wrapper.findAll('[role="menuitem"]')).toHaveLength(3);
      expect(wrapper.find('[data-vean-menubar-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-menubar-trigger][data-value="file"]').exists()).toBe(true);
      expect(wrapper.find('a[href="https://github.com/soybeanjs/vean-ui"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies the size variant class to the root', () => {
      const wrapper = mountMenubar({ size: 'sm' });

      const root = wrapper.find('[role="menubar"]');
      expect(root.classes()).toContain('text-xs');

      wrapper.unmount();
    });
  });

  describe('hidden items', () => {
    it('drops hidden triggers and hidden menu options', async () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SMenubar },
          setup() {
            return {
              items: [
                {
                  value: 'file',
                  label: 'File',
                  children: [
                    { value: 'new-tab', label: 'New Tab' },
                    { value: 'print', label: 'Print', hidden: true }
                  ]
                },
                {
                  value: 'hidden-menu',
                  label: 'Hidden Menu',
                  children: [{ value: 'x', label: 'X' }],
                  hidden: true
                },
                { value: 'edit', label: 'Edit', children: [{ value: 'undo', label: 'Undo' }] }
              ] satisfies MenuOptionData<string>[]
            };
          },
          template: `
            <SConfigProvider>
              <SMenubar :items="items" :portal-props="{ disabled: true }" />
            </SConfigProvider>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.findAll('[role="menuitem"]')).toHaveLength(2);
      expect(wrapper.text()).not.toContain('Hidden Menu');

      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');

      await trigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      expect(wrapper.text()).toContain('New Tab');
      expect(wrapper.text()).not.toContain('Print');

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('opens the menu on pointerdown and reflects aria-expanded', async () => {
      const wrapper = mountMenubar();
      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');

      await trigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('true');
      expect(trigger.attributes('aria-controls')).toBeTruthy();
      expect(trigger.attributes('data-state')).toBe('open');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('emits update:modelValue when a trigger is activated', async () => {
      const wrapper = mount(SMenubar, {
        props: { items, modelValue: '', portalProps: { disabled: true } },
        attachTo: document.body
      });
      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="edit"]');

      await trigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['edit']);

      wrapper.unmount();
    });
  });

  describe('disabled triggers', () => {
    const disabledItems: MenuOptionData<string>[] = [
      {
        value: 'disabled-menu',
        label: 'Disabled',
        disabled: true,
        children: [{ value: 'child', label: 'Child' }]
      },
      { value: 'active-menu', label: 'Active', children: [{ value: 'ok', label: 'OK' }] }
    ];

    it('renders a disabled top-level trigger as inert and ignores activation', async () => {
      const wrapper = mount(
        {
          components: { SConfigProvider, SMenubar },
          setup() {
            return { disabledItems };
          },
          template: `
            <SConfigProvider>
              <SMenubar :items="disabledItems" :portal-props="{ disabled: true }" />
            </SConfigProvider>
          `
        },
        { attachTo: document.body }
      );

      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="disabled-menu"]');

      expect(trigger.attributes('aria-disabled')).toBe('true');
      expect(trigger.attributes('tabindex')).toBe('-1');

      await trigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('false');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('disables all triggers when the compact disabled prop is set, including link triggers', async () => {
      const linkItems: MenuOptionData<string>[] = [
        { value: 'github', label: 'GitHub', href: 'https://github.com/soybeanjs/vean-ui' },
        { value: 'file', label: 'File', children: [{ value: 'new-tab', label: 'New Tab' }] }
      ];

      const wrapper = mount(
        {
          components: { SConfigProvider, SMenubar },
          setup() {
            return { linkItems };
          },
          template: `
            <SConfigProvider>
              <SMenubar :items="linkItems" disabled :portal-props="{ disabled: true }" />
            </SConfigProvider>
          `
        },
        { attachTo: document.body }
      );

      wrapper.findAll('[data-vean-menubar-trigger]').forEach(trigger => {
        expect(trigger.attributes('aria-disabled')).toBe('true');
      });

      const linkTrigger = wrapper.find('[data-vean-menubar-trigger][data-value="github"]');
      expect(linkTrigger.element.tagName).toBe('A');
      expect(linkTrigger.attributes('aria-disabled')).toBe('true');

      const fileTrigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');
      await fileTrigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('trigger modes', () => {
    it('opens the menu on pointer enter in hover mode', async () => {
      const wrapper = mountMenubar({ trigger: 'hover', delayDuration: 0 });
      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');

      await trigger.trigger('pointerenter');
      await new Promise(resolve => window.setTimeout(resolve, 0));
      await nextTick();
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('true');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('delays the first hover open and switches to a sibling instantly while a menu is open', async () => {
      const wrapper = mountMenubar({ trigger: 'hover', delayDuration: 50, skipDelayDuration: 300 });
      const [fileTrigger, editTrigger] = wrapper.findAll('[data-vean-menubar-trigger]');

      // The first open waits for `delayDuration`.
      await fileTrigger.trigger('pointerenter');
      await new Promise(resolve => window.setTimeout(resolve, 10));
      expect(fileTrigger.attributes('aria-expanded')).toBe('false');

      await new Promise(resolve => window.setTimeout(resolve, 50));
      await nextTick();
      expect(fileTrigger.attributes('aria-expanded')).toBe('true');

      // While a menu is open, the shared skip-delay window (the Popper delay group
      // provided by the menubar root) makes the sibling trigger open instantly and the
      // previously open menu closes.
      await editTrigger.trigger('pointerenter');
      await new Promise(resolve => window.setTimeout(resolve, 0));
      await nextTick();

      expect(editTrigger.attributes('aria-expanded')).toBe('true');
      expect(fileTrigger.attributes('aria-expanded')).toBe('false');

      wrapper.unmount();
    });

    it('keeps the menu open while the pointer moves from the trigger to the popup', async () => {
      const wrapper = mountMenubar({ trigger: 'hover', delayDuration: 0 });
      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');

      await trigger.trigger('pointerenter');
      await new Promise(resolve => window.setTimeout(resolve, 20));
      await nextTick();
      expect(trigger.attributes('aria-expanded')).toBe('true');

      // Leaving the single trigger must not close the menu: the grace anchor is the whole
      // menubar container (shared hover surface), so closing is owned by the container's
      // grace area exit, not by the trigger's hover machine.
      await trigger.trigger('pointerleave');
      await new Promise(resolve => window.setTimeout(resolve, 20));
      await nextTick();
      expect(trigger.attributes('aria-expanded')).toBe('true');

      // Entering the teleported popup keeps the menu open.
      const positioner = document.querySelector('[data-vean-popper-positioner]') as HTMLElement;
      expect(positioner).toBeTruthy();
      positioner.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, clientX: 10, clientY: 100 }));
      await new Promise(resolve => window.setTimeout(resolve, 20));
      await nextTick();
      expect(trigger.attributes('aria-expanded')).toBe('true');

      // Leaving the popup and moving away from the menubar closes the menu through the
      // grace area exit.
      positioner.dispatchEvent(new MouseEvent('pointerleave', { bubbles: false, clientX: 10, clientY: 100 }));
      await new Promise(resolve => window.setTimeout(resolve, 20));
      await nextTick();
      document.body.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 500, clientY: 500 }));
      await new Promise(resolve => window.setTimeout(resolve, 20));
      await nextTick();
      expect(trigger.attributes('aria-expanded')).toBe('false');

      wrapper.unmount();
    });

    it('ignores pointer down in hover mode', async () => {
      const wrapper = mountMenubar({ trigger: 'hover' });
      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');

      await trigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('false');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('opens the menu on pointer down in click mode', async () => {
      const wrapper = mountMenubar({ trigger: 'click' });
      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');

      await trigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('true');
      expect(wrapper.find('[role="menu"][data-state="open"]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('collapsible overflow', () => {
    it('drops the trailing "more" menu when collapsible is turned off', async () => {
      const wrapper = mount(SMenubar, {
        props: {
          items: items.slice(0, 2),
          collapsible: true,
          moreLabel: 'More',
          portalProps: { disabled: true }
        },
        attachTo: document.body
      });

      const container = wrapper.find('[data-vean-menubar-overflow]').element as HTMLElement;
      const root = wrapper.find('[data-vean-menubar-root]').element as HTMLElement;

      // happy-dom performs no layout, so force the measured overflow the reflow
      // loop reads: the root always overflows its container.
      Object.defineProperty(container, 'clientWidth', { configurable: true, get: () => 80 });
      Object.defineProperty(root, 'scrollWidth', { configurable: true, get: () => 800 });

      // A new items array re-runs the reflow, which now sees an overflowing bar.
      await wrapper.setProps({ items });
      await flushPromises();

      expect(wrapper.text()).toContain('More');

      await wrapper.setProps({ collapsible: false });
      await flushPromises();

      // Regression guard: the measured overflow count leaked out of collapsible
      // mode and kept rendering the "more" menu over a bar that now holds every
      // trigger.
      expect(wrapper.find('[data-vean-menubar-overflow]').exists()).toBe(false);
      expect(wrapper.text()).not.toContain('More');
      expect(wrapper.findAll('[role="menuitem"]')).toHaveLength(3);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when closed', async () => {
      const wrapper = mountMenubar();

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations when a menu is open', async () => {
      // Real usage renders the open menu in a teleported portal; scanning the
      // whole body covers both the menubar and the portal content. Keeping the
      // portal disabled here would nest the menu inside the menubar and trigger
      // a false-positive `aria-required-children` violation (menubar only allows
      // menuitem children).
      const wrapper = mount(
        {
          components: { SConfigProvider, SMenubar },
          setup() {
            return { items };
          },
          template: `
            <SConfigProvider>
              <SMenubar :items="items" />
            </SConfigProvider>
          `
        },
        { attachTo: document.body }
      );

      const trigger = wrapper.find('[data-vean-menubar-trigger][data-value="file"]');
      await trigger.trigger('pointerdown', { button: 0, ctrlKey: false });
      await nextTick();
      await nextTick();

      // Custom rules replace the a11y.ts defaults, so re-declare them here.
      const violations = await getA11yViolations(document.body, {
        rules: {
          'color-contrast': { enabled: false },
          'svg-img-alt': { enabled: false },
          'image-alt': { enabled: false },
          'frame-tested': { enabled: false },
          // Page-level best-practice rule; the bare test page has no landmark
          // elements, so it would flag every component under scan.
          region: { enabled: false }
        }
      });
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
