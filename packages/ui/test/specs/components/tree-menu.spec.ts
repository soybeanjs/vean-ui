import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import STreeMenuStyledItem from '@/components/tree-menu/tree-menu-styled-item.vue';
import STreeMenu from '@/components/tree-menu/tree-menu.vue';
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
    isGroup: true,
    children: [
      {
        value: 'projects',
        label: 'Projects',
        badge: 'New'
      },
      {
        value: 'settings',
        label: 'Settings',
        children: [
          {
            value: 'profile',
            label: 'Profile'
          },
          {
            value: 'security',
            label: 'Security'
          }
        ]
      }
    ]
  }
];

const collapsedItems = [
  {
    value: 'analytics',
    label: 'Analytics',
    icon: 'lucide:chart-column',
    dropdownMenuProps: {
      open: true,
      portalProps: { disabled: true }
    },
    children: [
      {
        value: 'reports',
        label: 'Reports'
      },
      {
        value: 'insights',
        label: 'Insights'
      }
    ]
  }
];

const actionItems = [
  {
    value: 'design-engineering',
    label: 'Design Engineering',
    icon: 'lucide:frame',
    actions: [
      {
        label: 'Edit',
        value: 'edit',
        icon: 'lucide:pencil'
      },
      {
        label: 'Delete',
        value: 'delete',
        icon: 'lucide:trash'
      }
    ]
  },
  {
    value: 'plain',
    label: 'Plain'
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
  },
  {
    value: 'section',
    label: 'Section',
    disabled: true,
    children: [
      {
        value: 'child',
        label: 'Child'
      }
    ]
  }
];

const keyboardItems = [
  {
    value: 'overview',
    label: 'Overview'
  },
  {
    value: 'locked',
    label: 'Locked',
    disabled: true
  },
  {
    value: 'projects',
    label: 'Projects'
  },
  {
    value: 'settings',
    label: 'Settings',
    children: [
      {
        value: 'profile',
        label: 'Profile'
      },
      {
        value: 'security',
        label: 'Security'
      }
    ]
  }
];

function getButtonWithText(wrapper: VueWrapper, label: string) {
  const button = wrapper.findAll('[data-vean-tree-menu-button]').find(item => item.text().includes(label));

  if (!button) {
    throw new Error(`tree menu button with text "${label}" not found`);
  }

  return button;
}

describe('STreeMenu', () => {
  describe('rendering', () => {
    it('renders the compact tree menu structure', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expanded: ['settings']
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tree-menu-root]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Workspace');
      expect(wrapper.text()).toContain('Projects');
      expect(wrapper.text()).toContain('Profile');

      wrapper.unmount();
    });

    it('renders nested children only when the parent is expanded', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Profile');
      expect(wrapper.text()).toContain('Security');
      expect(wrapper.text()).not.toContain('Child-of-workspace');

      wrapper.unmount();
    });

    it('renders group labels for group items', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items
        },
        attachTo: document.body
      });

      const groupLabel = wrapper.find('[data-vean-tree-menu-group-label]');

      expect(groupLabel.exists()).toBe(true);
      expect(groupLabel.text()).toContain('Workspace');

      wrapper.unmount();
    });

    it('renders top and bottom slots', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items
        },
        slots: {
          top: '<div data-top>Top</div>',
          bottom: '<div data-bottom>Bottom</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-top]').exists()).toBe(true);
      expect(wrapper.find('[data-bottom]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders a link item as an anchor', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: [
            {
              value: 'soybean',
              label: 'Vean',
              href: 'https://veanui.com'
            }
          ]
        },
        attachTo: document.body
      });

      const link = wrapper.find('a[data-vean-tree-menu-button]');

      expect(link.exists()).toBe(true);
      expect(link.attributes('href')).toBe('https://veanui.com');

      wrapper.unmount();
    });

    it('renders the item actions trigger with a localized aria-label', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: actionItems
        },
        attachTo: document.body
      });

      const actionButton = wrapper.find('[data-vean-dropdown-menu-trigger]');

      expect(actionButton.exists()).toBe(true);
      expect(actionButton.attributes('aria-label')).toBe('Open Design Engineering actions');

      wrapper.unmount();
    });

    it('does not leak as / asChild props to the DOM', () => {
      const wrapper = mount(STreeMenu, {
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

    it('forwards item slots through the compact wrapper', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items
        },
        slots: {
          item: ({ item }) => h('span', { class: 'tree-menu-item-slot' }, `Item:${item.label}`)
        },
        attachTo: document.body
      });

      expect(wrapper.find('.tree-menu-item-slot').exists()).toBe(true);
      expect(wrapper.text()).toContain('Item:Overview');

      wrapper.unmount();
    });

    it('forwards item-leading and item-trailing slots', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items
        },
        slots: {
          'item-leading': ({ item }) => h('span', { class: 'leading-slot' }, `Lead:${item.label}`),
          'item-trailing': ({ item }) => h('span', { class: 'trailing-slot' }, `Trail:${item.label}`)
        },
        attachTo: document.body
      });

      expect(wrapper.find('.leading-slot').exists()).toBe(true);
      expect(wrapper.find('.trailing-slot').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('hidden options', () => {
    it('drops hidden options and their subtrees from the rendered tree', () => {
      const wrapper = mount(STreeMenu, {
        props: {
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
          ],
          expanded: ['workspace']
        }
      });

      expect(wrapper.text()).toContain('Overview');
      expect(wrapper.text()).toContain('Projects');
      expect(wrapper.text()).not.toContain('Secret');
      expect(wrapper.text()).not.toContain('Internal');

      wrapper.unmount();
    });

    it('renders a branch whose children are all hidden without a collapsible trigger', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: [
            {
              value: 'workspace',
              label: 'Workspace',
              children: [{ value: 'projects', label: 'Projects', hidden: true }]
            }
          ]
        }
      });

      expect(wrapper.findAll('[data-vean-tree-menu-collapsible-root]')).toHaveLength(0);
      expect(wrapper.text()).toContain('Workspace');

      wrapper.unmount();
    });
  });

  describe('state', () => {
    it('activates the default value on mount', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultValue: 'overview'
        },
        attachTo: document.body
      });

      const selectedButton = wrapper.find('[data-vean-tree-menu-button][data-selected="true"]');

      expect(selectedButton.exists()).toBe(true);
      expect(selectedButton.text()).toContain('Overview');

      wrapper.unmount();
    });

    it('emits update:modelValue when a leaf item is clicked', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          modelValue: 'projects'
        },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-tree-menu-button]')[0].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('overview');

      wrapper.unmount();
    });

    it('respects a controlled modelValue', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          modelValue: 'overview'
        },
        attachTo: document.body
      });

      await wrapper.findAll('[data-vean-tree-menu-button]')[0].trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('overview');

      await wrapper.setProps({ modelValue: 'projects' });

      expect(wrapper.find('[data-vean-tree-menu-button][data-selected="true"]').text()).toContain('Projects');

      wrapper.unmount();
    });
  });

  describe('expand and collapse', () => {
    it('expands a parent on click and exposes the collapsible state', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items
        },
        attachTo: document.body
      });

      expect(wrapper.text()).not.toContain('Profile');

      const parentTrigger = wrapper.find('[data-vean-tree-menu-collapsible-trigger]');

      expect(parentTrigger.attributes('aria-expanded')).toBe('false');

      await parentTrigger.trigger('click');

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(wrapper.text()).toContain('Profile');

      wrapper.unmount();
    });

    it('collapses an expanded parent on a second click', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Profile');

      await wrapper.find('[data-vean-tree-menu-collapsible-trigger]').trigger('click');

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('false');
      expect(wrapper.text()).not.toContain('Profile');

      wrapper.unmount();
    });

    it('emits update:expanded for a controlled expanded state', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-tree-menu-collapsible-trigger]').trigger('click');

      expect(wrapper.emitted('update:expanded')?.at(-1)?.[0]).toEqual(['settings']);

      wrapper.unmount();
    });

    it('restores the expanded state after toggling collapse off', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Profile');

      await wrapper.setProps({ collapsed: true });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('collapsed');
      expect(wrapper.text()).not.toContain('Profile');

      await wrapper.setProps({ collapsed: false });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('expanded');
      expect(wrapper.text()).toContain('Profile');

      wrapper.unmount();
    });
  });

  describe('expand strategy', () => {
    it('defaults to "keep" and preserves manual expansion when another item is activated', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      const trigger = wrapper.find('[data-vean-tree-menu-collapsible-trigger]');

      expect(trigger.attributes('aria-expanded')).toBe('true');

      await getButtonWithText(wrapper, 'Security').trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('security');
      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(wrapper.text()).toContain('Profile');
      expect(wrapper.emitted('update:expanded')).toBeFalsy();

      wrapper.unmount();
    });

    it('expands the ancestors of the initial selected value under "keep"', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          modelValue: 'security'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(wrapper.text()).toContain('Security');

      wrapper.unmount();
    });

    it('expands the ancestors when the selected value changes from outside under "keep"', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          modelValue: 'overview'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('false');

      await wrapper.setProps({ modelValue: 'security' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(wrapper.emitted('update:expanded')?.at(-1)?.[0]).toEqual(['settings']);

      wrapper.unmount();
    });

    it('never collapses user-managed branches when the selected value changes under "keep"', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          modelValue: 'profile',
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.emitted('update:expanded')).toBeFalsy();

      // activating a sibling leaf inside the same expanded branch adds nothing
      await getButtonWithText(wrapper, 'Security').trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('security');
      expect(wrapper.emitted('update:expanded')).toBeFalsy();
      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');

      wrapper.unmount();
    });

    it('"active" strategy expands only the active menu and its ancestors on mount', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expandStrategy: 'selected',
          defaultValue: 'security'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(wrapper.text()).toContain('Security');
      expect(wrapper.text()).toContain('Profile');

      wrapper.unmount();
    });

    it('"active" strategy emits update:expanded without group nodes', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expandStrategy: 'selected',
          defaultValue: 'security'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.emitted('update:expanded')?.at(-1)?.[0]).toEqual(['settings', 'security']);

      wrapper.unmount();
    });

    it('"active" strategy collapses non-active branches when the active menu changes', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expandStrategy: 'selected',
          defaultValue: 'security'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');

      await getButtonWithText(wrapper, 'Projects').trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('projects');
      expect(wrapper.emitted('update:expanded')?.at(-1)?.[0]).toEqual(['projects']);
      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('false');
      expect(wrapper.text()).not.toContain('Profile');

      wrapper.unmount();
    });

    it('"active" strategy expands nothing when no menu is active', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expandStrategy: 'selected'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('false');
      expect(wrapper.text()).not.toContain('Profile');

      wrapper.unmount();
    });

    it('"active" strategy expands nothing when the active value is not in the tree', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expandStrategy: 'selected',
          defaultValue: 'missing'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('false');

      wrapper.unmount();
    });

    it('switching from "keep" to "active" collapses the menu to the active path', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultValue: 'security',
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');

      await wrapper.setProps({ expandStrategy: 'selected' });
      await nextTick();

      expect(wrapper.emitted('update:expanded')?.at(-1)?.[0]).toEqual(['settings', 'security']);
      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');

      wrapper.unmount();
    });

    it('switching from "active" to "keep" preserves the current expansion', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expandStrategy: 'selected',
          defaultValue: 'security'
        },
        attachTo: document.body
      });

      await nextTick();

      await wrapper.setProps({ expandStrategy: 'keep' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(wrapper.text()).toContain('Profile');

      wrapper.unmount();
    });

    it('"active" strategy re-syncs the active path after uncollapsing', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expandStrategy: 'selected',
          defaultValue: 'security',
          collapsed: true
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('collapsed');

      await wrapper.setProps({ collapsed: false });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(wrapper.text()).toContain('Security');

      wrapper.unmount();
    });
  });

  describe('collapsed', () => {
    it('renders collapsed child menus with dropdown-menu compact', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          collapsed: true,
          items: collapsedItems,
          modelValue: 'analytics'
        },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('collapsed');
      expect(document.body.textContent).toContain('Reports');
      expect(document.body.textContent).toContain('Insights');

      wrapper.unmount();
    });
  });

  describe('disabled', () => {
    it('blocks activation for a disabled item', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: disabledItems,
          modelValue: 'overview'
        },
        attachTo: document.body
      });

      const lockedButton = wrapper.findAll('[data-vean-tree-menu-button]')[1];

      expect(lockedButton.attributes('data-disabled')).toBeDefined();

      await lockedButton.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('blocks expansion for a disabled parent', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: disabledItems
        },
        attachTo: document.body
      });

      const sectionTrigger = wrapper.find('[data-vean-tree-menu-collapsible-trigger]');

      await sectionTrigger.trigger('click');

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('false');
      expect(wrapper.text()).not.toContain('Child');

      wrapper.unmount();
    });
  });

  describe('keyboard', () => {
    it('renders interactive elements as native buttons', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items
        },
        attachTo: document.body
      });

      const buttons = wrapper.findAll('[data-vean-tree-menu-button]');

      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach(button => {
        expect(button.element.tagName).toBe('BUTTON');
      });

      wrapper.unmount();
    });

    it('marks the collapsible trigger with aria-expanded for screen readers', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      // the content id is initialized in the content component setup, wait for it to settle
      await nextTick();
      await nextTick();

      const trigger = wrapper.find('[data-vean-tree-menu-collapsible-trigger]');

      expect(trigger.attributes('aria-expanded')).toBe('true');
      expect(trigger.attributes('aria-controls')).toBeTruthy();

      wrapper.unmount();
    });

    it('marks the selected item button with aria-current semantics via data-selected', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultValue: 'overview'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tree-menu-button][data-selected="true"]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('keyboard navigation', () => {
    it('exposes the tree semantics', () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('role')).toBe('tree');

      const item = wrapper.find('[data-vean-tree-menu-item]');

      // The item wrapper carries the treeitem role and its selection state.
      expect(item.attributes('role')).toBe('treeitem');
      expect(item.attributes('aria-selected')).toBe('false');

      // Nested lists become groups.
      expect(wrapper.find('[data-vean-tree-menu-sub]').attributes('role')).toBe('group');

      wrapper.unmount();
    });

    it('converges to a single tab stop and focuses the active item on entry', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: keyboardItems,
          defaultExpanded: ['settings'],
          defaultValue: 'profile'
        },
        attachTo: document.body
      });

      const buttons = wrapper.findAll('[data-vean-tree-menu-button]');

      // Every item is removed from the natural tab order.
      buttons.forEach(button => {
        expect(button.attributes('tabindex')).toBe('-1');
      });

      // Entering the tree focuses the active item.
      await wrapper.find('[data-vean-tree-menu-root]').trigger('focus');
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Profile');
      expect(getButtonWithText(wrapper, 'Profile').attributes('tabindex')).toBe('0');

      wrapper.unmount();
    });

    it('roams visible items with ↓/↑, skips disabled items and stops at the edges', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: keyboardItems
        },
        attachTo: document.body
      });

      const [overview, , projects] = wrapper.findAll('[data-vean-tree-menu-button]');

      (overview.element as HTMLElement).focus();

      // The disabled "locked" item is skipped.
      await overview.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      expect(document.activeElement).toBe(projects.element);

      // No wrap-around at the end: focus stays on the last item.
      const settings = getButtonWithText(wrapper, 'Settings');
      (settings.element as HTMLElement).focus();

      await settings.trigger('keydown', { key: 'ArrowDown' });
      await nextTick();

      expect(document.activeElement).toBe(settings.element);

      await settings.trigger('keydown', { key: 'ArrowUp' });
      await nextTick();

      expect(document.activeElement).toBe(projects.element);

      wrapper.unmount();
    });

    it('expands, enters children, returns to the parent and collapses with ←/→', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: keyboardItems
        },
        attachTo: document.body
      });

      const settings = getButtonWithText(wrapper, 'Settings');
      (settings.element as HTMLElement).focus();

      // Closed branch: expands in place, focus does not move.
      await settings.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(settings.element);

      // Expanded branch: moves into the first child.
      await settings.trigger('keydown', { key: 'ArrowRight' });
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Profile');

      // Leaf child: ← returns to the parent.
      const profile = getButtonWithText(wrapper, 'Profile');
      await profile.trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement).toBe(settings.element);

      // Expanded branch: ← collapses in place.
      await settings.trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-collapsible-trigger]').attributes('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(settings.element);

      wrapper.unmount();
    });

    it('treats ← on a root-level leaf as a no-op', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: keyboardItems
        },
        attachTo: document.body
      });

      const overview = getButtonWithText(wrapper, 'Overview');
      (overview.element as HTMLElement).focus();

      await overview.trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();

      expect(document.activeElement).toBe(overview.element);
      expect(wrapper.emitted('update:expanded')).toBeFalsy();

      wrapper.unmount();
    });

    it('jumps to the first and last visible item with Home/End', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: keyboardItems,
          defaultExpanded: ['settings']
        },
        attachTo: document.body
      });

      const security = getButtonWithText(wrapper, 'Security');
      (security.element as HTMLElement).focus();

      await security.trigger('keydown', { key: 'Home' });
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Overview');

      const overview = getButtonWithText(wrapper, 'Overview');
      await overview.trigger('keydown', { key: 'End' });
      await nextTick();

      expect(document.activeElement?.textContent).toContain('Security');

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in the default expanded state', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items,
          expanded: ['settings']
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations in the collapsed state', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          collapsed: true,
          items: collapsedItems
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations with item actions', async () => {
      const wrapper = mount(STreeMenu, {
        props: {
          items: actionItems
        },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});

/**
 * `STreeMenuStyledItem` is the row the menu's own items are drawn with, for content
 * that is not a menu node: a brand, a trigger, a footer row.
 */
describe('STreeMenuStyledItem', () => {
  const root = '[data-vean-tree-menu-styled-item]';
  const row = '[data-vean-tree-menu-styled-item-button]';

  const slots = { default: '<span data-row>Row</span>' };

  it('renders a native button row by default', () => {
    const wrapper = mount(STreeMenuStyledItem, { slots });

    const rowElement = wrapper.find(row);

    expect(wrapper.find(root).exists()).toBe(true);
    expect(rowElement.element.tagName).toBe('BUTTON');
    // A bare `button` submits the form it sits in.
    expect(rowElement.attributes('type')).toBe('button');
    expect(wrapper.find('[data-row]').exists()).toBe(true);

    wrapper.unmount();
  });

  it('drops the button semantics for another element', () => {
    const wrapper = mount(STreeMenuStyledItem, { props: { as: 'div' }, slots });

    const rowElement = wrapper.find(row);

    expect(rowElement.element.tagName).toBe('DIV');
    expect(rowElement.attributes('type')).toBeUndefined();

    wrapper.unmount();
  });

  it('merges the row into the consumer element with asChild', () => {
    const wrapper = mount(STreeMenuStyledItem, {
      props: { asChild: true },
      slots: { default: '<a data-link href="#row">Row</a>' }
    });

    const link = wrapper.find('[data-link]');

    expect(link.attributes('href')).toBe('#row');
    expect(link.attributes('data-vean-tree-menu-styled-item-button')).toBeDefined();
    // The consumer's element keeps its own semantics.
    expect(link.attributes('type')).toBeUndefined();

    wrapper.unmount();
  });

  it('declares the disabled state on every element, and the attribute only on a button', () => {
    const button = mount(STreeMenuStyledItem, { props: { disabled: true }, slots });
    const buttonRow = button.find(row);

    expect(buttonRow.attributes('data-disabled')).toBe('');
    expect(buttonRow.attributes('aria-disabled')).toBe('true');
    expect(buttonRow.attributes('disabled')).toBeDefined();

    button.unmount();

    const div = mount(STreeMenuStyledItem, { props: { as: 'div', disabled: true }, slots });
    const divRow = div.find(row);

    expect(divRow.attributes('data-disabled')).toBe('');
    expect(divRow.attributes('aria-disabled')).toBe('true');
    // A non-form element is not a disabled control: nested content decides.
    expect(divRow.attributes('disabled')).toBeUndefined();

    div.unmount();
  });

  it('leaves an enabled row unmarked', () => {
    const wrapper = mount(STreeMenuStyledItem, { slots });
    const rowElement = wrapper.find(row);

    expect(rowElement.attributes('data-disabled')).toBeUndefined();
    expect(rowElement.attributes('aria-disabled')).toBeUndefined();
    expect(rowElement.attributes('disabled')).toBeUndefined();

    wrapper.unmount();
  });

  it('sizes the row from the recipe and keeps slot overrides on their slots', () => {
    const wrapper = mount(STreeMenuStyledItem, {
      props: { size: 'lg', class: 'root-x', ui: { button: 'button-x' } },
      slots
    });

    expect(wrapper.find(root).classes()).toContain('root-x');
    // The row metrics come from the same size recipe the menu uses.
    expect(wrapper.find(row).classes()).toContain('h-9');
    expect(wrapper.find(row).classes()).toContain('button-x');

    wrapper.unmount();
  });

  it('has no a11y violations for a themed row', async () => {
    const wrapper = mount(STreeMenuStyledItem, {
      slots,
      attachTo: document.body
    });

    const violations = await getA11yViolations(wrapper.element);

    expect(violations).toHaveLength(0);

    wrapper.unmount();
  });
});
