import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import type { Locator } from 'vitest/browser';
import SSelect from '@/components/select/select.vue';
import { getA11yViolations } from '../../shared/a11y';
import { renderComponent } from '../../shared/render';

/**
 * Select e2e — exercises the REAL ResizeObserver, pointer capture, and
 * scrollIntoView that the happy-dom select spec
 * (`packages/ui/test/specs/components/select.spec.ts`) has to mock.
 *
 * No mocks here. `userEvent.click` dispatches real pointer + click events, so
 * the select opens the way a user experiences it.
 */
const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' }
];

/**
 * Renders the select next to an unrelated button that the content never covers, so a test can
 * press "outside" the way a user does. The content is anchored below the trigger, so the outside
 * target sits in the opposite corner of the viewport.
 */
function renderSelectWithOutsideTarget() {
  return renderComponent({
    components: { SSelect },
    data: () => ({ items }),
    template: `
      <div>
        <div style="width: 12rem">
          <SSelect :items="items" placeholder="Pick fruit" />
        </div>
        <button type="button" style="position: fixed; top: 0.25rem; right: 0.25rem; z-index: 999">
          Outside
        </button>
      </div>
    `
  });
}

/**
 * Presses an element that the open content's outside pointer lock makes untouchable.
 *
 * While the content is open it sets `pointer-events: none` on the body, so the browser resolves such a
 * press to the document root instead of the element painted there — the element dismisses the content
 * without ever seeing the press, which is exactly the documented "click twice" behavior. Playwright
 * refuses to act on an element that cannot receive events, so `force` is what puts the press at those
 * coordinates.
 */
async function forcePress(locator: Locator) {
  await locator.click({ force: true });
}

describe('SSelect (e2e)', () => {
  it('stays open when the trigger is pressed on a scrolled page and the pointer drifts', async () => {
    const { unmount } = await renderComponent({
      components: { SSelect },
      data: () => ({ items }),
      template: `
        <div>
          <div style="height: 60rem"></div>
          <div style="width: 12rem">
            <SSelect
              :items="items"
              placeholder="Pick fruit"
              :content-props="{ disableOutsidePointerEvents: false }"
            />
          </div>
          <div style="height: 60rem"></div>
        </div>
      `
    });

    const trigger = document.querySelector<HTMLElement>('[data-vean-select-trigger]');
    if (!trigger) throw new Error('select trigger not rendered');

    // The trigger must sit below the fold: opening the content locks the body scroll, which is
    // what made the press and release disagree.
    trigger.scrollIntoView({ block: 'center' });
    expect(window.scrollY).toBeGreaterThan(100);

    // The pointer lock is opted out here so the probe below stays pressable for the harness; the
    // mechanism under test — the body scroll lock shifting the page offset mid-press — is untouched
    // by it.
    // A 3px probe inside the trigger: dragging onto it presses and releases on the trigger itself
    // with a few pixels of real pointer travel in between — the drift of an ordinary hand click.
    const probe = document.createElement('span');
    probe.dataset.testid = 'drift-probe';
    probe.style.cssText = 'position:fixed;display:block;width:2px;height:2px';
    const box = trigger.getBoundingClientRect();
    probe.style.left = `${Math.round(box.x + box.width / 2 + 3)}px`;
    probe.style.top = `${Math.round(box.y + box.height / 2 + 3)}px`;
    trigger.appendChild(probe);

    await userEvent.dragAndDrop(page.getByRole('combobox'), page.getByTestId('drift-probe'));

    // A close triggered by the release would have run its exit animation (~150ms) and unmounted by
    // now, so a visible listbox proves the press was not mistaken for a drag.
    await new Promise(resolve => setTimeout(resolve, 400));

    await expect.element(page.getByRole('listbox')).toBeVisible();

    unmount();
  });

  it('opens the listbox and selects an option by click', async () => {
    const { unmount } = await renderComponent(SSelect, {
      props: { items, placeholder: 'Pick fruit' }
    });

    const trigger = page.getByRole('combobox');
    await userEvent.click(trigger);

    await expect.element(page.getByRole('listbox')).toBeVisible();
    await expect.element(page.getByRole('option', { name: 'Banana' })).toBeVisible();

    await userEvent.click(page.getByRole('option', { name: 'Banana' }));

    // The trigger now reflects the selected label.
    await expect.element(trigger).toHaveTextContent('Banana');

    unmount();
  });

  it('selects an option via keyboard', async () => {
    const { unmount } = await renderComponent(SSelect, {
      props: { items, placeholder: 'Pick fruit' }
    });

    const trigger = page.getByRole('combobox');
    await userEvent.click(trigger);
    await expect.element(page.getByRole('listbox')).toBeVisible();

    // Navigate with Arrow keys and confirm with Enter. We do not assert the exact
    // landing option (initial highlight varies); we only assert that SOME option
    // was committed — i.e. the trigger no longer shows the placeholder.
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    await expect.element(trigger).not.toHaveTextContent('Pick fruit');

    unmount();
  });

  it('holds the outside pointer lock while open and releases it on close', async () => {
    const { unmount } = await renderSelectWithOutsideTarget();

    const trigger = page.getByRole('combobox');
    const outside = page.getByRole('button', { name: 'Outside' });
    const listbox = page.getByRole('listbox');

    await userEvent.click(trigger);
    await expect.element(listbox).toBeVisible();

    // The documented contract: while the content is open, elements outside it cannot be interacted
    // with, so a press there only dismisses the content.
    expect(document.body.style.pointerEvents).toBe('none');

    await forcePress(outside);
    await expect.element(listbox).not.toBeInTheDocument();

    // ... and the page is handed back as soon as the content closes, not when its exit animation
    // finishes: otherwise the press that reopens the select would be swallowed by the lock.
    expect(document.body.style.pointerEvents).toBe('');

    await userEvent.click(trigger);
    await expect.element(listbox).toBeVisible();

    unmount();
  });

  it('closes when the trigger is pressed while the content is open', async () => {
    const { unmount } = await renderSelectWithOutsideTarget();

    const trigger = page.getByRole('combobox');
    await userEvent.click(trigger);
    await expect.element(page.getByRole('listbox')).toBeVisible();

    // The trigger sits outside the content, so while the content is open the lock keeps the press
    // from reaching it — the press still dismisses the content.
    await forcePress(trigger);
    await expect.element(page.getByRole('listbox')).not.toBeInTheDocument();

    unmount();
  });

  it('stays open when the trigger re-opens it right after an outside press', async () => {
    const { unmount } = await renderSelectWithOutsideTarget();

    const trigger = page.getByRole('combobox');
    const outside = page.getByRole('button', { name: 'Outside' });
    const listbox = page.getByRole('listbox');

    // The press that dismisses the select starts the content's exit animation, which keeps the
    // content mounted for a few frames. A trigger press landing in that window must open the
    // content and keep it open — the closing content used to read that very press as an outside
    // one and dismiss the select it had just re-opened.
    await userEvent.click(trigger);
    await expect.element(listbox).toBeVisible();

    for (let cycle = 0; cycle < 3; cycle += 1) {
      await forcePress(outside);
      await userEvent.click(trigger);

      // Wait out the exit animation so a close that only shows up slightly later cannot pass by
      // being visible for the few frames the unmounting content is still on screen.
      await new Promise(resolve => setTimeout(resolve, 400));

      await expect.element(listbox).toBeVisible();
    }

    unmount();
  });

  it('has no a11y violations when paired with a label (with theme)', async () => {
    const { unmount } = await renderComponent(
      {
        components: { SSelect },
        data: () => ({ items }),
        template: `
          <div>
            <label for="sel-trigger">Fruit</label>
            <SSelect
              :items="items"
              :trigger-props="{ id: 'sel-trigger', 'aria-label': 'Fruit' }"
              placeholder="Pick fruit"
            />
          </div>
        `
      },
      { withTheme: true }
    );

    // `region` is a page-level best-practice rule: the bare test page has no
    // landmark elements, so it flags every component scanned from `body`.
    const violations = await getA11yViolations(undefined, {
      rules: { region: { enabled: false } }
    });
    expect(violations).toHaveLength(0);
    unmount();
  });
});
