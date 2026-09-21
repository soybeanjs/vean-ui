import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { provideViewportContext } from '@vean/aria/composables';
import SAppShell from '@/components/app-shell/app-shell.vue';
import { appShellSkeletons, splitNavCollapsedPaneWidth, toMenuOptions } from '@/components/app-shell/shared';
import type { AppShellMode } from '@/components/app-shell/types';
import SBreadcrumb from '@/components/breadcrumb/breadcrumb.vue';
import SPageTabs from '@/components/page-tabs/page-tabs.vue';
import SSplitNav from '@/components/split-nav/split-nav.vue';
import STreeMenu from '@/components/tree-menu/tree-menu.vue';
import STreeNav from '@/components/tree-nav/tree-nav.vue';
import { splitNavPaneMetrics, splitNavVariants } from '@/styles/split-nav';
import type { ThemeSize } from '@/theme';
import { getA11yViolations } from '../../shared/a11y';

const items = [
  {
    value: 'overview',
    label: 'Overview',
    icon: 'lucide:layout-dashboard'
  },
  {
    value: 'draft',
    label: 'Draft',
    icon: 'lucide:file-pen',
    hidden: true
  },
  {
    value: 'workbench',
    label: 'Workbench',
    icon: 'lucide:layout-grid',
    children: [
      {
        value: 'projects',
        label: 'Projects',
        icon: 'lucide:folder-kanban',
        children: [
          {
            value: 'vean-ui',
            label: 'Vean UI',
            icon: 'lucide:book-open'
          }
        ]
      },
      {
        value: 'tasks',
        label: 'Tasks',
        icon: 'lucide:list-todo'
      }
    ]
  }
];

const breadcrumbs = [
  {
    value: 'home',
    label: 'Home'
  },
  {
    value: 'overview',
    label: 'Overview'
  }
];

const tabs = [
  {
    value: 'overview',
    label: 'Overview'
  },
  {
    value: 'projects',
    label: 'Projects'
  }
];

const themeSizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

describe('SAppShell', () => {
  describe('rendering', () => {
    it('renders the default sidebar skeleton', () => {
      const wrapper = mount(SAppShell, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-app-shell]').attributes('data-mode')).toBe('sidebar');
      expect(wrapper.find('[data-vean-app-shell-sidebar]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-app-shell-header]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-app-shell-menu-sidebar]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-app-shell-content]').exists()).toBe(true);
      expect(wrapper.findComponent(STreeMenu).exists()).toBe(true);
      expect(wrapper.find('[data-vean-layout-root]').attributes('data-orientation')).toBe('horizontal');

      wrapper.unmount();
    });

    it('renders the logo slot only when provided', () => {
      const withoutLogo = mount(SAppShell, {
        props: { items },
        attachTo: document.body
      });

      expect(withoutLogo.find('[data-vean-app-shell-logo]').exists()).toBe(false);

      withoutLogo.unmount();

      const withLogo = mount(SAppShell, {
        props: { items },
        slots: { logo: '<span data-logo>Logo</span>' },
        attachTo: document.body
      });

      expect(withLogo.find('[data-vean-app-shell-logo]').exists()).toBe(true);
      expect(withLogo.find('[data-logo]').exists()).toBe(true);

      withLogo.unmount();
    });

    it('renders no breadcrumb without an active menu', () => {
      const wrapper = mount(SAppShell, {
        props: { items },
        attachTo: document.body
      });

      expect(wrapper.findComponent(SBreadcrumb).exists()).toBe(false);

      wrapper.unmount();
    });

    it('derives the breadcrumb trail from the menu tree', () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'vean-ui' },
        attachTo: document.body
      });

      const breadcrumb = wrapper.findComponent(SBreadcrumb);

      expect(breadcrumb.exists()).toBe(true);
      expect(breadcrumb.text()).toContain('Workbench');
      expect(breadcrumb.text()).toContain('Projects');
      expect(breadcrumb.text()).toContain('Vean UI');

      wrapper.unmount();
    });

    it('turns the active menu siblings into an ancestor dropdown', () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'vean-ui' },
        attachTo: document.body
      });

      const crumbs = wrapper.findAll('[data-vean-breadcrumb-item]');

      expect(crumbs).toHaveLength(3);
      // Ancestors whose menu has children become menu buttons; the last crumb is the page.
      expect(crumbs[0].find('button').attributes('aria-haspopup')).toBe('menu');
      expect(crumbs[1].find('button').attributes('aria-haspopup')).toBe('menu');
      expect(crumbs[2].find('button').exists()).toBe(false);
      expect(crumbs[2].find('[data-vean-breadcrumb-page]').exists()).toBe(true);

      wrapper.unmount();
    });

    /**
     * The dropdown mirrors the menu tree: an entry with children keeps them, so
     * it renders as a submenu rather than a leaf that does nothing when picked.
     * Hidden nodes are dropped at every level.
     */
    it('mirrors the menu shape in an ancestor dropdown', () => {
      const options = toMenuOptions([
        {
          value: 'projects',
          label: 'Projects',
          children: [
            { value: 'vean-ui', label: 'Vean UI' },
            { value: 'soybean-admin', label: 'Soybean Admin', hidden: true }
          ]
        },
        { value: 'tasks', label: 'Tasks' },
        { value: 'draft', label: 'Draft', hidden: true }
      ]);

      expect(options).toEqual([
        {
          value: 'projects',
          label: 'Projects',
          icon: undefined,
          disabled: undefined,
          children: [{ value: 'vean-ui', label: 'Vean UI', icon: undefined, disabled: undefined }]
        },
        { value: 'tasks', label: 'Tasks', icon: undefined, disabled: undefined }
      ]);
    });

    it('prefers explicit breadcrumb data over the derived trail', () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'vean-ui', breadcrumbs },
        attachTo: document.body
      });

      expect(wrapper.findComponent(SBreadcrumb).exists()).toBe(true);

      const breadcrumb = wrapper.findComponent(SBreadcrumb);

      expect(breadcrumb.text()).toContain('Home');
      expect(breadcrumb.text()).not.toContain('Workbench');

      wrapper.unmount();
    });

    /**
     * The header crumb is one truncating line that hides itself on a phone. The
     * family wraps its items and keeps its content width by default, which is what
     * pushed the trailing actions out of the header — so the shell has to be the
     * one that brings the rules.
     */
    it('keeps the header crumb on one truncating line', () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'vean-ui' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-breadcrumb-root]').classes()).toContain('group-data-[mobile=true]/layout:hidden');
      expect(wrapper.find('[data-vean-breadcrumb-list]').classes()).toContain('flex-nowrap');
      expect(wrapper.find('[data-vean-breadcrumb-item]').classes()).toContain('min-w-0');
      expect(wrapper.find('[data-vean-breadcrumb-page]').classes()).toContain('truncate');

      wrapper.unmount();
    });

    it('lets breadcrumbUi override the header crumb defaults', () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'vean-ui', breadcrumbUi: { list: 'flex-wrap' } },
        attachTo: document.body
      });

      const list = wrapper.find('[data-vean-breadcrumb-list]');

      expect(list.classes()).toContain('flex-wrap');
      expect(list.classes()).not.toContain('flex-nowrap');

      wrapper.unmount();
    });

    it('renders the tabs region only when tabs are provided', () => {
      const withoutTabs = mount(SAppShell, {
        props: { items },
        attachTo: document.body
      });

      expect(withoutTabs.findComponent(SPageTabs).exists()).toBe(false);

      withoutTabs.unmount();

      const withTabs = mount(SAppShell, {
        props: { items, tabs, tabValue: 'overview' },
        attachTo: document.body
      });

      expect(withTabs.findComponent(SPageTabs).exists()).toBe(true);

      withTabs.unmount();
    });

    it('applies the root class and per-slot ui overrides', () => {
      const wrapper = mount(SAppShell, {
        props: {
          items,
          class: 'my-shell',
          ui: { header: 'custom-header' },
          layoutUi: { tab: 'custom-layout-tab' }
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-app-shell]').classes()).toContain('my-shell');
      expect(wrapper.find('[data-vean-app-shell-header]').classes()).toContain('custom-header');
      expect(wrapper.find('[data-vean-layout-tab]').classes()).toContain('custom-layout-tab');

      wrapper.unmount();
    });

    it('prefers layoutUi over the shell region defaults', () => {
      const wrapper = mount(SAppShell, {
        props: {
          items,
          layoutUi: { header: 'override-header' }
        },
        attachTo: document.body
      });

      const headerClasses = wrapper.find('[data-vean-layout-header]').classes();

      expect(headerClasses).toContain('override-header');
      expect(headerClasses).not.toContain('bg-background');

      wrapper.unmount();
    });
  });

  describe('modes', () => {
    it('renders the top mode without a sidebar and with a nav menu in the header', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'top' },
        slots: { logo: '<span data-logo>Logo</span>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-app-shell-sidebar]').exists()).toBe(false);
      expect(wrapper.findComponent(STreeNav).exists()).toBe(true);
      expect(wrapper.find('[data-vean-layout-root]').attributes('data-orientation')).toBe('vertical');
      expect(wrapper.find('[data-vean-layout-trigger]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-app-shell-header] [data-logo]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('drops hidden options for every renderer', () => {
      for (const mode of ['sidebar', 'top', 'dual-vertical'] as const) {
        const wrapper = mount(SAppShell, {
          props: { items, mode },
          attachTo: document.body
        });

        expect(wrapper.text()).not.toContain('Draft');

        wrapper.unmount();
      }
    });

    it('renders the dual-vertical mode in place inside the sidebar', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical' },
        attachTo: document.body
      });

      expect(wrapper.findComponent(SSplitNav).exists()).toBe(true);
      expect(wrapper.find('[data-vean-app-shell-menu-sidebar] [data-vean-split-nav-root]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-dual-vertical]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-app-shell-mount-vertical]').exists()).toBe(false);
      expect(wrapper.find('[data-vean-app-shell-mount-horizontal]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('teleports both panes into the header and sidebar mount targets', () => {
      const scenes: { mode: AppShellMode; header: string; sidebar: string }[] = [
        {
          mode: 'vertical-horizontal',
          header: '[data-vean-split-nav-sub-horizontal]',
          sidebar: '[data-vean-split-nav-vertical-first-level]'
        },
        {
          mode: 'horizontal-vertical',
          header: '[data-vean-split-nav-horizontal-first-level]',
          sidebar: '[data-vean-split-nav-sub-vertical]'
        },
        {
          mode: 'horizontal-dual-vertical',
          header: '[data-vean-split-nav-horizontal-first-level]',
          sidebar: '[data-vean-split-nav-dual-vertical]'
        }
      ];

      for (const scene of scenes) {
        const wrapper = mount(SAppShell, {
          props: { items, mode: scene.mode, modelValue: 'projects' },
          attachTo: document.body
        });

        expect(wrapper.find(`[data-vean-app-shell-mount-horizontal] ${scene.header}`).exists()).toBe(true);
        expect(wrapper.find(`[data-vean-app-shell-mount-vertical] ${scene.sidebar}`).exists()).toBe(true);

        wrapper.unmount();
      }
    });
  });

  describe('top menu', () => {
    it('renders every entry of the bar, branches included', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'top' },
        attachTo: document.body
      });

      const bar = wrapper.find('[data-vean-tree-nav]');

      expect(bar.exists()).toBe(true);
      expect(bar.text()).toContain('Workbench');
      expect(bar.text()).toContain('Overview');

      wrapper.unmount();
    });

    it('marks the active entry', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'top', modelValue: 'overview' },
        attachTo: document.body
      });

      const bar = wrapper.find('[data-vean-tree-nav]');
      const active = bar.findAll('[data-selected="true"]');

      expect(active).toHaveLength(1);
      expect(active[0].text()).toContain('Overview');

      wrapper.unmount();
    });

    it('activates a leaf entry', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'top', modelValue: 'overview' },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-tree-nav] [data-selected="true"]').trigger('click');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['overview']);
      expect(wrapper.emitted('select')?.at(-1)?.[0]).toBe('overview');

      wrapper.unmount();
    });

    /**
     * A branch only opens its popup: the bar must not report it as an activated menu,
     * which is the rule the tree and split renderers follow too.
     */
    it('does not activate a branch', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'top', modelValue: 'overview' },
        attachTo: document.body
      });

      const branch = wrapper.findAll('[data-vean-tree-nav] button').find(node => node.text().includes('Workbench'));

      expect(branch).toBeDefined();

      await branch!.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();

      wrapper.unmount();
    });
  });

  describe('state reflection', () => {
    it('collapses the sidebar and the menu together via v-model:open', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, defaultOpen: false },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-state')).toBe('collapsed');
      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('collapsed');

      await wrapper.setProps({ open: true });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-state')).toBe('expanded');
      expect(wrapper.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('expanded');

      wrapper.unmount();
    });

    it('emits update:open from the header trigger', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, defaultOpen: false },
        attachTo: document.body
      });

      await nextTick();
      await wrapper.find('[data-vean-layout-trigger]').trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true]);

      wrapper.unmount();
    });

    it('forwards menu selection through update:modelValue and select', async () => {
      const wrapper = mount(SAppShell, {
        props: { items },
        attachTo: document.body
      });

      const leaf = wrapper.findAll('[data-vean-tree-menu-button]').find(button => button.text().includes('Overview'));

      expect(leaf).toBeDefined();

      await leaf?.trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('overview');
      expect(wrapper.emitted('select')?.at(-1)?.[0]).toBe('overview');

      wrapper.unmount();
    });

    it('forwards split-nav open events', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical' },
        attachTo: document.body
      });

      const railItem = wrapper
        .findAll('[data-vean-split-nav-first-level-item]')
        .find(item => item.text().includes('Workbench'));

      expect(railItem).toBeDefined();

      await railItem?.trigger('click');
      await nextTick();

      expect(wrapper.emitted('open')?.at(-1)?.[0]).toMatchObject({ value: 'workbench' });

      wrapper.unmount();
    });

    it('folds the nested pane with the collapsed sidebar', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui', defaultOpen: false },
        attachTo: document.body
      });

      const region = wrapper.find('[data-vean-app-shell-menu-sidebar]');
      const pane = region.find('[data-vean-split-nav-sub-vertical]');

      // The pane stays in the shell's menu region and collapses in place; the
      // tree inside it renders its icon rail, not the expanded tree.
      expect(pane.exists()).toBe(true);
      expect(pane.attributes('data-state')).toBe('collapsed');
      expect(pane.classes()).not.toContain('absolute');
      expect(region.find('[data-vean-tree-menu-root]').attributes('data-state')).toBe('collapsed');

      wrapper.unmount();
    });

    /**
     * The pane follows every activation, not only the ones that move the model
     * value: activating the leaf that is already active resets the open path
     * without emitting a new value, and the sidebar has to fold with it.
     */
    it('folds the pane again when the active leaf is activated a second time', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      // Act like a `v-model` host: the emitted value is written back, and writing
      // back the same value is a no-op.
      async function activate(text: string) {
        const railItem = wrapper
          .findAll('[data-vean-split-nav-first-level-item]')
          .find(item => item.text().includes(text));

        expect(railItem).toBeDefined();

        await railItem?.trigger('click');

        const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0];

        // A parent does not move the value, so there is nothing to write back.
        if (typeof value === 'string') {
          await wrapper.setProps({ modelValue: value });
        }

        await nextTick();
      }

      const paneExists = () => wrapper.find('[data-vean-split-nav-sub-vertical]').exists();
      const sidebarStyle = () => wrapper.find('[data-vean-layout-root]').attributes('style') ?? '';

      // The active route sits in the pane, so it renders.
      expect(paneExists()).toBe(true);
      expect(sidebarStyle()).toContain('--vean-sidebar-width: 20rem');

      // A childless leaf closes it.
      await activate('Overview');

      expect(wrapper.props('modelValue')).toBe('overview');
      expect(paneExists()).toBe(false);
      expect(sidebarStyle()).toContain('--vean-sidebar-width: 5rem');

      // A parent opens it again.
      await activate('Workbench');

      expect(paneExists()).toBe(true);
      expect(sidebarStyle()).toContain('--vean-sidebar-width: 20rem');

      // The same leaf: the model value stays put, the pane still closes.
      await activate('Overview');

      expect(wrapper.props('modelValue')).toBe('overview');
      expect(paneExists()).toBe(false);
      expect(sidebarStyle()).toContain('--vean-sidebar-width: 5rem');

      wrapper.unmount();
    });

    /**
     * Switching modes re-creates the menu, whose path then starts from the model
     * value again: the open path the shell mirrored for the previous menu must
     * not leak into the new one.
     */
    it('drops the mirrored open path when the mode changes', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'overview' },
        attachTo: document.body
      });

      const railItem = wrapper
        .findAll('[data-vean-split-nav-first-level-item]')
        .find(item => item.text().includes('Workbench'));

      await railItem?.trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-layout-root]').attributes('style') ?? '').toContain(
        '--vean-sidebar-width: 20rem'
      );

      // `horizontal-dual-vertical` reads the second and third levels, and the
      // active menu is a first-level leaf: neither column has anything to show.
      await wrapper.setProps({ mode: 'horizontal-dual-vertical' });
      await nextTick();

      expect(wrapper.find('[data-vean-layout-root]').attributes('style') ?? '').toContain('--vean-sidebar-width: 0rem');

      wrapper.unmount();
    });

    it('folds the pane of a rail parent activated while collapsed', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'overview', defaultOpen: false },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(false);

      const railItem = wrapper
        .findAll('[data-vean-split-nav-first-level-item]')
        .find(item => item.text().includes('Workbench'));

      expect(railItem).toBeDefined();

      await railItem?.trigger('click');
      await nextTick();

      expect(wrapper.find('[data-vean-split-nav-sub-vertical]').attributes('data-state')).toBe('collapsed');
      // A collapsed sidebar reserves the rail plus the folded pane, so the pane
      // is never squeezed into the rail or left covering the content.
      expect(wrapper.find('[data-vean-layout-root]').attributes('style') ?? '').toContain(
        '--vean-layout-start-gap: 8.125rem'
      );

      wrapper.unmount();
    });

    /**
     * The width reserved for the sidebar has to equal the columns the menu
     * actually renders — in every mode, on both activation paths (the user
     * clicking the menu, and the host moving the value on its own, as a route
     * change does), and in both sidebar states.
     *
     * The expectation is derived from the rendered DOM rather than written out
     * per state, so it also covers the states nobody thought of: a column that
     * is reserved but empty fails the sum, and one that renders but is not
     * reserved fails it too.
     */
    describe('width invariant', () => {
      const splitModes: AppShellMode[] = [
        'dual-vertical',
        'vertical-horizontal',
        'horizontal-vertical',
        'horizontal-dual-vertical'
      ];

      const values = ['overview', 'workbench', 'tasks', 'vean-ui', 'settings', 'projects'];

      function remOf(style: string, name: string): number | undefined {
        const match = style.match(new RegExp(`--${name}: ([\\d.]+)rem`));

        return match ? Number(match[1]) : undefined;
      }

      /** Columns the sidebar renders, expressed as the width they take at `md`. */
      function renderedColumns(wrapper: ReturnType<typeof mount>) {
        const sidebar = wrapper.find('[data-vean-app-shell-sidebar]');
        const metrics = splitNavPaneMetrics.md;
        const rail = sidebar.find('[data-vean-split-nav-vertical-first-level]').exists();
        const pane = sidebar.find('[data-vean-split-nav-sub-vertical]').exists();

        return {
          width: (rail ? metrics.rail : 0) + (pane ? metrics.tree : 0),
          // Collapsed the pane folds into its icon rail.
          collapsedWidth: (rail ? metrics.rail : 0) + (pane ? splitNavCollapsedPaneWidth / 16 : 0)
        };
      }

      function reservedWidths(wrapper: ReturnType<typeof mount>) {
        const style = wrapper.find('[data-vean-layout-root]').attributes('style') ?? '';

        return {
          width: remOf(style, 'vean-sidebar-width'),
          collapsedWidth: remOf(style, 'vean-collapsed-sidebar-width')
        };
      }

      function expectInvariant(wrapper: ReturnType<typeof mount>, mode: AppShellMode, scene: string) {
        const rendered = renderedColumns(wrapper);
        const reserved = reservedWidths(wrapper);

        expect({ scene, width: reserved.width }).toEqual({ scene, width: rendered.width });

        // `offcanvas` modes hide the sidebar instead of keeping a rail, so the
        // layout overrides the collapsed width and the columns do not apply.
        if (appShellSkeletons[mode].collapsible === 'offcanvas') {
          return;
        }

        expect({ scene, collapsedWidth: reserved.collapsedWidth }).toEqual({
          scene,
          collapsedWidth: rendered.collapsedWidth
        });
      }

      it('holds while the host moves the value on its own', async () => {
        for (const mode of splitModes) {
          const wrapper = mount(SAppShell, {
            props: { items, mode, modelValue: 'overview' },
            attachTo: document.body
          });

          for (const value of values) {
            await wrapper.setProps({ modelValue: value });
            await nextTick();

            expectInvariant(wrapper, mode, `${mode} / modelValue=${value}`);
          }

          wrapper.unmount();
        }
      });

      it('holds when the host moves the value after the user browsed the menu', async () => {
        for (const mode of splitModes) {
          const wrapper = mount(SAppShell, {
            props: { items, mode, modelValue: 'overview' },
            attachTo: document.body
          });

          const clickFirstLevel = async (text: string) => {
            const item = wrapper
              .findAll('[data-vean-split-nav-first-level-item]')
              .find(node => node.text().includes(text));

            await item?.trigger('click');
            await nextTick();
          };

          await clickFirstLevel('Workbench');
          expectInvariant(wrapper, mode, `${mode} / after opening Workbench`);

          await clickFirstLevel('Projects');
          expectInvariant(wrapper, mode, `${mode} / after opening Projects`);

          // The route moves on: the browse path has to be dropped with it.
          for (const value of ['settings', 'vean-ui', 'overview']) {
            await wrapper.setProps({ modelValue: value });
            await nextTick();

            expectInvariant(wrapper, mode, `${mode} / browse then modelValue=${value}`);
          }

          wrapper.unmount();
        }
      });

      it('holds while the sidebar is collapsed', async () => {
        for (const mode of splitModes) {
          const wrapper = mount(SAppShell, {
            props: { items, mode, modelValue: 'overview', open: false },
            attachTo: document.body
          });

          for (const value of values) {
            await wrapper.setProps({ modelValue: value });
            await nextTick();

            expectInvariant(wrapper, mode, `${mode} collapsed / modelValue=${value}`);
          }

          wrapper.unmount();
        }
      });
    });

    it('forwards tab interactions and the active tab', async () => {
      const liveTabs = tabs.map(tab => ({ ...tab }));
      const wrapper = mount(SAppShell, {
        props: { items, tabs: liveTabs, tabValue: 'overview' },
        attachTo: document.body
      });

      const tab = wrapper.findAll('[data-vean-page-tabs-item]').find(item => item.text().includes('Projects'));

      expect(tab).toBeDefined();

      await tab?.trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:tabValue')?.at(-1)?.[0]).toBe('projects');
      expect(wrapper.emitted('tabClick')?.at(-1)?.[0]).toMatchObject({ value: 'projects' });

      await tab?.find('[data-vean-page-tabs-close]').trigger('click');
      await nextTick();

      expect(wrapper.emitted('tabClose')?.at(-1)?.[0]).toMatchObject({ value: 'projects' });
      // `SPageTabs` removes a closed tab by mutating the given collection in place;
      // `update:tabs` only fires for bulk operations and reorders.
      expect(liveTabs.map(item => item.value)).toEqual(['overview']);

      wrapper.unmount();
    });
  });

  describe('derived sidebar widths', () => {
    it('keeps the layout defaults for the single-pane modes', () => {
      const sidebar = mount(SAppShell, {
        props: { items },
        attachTo: document.body
      });

      const sidebarStyle = sidebar.find('[data-vean-layout-root]').attributes('style') ?? '';

      expect(sidebarStyle).toContain('--vean-sidebar-width: 15rem');
      expect(sidebarStyle).toContain('--vean-collapsed-sidebar-width: 3.125rem');

      sidebar.unmount();

      const top = mount(SAppShell, {
        props: { items, mode: 'top' },
        attachTo: document.body
      });

      expect(top.find('[data-vean-layout-root]').attributes('style') ?? '').toContain('--vean-layout-start-gap: 0px');

      top.unmount();
    });

    it('keeps only the rail while the active menu has no children', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'overview' },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') ?? '';

      expect(style).toContain('--vean-sidebar-width: 5rem');
      expect(style).toContain('--vean-collapsed-sidebar-width: 5rem');

      wrapper.unmount();
    });

    it('reserves the nested pane once a first-level menu with children is active', () => {
      const expanded = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      const expandedStyle = expanded.find('[data-vean-layout-root]').attributes('style') ?? '';

      expect(expandedStyle).toContain('--vean-sidebar-width: 20rem');
      // Collapsed the pane folds into its icon rail, so the sidebar takes the
      // rail plus that folded column.
      expect(expandedStyle).toContain('--vean-collapsed-sidebar-width: 8.125rem');

      expanded.unmount();

      const collapsed = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui', defaultOpen: false },
        attachTo: document.body
      });

      const collapsedStyle = collapsed.find('[data-vean-layout-root]').attributes('style') ?? '';

      expect(collapsedStyle).toContain('--vean-layout-start-gap: 8.125rem');

      collapsed.unmount();
    });

    it('sizes the sidebar to the nested tree pane for horizontal-vertical', () => {
      const expanded = mount(SAppShell, {
        props: { items, mode: 'horizontal-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      expect(expanded.find('[data-vean-layout-root]').attributes('style') ?? '').toContain(
        '--vean-sidebar-width: 15rem'
      );

      expanded.unmount();

      // No rail in this mode: collapsed, the sidebar is the folded pane alone.
      const collapsed = mount(SAppShell, {
        props: { items, mode: 'horizontal-vertical', modelValue: 'vean-ui', defaultOpen: false },
        attachTo: document.body
      });

      expect(collapsed.find('[data-vean-layout-root]').attributes('style') ?? '').toContain(
        '--vean-layout-start-gap: 3.125rem'
      );

      collapsed.unmount();

      // No rail in this mode: an empty pane means no sidebar at all.
      const empty = mount(SAppShell, {
        props: { items, mode: 'horizontal-vertical', modelValue: 'overview' },
        attachTo: document.body
      });

      expect(empty.find('[data-vean-layout-root]').attributes('style') ?? '').toContain('--vean-sidebar-width: 0rem');

      empty.unmount();
    });

    /**
     * The sidebar of this mode hosts the dual-vertical pane of the active
     * first-level menu, so its rail is the *second* level and its pane the third:
     * the width has to follow those levels, not the root one.
     */
    it('sizes the horizontal-dual-vertical sidebar to the columns it renders', async () => {
      const sidebarWidth = (wrapper: ReturnType<typeof mount>) => {
        const style = wrapper.find('[data-vean-layout-root]').attributes('style') ?? '';

        return style.match(/--vean-sidebar-width: ([^;]+)/)?.[1];
      };

      // A first-level leaf fills neither column, so the sidebar takes no space.
      const leaf = mount(SAppShell, {
        props: { items, mode: 'horizontal-dual-vertical', modelValue: 'overview' },
        attachTo: document.body
      });

      expect(sidebarWidth(leaf)).toBe('0rem');
      expect(leaf.find('[data-vean-split-nav-vertical-first-level]').exists()).toBe(false);
      expect(leaf.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(false);

      leaf.unmount();

      // Opening a first-level menu fills its rail; its pane stays closed until a
      // rail parent is opened, so the sidebar is the rail alone.
      const rail = mount(SAppShell, {
        props: { items, mode: 'horizontal-dual-vertical', modelValue: 'overview' },
        attachTo: document.body
      });

      const headerItem = rail
        .find('[data-vean-split-nav-horizontal-first-level]')
        .findAll('[data-vean-split-nav-first-level-item]')
        .find(item => item.text().includes('Workbench'));

      expect(headerItem).toBeDefined();

      await headerItem?.trigger('click');
      await nextTick();

      expect(rail.find('[data-vean-split-nav-vertical-first-level]').text()).toContain('Projects');
      expect(sidebarWidth(rail)).toBe('5rem');
      expect(rail.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(false);

      rail.unmount();

      // A selected grandchild fills both columns.
      const nested = mount(SAppShell, {
        props: { items, mode: 'horizontal-dual-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      expect(sidebarWidth(nested)).toBe('20rem');
      expect(nested.find('[data-vean-split-nav-vertical-first-level]').exists()).toBe(true);
      expect(nested.find('[data-vean-split-nav-sub-vertical]').exists()).toBe(true);

      nested.unmount();
    });

    it('keeps splitNavPaneMetrics in sync with the split-nav recipe tokens', () => {
      for (const size of themeSizes) {
        const classes = splitNavVariants({ size });

        expect(classes.firstLevel).toContain(`--vean-split-nav-first-level-width:${splitNavPaneMetrics[size].rail}rem`);
        expect(classes.subVertical).toContain(`--vean-split-nav-tree-width:${splitNavPaneMetrics[size].tree}rem`);
      }
    });
  });

  describe('expand strategy', () => {
    /**
     * The shell defaults to `selected`, so the menu mirrors the route: navigating
     * away from the branch the active leaf sits in collapses it instead of letting
     * branches opened earlier in the session pile up.
     */
    it('collapses the branch the selection left by default', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'vean-ui' },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="workbench"]').attributes('aria-expanded')).toBe(
        'true'
      );
      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );

      await wrapper.setProps({ modelValue: 'tasks' });
      await nextTick();

      // `workbench` stays open — it is the branch the new selection sits in —
      // while the branch the selection left collapses.
      expect(wrapper.find('[data-vean-tree-menu-button][data-value="workbench"]').attributes('aria-expanded')).toBe(
        'true'
      );
      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'false'
      );
      expect(wrapper.text()).not.toContain('Vean UI');

      wrapper.unmount();
    });

    it('keeps the branch with expand-strategy="keep"', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'vean-ui', expandStrategy: 'keep' },
        attachTo: document.body
      });

      await nextTick();
      await wrapper.setProps({ modelValue: 'tasks' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );
      expect(wrapper.text()).toContain('Vean UI');

      wrapper.unmount();
    });

    it('drives the nested pane of a split mode', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'true'
      );

      await wrapper.setProps({ modelValue: 'tasks' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'false'
      );

      wrapper.unmount();
    });

    it('lets menuProps.tree override the shell strategy', async () => {
      const wrapper = mount(SAppShell, {
        props: {
          items,
          modelValue: 'vean-ui',
          expandStrategy: 'keep',
          menuProps: { tree: { expandStrategy: 'selected' } }
        },
        attachTo: document.body
      });

      await nextTick();
      await wrapper.setProps({ modelValue: 'tasks' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'false'
      );

      wrapper.unmount();
    });

    it('lets menuProps.split override the shell strategy', async () => {
      const wrapper = mount(SAppShell, {
        props: {
          items,
          mode: 'dual-vertical',
          modelValue: 'vean-ui',
          expandStrategy: 'keep',
          menuProps: { split: { expandStrategy: 'selected' } }
        },
        attachTo: document.body
      });

      await nextTick();
      await wrapper.setProps({ modelValue: 'tasks' });
      await nextTick();

      expect(wrapper.find('[data-vean-tree-menu-button][data-value="projects"]').attributes('aria-expanded')).toBe(
        'false'
      );

      wrapper.unmount();
    });

    /**
     * `top` mode renders `STreeNav`, which declares no expand strategy: the shell
     * must not hand it one, or it would fall through to the DOM as an attribute.
     */
    it('does not reach the markup of the top mode', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'top', expandStrategy: 'keep' },
        attachTo: document.body
      });

      expect(wrapper.html()).not.toContain('expandstrategy');

      wrapper.unmount();
    });
  });

  describe('collapse trigger', () => {
    const foldedPane = `${splitNavCollapsedPaneWidth / 16}rem`;
    const rail = `${splitNavPaneMetrics.md.rail}rem`;

    it('pins the trigger to the sidebar corner for the top-bar-first modes', () => {
      for (const mode of ['horizontal-vertical', 'horizontal-dual-vertical'] as const) {
        const wrapper = mount(SAppShell, {
          props: { items, mode, modelValue: 'vean-ui' },
          attachTo: document.body
        });

        const sidebar = wrapper.find('[data-vean-app-shell-sidebar]').element;

        expect(sidebar.lastElementChild).toBe(wrapper.find('[data-vean-app-shell-trigger-row]').element);
        expect(wrapper.find('[data-vean-app-shell-header] [data-vean-layout-trigger]').exists()).toBe(false);

        wrapper.unmount();
      }
    });

    it('centers the collapsed trigger inside the folded column', () => {
      const wrapper = mount(SAppShell, {
        props: {
          items,
          mode: 'horizontal-dual-vertical',
          modelValue: 'vean-ui',
          defaultOpen: false
        },
        attachTo: document.body
      });

      const cell = wrapper.find('[data-vean-app-shell-trigger-cell]');

      // The sidebar is the rail plus the folded pane, so the trigger takes the
      // folded column instead of centering across both.
      expect(cell.attributes('data-centered')).toBe('true');
      expect(cell.attributes('style')).toContain(`width: ${foldedPane}`);

      wrapper.unmount();
    });

    it('centers the collapsed trigger in a rail-less sidebar', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'horizontal-vertical', modelValue: 'vean-ui', defaultOpen: false },
        attachTo: document.body
      });

      const cell = wrapper.find('[data-vean-app-shell-trigger-cell]');

      // No rail: the folded pane is the entire sidebar, so its cell is the row.
      expect(wrapper.find('[data-vean-app-shell-trigger-rail]').exists()).toBe(false);
      expect(cell.attributes('data-centered')).toBe('true');
      expect(cell.attributes('style')).toContain(`width: ${foldedPane}`);

      wrapper.unmount();
    });

    it('renders the trigger only while the second panel is shown', () => {
      // A top-bar leaf leaves the sidebar without a pane column: there is nothing
      // for the trigger to collapse, so it stays out until a branch is opened.
      for (const mode of ['horizontal-vertical', 'horizontal-dual-vertical'] as const) {
        const closed = mount(SAppShell, {
          props: { items, mode, modelValue: 'overview' },
          attachTo: document.body
        });

        expect(closed.find('[data-vean-app-shell-trigger-row]').exists()).toBe(false);

        closed.unmount();

        const open = mount(SAppShell, {
          props: { items, mode, modelValue: 'vean-ui' },
          attachTo: document.body
        });

        expect(open.find('[data-vean-app-shell-trigger-row]').exists()).toBe(true);

        open.unmount();
      }
    });

    it('carries the rail divider into the trigger row', () => {
      const dualVertical = mount(SAppShell, {
        props: { items, mode: 'horizontal-dual-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      const railCell = dualVertical.find('[data-vean-app-shell-trigger-rail]');

      // The same column width as the rail above, so the divider runs on through
      // the row instead of stopping at the menu.
      expect(railCell.attributes('style')).toContain(`width: ${rail}`);

      dualVertical.unmount();

      const railLess = mount(SAppShell, {
        props: { items, mode: 'horizontal-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      // A rail-less sidebar has no divider to continue.
      expect(railLess.find('[data-vean-app-shell-trigger-rail]').exists()).toBe(false);

      railLess.unmount();
    });

    it('keeps the trigger in the header for the modes whose first level is a rail', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-app-shell-header] [data-vean-layout-trigger]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-app-shell-trigger-row]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('renders no sidebar trigger when the trigger is turned off', () => {
      const wrapper = mount(SAppShell, {
        props: {
          items,
          mode: 'horizontal-vertical',
          modelValue: 'vean-ui',
          triggerVisible: false
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-trigger]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('brand placement', () => {
    /** Rail and pane widths the brand cells align to, in rem. */
    const rail = `${splitNavPaneMetrics.md.rail}rem`;
    const pane = `${splitNavPaneMetrics.md.tree}rem`;

    const brandSlots = {
      logo: '<span data-mark>Mark</span>',
      title: '<span data-title>Title</span>'
    };

    /**
     * The dual-vertical menu owns the cells above its own columns, so a sidebar
     * brand renders inside the menu: the mark in the `top-left` cell of the rail
     * column — the one that carries the rail's divider — and the title in the
     * `top-right` cell of the pane column. The shell renders no region beside it.
     */
    it('renders the brand in the menu cells for dual-vertical', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui' },
        slots: brandSlots,
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-app-shell-logo]').exists()).toBe(false);
      expect(
        wrapper.find('[data-vean-split-nav-vertical-rail] [data-vean-split-nav-top-left] [data-mark]').exists()
      ).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-top-right] [data-title]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('leaves the divider between the columns to the pane', () => {
      const classes = splitNavVariants({ size: 'md' });

      // The pane's own leading edge is the boundary, so neither the rail nor the
      // brand cell that heads it draws a second line.
      expect(classes.subVertical).toContain('border-s');
      expect(classes.subVertical).toContain('border-sidebar-border');
      expect(classes.topLeft).not.toContain('border');
      expect(classes.firstLevel).not.toContain('border-sidebar-border');
    });

    it('keeps the mark on the rail while a rail sidebar is collapsed', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui', defaultOpen: false },
        slots: brandSlots,
        attachTo: document.body
      });

      // The rail keeps its column, so the mark stays on it instead of centering
      // in the folded sidebar; the title's column is folded away.
      expect(wrapper.find('[data-vean-split-nav-top-left] [data-mark]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-top-right]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('folds the single-column brand row together with the menu', () => {
      const wrapper = mount(SAppShell, {
        props: { items, defaultOpen: false },
        slots: brandSlots,
        attachTo: document.body
      });

      const region = wrapper.find('[data-vean-app-shell-logo]');

      // The row mirrors a tree-menu item, so it folds to the item's icon width
      // instead of centering an unstyled mark in the folded column.
      expect(region.attributes('data-aligned')).toBeUndefined();
      expect(region.attributes('data-inset')).toBe('menu');
      expect(region.attributes('data-state')).toBe('collapsed');
      expect(wrapper.find('[data-vean-app-shell-logo-mark]').attributes('style')).toBeUndefined();
      expect(wrapper.find('[data-vean-app-shell-logo-title]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('keeps the region for a rail sidebar the menu does not own', () => {
      // `vertical-horizontal` keeps its rail in the sidebar but has no menu cell
      // above it, so the shell still renders the aligned region there.
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'vertical-horizontal', logoPlacement: 'sidebar' },
        slots: brandSlots,
        attachTo: document.body
      });

      const region = wrapper.find('[data-vean-app-shell-logo]');

      expect(region.attributes('data-placement')).toBe('sidebar');
      expect(region.attributes('data-aligned')).toBe('true');
      expect(wrapper.find('[data-vean-app-shell-logo-mark]').attributes('style')).toContain(`width: ${rail}`);
      expect(wrapper.find('[data-vean-app-shell-logo-title]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('keeps its own row shape outside a single-column sidebar', () => {
      // The menu brand is one row of the rail column, and the header brand is a
      // header row: neither mirrors a menu row.
      const railMode = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui' },
        slots: brandSlots,
        attachTo: document.body
      });

      expect(railMode.find('[data-vean-split-nav-top-left] [data-vean-tree-menu-styled-item-button]').exists()).toBe(
        true
      );

      railMode.unmount();

      const header = mount(SAppShell, {
        props: { items, logoPlacement: 'header' },
        slots: brandSlots,
        attachTo: document.body
      });

      expect(header.find('[data-vean-app-shell-logo]').attributes('data-inset')).toBeUndefined();
      // The header brand is a plain header row, not a menu row.
      expect(header.find('[data-vean-tree-menu-styled-item-button]').exists()).toBe(false);

      header.unmount();
    });

    it('drops the title while the sidebar has no pane column', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'overview' },
        slots: brandSlots,
        attachTo: document.body
      });

      // The active first-level menu has no children: the sidebar is the rail
      // alone, so there is no second column for the title to sit on.
      expect(wrapper.find('[data-vean-split-nav-top-left] [data-mark]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-split-nav-top-right]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('pins the brand under the menu region for the bottom placement', () => {
      const wrapper = mount(SAppShell, {
        props: { items, logoPlacement: 'sidebar-bottom' },
        slots: brandSlots,
        attachTo: document.body
      });

      const sidebar = wrapper.find('[data-vean-app-shell-sidebar]').element;
      const region = wrapper.find('[data-vean-app-shell-logo]');

      expect(region.attributes('data-placement')).toBe('sidebar-bottom');
      expect(sidebar.lastElementChild).toBe(region.element);
      expect(sidebar.lastElementChild).not.toBe(wrapper.find('[data-vean-app-shell-menu-sidebar]').element);

      wrapper.unmount();
    });

    it('keeps the bottom brand aligned to the menu columns', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui', logoPlacement: 'sidebar-bottom' },
        slots: brandSlots,
        attachTo: document.body
      });

      // The bottom region sits outside the menu, so it keeps mirroring the
      // columns with cells of its own.
      expect(wrapper.find('[data-vean-app-shell-logo-mark]').attributes('style')).toContain(`width: ${rail}`);
      expect(wrapper.find('[data-vean-app-shell-logo-title]').attributes('style')).toContain(`width: ${pane}`);
      expect(wrapper.find('[data-vean-split-nav-top-left]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('keeps the brand above the menu for the top placement', () => {
      const wrapper = mount(SAppShell, {
        props: { items },
        slots: brandSlots,
        attachTo: document.body
      });

      const sidebar = wrapper.find('[data-vean-app-shell-sidebar]').element;

      expect(sidebar.firstElementChild).toBe(wrapper.find('[data-vean-app-shell-logo]').element);

      wrapper.unmount();
    });

    it('keeps the mode default where a bottom brand cannot stay', () => {
      for (const [mode, expected] of [
        ['top', 'header'],
        ['vertical-horizontal', 'header'],
        ['horizontal-vertical', 'header'],
        ['horizontal-dual-vertical', 'header']
      ] as const) {
        const wrapper = mount(SAppShell, {
          props: { items, mode, logoPlacement: 'sidebar-bottom' },
          slots: brandSlots,
          attachTo: document.body
        });

        expect(wrapper.find('[data-vean-app-shell-logo]').attributes('data-placement')).toBe(expected);

        wrapper.unmount();
      }
    });

    it('leaves the brand unaligned when it renders in the header', () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'vean-ui', logoPlacement: 'header' },
        slots: brandSlots,
        attachTo: document.body
      });

      const region = wrapper.find('[data-vean-app-shell-header] [data-vean-app-shell-logo]');

      expect(region.attributes('data-placement')).toBe('header');
      expect(region.attributes('data-aligned')).toBeUndefined();
      expect(wrapper.find('[data-vean-app-shell-logo-mark]').attributes('style')).toBeUndefined();
      expect(wrapper.find('[data-vean-app-shell-logo-title]').attributes('style')).toBeUndefined();

      wrapper.unmount();
    });

    it('renders no brand region without the logo slot', () => {
      const wrapper = mount(SAppShell, {
        props: { items, logoPlacement: 'sidebar-bottom' },
        slots: { title: '<span data-title>Title</span>' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-app-shell-logo]').exists()).toBe(false);
      expect(wrapper.find('[data-title]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  /**
   * The drawer is the mobile counterpart of the desktop sidebar and carries its
   * own state, so the shell forwards both channels: `open` for the collapse,
   * `mobileOpen` for the drawer the layout renders instead of it.
   */
  describe('mobile drawer', () => {
    it('forwards the mobileOpen state to the layout drawer', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, isMobile: true, mobileOpen: true },
        attachTo: document.body
      });

      await nextTick();

      expect(document.querySelector('[data-vean-layout-mobile]')).not.toBeNull();

      wrapper.unmount();
    });

    /**
     * The drawer always shows the expanded navigation: a collapse is a desktop
     * affordance, so picking it on desktop and then switching to mobile must not
     * fold the brand or the menu inside the drawer.
     */
    it('renders the drawer expanded after a collapse picked on desktop', async () => {
      const menuSlotProps: { collapsed?: boolean }[] = [];
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'overview', isMobile: true, mobileOpen: true, open: false },
        slots: {
          logo: '<span>Logo</span>',
          title: '<span>Vean UI</span>',
          menu: (slotProps: { collapsed?: boolean }) => {
            menuSlotProps.push({ collapsed: slotProps.collapsed });

            return h('div', { 'data-menu-slot': '' });
          }
        },
        attachTo: document.body
      });

      await nextTick();
      await nextTick();

      const drawer = document.querySelector('[data-vean-layout-mobile]');
      const logo = drawer?.querySelector('[data-vean-app-shell-logo]');

      expect(logo).not.toBeNull();
      expect(logo?.hasAttribute('data-collapsed')).toBe(false);
      expect(drawer?.querySelector('[data-vean-app-shell-logo-title]')).not.toBeNull();
      expect(menuSlotProps.at(-1)?.collapsed).toBe(false);

      wrapper.unmount();
    });

    it('keeps the header title while the sidebar is collapsed', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, modelValue: 'overview', open: false, logoPlacement: 'header' },
        slots: { logo: '<span>Logo</span>', title: '<span>Vean UI</span>' },
        attachTo: document.body
      });

      await nextTick();

      const logo = document.querySelector('[data-vean-app-shell-logo][data-placement="header"]');

      expect(logo).not.toBeNull();
      expect(logo?.hasAttribute('data-collapsed')).toBe(false);
      expect(logo?.querySelector('[data-vean-app-shell-logo-title]')).not.toBeNull();

      wrapper.unmount();
    });
  });

  /**
   * The mobile view renders the `sidebar` skeleton whatever mode is bound: the
   * sidebar is the layout's drawer there, and a drawer holds one nested tree, so
   * a top bar, a rail, or a pane has nowhere to go in it. The bound mode is never
   * overwritten, so the desktop shape is back the moment the view is.
   */
  describe('mobile view', () => {
    /**
     * The view is resolved the way `SLayout` resolves it, so a host that
     * simulates a viewport (a device frame, an embedded shell) gets the shape the
     * layout renders — without binding `isMobile` itself.
     */
    it('follows a viewport published by the host', async () => {
      const host = defineComponent({
        name: 'AppShellViewportHost',
        setup() {
          provideViewportContext({ isMobile: true });

          return () => h(SAppShell, { items, mobileOpen: true });
        }
      });

      const wrapper = mount(host, { attachTo: document.body });

      await nextTick();
      await nextTick();

      const shell = wrapper.find('[data-vean-app-shell]');

      expect(shell.attributes('data-mobile')).toBe('true');
      expect(document.querySelector('[data-vean-layout-mobile] [data-vean-tree-menu-root]')).not.toBeNull();

      wrapper.unmount();
    });

    it('renders the full menu tree in the drawer for a top-bar mode', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'top', isMobile: true, mobileOpen: true },
        attachTo: document.body
      });

      await nextTick();
      await nextTick();

      const drawer = document.querySelector('[data-vean-layout-mobile]');

      // The bound mode is still reported: the shape is the shell's business, the
      // mode stays the host's.
      expect(wrapper.find('[data-vean-app-shell]').attributes('data-mode')).toBe('top');
      // A top-bar-first mode has no sidebar on desktop; on mobile the drawer is the
      // only navigation there is, so the trigger has to exist.
      expect(wrapper.find('[data-vean-layout-trigger]').exists()).toBe(true);
      expect(wrapper.findComponent(STreeNav).exists()).toBe(false);
      expect(drawer?.querySelector('[data-vean-tree-menu-root]')).not.toBeNull();
      expect(drawer?.textContent).toContain('Overview');
      expect(drawer?.textContent).toContain('Workbench');

      wrapper.unmount();
    });

    it('renders one tree instead of the split panes for a split mode', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'horizontal-dual-vertical', modelValue: 'overview', isMobile: true, mobileOpen: true },
        attachTo: document.body
      });

      await nextTick();
      await nextTick();

      const drawer = document.querySelector('[data-vean-layout-mobile]');

      expect(wrapper.findComponent(SSplitNav).exists()).toBe(false);
      expect(drawer?.querySelector('[data-vean-tree-menu-root]')).not.toBeNull();
      expect(drawer?.querySelector('[data-vean-split-nav-root]')).toBeNull();

      wrapper.unmount();
    });

    it('gives the desktop shape back when the view is not mobile', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', modelValue: 'projects', isMobile: true },
        attachTo: document.body
      });

      await nextTick();
      await nextTick();

      expect(wrapper.findComponent(SSplitNav).exists()).toBe(false);
      expect(wrapper.find('[data-vean-app-shell]').attributes('data-mode')).toBe('dual-vertical');

      await wrapper.setProps({ isMobile: false });
      await nextTick();

      expect(wrapper.findComponent(SSplitNav).exists()).toBe(true);

      wrapper.unmount();
    });

    /**
     * The mode is not overridden while the mobile view is up, so a mode the host
     * binds in between is rendered as soon as the desktop shape is: no record, no
     * mode waiting to be re-applied.
     */
    it('renders the mode bound while the mobile view is up', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, mode: 'dual-vertical', isMobile: true, mobileOpen: true },
        attachTo: document.body
      });

      await nextTick();
      await nextTick();

      await wrapper.setProps({ mode: 'top' });

      expect(wrapper.findComponent(STreeNav).exists()).toBe(false);
      expect(wrapper.findComponent(SSplitNav).exists()).toBe(false);
      expect(document.querySelector('[data-vean-layout-mobile] [data-vean-tree-menu-root]')).not.toBeNull();

      await wrapper.setProps({ isMobile: false });
      await nextTick();

      expect(wrapper.findComponent(SSplitNav).exists()).toBe(false);
      expect(wrapper.findComponent(STreeNav).exists()).toBe(true);

      wrapper.unmount();
    });
  });
  describe('accessibility', () => {
    it('has no violations for the sidebar skeleton', async () => {
      const wrapper = mount(SAppShell, {
        props: { items, breadcrumbs, tabs, tabValue: 'overview' },
        slots: { logo: '<span>Logo</span>', footer: '<span>Footer</span>' },
        attachTo: document.body
      });

      const violations = await getA11yViolations(wrapper.element as Element);

      expect(violations.map(violation => `${violation.id}: ${violation.nodes[0]?.html ?? ''}`)).toEqual([]);

      wrapper.unmount();
    });
  });
});
