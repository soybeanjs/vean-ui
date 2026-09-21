import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { provideViewportContext } from '@vean/aria/composables';
import { page } from 'vitest/browser';
import SLayout from '@/components/layout/layout.vue';
import type { LayoutProps } from '@/components/layout/types';
import { renderComponent } from '../../shared/render';

/**
 * Layout mobile geometry e2e — real CSS cascade, real custom-property
 * inheritance.
 *
 * The happy-dom unit spec asserts the CSS variables the Aria root writes.
 * That is not enough for the mobile fix: the sidebar-derived gaps reach the
 * slots through a second layer of `--sl-*` aliases owned by the `scv()` recipe,
 * and only a real browser resolves that chain (inline custom property → alias →
 * `margin-inline-start`). Together the two specs cover both the value the root
 * emits and the geometry it produces.
 *
 * The critical scene is `isMobile` at a *desktop-width* viewport: the CSS
 * `lt-md:hidden` fallback can never see it, so only the prop-driven collapse
 * keeps the content from reserving room for a sidebar that is now a drawer.
 */
const SIDEBAR_WIDTH_PX = 240;
const SPACING_PX = 16;
const HALF_SPACING_PX = SPACING_PX / 2;
const HEADER_HEIGHT_PX = 56;

/**
 * `simulatedMobile` stands for a host that publishes a viewport of its own — the
 * documentation device frame is the reference case: the browser window may be
 * wide while the component is told it is not.
 */
function createHarness(props: LayoutProps, simulatedMobile?: boolean) {
  return defineComponent({
    name: simulatedMobile === undefined ? 'LayoutGeometryHarness' : 'LayoutSimulatedViewportHarness',
    setup() {
      if (simulatedMobile !== undefined) {
        provideViewportContext({ isMobile: simulatedMobile });
      }

      return () =>
        h(
          'div',
          { style: 'height: 700px' },
          h(SLayout, props, {
            sidebar: () => h('div', 'Sidebar'),
            default: () => h('div', 'Main')
          })
        );
    }
  });
}

function element(selector: string): HTMLElement {
  const found = document.querySelector<HTMLElement>(selector);

  if (!found) {
    throw new Error(`expected "${selector}" to be rendered`);
  }

  return found;
}

/**
 * The layout animates its first paint (theme default → derived width), so a gap
 * measured immediately after mount can read a half-applied value.
 */
async function expectMainGap(startPx: number, endPx: number) {
  await vi.waitFor(() => {
    const style = getComputedStyle(element('[data-vean-layout-main]'));

    expect(style.marginInlineStart).toBe(`${startPx}px`);
    expect(style.marginInlineEnd).toBe(`${endPx}px`);
  });
}

async function renderLayout(props: LayoutProps, simulatedMobile?: boolean) {
  const { unmount } = await renderComponent(createHarness(props, simulatedMobile));

  return unmount;
}

/**
 * The fixed tab is positioned against the root, not against the region stack it
 * belongs to, so its `top` is the only thing tying it to the band the placeholder
 * reserves. The layout animates that offset, hence the retry.
 */
async function expectTabOffset(topPx: number) {
  await vi.waitFor(() => {
    expect(getComputedStyle(element('[data-vean-layout-tab]')).top).toBe(`${topPx}px`);
  });
}

/**
 * The main column is offset by a margin while the header is positioned against
 * the root, so "the header sits over the content" is a comparison of their start
 * edges — the observable form of `--sl-header-gap` matching `--sl-main-gap`.
 */
async function expectHeaderAlignedWithMain() {
  await vi.waitFor(() => {
    const header = element('[data-vean-layout-header]').getBoundingClientRect();
    const main = element('[data-vean-layout-main]').getBoundingClientRect();

    expect(Math.abs(header.left - main.left)).toBeLessThanOrEqual(1);
  });
}

/**
 * The observable half of the contract: whatever offset the tab carries, it has to
 * cover the band its own placeholder reserves instead of floating away from it.
 */
async function expectTabAlignedWithPlaceholder() {
  await vi.waitFor(() => {
    const tab = element('[data-vean-layout-tab]').getBoundingClientRect();
    const placeholder = element('[data-vean-layout-tab-placeholder]').getBoundingClientRect();

    expect(Math.abs(tab.top - placeholder.top)).toBeLessThanOrEqual(1);
  });
}

describe('SLayout geometry', () => {
  beforeEach(async () => {
    await page.viewport(1280, 800);
  });

  it('reserves the sidebar width for the content on desktop', async () => {
    const unmount = await renderLayout({});

    await expectMainGap(SIDEBAR_WIDTH_PX, 0);

    unmount();
  });

  /**
   * The default path: no `isMobile` prop at all, just a phone-width viewport.
   * Real `matchMedia` drives it, so this proves the `useMediaQuery` fallback
   * needs no host wiring.
   */
  it('follows the viewport by default on a phone viewport', async () => {
    await page.viewport(390, 800);

    const unmount = await renderLayout({});

    await expectMainGap(0, 0);
    expect(document.querySelector('[data-vean-layout-sidebar]')).toBeNull();

    unmount();
  });

  /**
   * The scene a media query cannot cover: a mobile layout on a wide viewport.
   * The sidebar is a drawer, so nothing may be reserved for it.
   */
  it('reserves no space for the drawer when isMobile is true at a desktop width', async () => {
    const unmount = await renderLayout({ isMobile: true });

    await expectMainGap(0, 0);

    // The desktop sidebar is replaced by the drawer, not merely hidden.
    expect(document.querySelector('[data-vean-layout-sidebar]')).toBeNull();

    await vi.waitFor(() => {
      const main = element('[data-vean-layout-main]');
      const root = element('[data-vean-layout-root]');

      expect(Math.abs(main.getBoundingClientRect().width - root.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
    });

    unmount();
  });

  it('reserves no space for the drawer on a phone viewport', async () => {
    await page.viewport(390, 800);

    const unmount = await renderLayout({ isMobile: true });

    await expectMainGap(0, 0);

    unmount();
  });

  /**
   * The mirror scene of the one above: an explicit desktop mode below the
   * breakpoint. The JS decision keeps the inline sidebar and reserves its width,
   * so the styled `lt-md` fallback has to stand down — hiding the sidebar while
   * the content still reserved room for it left a 240px gutter and no navigation.
   */
  it('keeps the inline sidebar when isMobile is false at a phone viewport', async () => {
    await page.viewport(390, 800);

    const unmount = await renderLayout({ isMobile: false });

    await expectMainGap(SIDEBAR_WIDTH_PX, 0);
    expect(getComputedStyle(element('[data-vean-layout-sidebar]')).display).toBe('block');
    expect(getComputedStyle(element('[data-vean-layout-rail]')).display).toBe('flex');
    expect(element('[data-vean-layout-root]').dataset.mobileSource).toBe('explicit');

    unmount();
  });

  /**
   * A host-published viewport at a desktop width: the CSS fallback cannot see it
   * either, so only the provided decision can turn the sidebar into a drawer —
   * exactly what a documentation device frame relies on.
   */
  it('follows a host-provided viewport at a desktop width', async () => {
    const unmount = await renderLayout({}, true);

    await expectMainGap(0, 0);
    expect(document.querySelector('[data-vean-layout-sidebar]')).toBeNull();
    expect(element('[data-vean-layout-root]').dataset.mobileSource).toBe('explicit');

    unmount();
  });

  it('reports the viewport as the source when no host publishes one', async () => {
    const unmount = await renderLayout({});

    expect(element('[data-vean-layout-root]').dataset.mobileSource).toBe('viewport');

    unmount();
  });

  /**
   * `inset` keeps its identity on mobile by insetting the shell symmetrically:
   * the start gap falls back to the end gap instead of to the sidebar width.
   */
  it('insets the shell symmetrically for the inset variant on mobile', async () => {
    const unmount = await renderLayout({ isMobile: true, variant: 'inset' });

    await expectMainGap(HALF_SPACING_PX, HALF_SPACING_PX);

    unmount();
  });

  /**
   * Guards the desktop half of the fix: the sidebar-adjacent spacing `floating`
   * adds on top of the sidebar width must survive the mobile gating.
   */
  it('keeps the sidebar-adjacent spacing for the floating variant on desktop', async () => {
    const unmount = await renderLayout({ isMobile: false, variant: 'floating' });

    await expectMainGap(SIDEBAR_WIDTH_PX + SPACING_PX, 0);

    unmount();
  });

  /**
   * `inset` reserves the padded wrapper plus the layout's own edge inset, so the
   * companion case to the floating baseline above: the start gap is the sidebar
   * width **plus** one spacing, and the end gap is the half spacing.
   */
  it('keeps the padded-wrapper spacing for the inset variant on desktop', async () => {
    const unmount = await renderLayout({ isMobile: false, variant: 'inset' });

    await expectMainGap(SIDEBAR_WIDTH_PX + SPACING_PX, HALF_SPACING_PX);

    unmount();
  });

  /**
   * `sidebarVisible=false` leaves the layout in the same situation as the mobile
   * drawer: nothing reserves the start edge. The variants widen their gap to clear
   * the padded sidebar wrapper, so that spacing has to be given back — and the
   * header, which the same compensation pushed, has to keep sitting over the
   * content instead of drifting away from it.
   */
  it('drops the sidebar-adjacent spacing when the sidebar is hidden', async () => {
    const unmount = await renderLayout({ isMobile: false, variant: 'floating', sidebarVisible: false });

    await expectMainGap(0, 0);
    await expectHeaderAlignedWithMain();

    unmount();
  });

  /**
   * `inset` keeps its identity with the sidebar hidden for the same reason it does
   * on mobile: the shell stays inset symmetrically, so the start gap falls back to
   * the end gap (the half spacing) rather than to the sidebar width — and the
   * header follows the content onto that edge.
   */
  it('keeps the inset shell symmetric when the sidebar is hidden', async () => {
    const unmount = await renderLayout({ isMobile: false, variant: 'inset', sidebarVisible: false });

    await expectMainGap(HALF_SPACING_PX, HALF_SPACING_PX);
    await expectHeaderAlignedWithMain();

    unmount();
  });

  /**
   * The vertical orientation exposes the mismatch on its own: its header spans the
   * full width, so only the start gap of the content has to collapse. A leftover
   * sidebar compensation left the content indented by one spacing (floating) or by
   * a full spacing instead of the half spacing (inset).
   */
  it('collapses the start gap of the content in a vertical layout when the sidebar is hidden', async () => {
    for (const [variant, gapPx] of [
      ['floating', 0],
      ['inset', HALF_SPACING_PX]
    ] as const) {
      const unmount = await renderLayout({
        isMobile: false,
        orientation: 'vertical',
        variant,
        sidebarVisible: false
      });

      await expectMainGap(gapPx, gapPx);

      unmount();
    }
  });

  /**
   * The baseline the collapsing cases are measured against: with the header in the
   * flow the top band is the header's own height, and the tab starts right below it.
   */
  it('offsets the fixed tab below the header band', async () => {
    const unmount = await renderLayout({ headerVisible: true });

    await expectTabOffset(HEADER_HEIGHT_PX);
    await expectTabAlignedWithPlaceholder();

    unmount();
  });

  /**
   * Hiding the header removes the region *and* its placeholder, so the top band ends
   * at the layout's own edge and the tab has to collapse onto it. Keeping the
   * header-height offset while the band was gone dropped the tab a header below its
   * placeholder and left a blank strip above the content.
   */
  it('collapses the fixed tab onto the layout top when the header is hidden', async () => {
    const unmount = await renderLayout({ headerVisible: false });

    await expectTabOffset(0);
    await expectTabAlignedWithPlaceholder();

    unmount();
  });

  /**
   * `inset` keeps its half-spacing on top of the band, hidden header included: the
   * variant's own gap is what stays, the header's height is what goes.
   */
  it('keeps the inset half-spacing when the header is hidden', async () => {
    const unmount = await renderLayout({ variant: 'inset', headerVisible: false });

    await expectTabOffset(HALF_SPACING_PX);
    await expectTabAlignedWithPlaceholder();

    unmount();
  });
});
