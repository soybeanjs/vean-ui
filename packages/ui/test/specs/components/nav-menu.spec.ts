import { afterEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SNavMenu from '@/components/nav-menu/nav-menu.vue';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  { value: 'guide', label: 'Guide', href: '/guide' },
  {
    value: 'components',
    label: 'Components',
    href: '/components',
    children: [{ value: 'button', label: 'Button', href: '/components/button' }]
  },
  { value: 'help', label: 'Help', href: '/help', disabled: true }
];

const hoverItems = [
  {
    value: 'one',
    label: 'One',
    href: '/one',
    children: [{ value: 'one-a', label: 'One A', href: '/one-a' }]
  },
  {
    value: 'two',
    label: 'Two',
    href: '/two',
    children: [{ value: 'two-a', label: 'Two A', href: '/two-a' }]
  }
];

describe('SNavMenu', () => {
  describe('rendering', () => {
    it('renders the root structure and item labels', () => {
      const wrapper = mount(SNavMenu, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.find('nav').exists()).toBe(true);
      expect(wrapper.find('nav ul').exists()).toBe(true);
      expect(wrapper.findAll('[data-vean-nav-menu-item]')).toHaveLength(3);
      expect(wrapper.text()).toContain('Guide');
      expect(wrapper.find('a[href="/guide"]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('hidden items', () => {
    it('drops hidden items and hidden sub items', async () => {
      const wrapper = mount(SNavMenu, {
        props: {
          items: [
            { value: 'guide', label: 'Guide', href: '/guide' },
            { value: 'secret', label: 'Secret', href: '/secret', hidden: true },
            {
              value: 'components',
              label: 'Components',
              href: '/components',
              children: [
                { value: 'button', label: 'Button', href: '/components/button' },
                { value: 'internal', label: 'Internal', href: '/internal', hidden: true }
              ]
            }
          ]
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-nav-menu-item]')).toHaveLength(2);
      expect(wrapper.text()).not.toContain('Secret');

      await wrapper.find('[data-vean-nav-menu-trigger]').trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('Button');
      expect(wrapper.text()).not.toContain('Internal');

      wrapper.unmount();
    });

    it('renders an item whose children are all hidden as a leaf link', () => {
      const wrapper = mount(SNavMenu, {
        props: {
          items: [
            {
              value: 'components',
              label: 'Components',
              href: '/components',
              children: [{ value: 'button', label: 'Button', href: '/components/button', hidden: true }]
            }
          ]
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-nav-menu-trigger]')).toHaveLength(0);
      expect(wrapper.find('a[href="/components"]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('open state', () => {
    it('opens the submenu on trigger click and toggles it closed again', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items },
        attachTo: document.body
      });

      const trigger = wrapper.find('[data-vean-nav-menu-trigger]');
      expect(trigger.attributes('aria-expanded')).toBe('false');

      await trigger.trigger('click');
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('true');
      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Button');

      await trigger.trigger('click');
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('false');
      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('emits update:modelValue when a trigger is toggled', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-nav-menu-trigger]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();

      wrapper.unmount();
    });

    it('applies the subLink UI slot to submenu links', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items, ui: { subLink: 'w-60' } },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-nav-menu-trigger]').trigger('click');
      await nextTick();

      const subLink = wrapper.find('[data-vean-nav-menu-content] [data-vean-nav-menu-link]');
      expect(subLink.exists()).toBe(true);
      expect(subLink.classes()).toContain('w-60');

      wrapper.unmount();
    });

    it('flags the positioner as settled via data-settled after placed', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-nav-menu-trigger]').trigger('click');
      await nextTick();

      // wait for the positioner's post-flush `placed` effect (+ its deferred rAF) to run
      const viewport = document.querySelector('[data-vean-nav-menu-viewport]');
      await vi.waitFor(() => {
        expect(viewport?.getAttribute('data-settled')).toBe('');
      });

      wrapper.unmount();
    });

    it('closes the menu on Escape', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items },
        attachTo: document.body
      });

      const trigger = wrapper.find('[data-vean-nav-menu-trigger]');

      await trigger.trigger('click');
      await nextTick();
      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await nextTick();

      expect(trigger.attributes('aria-expanded')).toBe('false');

      wrapper.unmount();
    });
  });

  describe('hover open/close (single shared Popper machine)', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('opens after the open delay and switches instantly between triggers', async () => {
      vi.useFakeTimers();

      const wrapper = mount(SNavMenu, {
        props: { items: hoverItems },
        attachTo: document.body
      });

      const triggers = wrapper.findAll('[data-vean-nav-menu-trigger]');

      await triggers[0].trigger('pointerenter', { pointerType: 'mouse' });
      await vi.advanceTimersByTimeAsync(200);
      await nextTick();

      expect(triggers[0].attributes('data-state')).toBe('open');
      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(true);

      // the shared-surface grace override means leaving a trigger does not close it
      await triggers[0].trigger('pointerleave', { pointerType: 'mouse' });
      await vi.advanceTimersByTimeAsync(300);
      await nextTick();
      expect(triggers[0].attributes('data-state')).toBe('open');

      // entering the second trigger switches instantly (shared machine already open)
      await triggers[1].trigger('pointerenter', { pointerType: 'mouse' });
      await nextTick();

      expect(triggers[1].attributes('data-state')).toBe('open');
      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('closes an open menu when hovering a root-level leaf link', async () => {
      vi.useFakeTimers();

      const wrapper = mount(SNavMenu, {
        props: {
          items: [...hoverItems, { value: 'leaf', label: 'Leaf', href: '/leaf' }]
        },
        attachTo: document.body
      });

      const trigger = wrapper.find('[data-vean-nav-menu-trigger]');

      await trigger.trigger('pointerenter', { pointerType: 'mouse' });
      await vi.advanceTimersByTimeAsync(200);
      await nextTick();

      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(true);

      // a root-level link without children has no flyout: entering it dismisses the open menu
      await wrapper.find('a[href="/leaf"]').trigger('pointerenter', { pointerType: 'mouse' });
      await nextTick();

      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(false);
      expect(trigger.attributes('data-state')).not.toBe('open');

      wrapper.unmount();
    });

    it('does not open on hover when disableHoverTrigger is set, but still opens on click', async () => {
      vi.useFakeTimers();

      const wrapper = mount(SNavMenu, {
        props: { items: hoverItems, disableHoverTrigger: true },
        attachTo: document.body
      });

      const triggers = wrapper.findAll('[data-vean-nav-menu-trigger]');

      await triggers[0].trigger('pointerenter', { pointerType: 'mouse' });
      await vi.advanceTimersByTimeAsync(300);
      await nextTick();

      expect(triggers[0].attributes('aria-expanded')).toBe('false');

      await triggers[0].trigger('click');
      await nextTick();

      expect(triggers[0].attributes('aria-expanded')).toBe('true');

      wrapper.unmount();
    });

    it('does not open on click when disableClickTrigger is set, but still opens on hover', async () => {
      vi.useFakeTimers();

      const wrapper = mount(SNavMenu, {
        props: { items: hoverItems, disableClickTrigger: true },
        attachTo: document.body
      });

      const triggers = wrapper.findAll('[data-vean-nav-menu-trigger]');

      await triggers[0].trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(false);

      await triggers[0].trigger('pointerenter', { pointerType: 'mouse' });
      await vi.advanceTimersByTimeAsync(200);
      await nextTick();

      expect(triggers[0].attributes('aria-expanded')).toBe('true');

      wrapper.unmount();
    });
  });

  describe('keyboard navigation (menubar-like)', () => {
    it('opens the flyout with ArrowDown in horizontal mode and focuses the first item', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items: hoverItems },
        attachTo: document.body
      });

      const trigger = wrapper.find('[data-vean-nav-menu-trigger]');
      (trigger.element as HTMLElement).focus();

      await trigger.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      expect(wrapper.find('[data-vean-nav-menu-content]').exists()).toBe(true);
      // focus moved into the content's first link
      expect(document.activeElement?.closest('[data-vean-nav-menu-content]')).toBeTruthy();

      wrapper.unmount();
    });

    it('moves focus between triggers with ArrowLeft/ArrowRight in horizontal mode', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items: hoverItems },
        attachTo: document.body
      });

      const triggers = wrapper.findAll('[data-vean-nav-menu-trigger]');
      (triggers[0].element as HTMLElement).focus();

      await triggers[0].trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      expect(document.activeElement).toBe(triggers[1].element);

      await triggers[1].trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();
      expect(document.activeElement).toBe(triggers[0].element);

      wrapper.unmount();
    });

    it('does not move focus with ArrowUp in horizontal mode', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items: hoverItems },
        attachTo: document.body
      });

      const triggers = wrapper.findAll('[data-vean-nav-menu-trigger]');
      (triggers[0].element as HTMLElement).focus();

      await triggers[0].trigger('keydown', { key: 'ArrowUp' });
      await nextTick();
      expect(document.activeElement).toBe(triggers[0].element);

      wrapper.unmount();
    });

    it('moves focus between triggers with ArrowDown/ArrowUp in vertical mode', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items: hoverItems, orientation: 'vertical' },
        attachTo: document.body
      });

      const triggers = wrapper.findAll('[data-vean-nav-menu-trigger]');
      (triggers[0].element as HTMLElement).focus();

      await triggers[0].trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      expect(document.activeElement).toBe(triggers[1].element);

      wrapper.unmount();
    });
  });

  describe('nested flyout', () => {
    const nestedItems = [
      {
        value: 'one',
        label: 'One',
        href: '/one',
        children: [
          {
            value: 'one-a',
            label: 'One A',
            href: '/one-a',
            children: [
              {
                value: 'one-a-1',
                label: 'One A 1',
                href: '/one-a-1',
                children: [{ value: 'one-a-1-x', label: 'One A 1 X', href: '/one-a-1-x' }]
              },
              { value: 'one-a-2', label: 'One A 2', href: '/one-a-2' }
            ]
          },
          { value: 'one-b', label: 'One B', href: '/one-b' }
        ]
      }
    ];

    const openRoot = async (wrapper: ReturnType<typeof mount>) => {
      await wrapper.find('[data-vean-nav-menu-trigger]').trigger('click');
      await nextTick();
      expect(document.querySelector('[data-vean-nav-menu-content]')).toBeTruthy();
    };

    it('opens a nested flyout on sub-trigger click and keeps the root menu open', async () => {
      const wrapper = mount(SNavMenu, { props: { items: nestedItems }, attachTo: document.body });
      await openRoot(wrapper);

      const subTrigger = document.querySelector('[data-vean-nav-menu-sub-trigger]') as HTMLElement;
      expect(subTrigger).toBeTruthy();
      expect(subTrigger.getAttribute('aria-expanded')).toBe('false');

      subTrigger.click();
      await nextTick();

      expect(subTrigger.getAttribute('aria-expanded')).toBe('true');
      const flyout = document.querySelector('[data-vean-nav-menu-sub-content]') as HTMLElement;
      expect(flyout).toBeTruthy();
      expect(flyout.textContent).toContain('One A 1');
      expect(flyout.textContent).toContain('One A 2');
      // the root viewport stays open underneath
      expect(document.querySelector('[data-vean-nav-menu-content]')).toBeTruthy();

      wrapper.unmount();
    });

    it('opens the nested flyout on hover after the open delay', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SNavMenu, { props: { items: nestedItems }, attachTo: document.body });
      await openRoot(wrapper);

      const subTrigger = document.querySelector('[data-vean-nav-menu-sub-trigger]') as HTMLElement;
      subTrigger.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }));
      await vi.advanceTimersByTimeAsync(200);
      await nextTick();

      expect(document.querySelector('[data-vean-nav-menu-sub-content]')).toBeTruthy();

      vi.useRealTimers();
      wrapper.unmount();
    });

    it('closes the flyout on Escape while keeping the root menu open', async () => {
      const wrapper = mount(SNavMenu, { props: { items: nestedItems }, attachTo: document.body });
      await openRoot(wrapper);

      const subTrigger = document.querySelector('[data-vean-nav-menu-sub-trigger]') as HTMLElement;
      subTrigger.click();
      await nextTick();
      expect(document.querySelector('[data-vean-nav-menu-sub-content]')).toBeTruthy();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await nextTick();

      expect(document.querySelector('[data-vean-nav-menu-sub-content]')).toBeNull();
      expect(document.querySelector('[data-vean-nav-menu-content]')).toBeTruthy();

      wrapper.unmount();
    });

    it('closes the nested flyout when the root menu closes', async () => {
      const wrapper = mount(SNavMenu, { props: { items: nestedItems }, attachTo: document.body });
      await openRoot(wrapper);

      const subTrigger = document.querySelector('[data-vean-nav-menu-sub-trigger]') as HTMLElement;
      subTrigger.click();
      await nextTick();
      expect(document.querySelector('[data-vean-nav-menu-sub-content]')).toBeTruthy();

      // closing the root trigger cascades to the nested flyout (Popper nesting)
      await wrapper.find('[data-vean-nav-menu-trigger]').trigger('click');
      await nextTick();

      expect(document.querySelector('[data-vean-nav-menu-content]')).toBeNull();
      expect(document.querySelector('[data-vean-nav-menu-sub-content]')).toBeNull();

      wrapper.unmount();
    });

    it('recurses to arbitrary nesting depth and leaves render as links', async () => {
      const wrapper = mount(SNavMenu, { props: { items: nestedItems }, attachTo: document.body });
      await openRoot(wrapper);

      // level 3: open the "One A" flyout
      const triggers = document.querySelectorAll('[data-vean-nav-menu-sub-trigger]');
      (triggers[0] as HTMLElement).click();
      await nextTick();

      // level 4: "One A 1" also has children -> a deeper sub trigger appears
      const deepTriggers = document.querySelectorAll('[data-vean-nav-menu-sub-trigger]');
      expect(deepTriggers.length).toBe(2);
      (deepTriggers[1] as HTMLElement).click();
      await nextTick();

      const deepFlyouts = document.querySelectorAll('[data-vean-nav-menu-sub-content]');
      expect(deepFlyouts.length).toBe(2);
      const deepFlyout = deepFlyouts[1] as HTMLElement;
      expect(deepFlyout.textContent).toContain('One A 1 X');

      // "One B" is a leaf at level 2 and renders as a link
      expect(document.querySelector('[data-vean-nav-menu-content] a[href="/one-b"]')).toBeTruthy();

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SNavMenu, {
        props: { items },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
