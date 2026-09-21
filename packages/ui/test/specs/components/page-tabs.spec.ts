import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SPageTabs from '@/components/page-tabs/page-tabs.vue';
import { getA11yViolations } from '../../shared/a11y';

const TAB_ITEM = '[data-vean-page-tabs-item]';

const createItems = () => [
  { value: 'home', label: 'Home', pinned: true, hidePinnedIcon: true },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' }
];

const createPinItems = () => [
  { value: 'home', label: 'Home', pinned: true },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' }
];

describe('SPageTabs', () => {
  describe('rendering', () => {
    it('renders all page tab items', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-page-tabs-root]').exists()).toBe(true);
      expect(wrapper.findAll('[data-vean-page-tabs-item]')).toHaveLength(3);

      wrapper.unmount();
    });

    it('renders tab labels', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Home');
      expect(wrapper.text()).toContain('Profile');
      expect(wrapper.text()).toContain('Settings');

      wrapper.unmount();
    });

    it('renders close buttons only for closable (non-pinned) tabs', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-page-tabs-close]')).toHaveLength(2);

      wrapper.unmount();
    });

    it('renders pin button only for pinned tabs', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createPinItems(), modelValue: 'home' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-page-tabs-pin]')).toHaveLength(1);

      wrapper.unmount();
    });

    it('renders chrome indicator svg by default', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', variant: 'chrome' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-page-tabs-item]').find('svg').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders slider indicator for the slider variant', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', variant: 'slider' },
        attachTo: document.body
      });

      const item = wrapper.findAll('[data-vean-page-tabs-item]')[0];

      expect(item.find('div[class*="h-0.5"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies a custom root class', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', class: 'my-page-tabs' },
        attachTo: document.body
      });

      expect(wrapper.find('.my-page-tabs').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('selected state', () => {
    it('marks the selected item with data-selected="true"', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-page-tabs-item]')[0].attributes('data-selected')).toBe('true');
      expect(wrapper.findAll('[data-vean-page-tabs-item]')[1].attributes('data-selected')).toBe('false');

      wrapper.unmount();
    });

    it('emits update:modelValue and click when an item is clicked', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('profile');
      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')![0][0]).toMatchObject({ value: 'profile', label: 'Profile' });

      wrapper.unmount();
    });

    it('syncs data-selected internally after selection', async () => {
      // uncontrolled: no modelValue prop, so the internal state drives the DOM
      const wrapper = mount(SPageTabs, {
        props: { items: createItems() },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('click');

      const items = wrapper.findAll('[data-vean-page-tabs-item]');

      expect(items[0].attributes('data-selected')).toBe('false');
      expect(items[1].attributes('data-selected')).toBe('true');

      wrapper.unmount();
    });

    it('does not emit click when the selected tab is clicked', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[0].trigger('click');

      expect(wrapper.emitted('click')).toBeFalsy();

      wrapper.unmount();
    });

    it('emits close on middle click for a closable item', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', middleClickClose: true },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('mousedown', { button: 1 });

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')![0][0]).toMatchObject({ value: 'profile', label: 'Profile' });

      wrapper.unmount();
    });

    it('does not close on middle click when middleClickClose is false', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', middleClickClose: false },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('mousedown', { button: 1 });

      expect(wrapper.emitted('close')).toBeFalsy();

      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('activates a tab with the Enter key', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('profile');

      wrapper.unmount();
    });

    it('closes a tab with the Backspace key', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('keydown', { key: 'Backspace' });

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')![0][0]).toMatchObject({ value: 'profile' });

      wrapper.unmount();
    });
  });

  describe('close behavior', () => {
    it('emits close with tab data when the close button is clicked', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-close]')[0].trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.emitted('close')![0][0]).toMatchObject({ value: 'profile', label: 'Profile' });

      wrapper.unmount();
    });

    it('does not emit close for a pinned item', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', middleClickClose: true },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[0].trigger('mousedown', { button: 1 });

      expect(wrapper.emitted('close')).toBeFalsy();

      wrapper.unmount();
    });

    it('blocks close when beforeClose returns false', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', beforeClose: () => false },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-close]')[0].trigger('click');

      expect(wrapper.emitted('close')).toBeFalsy();
      expect(wrapper.findAll('[data-vean-page-tabs-item]')).toHaveLength(3);

      wrapper.unmount();
    });

    it('allows close when an async beforeClose resolves to true', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', beforeClose: async () => true },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-close]')[0].trigger('click');

      expect(wrapper.emitted('close')).toBeTruthy();
      expect(wrapper.findAll('[data-vean-page-tabs-item]')).toHaveLength(2);

      wrapper.unmount();
    });

    it('activates a sibling tab when the active tab is closed', async () => {
      const items = createItems();
      const wrapper = mount(SPageTabs, {
        props: { items, modelValue: 'profile' },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-close]')[0].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toBe('settings');

      wrapper.unmount();
    });
  });

  describe('pin behavior', () => {
    it('emits pin with the new pinned state when the pin button is clicked', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createPinItems(), modelValue: 'home' },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-page-tabs-pin]').trigger('click');

      expect(wrapper.emitted('pin')).toBeTruthy();
      expect(wrapper.emitted('pin')![0][0]).toMatchObject({ value: 'home', label: 'Home' });

      wrapper.unmount();
    });

    it('sorts pinned tabs to the front on mount', () => {
      // controlled items: the reordering is emitted via update:items
      const wrapper = mount(SPageTabs, {
        props: {
          items: [
            { value: 'normal1', label: 'N1' },
            { value: 'pinned1', label: 'P1', pinned: true },
            { value: 'normal2', label: 'N2' },
            { value: 'hidden', label: 'H', pinned: true, hidePinnedIcon: true }
          ],
          modelValue: 'normal1'
        },
        attachTo: document.body
      });

      const emitted = wrapper.emitted('update:items')?.[0]?.[0] as Array<{ value: string }> | undefined;

      expect(emitted?.map(item => item.value)).toEqual(['pinned1', 'hidden', 'normal1', 'normal2']);

      wrapper.unmount();
    });

    it('keeps the relative order within each zone when sorting', () => {
      // zone invariant that drag reordering relies on: pinned → unpinned,
      // with the relative order inside a zone preserved (hidePinnedIcon is
      // display-only and does not affect the zone)
      const wrapper = mount(SPageTabs, {
        props: {
          items: [
            { value: 'hidden2', label: 'H2', pinned: true, hidePinnedIcon: true },
            { value: 'normal1', label: 'N1' },
            { value: 'pinned2', label: 'P2', pinned: true },
            { value: 'normal2', label: 'N2' },
            { value: 'pinned1', label: 'P1', pinned: true },
            { value: 'normal3', label: 'N3' }
          ],
          modelValue: 'normal1'
        },
        attachTo: document.body
      });

      const emitted = wrapper.emitted('update:items')?.[0]?.[0] as Array<{ value: string }> | undefined;

      expect(emitted?.map(item => item.value)).toEqual([
        'hidden2',
        'pinned2',
        'pinned1',
        'normal1',
        'normal2',
        'normal3'
      ]);

      wrapper.unmount();
    });
  });

  describe('drag behavior', () => {
    it('locks an item with an explicit draggable: false even when the component enables dragging', () => {
      const wrapper = mount(SPageTabs, {
        props: {
          items: [
            { value: 'home', label: 'Home', pinned: true, draggable: false },
            { value: 'profile', label: 'Profile' },
            { value: 'settings', label: 'Settings' }
          ],
          modelValue: 'home',
          draggable: true
        },
        attachTo: document.body
      });

      const tabs = wrapper.findAll('[data-vean-page-tabs-item]');

      expect(tabs[0].attributes('data-draggable')).toBe('false');
      expect(tabs[1].attributes('data-draggable')).toBe('true');
      expect(tabs[2].attributes('data-draggable')).toBe('true');

      wrapper.unmount();
    });
  });

  describe('context menu', () => {
    it('emits contextmenu with the hovered tab', async () => {
      const wrapper = mount(SPageTabs, {
        props: {
          items: createItems(),
          modelValue: 'home',
          menuFactory: () => []
        },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('pointerenter');

      expect(wrapper.emitted('contextmenu')).toBeTruthy();
      expect(wrapper.emitted('contextmenu')![0][0]).toMatchObject({
        value: 'profile',
        label: 'Profile'
      });

      wrapper.unmount();
    });

    it('passes closable state into the menu factory options', async () => {
      const menuFactory = () => [];
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home', menuFactory },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-page-tabs-item]')[1].trigger('pointerenter');

      expect(wrapper.emitted('contextmenu')).toBeTruthy();

      wrapper.unmount();
    });
  });

  describe('localization', () => {
    it('localizes close and pin button aria-labels from the locale registry', () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createPinItems(), modelValue: 'home' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-page-tabs-close]').attributes('aria-label')).toBe('Close tab');
      expect(wrapper.find('[data-vean-page-tabs-pin]').attributes('aria-label')).toBe('Unpin tab');

      wrapper.unmount();
    });

    it('applies zh-CN locale via ConfigProvider', () => {
      const wrapper = mount(
        {
          components: { SPageTabs, SConfigProvider },
          template: `
            <SConfigProvider locale="zh-CN">
              <SPageTabs :items="items" model-value="home" />
            </SConfigProvider>
          `,
          data: () => ({ items: createPinItems() })
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-vean-page-tabs-close]').attributes('aria-label')).toBe('关闭标签页');
      expect(wrapper.find('[data-vean-page-tabs-pin]').attributes('aria-label')).toBe('取消固定标签页');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createItems(), modelValue: 'home' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with pinned tabs', async () => {
      const wrapper = mount(SPageTabs, {
        props: { items: createPinItems(), modelValue: 'home' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });

  describe('drag sorting', () => {
    interface DragHostItem {
      value: string;
      label: string;
      pinned?: boolean;
      draggable?: boolean;
    }

    // happy-dom reports a zero box for every element, so the harness drives the
    // hit-testing from stubbed 100px slots. Each stub resolves the element's
    // *current* DOM position, so the geometry keeps following the reorder.
    const createRect = (index: number): DOMRect =>
      ({
        x: index * 100,
        y: 0,
        left: index * 100,
        top: 0,
        width: 100,
        height: 40,
        right: index * 100 + 100,
        bottom: 40,
        toJSON: () => ({})
      }) as DOMRect;

    const fire = (target: EventTarget, type: string, init: Record<string, unknown>) => {
      const event = new Event(type, { bubbles: true, cancelable: true });

      Object.assign(event, init);
      target.dispatchEvent(event);
    };

    const createHost = (initial: DragHostItem[], modelValue: string) => {
      const items = ref<DragHostItem[]>(initial);
      const active = ref(modelValue);

      const Host = defineComponent({
        components: { SPageTabs },
        setup: () => ({ items, active }),
        template: `<SPageTabs v-model="active" v-model:items="items" draggable />`
      });

      const wrapper = mount(Host, { attachTo: document.body });
      const tabs = wrapper.findAll(TAB_ITEM);

      tabs.forEach(tab => {
        tab.element.getBoundingClientRect = () => {
          const index = wrapper.findAll(TAB_ITEM).findIndex(item => item.element === tab.element);

          return createRect(index);
        };
      });

      return {
        wrapper,
        tabs,
        // `getComponent` loses the wrapper type for these generic SFCs.
        pageTabs: wrapper.getComponent(SPageTabs) as unknown as VueWrapper,
        order: () => items.value.map(item => item.value),
        modelValue: active
      };
    };

    it('reorders a tab past its neighbours and emits the drag lifecycle', async () => {
      const { wrapper, tabs, pageTabs, order } = createHost(
        [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' },
          { value: 'd', label: 'D' }
        ],
        'a'
      );

      fire(tabs[0].element, 'pointerdown', { clientX: 50, clientY: 20, pointerId: 1, button: 0 });
      fire(window, 'pointermove', { clientX: 260, clientY: 20, pointerId: 1 });

      await nextTick();

      expect(order()).toEqual(['b', 'c', 'a', 'd']);
      expect(pageTabs.emitted('tabDragStart')).toHaveLength(1);
      expect(pageTabs.emitted('tabDragStart')![0][0]).toMatchObject({ index: 0 });
      expect(pageTabs.emitted('tabDragReorder')).toHaveLength(1);
      expect(pageTabs.emitted('tabDragReorder')![0][0]).toMatchObject({ index: 2 });
      expect(pageTabs.emitted('tabDragEnd')).toBeFalsy();

      fire(window, 'pointerup', { clientX: 260, clientY: 20, pointerId: 1 });

      await nextTick();

      expect(pageTabs.emitted('tabDragEnd')).toHaveLength(1);

      wrapper.unmount();
    });

    it('ignores pointer travel below the activation distance', async () => {
      const { wrapper, tabs, pageTabs, order } = createHost(
        [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ],
        'a'
      );

      fire(tabs[0].element, 'pointerdown', { clientX: 50, clientY: 20, pointerId: 2, button: 0 });
      fire(window, 'pointermove', { clientX: 52, clientY: 20, pointerId: 2 });

      await nextTick();

      expect(order()).toEqual(['a', 'b', 'c']);
      expect(pageTabs.emitted('tabDragStart')).toBeFalsy();

      fire(window, 'pointerup', { clientX: 52, clientY: 20, pointerId: 2 });

      wrapper.unmount();
    });

    it('keeps an unpinned tab from crossing into the pinned zone', async () => {
      const { wrapper, tabs, pageTabs, order } = createHost(
        [
          { value: 'p1', label: 'P1', pinned: true },
          { value: 'p2', label: 'P2', pinned: true },
          { value: 'u1', label: 'U1' },
          { value: 'u2', label: 'U2' }
        ],
        'u1'
      );

      // u1 sits at index 2; pulling far left must halt at the pinned boundary.
      fire(tabs[2].element, 'pointerdown', { clientX: 250, clientY: 20, pointerId: 3, button: 0 });
      fire(window, 'pointermove', { clientX: -500, clientY: 20, pointerId: 3 });

      await nextTick();

      expect(order()).toEqual(['p1', 'p2', 'u1', 'u2']);
      expect(pageTabs.emitted('tabDragReorder')).toBeFalsy();

      fire(window, 'pointerup', { clientX: -500, clientY: 20, pointerId: 3 });

      wrapper.unmount();
    });

    it('locks an item marked draggable: false in place', async () => {
      const { wrapper, tabs, pageTabs, order } = createHost(
        [
          { value: 'locked', label: 'Locked', draggable: false },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ],
        'locked'
      );

      fire(tabs[1].element, 'pointerdown', { clientX: 150, clientY: 20, pointerId: 4, button: 0 });
      fire(window, 'pointermove', { clientX: -500, clientY: 20, pointerId: 4 });

      await nextTick();

      expect(order()).toEqual(['locked', 'b', 'c']);
      expect(pageTabs.emitted('tabDragReorder')).toBeFalsy();

      fire(window, 'pointerup', { clientX: -500, clientY: 20, pointerId: 4 });

      wrapper.unmount();
    });

    it('swallows the click that concludes a drag', async () => {
      const { wrapper, tabs, pageTabs, order } = createHost(
        [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ],
        'c'
      );

      fire(tabs[0].element, 'pointerdown', { clientX: 50, clientY: 20, pointerId: 5, button: 0 });
      fire(window, 'pointermove', { clientX: 160, clientY: 20, pointerId: 5 });

      await nextTick();

      fire(window, 'pointerup', { clientX: 160, clientY: 20, pointerId: 5 });

      await nextTick();
      await tabs[0].trigger('click');

      expect(order()).toEqual(['b', 'a', 'c']);
      expect(pageTabs.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('reorders with Space and the arrow keys', async () => {
      const { wrapper, tabs, pageTabs, order } = createHost(
        [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ],
        'a'
      );

      fire(tabs[0].element, 'keydown', { key: ' ' });
      fire(tabs[0].element, 'keydown', { key: 'ArrowRight' });

      await nextTick();

      expect(order()).toEqual(['b', 'a', 'c']);
      expect(pageTabs.emitted('tabDragStart')).toHaveLength(1);

      fire(tabs[0].element, 'keydown', { key: ' ' });

      await nextTick();

      expect(pageTabs.emitted('tabDragEnd')).toHaveLength(1);

      wrapper.unmount();
    });

    it('restores the original order on Escape', async () => {
      const { wrapper, tabs, pageTabs, order } = createHost(
        [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'c', label: 'C' }
        ],
        'a'
      );

      fire(tabs[0].element, 'pointerdown', { clientX: 50, clientY: 20, pointerId: 6, button: 0 });
      fire(window, 'pointermove', { clientX: 260, clientY: 20, pointerId: 6 });

      await nextTick();

      expect(order()).toEqual(['b', 'c', 'a']);

      fire(window, 'keydown', { key: 'Escape' });

      await nextTick();

      expect(order()).toEqual(['a', 'b', 'c']);
      expect(pageTabs.emitted('tabDragEnd')).toBeFalsy();

      wrapper.unmount();
    });
  });
});
