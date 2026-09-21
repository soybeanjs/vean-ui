import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue';
import { mount } from '@vue/test-utils';
import SSplitNav from '@/components/split-nav/split-nav.vue';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  {
    value: 'overview',
    label: 'Overview',
    icon: 'lucide:house'
  },
  {
    value: 'workspace',
    label: 'Workspace',
    icon: 'lucide:folder-tree',
    children: [
      {
        value: 'projects',
        label: 'Projects',
        icon: 'lucide:folder-kanban',
        children: [
          {
            value: 'vean',
            label: 'Vean'
          }
        ]
      },
      {
        value: 'tasks',
        label: 'Tasks'
      }
    ]
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: 'lucide:settings'
  }
];

const disabledItems = [
  {
    value: 'overview',
    label: 'Overview'
  },
  {
    value: 'locked',
    label: 'Locked',
    disabled: true
  }
];

const expandItems = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: 'lucide:house'
  },
  {
    value: 'workbench',
    label: 'Workbench',
    icon: 'lucide:layout-grid',
    children: [
      {
        value: 'projects',
        label: 'Projects',
        children: [{ value: 'vean-ui', label: 'Vean UI' }]
      },
      {
        value: 'tasks',
        label: 'Tasks'
      },
      {
        value: 'calendar',
        label: 'Calendar'
      }
    ]
  },
  {
    value: 'system',
    label: 'System',
    icon: 'lucide:settings',
    children: [
      {
        value: 'users',
        label: 'Users',
        children: [{ value: 'admins', label: 'Admins' }]
      },
      {
        value: 'roles',
        label: 'Roles'
      }
    ]
  }
];

describe('SSplitNav', () => {
  describe('rendering', () => {
    it('renders the root and first-level rail for dual-vertical mode', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-root]').attributes('data-mode')).toBe('dual-vertical');
      expect(wrapper.find('[data-vean-split-nav-root]').element.tagName).toBe('NAV');
      expect(wrapper.find('[data-vean-split-nav-dual-vertical]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-vertical-first-level]').exists()).toBe(true);
      expect(wrapper.findAll('[data-vean-split-nav-first-level-item]')).toHaveLength(3);
      expect(wrapper.find('[data-vean-split-nav-first-level-item]').attributes('data-orientation')).toBe('vertical');

      wrapper.unmount();
    });

    it('renders a nested dual-vertical pane for horizontal-dual-vertical when a parent is active', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'horizontal-dual-vertical',
          modelValue: 'workspace'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-root]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-split-nav-horizontal-first-level]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-dual-vertical]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-vertical-first-level]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Projects');
      expect(wrapper.text()).toContain('Tasks');

      wrapper.unmount();
    });

    it('renders horizontal first-level and nested tree for horizontal-vertical', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'horizontal-vertical',
          modelValue: 'workspace'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-root]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-split-nav-horizontal-first-level]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-first-level-item]').attributes('data-orientation')).toBe('horizontal');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-tree-menu-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').text()).toContain('Projects');

      wrapper.unmount();
    });

    it('renders vertical first-level and nested tree-nav for vertical-horizontal', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'vertical-horizontal',
          modelValue: 'workspace'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-root]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-split-nav-vertical-first-level]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-sub-horizontal]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-tree-nav]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-sub-horizontal]').text()).toContain('Projects');
      expect(wrapper.find('[data-vean-split-nav-sub-horizontal]').text()).toContain('Tasks');

      wrapper.unmount();
    });

    it('forwards first-level-item and item slots', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          modelValue: 'workspace'
        },
        slots: {
          'first-level-item': ({ item }: { item: { label: string } }) =>
            h('span', { class: 'first-level-slot' }, `Rail:${item.label}`),
          item: ({ item }: { item: { label: string } }) => h('span', { class: 'tree-item-slot' }, `Item:${item.label}`)
        },
        attachTo: document.body
      });

      expect(wrapper.find('.first-level-slot').exists()).toBe(true);
      expect(wrapper.text()).toContain('Rail:Overview');
      expect(wrapper.find('.tree-item-slot').exists()).toBe(true);
      expect(wrapper.text()).toContain('Item:Projects');

      wrapper.unmount();
    });

    /**
     * `top-left` / `top-right` are the cells above the two columns of a
     * dual-vertical menu: the host injects a brand there and the menu keeps the
     * column geometry — the rail's divider included — around it.
     */
    it('renders the top slots above the two dual-vertical columns', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          modelValue: 'vean'
        },
        slots: {
          'top-left': () => h('span', { class: 'top-left-slot' }, 'Mark'),
          'top-right': () => h('span', { class: 'top-right-slot' }, 'Title')
        },
        attachTo: document.body
      });

      const topLeft = wrapper.find('[data-vean-split-nav-vertical-rail] [data-vean-split-nav-top-left]');

      expect(topLeft.find('.top-left-slot').exists()).toBe(true);
      // The cell is the rail column's own first child, stacked above the box the
      // rail fills.
      expect(topLeft.element.nextElementSibling).toBe(
        wrapper.find('[data-vean-split-nav-vertical-first-level]').element.parentElement
      );
      expect(
        wrapper.find('[data-vean-split-nav-sub-vertical] [data-vean-split-nav-top-right] .top-right-slot').exists()
      ).toBe(true);

      wrapper.unmount();
    });

    it('drops the top-right cell while the pane column does not exist', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          modelValue: 'overview'
        },
        slots: {
          'top-left': () => h('span', { class: 'top-left-slot' }, 'Mark'),
          'top-right': () => h('span', { class: 'top-right-slot' }, 'Title')
        },
        attachTo: document.body
      });

      // The active first-level menu has no children: the sidebar is the rail
      // alone, so only its cell has a column to sit on.
      expect(wrapper.find('[data-vean-split-nav-top-left]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-top-right]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('reports the pane collapsed state to the top slots', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          modelValue: 'vean',
          collapsed: true
        },
        slots: {
          'top-left': ({ collapsed }: { collapsed: boolean }) => h('span', { class: 'left-state' }, String(collapsed)),
          'top-right': ({ collapsed }: { collapsed: boolean }) => h('span', { class: 'right-state' }, String(collapsed))
        },
        attachTo: document.body
      });

      expect(wrapper.find('.left-state').text()).toBe('true');
      expect(wrapper.find('.right-state').text()).toBe('true');

      wrapper.unmount();
    });

    /**
     * The divider between the two columns is the pane's own leading edge, so the
     * pane marks itself as the second column of a dual-vertical menu and the
     * recipe hangs that border on the marker.
     */
    it('marks the second column of a dual-vertical menu', () => {
      const dualVertical = mount(SSplitNav, {
        props: {
          items,
          modelValue: 'vean'
        },
        attachTo: document.body
      });

      expect(
        dualVertical.find('[data-vean-split-nav-sub-vertical]').attributes('data-vean-split-nav-dual-vertical-pane')
      ).toBeDefined();

      dualVertical.unmount();

      const lonePane = mount(SSplitNav, {
        props: {
          items,
          mode: 'horizontal-vertical',
          modelValue: 'vean'
        },
        attachTo: document.body
      });

      // Nothing precedes a lone pane, so its edge stays the host's to draw.
      expect(
        lonePane.find('[data-vean-split-nav-sub-vertical]').attributes('data-vean-split-nav-dual-vertical-pane')
      ).toBeUndefined();

      lonePane.unmount();
    });

    it('applies class to the standalone dual-vertical pane', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          class: 'custom-pane'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-dual-vertical]').classes()).toContain('custom-pane');

      wrapper.unmount();
    });

    it('does not leak as / asChild props to the DOM', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items
        },
        attachTo: document.body
      });
      const html = wrapper.html();

      expect(html).not.toContain('aschild');
      expect(html).not.toMatch(/as="/);

      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('reflects the default selected value on the first-level item', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          defaultValue: 'overview'
        },
        attachTo: document.body
      });

      const selectedItem = wrapper.find('[data-vean-split-nav-first-level-item][data-selected="true"]');

      expect(selectedItem.exists()).toBe(true);
      expect(selectedItem.text()).toContain('Overview');

      wrapper.unmount();
    });

    it('emits update:modelValue and select when a leaf is clicked', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const leaf = wrapper.find('[data-vean-split-nav-first-level-item][data-value="overview"]');

      await leaf.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('overview');
      expect(wrapper.emitted('select')?.at(-1)?.[0]).toBe('overview');
      expect(leaf.attributes('data-selected')).toBe('true');
      expect(leaf.attributes('data-state')).toBe('closed');

      wrapper.unmount();
    });

    it('keeps the selected leaf when a parent pane is opened', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical',
          modelValue: 'overview'
        },
        attachTo: document.body
      });

      const leaf = wrapper.find('[data-vean-split-nav-first-level-item][data-value="overview"]');
      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(leaf.attributes('data-selected')).toBe('true');
      expect(parent.attributes('data-state')).toBe('open');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('falls back inside its own instance when a sibling instance shares item values', async () => {
      const wrapperA = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });
      const wrapperB = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical',
          modelValue: 'workspace'
        },
        attachTo: document.body
      });

      const projectsB = wrapperB.find('[data-vean-tree-menu-button][data-value="projects"]');
      expect(projectsB.exists()).toBe(true);

      await projectsB.trigger('keydown', { key: 'ArrowLeft' });

      const workspaceB = wrapperB.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');
      expect(document.activeElement).toBe(workspaceB.element);

      const workspaceA = wrapperA.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');
      expect(document.activeElement).not.toBe(workspaceA.element);

      wrapperA.unmount();
      wrapperB.unmount();
    });

    it('opens a parent pane without selecting it', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('select')).toBeFalsy();
      expect(parent.attributes('data-state')).toBe('open');
      expect(parent.attributes('aria-expanded')).toBe('true');
      expect(wrapper.find('[data-vean-tree-menu-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').attributes('data-state')).toBe('expanded');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').text()).toContain('Projects');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').text()).toContain('Tasks');

      wrapper.unmount();
    });

    it('marks a first-level parent as child-selected when a descendant is selected', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical',
          modelValue: 'vean'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      expect(parent.attributes('data-state')).toBe('open');
      expect(parent.attributes('data-child-selected')).toBeDefined();
      expect(wrapper.find('[data-vean-split-nav-first-level-item][data-selected="true"]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('does not open a vertical first-level parent with ArrowDown', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('keydown', { key: 'ArrowDown' });

      expect(parent.attributes('data-state')).toBe('closed');
      expect(parent.attributes('data-selected')).toBe('false');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('does not open a vertical first-level parent with the backward key ArrowLeft', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('keydown', { key: 'ArrowLeft' });

      expect(parent.attributes('data-state')).toBe('closed');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(false);
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('opens a vertical first-level parent with ArrowRight', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('keydown', { key: 'ArrowRight' });

      expect(parent.attributes('data-state')).toBe('open');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(true);
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('opens a horizontal first-level parent with ArrowDown', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'horizontal-vertical'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('keydown', { key: 'ArrowDown' });

      expect(parent.attributes('data-state')).toBe('open');
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(true);
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('forwards collapsed to the nested TreeMenu pane', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical',
          modelValue: 'workspace',
          collapsed: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').attributes('data-state')).toBe('expanded');
      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('expanded');

      await wrapper.setProps({ collapsed: true });

      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').attributes('data-state')).toBe('collapsed');
      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('collapsed');

      wrapper.unmount();
    });

    it('emits update:modelValue and select when a nested TreeNav leaf is clicked', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'vertical-horizontal',
          modelValue: 'workspace'
        },
        attachTo: document.body
      });

      const tasks = wrapper
        .find('[data-vean-tree-nav]')
        .findAll('button')
        .find(button => button.text() === 'Tasks');

      expect(tasks).toBeDefined();

      await tasks?.trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('tasks');
      expect(wrapper.emitted('select')?.at(-1)?.[0]).toBe('tasks');

      wrapper.unmount();
    });

    it('supports v-model:collapsed from a parent host', async () => {
      const Host = defineComponent({
        setup() {
          const collapsed = ref(false);

          return {
            collapsed,
            items
          };
        },
        template: `
          <div>
            <button type="button" data-test="toggle-collapsed" @click="collapsed = !collapsed">Toggle</button>
            <SSplitNav
              v-model:collapsed="collapsed"
              mode="dual-vertical"
              model-value="workspace"
              :items="items"
            />
          </div>
        `
      });

      const wrapper = mount(Host, {
        global: {
          components: { SSplitNav }
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').attributes('data-state')).toBe('expanded');

      await wrapper.find('[data-test="toggle-collapsed"]').trigger('click');

      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').attributes('data-state')).toBe('collapsed');
      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('collapsed');

      wrapper.unmount();
    });
  });

  describe('expand strategy', () => {
    it('expands the selected chain on mount by default', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: expandItems,
          mode: 'dual-vertical',
          defaultValue: 'vean-ui'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );
      expect(wrapper.text()).toContain('Vean UI');

      wrapper.unmount();
    });

    it('keeps a manually expanded branch when another leaf is selected', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: expandItems,
          mode: 'dual-vertical',
          defaultValue: 'calendar'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'false'
      );

      await wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );

      await wrapper.find('[data-vean-tree-menu-button][data-value="tasks"]').trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('tasks');
      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );

      wrapper.unmount();
    });

    it('restores a branch expanded before switching first-level parents', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: expandItems,
          mode: 'dual-vertical',
          defaultValue: 'tasks'
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').trigger('click');
      await nextTick();

      await wrapper.find('[data-vean-split-nav-first-level-item][data-value="system"]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-tree-menu-button][data-value="users"]').attributes('aria-expanded')).toBe(
        'false'
      );

      await wrapper.find('[data-vean-split-nav-first-level-item][data-value="workbench"]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );
      expect(wrapper.text()).toContain('Vean UI');

      wrapper.unmount();
    });

    it('expands only the selected chain with expandStrategy="selected"', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: expandItems,
          mode: 'dual-vertical',
          defaultValue: 'vean-ui',
          expandStrategy: 'selected'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );
      expect(wrapper.text()).toContain('Vean UI');

      wrapper.unmount();
    });

    it('collapses a non-selected branch with expandStrategy="selected"', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: expandItems,
          mode: 'dual-vertical',
          defaultValue: 'calendar',
          expandStrategy: 'selected'
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );

      await wrapper.find('[data-vean-tree-menu-button][data-value="tasks"]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'false'
      );
      expect(wrapper.text()).not.toContain('Vean UI');

      wrapper.unmount();
    });

    it('forwards expandStrategy to the nested TreeMenu of horizontal-vertical mode', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: expandItems,
          mode: 'horizontal-vertical',
          defaultValue: 'calendar',
          expandStrategy: 'selected'
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').trigger('click');
      await nextTick();

      await wrapper.find('[data-vean-tree-menu-button][data-value="tasks"]').trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'false'
      );

      wrapper.unmount();
    });

    it('does not leak expandStrategy to the DOM', () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: expandItems,
          expandStrategy: 'selected'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-root]').attributes('expandstrategy')).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('open event', () => {
    it('emits open with the complete parent item when a parent is clicked', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('click');

      expect(wrapper.emitted('open')).toHaveLength(1);
      expect(wrapper.emitted('open')?.at(-1)?.[0]).toMatchObject({
        value: 'workspace',
        label: 'Workspace',
        children: [{ value: 'projects' }, { value: 'tasks' }]
      });
      expect(wrapper.emitted('select')).toBeFalsy();
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('does not emit open when a leaf is clicked', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const leaf = wrapper.find('[data-vean-split-nav-first-level-item][data-value="overview"]');

      await leaf.trigger('click');

      expect(wrapper.emitted('open')).toBeFalsy();
      expect(wrapper.emitted('select')?.at(-1)?.[0]).toBe('overview');

      wrapper.unmount();
    });

    it('emits open when a vertical first-level parent is opened with the forward key ArrowRight', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical'
        },
        attachTo: document.body
      });

      const parent = wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]');

      await parent.trigger('keydown', { key: 'ArrowRight' });

      expect(wrapper.emitted('open')).toHaveLength(1);
      expect(wrapper.emitted('open')?.at(-1)?.[0]).toMatchObject({ value: 'workspace' });
      expect(wrapper.emitted('select')).toBeFalsy();

      wrapper.unmount();
    });

    it('activates the first child when the host reacts to open', async () => {
      const Host = defineComponent({
        setup() {
          const active = shallowRef('');

          function handleOpen(item: { children?: { value: string }[] }) {
            const firstChild = item.children?.[0];

            if (firstChild) {
              active.value = firstChild.value;
            }
          }

          return {
            active,
            items,
            handleOpen
          };
        },
        template: `
          <div>
            <span data-test="active">{{ active }}</span>
            <SSplitNav v-model="active" mode="dual-vertical" :items="items" @open="handleOpen" />
          </div>
        `
      });

      const wrapper = mount(Host, {
        global: {
          components: { SSplitNav }
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]').trigger('click');

      expect(wrapper.find('[data-test="active"]').text()).toBe('projects');
      expect(
        wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]').attributes('data-child-selected')
      ).toBeDefined();
      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('hidden options', () => {
    it('drops hidden first-level items and hidden children of a nested pane', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          mode: 'dual-vertical',
          items: [
            { value: 'overview', label: 'Overview' },
            { value: 'secret', label: 'Secret', hidden: true },
            {
              value: 'workspace',
              label: 'Workspace',
              children: [
                { value: 'projects', label: 'Projects' },
                { value: 'internal', label: 'Internal', hidden: true }
              ]
            }
          ]
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-split-nav-first-level-item]')).toHaveLength(2);
      expect(wrapper.text()).not.toContain('Secret');

      await wrapper.find('[data-vean-split-nav-first-level-item][data-value="workspace"]').trigger('click');

      const pane = wrapper.find('[data-vean-split-nav-sub-vertical]');
      expect(pane.text()).toContain('Projects');
      expect(pane.text()).not.toContain('Internal');

      wrapper.unmount();
    });
  });

  describe('disabled', () => {
    it('blocks activation for a disabled first-level item', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items: disabledItems
        },
        attachTo: document.body
      });

      const locked = wrapper.find('[data-vean-split-nav-first-level-item][data-value="locked"]');

      expect(locked.attributes('data-disabled')).toBeDefined();

      await locked.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });
  });

  describe('teleport', () => {
    it('mounts the dual-vertical pane as one block into the vertical target', async () => {
      const siderEl = document.createElement('div');
      siderEl.id = 'split-nav-sider';
      document.body.appendChild(siderEl);

      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'dual-vertical',
          modelValue: 'workspace',
          verticalMountedId: 'split-nav-sider'
        },
        attachTo: document.body
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(siderEl.querySelector('[data-vean-split-nav-dual-vertical]')).toBeTruthy();
      expect(siderEl.querySelector('[data-vean-split-nav-root]')).toBe(
        siderEl.querySelector('[data-vean-split-nav-dual-vertical]')
      );
      expect(siderEl.querySelector('[data-vean-split-nav-vertical-first-level]')).toBeTruthy();
      expect(siderEl.querySelector('[data-vean-split-nav-sub-vertical]')).toBeTruthy();

      wrapper.unmount();
      siderEl.remove();
    });

    it('mounts horizontal and vertical panes into independent targets', async () => {
      const headerEl = document.createElement('div');
      headerEl.id = 'split-nav-header';
      const siderEl = document.createElement('div');
      siderEl.id = 'split-nav-sider';
      document.body.appendChild(headerEl);
      document.body.appendChild(siderEl);

      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'horizontal-vertical',
          modelValue: 'workspace',
          horizontalMountedId: 'split-nav-header',
          verticalMountedId: 'split-nav-sider'
        },
        attachTo: document.body
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(headerEl.querySelector('[data-vean-split-nav-horizontal-first-level]')).toBeTruthy();
      expect(siderEl.querySelector('[data-vean-split-nav-sub-vertical]')).toBeTruthy();

      wrapper.unmount();
      headerEl.remove();
      siderEl.remove();
    });

    it('mounts vertical-horizontal first-level and tree-nav into independent targets', async () => {
      const headerEl = document.createElement('div');
      headerEl.id = 'split-nav-vh-header';
      const siderEl = document.createElement('div');
      siderEl.id = 'split-nav-vh-sider';
      document.body.appendChild(headerEl);
      document.body.appendChild(siderEl);

      const wrapper = mount(SSplitNav, {
        props: {
          items,
          mode: 'vertical-horizontal',
          modelValue: 'workspace',
          verticalMountedId: 'split-nav-vh-sider',
          horizontalMountedId: 'split-nav-vh-header'
        },
        attachTo: document.body
      });

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(siderEl.querySelector('[data-vean-split-nav-vertical-first-level]')).toBeTruthy();
      expect(headerEl.querySelector('[data-vean-split-nav-sub-horizontal]')).toBeTruthy();
      expect(headerEl.querySelector('[data-vean-tree-nav]')).toBeTruthy();
      expect(siderEl.querySelector('[data-vean-split-nav-sub-horizontal]')).toBeNull();
      expect(headerEl.querySelector('[data-vean-split-nav-vertical-first-level]')).toBeNull();

      wrapper.unmount();
      headerEl.remove();
      siderEl.remove();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default state', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.find('[data-vean-split-nav-dual-vertical]').element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with an active nested pane', async () => {
      const wrapper = mount(SSplitNav, {
        props: {
          items,
          defaultValue: 'workspace'
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.find('[data-vean-split-nav-dual-vertical]').element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
