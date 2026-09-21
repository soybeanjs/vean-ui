import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { mount } from '@vue/test-utils';
import { provideViewportContext } from '@vean/aria/composables';
import { LayoutTrigger, LayoutRail } from '@vean/aria/layout';
import type { LayoutProps } from '@/components/layout';
import SLayout from '@/components/layout/layout.vue';

/** The breakpoint the headless root falls back to when `isMobile` is unset. */
const LAYOUT_MOBILE_QUERY = '(max-width: 767.9px)';

/**
 * happy-dom reports a 1024px viewport, so the layout's viewport default resolves
 * to the desktop path everywhere else in this suite. Swap `matchMedia` for a
 * stub that always reports `matches` to pin the mobile branch.
 */
function mockMediaQuery(matches: boolean): () => void {
  const originalMatchMedia = window.matchMedia;
  const mediaQueryList = {
    matches,
    media: LAYOUT_MOBILE_QUERY,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false
  };

  window.matchMedia = vi.fn().mockReturnValue(mediaQueryList) as unknown as typeof window.matchMedia;

  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

/**
 * Renders `SLayout` under a host that publishes a simulated viewport, the way a
 * documentation device frame does: the layout has to take that decision as the
 * environment and keep its own prop as the stronger signal.
 */
function mountWithViewport(isMobile: MaybeRefOrGetter<boolean | undefined>, props: LayoutProps = {}) {
  const host = defineComponent({
    name: 'LayoutViewportHost',
    setup() {
      provideViewportContext({ isMobile });

      return () =>
        h(SLayout, props, {
          sidebar: () => h('div', 'Sidebar'),
          default: () => h('div', 'Main')
        });
    }
  });

  return mount(host, { attachTo: document.body });
}

describe('SLayout', () => {
  describe('rendering', () => {
    it('renders with all slots', () => {
      const wrapper = mount(SLayout, {
        slots: {
          header: '<div data-header>Header</div>',
          tab: '<div data-tab>Tab</div>',
          sidebar: '<div data-sidebar>Sidebar</div>',
          footer: '<div data-footer>Footer</div>',
          default: '<div data-main>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').exists()).toBe(true);
      expect(wrapper.find('[data-header]').exists()).toBe(true);
      expect(wrapper.find('[data-tab]').exists()).toBe(true);
      expect(wrapper.find('[data-sidebar]').exists()).toBe(true);
      expect(wrapper.find('[data-footer]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Main');

      wrapper.unmount();
    });

    it('applies custom root class', () => {
      const wrapper = mount(SLayout, {
        props: { class: 'my-layout' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('.my-layout').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies per-slot ui overrides', () => {
      const wrapper = mount(SLayout, {
        props: {
          ui: {
            header: 'custom-header',
            content: 'custom-content'
          }
        },
        slots: {
          sidebar: '<div>Sidebar</div>',
          header: '<div>Header</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('.custom-header').exists()).toBe(true);
      expect(wrapper.find('.custom-content').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('defaults', () => {
    it('defaults to horizontal orientation, sidebar variant and expanded state', () => {
      const wrapper = mount(SLayout, {
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-layout-root]');
      expect(root.attributes('data-orientation')).toBe('horizontal');
      expect(root.attributes('data-variant')).toBe('sidebar');
      expect(root.attributes('data-state')).toBe('expanded');

      wrapper.unmount();
    });
  });

  describe('state reflection', () => {
    it('reflects data-orientation attribute', () => {
      const wrapper = mount(SLayout, {
        props: { orientation: 'vertical' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-orientation')).toBe('vertical');

      wrapper.unmount();
    });

    it('reflects data-scroll-behavior attribute', () => {
      const wrapper = mount(SLayout, {
        props: { scrollBehavior: 'wrapper' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-scroll-behavior')).toBe('wrapper');

      wrapper.unmount();
    });

    it('reflects data-fixed-top attribute', () => {
      const wrapper = mount(SLayout, {
        props: { fixedTop: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-fixed-top')).toBe('true');

      wrapper.unmount();
    });

    it('reflects data-fixed-footer attribute', () => {
      const wrapper = mount(SLayout, {
        props: { fixedFooter: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-fixed-footer')).toBe('true');

      wrapper.unmount();
    });

    it('reflects data-stretch-footer attribute', () => {
      const wrapper = mount(SLayout, {
        props: { stretchFooter: false },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-stretch-footer')).toBe('false');

      wrapper.unmount();
    });

    it('reflects expanded/collapsed state via data-state', () => {
      const wrapper = mount(SLayout, {
        props: { defaultOpen: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-state')).toBe('expanded');

      wrapper.unmount();
    });

    it('reflects collapsed state via data-state', () => {
      const wrapper = mount(SLayout, {
        props: { defaultOpen: false },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-state')).toBe('collapsed');

      wrapper.unmount();
    });

    it('reflects data-side attribute on root', () => {
      const wrapper = mount(SLayout, {
        props: { side: 'right' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-side')).toBe('right');

      wrapper.unmount();
    });

    it('reflects data-variant attribute on root', () => {
      const wrapper = mount(SLayout, {
        props: { variant: 'floating' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-variant')).toBe('floating');

      wrapper.unmount();
    });

    it('reflects data-collapsible when collapsed and clears it when expanded', async () => {
      const wrapper = mount(SLayout, {
        props: { defaultOpen: false, collapsible: 'offcanvas' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-layout-root]');
      expect(root.attributes('data-state')).toBe('collapsed');
      expect(root.attributes('data-collapsible')).toBe('offcanvas');

      await wrapper.setProps({ open: true });
      expect(root.attributes('data-state')).toBe('expanded');
      expect(root.attributes('data-collapsible')).toBe('');

      wrapper.unmount();
    });

    it('emits update:open when state changes via trigger', async () => {
      const wrapper = mount(SLayout, {
        props: { defaultOpen: false },
        slots: {
          sidebar: '<div>Sidebar</div>',
          header: () => h(LayoutTrigger),
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      await nextTick();

      const trigger = wrapper.find('[data-vean-layout-trigger]');
      await trigger.trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:open')).toBeTruthy();
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true]);

      wrapper.unmount();
    });

    it('supports v-model:open', async () => {
      const wrapper = mount(SLayout, {
        props: { open: false, 'onUpdate:open': (v: boolean) => wrapper.setProps({ open: v }) },
        slots: {
          sidebar: '<div>Sidebar</div>',
          header: () => h(LayoutTrigger),
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-layout-root]');
      expect(root.attributes('data-state')).toBe('collapsed');

      await wrapper.find('[data-vean-layout-trigger]').trigger('click');
      await nextTick();

      expect(root.attributes('data-state')).toBe('expanded');

      wrapper.unmount();
    });
  });

  describe('variants', () => {
    it('renders sidebar variant by default', () => {
      const wrapper = mount(SLayout, {
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-variant')).toBe('sidebar');

      wrapper.unmount();
    });

    it('renders floating variant', () => {
      const wrapper = mount(SLayout, {
        props: { variant: 'floating' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-variant')).toBe('floating');

      wrapper.unmount();
    });

    it('renders inset variant', () => {
      const wrapper = mount(SLayout, {
        props: { variant: 'inset' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-variant')).toBe('inset');

      wrapper.unmount();
    });
  });

  describe('surface layering', () => {
    it('keeps the page base on the root and the raised canvas on the content region', () => {
      const wrapper = mount(SLayout, {
        slots: {
          header: '<div>Header</div>',
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-layout-root]');
      const main = wrapper.find('[data-vean-layout-main]');
      const sidebar = wrapper.find('[data-sidebar="sidebar"]');
      const content = wrapper.find('[data-vean-layout-content]');

      // 页面基底由 root 声明；主列是纯结构列，不自己着色，让基底在列间隙透出；区域面由各自槽位声明
      expect(root.classes()).toContain('bg-background');
      expect(main.classes()).not.toContain('bg-card');
      expect(content.classes()).toContain('bg-card');
      expect(sidebar.classes()).toContain('bg-sidebar');

      // 区域面不能与主画布同色，否则侧栏与主体读不出分界
      expect(sidebar.classes()).not.toContain('bg-card');

      wrapper.unmount();
    });

    it('lets the inset variant own the root canvas instead of the page base', () => {
      const wrapper = mount(SLayout, {
        props: { variant: 'inset' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-layout-root]');

      // 变体的区域面必须压过 slot 上的页面基底（tailwind-merge 只留最后一个）
      expect(root.classes()).toContain('bg-sidebar');
      expect(root.classes()).not.toContain('bg-background');

      wrapper.unmount();
    });
  });

  describe('sidebar visibility', () => {
    it('sidebar is visible by default', () => {
      const wrapper = mount(SLayout, {
        slots: {
          sidebar: '<div data-sidebar>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-sidebar]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('hides sidebar when sidebarVisible is false', () => {
      const wrapper = mount(SLayout, {
        props: { sidebarVisible: false },
        slots: {
          sidebar: '<div data-sidebar>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-sidebar]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('hides header when headerVisible is false', () => {
      const wrapper = mount(SLayout, {
        props: { headerVisible: false },
        slots: {
          header: '<div data-header>Header</div>',
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-header]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('hides tab when tabVisible is false', () => {
      const wrapper = mount(SLayout, {
        props: { tabVisible: false },
        slots: {
          tab: '<div data-tab>Tab</div>',
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-tab]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('hides footer when footerVisible is false', () => {
      const wrapper = mount(SLayout, {
        props: { footerVisible: false },
        slots: {
          footer: '<div data-footer>Footer</div>',
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-footer]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('fullContent', () => {
    it('reflects data-full-content attribute', () => {
      const wrapper = mount(SLayout, {
        props: { fullContent: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-full-content')).toBe('true');

      wrapper.unmount();
    });

    it('defaults data-full-content to false', () => {
      const wrapper = mount(SLayout, {
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-full-content')).toBe('false');

      wrapper.unmount();
    });
  });

  describe('mobile', () => {
    it('does not render mobile drawer when isMobile is false', () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: false },
        slots: {
          sidebar: '<div data-sidebar>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-mobile]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('reflects data-mobile attribute on root', () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-mobile')).toBe('true');

      wrapper.unmount();
    });

    /**
     * The mobile sidebar is a `Dialog`-based drawer teleported out of the layout,
     * so it reserves no space: the start gaps that push `main`, `header`, and
     * `footer` beside the sidebar collapse, and the desktop sidebar offsets stop
     * applying.
     */
    it('collapses every sidebar-derived offset on mobile', () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';

      expect(style).toContain('--vean-layout-start-gap: 0px');
      expect(style).toContain('--vean-layout-header-start-gap: 0px');
      expect(style).toContain('--vean-layout-footer-start-gap: 0px');
      expect(style).toContain('--vean-layout-sidebar-top-gap: 0px');
      expect(style).toContain('--vean-layout-sidebar-bottom-gap: 0px');
      expect(style).toContain('--vean-layout-sidebar-height: 100%');

      wrapper.unmount();
    });

    /**
     * A vertical layout offsets the sidebar below the header on desktop; on mobile
     * the drawer spans the viewport, so the offset must drop even though the
     * orientation is unchanged.
     */
    it('drops the vertical sidebar offset on mobile', () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: true, orientation: 'vertical' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';

      expect(style).toContain('--vean-layout-sidebar-top-gap: 0px');
      expect(style).toContain('--vean-layout-sidebar-height: 100%');

      wrapper.unmount();
    });

    it('collapses the start gap on mobile for every variant', () => {
      for (const variant of ['sidebar', 'floating', 'inset'] as const) {
        const wrapper = mount(SLayout, {
          props: { isMobile: true, variant },
          slots: {
            sidebar: '<div>Sidebar</div>',
            default: '<div>Main</div>'
          },
          attachTo: document.body
        });

        const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
        expect(style).toContain('--vean-layout-start-gap: 0px');

        wrapper.unmount();
      }
    });

    it('keeps the desktop offsets when isMobile is false', () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: false },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-layout-root]');
      const style = root.attributes('style') || '';

      expect(root.attributes('data-mobile')).toBe('false');
      expect(style).toContain('--vean-layout-start-gap: 15rem');

      wrapper.unmount();
    });

    /**
     * The drawer is the mobile counterpart of `open` and carries its own state:
     * `open` drives the desktop sidebar, so a host that pins `isMobile` can only
     * reach what the user actually sees through `mobileOpen`.
     */
    it('opens the drawer from the mobileOpen prop', async () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: true, mobileOpen: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      // The drawer mounts through the dialog's presence state, one tick after the
      // controlled prop lands.
      await nextTick();

      expect(document.querySelector('[data-vean-layout-mobile]')).not.toBeNull();

      wrapper.unmount();
    });

    it('emits update:mobileOpen when the trigger opens the drawer', async () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          header: () => h(LayoutTrigger),
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      await nextTick();
      await wrapper.find('[data-vean-layout-trigger]').trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:mobileOpen')?.at(-1)).toEqual([true]);

      wrapper.unmount();
    });
  });

  /**
   * `isMobile` is optional: unset follows the viewport, an explicit boolean wins.
   * The viewport side is what the `SLayout` default now relies on, and the
   * override is the hook for a server-side detection.
   */
  describe('viewport default', () => {
    it('follows the viewport when isMobile is unset', () => {
      const restore = mockMediaQuery(true);

      try {
        const wrapper = mount(SLayout, {
          slots: {
            sidebar: '<div>Sidebar</div>',
            default: '<div>Main</div>'
          },
          attachTo: document.body
        });

        const root = wrapper.find('[data-vean-layout-root]');

        expect(root.attributes('data-mobile')).toBe('true');
        // No host spoke, so the styled `lt-md` fallback stays in charge.
        expect(root.attributes('data-mobile-source')).toBe('viewport');
        expect(root.attributes('style') || '').toContain('--vean-layout-start-gap: 0px');
        // The desktop sidebar is replaced by the drawer, not merely styled away.
        expect(wrapper.find('[data-vean-layout-sidebar]').exists()).toBe(false);

        wrapper.unmount();
      } finally {
        restore();
      }
    });

    it('lets an explicit isMobile override the viewport', () => {
      const restore = mockMediaQuery(true);

      try {
        const wrapper = mount(SLayout, {
          props: { isMobile: false },
          slots: {
            sidebar: '<div>Sidebar</div>',
            default: '<div>Main</div>'
          },
          attachTo: document.body
        });

        const root = wrapper.find('[data-vean-layout-root]');

        expect(root.attributes('data-mobile')).toBe('false');
        expect(root.attributes('style') || '').toContain('--vean-layout-start-gap: 15rem');
        expect(wrapper.find('[data-vean-layout-sidebar]').exists()).toBe(true);

        wrapper.unmount();
      } finally {
        restore();
      }
    });
  });

  /**
   * A host can hand the layout a viewport it simulated — a documentation device
   * frame, an embedded shell. The provided value is the environment, the prop
   * stays the stronger signal, and a missing provider changes nothing.
   */
  describe('provided viewport', () => {
    it('follows a simulated mobile viewport when isMobile is unset', () => {
      const wrapper = mountWithViewport(true);

      const root = wrapper.find('[data-vean-layout-root]');

      expect(root.attributes('data-mobile')).toBe('true');
      // A host asked for this mode, so the styled `lt-md` fallback has to stand down.
      expect(root.attributes('data-mobile-source')).toBe('explicit');
      expect(root.attributes('style') || '').toContain('--vean-layout-start-gap: 0px');
      expect(wrapper.find('[data-vean-layout-sidebar]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('reacts when the simulated viewport changes', async () => {
      const simulated = ref<boolean | undefined>(true);
      const wrapper = mountWithViewport(simulated);

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-mobile')).toBe('true');

      simulated.value = false;
      await nextTick();

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-mobile')).toBe('false');
      expect(wrapper.find('[data-vean-layout-sidebar]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('lets an explicit isMobile override the simulated viewport', () => {
      const wrapper = mountWithViewport(true, { isMobile: false });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-mobile')).toBe('false');
      expect(wrapper.find('[data-vean-layout-sidebar]').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  /**
   * The sidebar slot publishes the state its content has to render from. A
   * collapse is a desktop affordance: the mobile drawer always shows the expanded
   * navigation, so a collapse picked on desktop must not follow the content into
   * it — while `open` keeps reporting the desktop state for anything that tracks
   * it.
   */
  describe('sidebar slot collapsed state', () => {
    function mountSidebarSlot(props: LayoutProps, simulatedMobile?: MaybeRefOrGetter<boolean | undefined>) {
      const captured: { open: boolean | undefined; collapsed: boolean }[] = [];
      const host = defineComponent({
        name: 'LayoutSidebarSlotHost',
        setup() {
          if (simulatedMobile !== undefined) {
            provideViewportContext({ isMobile: simulatedMobile });
          }

          return () =>
            h(SLayout, props, {
              sidebar: (slotProps: { open: boolean | undefined; collapsed: boolean }) => {
                captured.push({ open: slotProps.open, collapsed: slotProps.collapsed });

                return h('div', 'Sidebar');
              },
              default: () => h('div', 'Main')
            });
        }
      });

      const wrapper = mount(host, { attachTo: document.body });

      // A drawer mounts its content through the dialog's presence state, one tick
      // after the open state lands.
      return nextTick().then(() => ({ wrapper, captured }));
    }

    it('reports collapsed on desktop when open is false', async () => {
      const { wrapper, captured } = await mountSidebarSlot({ open: false });

      expect(captured.at(-1)).toEqual({ open: false, collapsed: true });

      wrapper.unmount();
    });

    it('stays expanded in the drawer after collapsing on desktop', async () => {
      const { wrapper, captured } = await mountSidebarSlot({ isMobile: true, mobileOpen: true, open: false });

      // The desktop state is still there for a consumer that tracks it …
      expect(captured.at(-1)).toEqual({ open: false, collapsed: false });

      wrapper.unmount();
    });

    it('stays expanded in a host-simulated drawer after collapsing on desktop', async () => {
      const { wrapper, captured } = await mountSidebarSlot({ mobileOpen: true, open: false }, true);

      expect(captured.at(-1)).toEqual({ open: false, collapsed: false });

      wrapper.unmount();
    });

    it('follows the desktop state again when the mode returns to desktop', async () => {
      const simulated = ref<boolean | undefined>(true);
      const { wrapper, captured } = await mountSidebarSlot({ mobileOpen: true, open: false }, simulated);

      expect(captured.at(-1)?.collapsed).toBe(false);

      simulated.value = false;
      await nextTick();
      await nextTick();

      expect(captured.at(-1)?.collapsed).toBe(true);

      wrapper.unmount();
    });
  });

  describe('start gap CSS variable', () => {
    it('sets start gap to sidebar width when expanded', () => {
      const wrapper = mount(SLayout, {
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
      expect(style).toContain('--vean-layout-start-gap: 15rem');

      wrapper.unmount();
    });

    it('sets start gap to collapsed width when collapsed with icon collapsible', () => {
      const wrapper = mount(SLayout, {
        props: { defaultOpen: false, collapsible: 'icon' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
      expect(style).toContain('--vean-layout-start-gap: 3.125rem');

      wrapper.unmount();
    });

    it('sets start gap to 0rem when collapsed with offcanvas collapsible', () => {
      const wrapper = mount(SLayout, {
        props: { defaultOpen: false, collapsible: 'offcanvas' },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
      expect(style).toContain('--vean-layout-start-gap: 0rem');

      wrapper.unmount();
    });

    it('keeps start gap at sidebar width for floating and inset variants', () => {
      for (const variant of ['floating', 'inset'] as const) {
        const wrapper = mount(SLayout, {
          props: { variant },
          slots: {
            sidebar: '<div>Sidebar</div>',
            default: '<div>Main</div>'
          },
          attachTo: document.body
        });

        const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
        expect(style).toContain('--vean-layout-start-gap: 15rem');

        wrapper.unmount();
      }
    });

    it('sets start gap to 0px when sidebar is hidden', () => {
      const wrapper = mount(SLayout, {
        props: { sidebarVisible: false },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
      expect(style).toContain('--vean-layout-start-gap: 0px');

      wrapper.unmount();
    });
  });

  /**
   * Whether the sidebar has a column of its own.
   *
   * The styled layer keys the column's padding (the `floating`/`inset` wrapper is
   * a spacing wider than the sidebar), its card chrome, and the gaps those
   * variants add on that state, so a host that resolves the sidebar to no column
   * — `SAppShell`'s split modes do, for a first-level leaf — declares a width of
   * `0` and gets a column that reserves and paints nothing.
   */
  describe('sidebar flow state', () => {
    it('reports the sidebar in flow while it declares a width', () => {
      const wrapper = mount(SLayout, {
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-sidebar-flow')).toBe('true');

      wrapper.unmount();
    });

    it('reports a zero-width sidebar as out of flow', () => {
      const wrapper = mount(SLayout, {
        props: { sidebarWidth: 0, collapsedSidebarWidth: 0 },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-layout-root]');

      expect(root.attributes('data-sidebar-flow')).toBe('false');
      // The region itself stays rendered: its mount targets host the panes the
      // split modes teleport, and the menu root inside it owns their top bar.
      expect(wrapper.find('[data-vean-layout-sidebar]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('reports a hidden sidebar as out of flow', () => {
      const wrapper = mount(SLayout, {
        props: { sidebarVisible: false },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-layout-root]').attributes('data-sidebar-flow')).toBe('false');

      wrapper.unmount();
    });
  });

  describe('CSS variables', () => {
    it('sets sidebar width CSS variable', () => {
      const wrapper = mount(SLayout, {
        props: { sidebarWidth: 300 },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
      expect(style).toContain('--vean-sidebar-width');

      wrapper.unmount();
    });

    it('sets header height CSS variable', () => {
      const wrapper = mount(SLayout, {
        props: { headerHeight: 64 },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      const style = wrapper.find('[data-vean-layout-root]').attributes('style') || '';
      expect(style).toContain('--vean-layout-header-height');

      wrapper.unmount();
    });

    /**
     * The drawer is teleported out of the root, so the properties its sidebar
     * content reads never inherit into it: the header band and the spacing step
     * have to be declared on the drawer itself.
     */
    it('re-declares the layout variables on the mobile drawer', async () => {
      const wrapper = mount(SLayout, {
        props: { isMobile: true, mobileOpen: true },
        slots: {
          sidebar: '<div>Sidebar</div>',
          default: '<div>Main</div>'
        },
        attachTo: document.body
      });

      await nextTick();

      const drawer = document.querySelector('[data-vean-layout-mobile]');

      expect(drawer).not.toBeNull();
      expect(drawer?.getAttribute('style')).toContain('--vean-layout-header-height: 3.5rem');
      expect(drawer?.className).toContain('[--sl-spacing:1rem]');
      expect(drawer?.className).toContain('[--sl-half-spacing:calc(var(--sl-spacing)/2)]');

      wrapper.unmount();
    });
  });
});

describe('LayoutTrigger', () => {
  it('renders with aria-expanded reflecting open state', async () => {
    const wrapper = mount(SLayout, {
      props: { defaultOpen: true },
      slots: {
        sidebar: '<div>Sidebar</div>',
        header: () => h(LayoutTrigger),
        default: '<div>Main</div>'
      },
      attachTo: document.body
    });

    await nextTick();

    const trigger = wrapper.find('[data-vean-layout-trigger]');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes('aria-expanded')).toBe('true');

    wrapper.unmount();
  });

  it('reflects aria-expanded false when collapsed', async () => {
    const wrapper = mount(SLayout, {
      props: { defaultOpen: false },
      slots: {
        sidebar: '<div>Sidebar</div>',
        header: () => h(LayoutTrigger),
        default: '<div>Main</div>'
      },
      attachTo: document.body
    });

    await nextTick();

    const trigger = wrapper.find('[data-vean-layout-trigger]');
    expect(trigger.attributes('aria-expanded')).toBe('false');

    wrapper.unmount();
  });

  it('toggles sidebar open state on click', async () => {
    const wrapper = mount(SLayout, {
      props: { defaultOpen: false },
      slots: {
        sidebar: '<div data-sidebar>Sidebar</div>',
        header: () => h(LayoutTrigger),
        default: '<div>Main</div>'
      },
      attachTo: document.body
    });

    await nextTick();

    const trigger = wrapper.find('[data-vean-layout-trigger]');
    expect(trigger.attributes('aria-expanded')).toBe('false');

    await trigger.trigger('click');
    await nextTick();

    expect(trigger.attributes('aria-expanded')).toBe('true');

    wrapper.unmount();
  });

  /**
   * On mobile the trigger opens the drawer, not the desktop sidebar, so it has to
   * report the drawer's state — the desktop `open` is a different control there.
   */
  it('reports the drawer state in mobile mode', async () => {
    const wrapper = mount(SLayout, {
      props: { isMobile: true, open: false },
      slots: {
        sidebar: '<div>Sidebar</div>',
        header: () => h(LayoutTrigger),
        default: '<div>Main</div>'
      },
      attachTo: document.body
    });

    await nextTick();

    const trigger = wrapper.find('[data-vean-layout-trigger]');
    expect(trigger.attributes('aria-expanded')).toBe('false');

    await trigger.trigger('click');
    await nextTick();

    expect(trigger.attributes('aria-expanded')).toBe('true');

    wrapper.unmount();
  });
});

describe('LayoutRail', () => {
  it('renders with aria-expanded reflecting open state', async () => {
    const wrapper = mount(SLayout, {
      props: { defaultOpen: true },
      slots: {
        sidebar: () => h(LayoutRail),
        default: '<div>Main</div>'
      },
      attachTo: document.body
    });

    await nextTick();

    const rail = wrapper.find('[data-vean-layout-rail]');
    expect(rail.exists()).toBe(true);
    expect(rail.attributes('aria-expanded')).toBe('true');
    expect(rail.attributes('tabindex')).toBe('-1');

    wrapper.unmount();
  });

  it('reflects aria-expanded false when collapsed', async () => {
    const wrapper = mount(SLayout, {
      props: { defaultOpen: false },
      slots: {
        sidebar: () => h(LayoutRail),
        default: '<div>Main</div>'
      },
      attachTo: document.body
    });

    await nextTick();

    const rail = wrapper.find('[data-vean-layout-rail]');
    expect(rail.attributes('aria-expanded')).toBe('false');

    wrapper.unmount();
  });

  it('toggles sidebar open state on click', async () => {
    const wrapper = mount(SLayout, {
      props: { defaultOpen: true },
      slots: {
        sidebar: () => h(LayoutRail),
        default: '<div>Main</div>'
      },
      attachTo: document.body
    });

    await nextTick();

    const rail = wrapper.find('[data-vean-layout-rail]');
    expect(rail.attributes('aria-expanded')).toBe('true');

    await rail.trigger('click');
    await nextTick();

    expect(rail.attributes('aria-expanded')).toBe('false');

    wrapper.unmount();
  });
});
