import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { render } from 'vitest-browser-vue';
import { cdp, page, userEvent } from 'vitest/browser';
import type { MenuOptionData } from '@/components/menu';
import SMenubar from '@/components/menubar/menubar.vue';
import { getA11yViolations } from '../../shared/a11y';
import { renderComponent } from '../../shared/render';

/**
 * Menubar e2e — real Teleport + roving focus + keyboard navigation contract.
 *
 * The happy-dom unit spec (`packages/ui/test/specs/components/menubar.spec.ts`)
 * verifies rendering, emit wiring, and disabled resolution with the portal
 * disabled to keep content inline. This spec keeps the portal REAL (open menus
 * teleport to `document.body`) and exercises the keyboard navigation contract
 * that happy-dom cannot faithfully reproduce: roving focus across triggers,
 * ArrowDown/Enter to open, and Escape to close with focus restored to the
 * trigger.
 */
const items: MenuOptionData<string>[] = [
  {
    value: 'file',
    label: 'File',
    children: [
      { value: 'new-tab', label: 'New Tab' },
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

const manyItems: MenuOptionData<string>[] = [
  'file',
  'edit',
  'view',
  'window',
  'help',
  'settings',
  'account',
  'billing',
  'support'
].map(value => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
  children: [{ value: `${value}-child`, label: `${value} action` }]
}));

function renderNarrowMenubar(width: number, collapsible = ref(true)) {
  return render(
    defineComponent({
      name: 'NarrowMenubarHost',
      setup() {
        return () =>
          h(
            'div',
            { style: { width: `${width}px`, overflow: 'hidden' } },
            h(SMenubar, { items: manyItems, collapsible: collapsible.value, moreLabel: 'More' })
          );
      }
    })
  );
}

/**
 * Move the real pointer in small steps from the center of `fromEl` to the
 * center of `toEl`, mimicking a continuous mouse move across adjacent
 * menubar triggers.
 */
async function movePointerBetween(fromEl: Element, toEl: Element) {
  const session = cdp();
  const a = fromEl.getBoundingClientRect();
  const b = toEl.getBoundingClientRect();
  const startX = a.x + a.width / 2;
  const startY = a.y + a.height / 2;
  const endX = b.x + b.width / 2;
  const endY = b.y + b.height / 2;
  const steps = 8;

  for (let i = 1; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = startY + ((endY - startY) * i) / steps;
    await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  }
}

/**
 * Inject a deterministic exit animation into menu popups and return a cleanup
 * function.
 *
 * The layer race these specs guard against only exists while a closing popup
 * stays mounted for an exit animation. The default test page has no theme, so
 * popups unmount immediately and the race cannot happen — the injected
 * animation recreates that window explicitly instead of depending on the
 * UnoCSS animation pipeline.
 */
function injectMenuExitAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes menubar-e2e-exit { from { opacity: 1 } to { opacity: 0.99 } }
    [data-dismissable-layer][data-state='open'] { animation: none !important; }
    [data-dismissable-layer][data-state='closed'] { animation: menubar-e2e-exit 300ms !important; }
  `;
  document.head.append(style);
  return () => style.remove();
}

/**
 * Wait for a replaced menu popup to finish its exit animation and unmount.
 *
 * The regression these specs guard needs the replaced popup to REMOUNT fresh:
 * a fresh mount runs `open-auto-focus` (focus moves into the new popup), which
 * is what the closing layer used to misinterpret as focus leaving. If the
 * pointer returns while the old popup is still animating out, the same element
 * is reused, no focus move happens, and the race cannot occur.
 */
function waitForPopupUnmount() {
  return new Promise(resolve => setTimeout(resolve, 400));
}

/**
 * Render a menubar whose open menu is driven by a controlled `modelValue`.
 *
 * Driving the switch programmatically (instead of via pointer moves) makes the
 * layer race deterministic: the remounted popup's `open-auto-focus` always
 * moves focus into the new popup while the replaced popup is still animating
 * out — exactly the window the regression lives in.
 */
async function renderControlledMenubar() {
  const model = ref<string | number>('file');
  const host = defineComponent({
    name: 'ControlledMenubarHost',
    setup() {
      return () =>
        h(SMenubar, {
          items,
          modelValue: model.value,
          'onUpdate:modelValue': (value: string | number) => {
            model.value = value;
          }
        });
    }
  });

  const result = await render(host);

  return { ...result, model };
}

describe('SMenubar (e2e)', () => {
  it('opens the menu on trigger click and renders items in the real portal', async () => {
    const { unmount } = await renderComponent(SMenubar, { props: { items } });

    await userEvent.click(page.getByRole('menuitem', { name: 'File' }));

    // The open menu teleports to `document.body` — a real portal.
    await expect.element(page.getByRole('menu')).toBeVisible();
    await expect.element(page.getByRole('menuitem', { name: 'New Tab' })).toBeVisible();
    // Disabled menu items are still rendered (and inert).
    await expect.element(page.getByRole('menuitem', { name: 'Print' })).toBeVisible();

    unmount();
  });

  it('moves roving focus across triggers with Arrow keys and opens via keyboard', async () => {
    const { unmount } = await renderComponent(SMenubar, { props: { items } });

    // The menubar exposes a single tab stop (roving focus): Tab lands on the
    // first trigger, ArrowRight moves to the next.
    await userEvent.tab();
    const fileTrigger = page.getByRole('menuitem', { name: 'File' });
    await expect.element(fileTrigger).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    const editTrigger = page.getByRole('menuitem', { name: 'Edit' });
    await expect.element(editTrigger).toHaveFocus();

    // ArrowDown opens the menu and moves focus into its content (keyboard-open
    // contract; pointer-open keeps focus on the trigger instead).
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(page.getByRole('menu')).toBeVisible();
    await expect.element(page.getByRole('menuitem', { name: 'Undo' })).toHaveFocus();

    unmount();
  });

  it('closes the menu on Escape and restores focus to the trigger', async () => {
    const { unmount } = await renderComponent(SMenubar, { props: { items } });

    const fileTrigger = page.getByRole('menuitem', { name: 'File' });
    await userEvent.click(fileTrigger);
    await expect.element(page.getByRole('menu')).toBeVisible();

    await userEvent.keyboard('{Escape}');

    await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
    await expect.element(fileTrigger).toHaveFocus();

    unmount();
  });

  it('has no a11y violations when a menu is open (with theme)', async () => {
    const { unmount } = await renderComponent(SMenubar, { props: { items }, withTheme: true });

    await userEvent.click(page.getByRole('menuitem', { name: 'File' }));
    await expect.element(page.getByRole('menu')).toBeVisible();

    // Real portal + real computed styles: color-contrast runs for real here.
    // `region` is a page-level best-practice rule: the bare test page has no
    // landmark elements, so it flags every component scanned from `body` (the
    // same pre-existing noise affects the select/dialog e2e specs).
    // `svg-img-alt` mirrors the project-wide exemption in
    // `packages/ui/test/shared/a11y.ts`: menu items render decorative chevron /
    // check icons as SVGs without aria-hidden, a rendering artifact rather than
    // a structural a11y issue.
    const violations = await getA11yViolations(undefined, {
      rules: {
        region: { enabled: false },
        'svg-img-alt': { enabled: false }
      }
    });
    expect(violations).toHaveLength(0);

    unmount();
  });

  it('opens the menu on hover and ignores clicks in hover mode', async () => {
    const { unmount } = await renderComponent(SMenubar, {
      props: { items, trigger: 'hover', delayDuration: 0 }
    });
    const fileTrigger = page.getByRole('menuitem', { name: 'File' });

    await userEvent.hover(fileTrigger);
    await expect.element(page.getByRole('menu')).toBeVisible();
    await expect.element(page.getByRole('menuitem', { name: 'New Tab' })).toBeVisible();

    unmount();
  });

  it('keeps the menu open when moving from the trigger onto the content in hover mode', async () => {
    const { unmount } = await renderComponent(SMenubar, {
      props: { items, trigger: 'hover', delayDuration: 0 }
    });
    const fileTrigger = page.getByRole('menuitem', { name: 'File' });
    const menu = page.getByRole('menu');

    await userEvent.hover(fileTrigger);
    await expect.element(menu).toBeVisible();

    // Move the real pointer in small steps from the trigger center down onto
    // the open content (through the gap between the menubar and the popup).
    // The grace area must keep the menu open while the pointer is in transit.
    const triggerEl = fileTrigger.elements()[0]!;
    const menuEl = menu.elements()[0]!;
    const t = triggerEl.getBoundingClientRect();
    const m = menuEl.getBoundingClientRect();

    const startX = t.x + t.width / 2;
    const startY = t.y + t.height / 2;
    const endX = m.x + m.width / 2;
    const endY = m.y + m.height / 2;

    const session = cdp();
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
      const x = startX + ((endX - startX) * i) / steps;
      const y = startY + ((endY - startY) * i) / steps;
      await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    }

    await expect.element(menu).toBeVisible();
    await expect.element(page.getByRole('menuitem', { name: 'New Tab' })).toBeVisible();

    // Moving back onto the trigger also keeps the menu open.
    for (let i = 0; i <= steps; i++) {
      const x = endX + ((startX - endX) * i) / steps;
      const y = endY + ((startY - endY) * i) / steps;
      await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    }
    await expect.element(menu).toBeVisible();

    unmount();
  });

  it('does not dismiss a freshly remounted menu while the replaced one is exiting', async () => {
    const removeExitAnimation = injectMenuExitAnimation();
    const { unmount, model } = await renderControlledMenubar();
    const fileTrigger = page.getByRole('menuitem', { name: 'File' });
    const newItem = page.getByRole('menuitem', { name: 'New Tab' });
    const undoItem = page.getByRole('menuitem', { name: 'Undo' });

    // File menu opens (fresh mount => open-auto-focus moves focus into it).
    await expect.element(newItem).toBeVisible();

    // Switch to Edit; the File popup animates out and unmounts.
    model.value = 'edit';
    await expect.element(undoItem).toBeVisible();
    await waitForPopupUnmount();

    // Switch back: the File popup REMOUNTS fresh and takes focus while the
    // Edit popup is still mounted for its exit animation. Regression guard:
    // the exiting Edit layer used to treat the remounted File popup (teleported
    // to an earlier portal anchor, so DOM order disagreed with the layer
    // stack) as an outside focus target and dismiss the whole menubar.
    model.value = 'file';
    await expect.element(newItem).toBeVisible();
    expect(model.value).toBe('file');
    expect((fileTrigger.elements()[0]! as HTMLElement).dataset.state).toBe('open');

    unmount();
    removeExitAnimation();
  });

  it('switches menus in both directions on hover without dismissing the newly opened menu', async () => {
    const removeExitAnimation = injectMenuExitAnimation();
    const { unmount } = await renderComponent(SMenubar, {
      props: { items, trigger: 'hover', delayDuration: 0 }
    });
    const fileTrigger = page.getByRole('menuitem', { name: 'File' });
    const editTrigger = page.getByRole('menuitem', { name: 'Edit' });
    const newItem = page.getByRole('menuitem', { name: 'New Tab' });
    const undoItem = page.getByRole('menuitem', { name: 'Undo' });

    await userEvent.hover(fileTrigger);
    await expect.element(newItem).toBeVisible();

    // Move right: File -> Edit replaces the open menu.
    await movePointerBetween(fileTrigger.elements()[0]!, editTrigger.elements()[0]!);
    await expect.element(undoItem).toBeVisible();

    // Let the File popup finish its exit animation and unmount so that moving
    // back REMOUNTS it fresh (fresh mount => open-auto-focus => the focus move
    // the closing Edit layer must tolerate).
    await waitForPopupUnmount();

    // Move back LEFT: Edit -> File — the real-pointer equivalent of the
    // controlled spec above.
    await movePointerBetween(editTrigger.elements()[0]!, fileTrigger.elements()[0]!);
    await expect.element(newItem).toBeVisible();

    unmount();
    removeExitAnimation();
  });

  it('switches menus on trigger click in click mode instead of dismissing everything', async () => {
    const { unmount } = await renderComponent(SMenubar, { props: { items } });
    const fileTrigger = page.getByRole('menuitem', { name: 'File' });
    const editTrigger = page.getByRole('menuitem', { name: 'Edit' });
    const newItem = page.getByRole('menuitem', { name: 'New Tab' });
    const undoItem = page.getByRole('menuitem', { name: 'Undo' });

    await userEvent.click(fileTrigger);
    await expect.element(newItem).toBeVisible();

    // The pointer approach switches File -> Edit (click-mode contract), and
    // the click must then KEEP the switched-to menu open. Regression guard:
    // the open menu's dismissable layer used to treat the trigger pointerdown
    // as an outside dismissal and close the whole menubar.
    await userEvent.hover(editTrigger);
    await userEvent.click(editTrigger);
    await expect.element(undoItem).toBeVisible();

    // Clicking the same trigger again (no hover switch in between) toggles
    // the open menu closed.
    await userEvent.click(editTrigger);
    await expect.element(page.getByRole('menu')).not.toBeInTheDocument();

    unmount();
  });

  it('keeps a hover-opened menu open when its trigger is clicked', async () => {
    const { unmount } = await renderComponent(SMenubar, {
      props: { items, trigger: 'hover', delayDuration: 0 }
    });
    const fileTrigger = page.getByRole('menuitem', { name: 'File' });
    const newItem = page.getByRole('menuitem', { name: 'New Tab' });

    await userEvent.hover(fileTrigger);
    await expect.element(newItem).toBeVisible();

    // In hover mode a click on the trigger must not dismiss the open menu
    // (the menu follows hover, not clicks).
    await userEvent.click(fileTrigger);
    await expect.element(newItem).toBeVisible();

    unmount();
  });

  it('unmounts a closing popup whose exit animation is cancelled mid-flight', async () => {
    const removeExitAnimation = injectMenuExitAnimation();
    const { unmount } = await renderComponent(SMenubar, { props: { items } });
    const menu = page.getByRole('menu');

    await userEvent.click(page.getByRole('menuitem', { name: 'File' }));
    await expect.element(menu).toBeVisible();
    const popup = menu.elements()[0]!;

    // Close, then strip the injected styles once the exit animation has
    // started: the running animation is cancelled while its animation-name no
    // longer resolves, so no matching `animationend` will ever arrive.
    // Regression guard: presence used to stay stuck in `unmountSuspended`
    // with the popup mounted, visible, and interactive.
    const exitStarted = new Promise<void>(resolve => {
      popup.addEventListener('animationstart', () => resolve(), { once: true });
    });
    await userEvent.keyboard('{Escape}');
    await exitStarted;
    removeExitAnimation();

    await expect.element(menu).not.toBeInTheDocument();

    unmount();
  });

  it('collapses overflowing items into a trailing "more" menu so the content fits', async () => {
    const { unmount } = await renderNarrowMenubar(280);

    // Not every item fits; a "more" trigger appears and the bar content fits
    // its container.
    const moreTrigger = page.getByText('More');
    await expect.element(moreTrigger).toBeVisible();

    // The menubar content always fits inside the measurement wrapper.
    const menubarEl = document.querySelector('[data-vean-menubar-root]');
    const wrapperEl = menubarEl?.closest('[data-vean-menubar-overflow]');
    expect(menubarEl).not.toBeNull();
    expect(wrapperEl).not.toBeNull();
    if (menubarEl && wrapperEl) {
      expect(menubarEl.getBoundingClientRect().width).toBeLessThanOrEqual(wrapperEl.getBoundingClientRect().width);
    }

    // Hidden items live inside the "more" menu.
    await userEvent.click(moreTrigger);
    await expect.element(page.getByText('Support')).toBeVisible();
    await expect.element(page.getByText('Settings')).toBeVisible();

    unmount();
  });

  it('restores every trigger and drops the "more" menu when collapsible is turned off', async () => {
    const collapsible = ref(true);
    const { unmount } = await renderNarrowMenubar(280, collapsible);

    await expect.element(page.getByText('More')).toBeVisible();

    collapsible.value = false;

    // Regression guard: the measured overflow count used to leak out of
    // collapsible mode, so the "more" menu survived while every trigger was
    // rendered right next to it.
    await expect.element(page.getByText('More')).not.toBeInTheDocument();
    expect(document.querySelector('[data-vean-menubar-overflow]')).toBeNull();
    await expect.element(page.getByText('Support')).toBeInTheDocument();

    unmount();
  });
});
