import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { page, userEvent } from 'vitest/browser';
import SContextMenu from '@/components/context-menu/context-menu.vue';
import { renderComponent } from '../../shared/render';

/**
 * Context menu e2e — the outside-press contract of a right-click trigger.
 *
 * A contextmenu trigger toggles on the RIGHT press, so a LEFT press on it is an ordinary
 * outside press and must dismiss the menu. The happy-dom unit spec cannot verify this: the
 * layer attaches its outside-`pointerdown` listener from a `setTimeout`, and the press has to
 * be a genuine pointer sequence against a real portal.
 *
 * The trigger renders a nested element on purpose: a real press lands on the trigger's child,
 * which is the shape that regressed — press containment has to be judged against the whole
 * trigger subtree, not against the trigger node alone.
 */
const items = [
  { value: 'copy', label: 'Copy' },
  { value: 'paste', label: 'Paste' }
];

const CONTENT = '[data-vean-context-menu-content]';

// The fixture keeps the generic component out of `renderComponent`'s signature (mirrors the
// menu spec); the trigger's nested element covers the whole trigger box so a press at the
// point used below is guaranteed to land on the child.
const ContextMenuFixture = defineComponent({
  name: 'ContextMenuFixture',
  props: {
    modal: { type: Boolean, default: true }
  },
  setup(props) {
    return () =>
      h(
        SContextMenu,
        { modal: props.modal, items },
        {
          trigger: () =>
            h('button', { type: 'button', style: { display: 'block', padding: '0' } }, [
              h('span', { style: { display: 'block', width: '8rem', height: '2.5rem' } }, 'Right-click me')
            ])
        }
      );
  }
});

function renderMenu(modal = true) {
  return renderComponent(ContextMenuFixture, { props: { modal } });
}

const trigger = () => page.getByRole('button', { name: 'Right-click me' });
const menu = () => page.getByRole('menu');

// The popup anchors at the press point and grows away from it, so the trigger's top-left
// corner stays pressable no matter how wide the open menu renders.
const triggerCorner = { x: 6, y: 6 };

/**
 * Record every `data-state` transition of the open menu. A close-then-reopen cycle cannot be
 * observed through `update:open`: both updates land in the same tick, so the emitted watch
 * only ever reports the final value.
 */
function recordMenuStates(element: HTMLElement) {
  const states = [element.getAttribute('data-state')];
  const observer = new MutationObserver(() => states.push(element.getAttribute('data-state')));

  observer.observe(element, { attributes: true, attributeFilter: ['data-state'] });

  return {
    states,
    stop: () => observer.disconnect()
  };
}

describe('SContextMenu dismissal (e2e)', () => {
  it('opens on a real right press', async () => {
    const { unmount } = await renderMenu(false);

    await userEvent.click(trigger(), { button: 'right' });

    await expect.element(menu()).toBeVisible();
    await expect.element(page.getByRole('menuitem', { name: 'Copy' })).toBeVisible();

    unmount();
  });

  it('dismisses on a left press of the trigger while modal', async () => {
    const { unmount } = await renderMenu();

    await userEvent.click(trigger(), { button: 'right' });
    await expect.element(menu()).toBeVisible();

    await userEvent.click(trigger(), { position: triggerCorner });

    await expect.element(menu()).not.toBeInTheDocument();

    unmount();
  });

  it('dismisses on a left press of the trigger while non-modal', async () => {
    const { unmount } = await renderMenu(false);

    await userEvent.click(trigger(), { button: 'right' });
    await expect.element(menu()).toBeVisible();

    await userEvent.click(trigger(), { position: triggerCorner });

    await expect.element(menu()).not.toBeInTheDocument();

    unmount();
  });

  it('repositions instead of closing on a second right press of the trigger', async () => {
    const { unmount } = await renderMenu(false);

    await userEvent.click(trigger(), { button: 'right' });
    await expect.element(menu()).toBeVisible();

    const { states, stop } = recordMenuStates(document.querySelector(CONTENT)!);

    await userEvent.click(trigger(), { button: 'right', position: triggerCorner });
    await expect.element(menu()).toBeVisible();
    stop();

    // The right press is the toggle gesture: the open menu repositions and never closes.
    expect(states).toEqual(['open']);

    unmount();
  });
});
