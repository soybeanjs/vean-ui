import { describe, expect, it } from 'vitest';
import { cdp, page, userEvent } from 'vitest/browser';
import type { NavMenuOptionData } from '@/components/nav-menu';
import SNavMenu from '@/components/nav-menu/nav-menu.vue';
import { renderComponent } from '../../shared/render';

/**
 * NavMenu e2e — single shared Popper root + viewport-as-positioner.
 *
 * The viewport is a real `PopperPositioner`: Floating UI positions it against the active
 * trigger (inline styles), the grace corridor and dismissal come from the positioner, and
 * hover timing runs on one shared machine with `pendingValue` routing. Real pointers here
 * validate the corridor (trigger → viewport) and the instant trigger switching.
 */
const items: NavMenuOptionData[] = [
  {
    value: 'one',
    label: 'One',
    href: '/one',
    children: [
      { value: 'one-a', label: 'One A', description: 'Introduction guide', href: '/one-a' },
      { value: 'one-b', label: 'One B', description: 'Installation guide', href: '/one-b' }
    ]
  },
  {
    value: 'two',
    label: 'Two',
    href: '/two',
    children: [
      { value: 'two-a', label: 'Two A', description: 'Component library', href: '/two-a' },
      { value: 'two-b', label: 'Two B', description: 'Theme reference', href: '/two-b' }
    ]
  }
];

/**
 * Move the real pointer in small steps from the center of `fromEl` to the center of `toEl`.
 */
async function movePointerBetween(fromEl: Element, toEl: Element) {
  const session = cdp();
  const a = fromEl.getBoundingClientRect();
  const b = toEl.getBoundingClientRect();
  const startX = a.x + a.width / 2;
  const startY = a.y + a.height / 2;
  const endX = b.x + b.width / 2;
  const endY = b.y + b.height / 2;
  const steps = 12;

  for (let i = 0; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = startY + ((endY - startY) * i) / steps;
    await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  }
}

describe('SNavMenu (e2e)', () => {
  it('closes the menu when the pointer moves to a root-level leaf link', async () => {
    const { unmount } = await renderComponent(SNavMenu, {
      props: {
        items: [...items, { value: 'help', label: 'Help', href: '/help' }],
        delayDuration: 0
      }
    });
    const oneTrigger = page.getByRole('link', { name: 'One', exact: true });
    const helpLink = page.getByRole('link', { name: 'Help', exact: true });
    const oneItem = page.getByText('One A');

    await userEvent.hover(oneTrigger);
    await expect.element(oneItem).toBeVisible();

    // moving the real pointer onto a root link without children dismisses the open menu
    await movePointerBetween(oneTrigger.elements()[0]!, helpLink.elements()[0]!);

    await expect.element(oneItem).not.toBeInTheDocument();

    unmount();
  });

  it('opens on hover and keeps the menu open while moving onto the content', async () => {
    const { unmount } = await renderComponent(SNavMenu, { props: { items, delayDuration: 0 } });
    const oneTrigger = page.getByRole('link', { name: 'One' });
    const oneItem = page.getByText('One A');

    await userEvent.hover(oneTrigger);
    await expect.element(oneItem).toBeVisible();

    // Move the real pointer from the trigger center down into the open viewport. The
    // positioner's grace corridor must keep the menu open while the pointer is in transit.
    const triggerEl = oneTrigger.elements()[0]!;
    const viewportEl = document.querySelector('[data-vean-nav-menu-viewport]')!;
    const session = cdp();
    const t = triggerEl.getBoundingClientRect();
    const v = viewportEl.getBoundingClientRect();
    const startX = t.x + t.width / 2;
    const startY = t.y + t.height / 2;
    const endX = v.x + v.width / 2;
    const endY = v.y + v.height / 2;
    const steps = 12;

    for (let i = 0; i <= steps; i++) {
      const x = startX + ((endX - startX) * i) / steps;
      const y = startY + ((endY - startY) * i) / steps;
      await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    }

    await expect.element(oneItem).toBeVisible();

    unmount();
  });

  it('switches instantly between triggers on hover', async () => {
    const { unmount } = await renderComponent(SNavMenu, { props: { items, delayDuration: 0 } });
    const oneTrigger = page.getByRole('link', { name: 'One' });
    const twoTrigger = page.getByRole('link', { name: 'Two' });
    const oneItem = page.getByText('One A');
    const twoItem = page.getByText('Two A');

    await userEvent.hover(oneTrigger);
    await expect.element(oneItem).toBeVisible();

    await movePointerBetween(oneTrigger.elements()[0]!, twoTrigger.elements()[0]!);

    await expect.element(twoItem).toBeVisible();
    expect((twoTrigger.elements()[0]! as HTMLElement).getAttribute('data-state')).toBe('open');

    unmount();
  });

  it('closes the menu when the pointer leaves the grace corridor', async () => {
    const { unmount } = await renderComponent(SNavMenu, { props: { items, delayDuration: 0 } });
    const oneTrigger = page.getByRole('link', { name: 'One' });
    const oneItem = page.getByText('One A');

    await userEvent.hover(oneTrigger);
    await expect.element(oneItem).toBeVisible();

    const session = cdp();
    const t = oneTrigger.elements()[0]!.getBoundingClientRect();
    const startX = t.x + t.width / 2;
    const startY = t.y + t.height / 2;
    const endY = Math.min(startY + 500, window.innerHeight - 20);
    const steps = 12;

    for (let i = 1; i <= steps; i++) {
      const y = startY + ((endY - startY) * i) / steps;
      await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: startX, y });
    }

    await expect.element(oneItem).not.toBeInTheDocument();

    unmount();
  });

  it('opens the submenu on trigger click', async () => {
    const { unmount } = await renderComponent(SNavMenu, { props: { items } });
    const oneTrigger = page.getByRole('link', { name: 'One' });

    await userEvent.click(oneTrigger);
    await expect.element(page.getByText('One A')).toBeVisible();

    unmount();
  });

  it('aligns the horizontal viewport to the logical end in RTL (mirror of LTR bottom-start)', async () => {
    // Keep the content narrow: with descriptions the viewport is wider than
    // the space to the start edge and Floating UI's shift middleware pushes it
    // back, which would mask the RTL end-alignment contract under test.
    const rtlItems: NavMenuOptionData[] = [
      {
        value: 'one',
        label: 'One',
        href: '/one',
        children: [
          { value: 'one-a', label: 'One A', href: '/one-a' },
          { value: 'one-b', label: 'One B', href: '/one-b' }
        ]
      },
      {
        value: 'two',
        label: 'Two',
        href: '/two',
        children: [
          { value: 'two-a', label: 'Two A', href: '/two-a' },
          { value: 'two-b', label: 'Two B', href: '/two-b' }
        ]
      }
    ];
    const { unmount } = await renderComponent(SNavMenu, {
      props: { items: rtlItems, dir: 'rtl', delayDuration: 0 }
    });
    const oneTrigger = page.getByRole('link', { name: 'One' });

    await userEvent.hover(oneTrigger);
    await expect.element(page.getByText('One A')).toBeVisible();

    // Floating UI aligns logically: `start` maps to the right edge in RTL, so
    // the viewport's right edge must line up with the trigger's right edge.
    // The shared viewport animates its width/position when content first lands,
    // so poll until placement settles instead of sampling a transition frame.
    const measureAlignmentGap = () => {
      const triggerRect = oneTrigger.elements()[0]!.getBoundingClientRect();
      const viewportRect = document.querySelector('[data-vean-nav-menu-viewport]')!.getBoundingClientRect();

      return Math.abs(viewportRect.right - triggerRect.right);
    };

    await expect.poll(measureAlignmentGap, { timeout: 1000 }).toBeLessThan(2);

    unmount();
  });

  it('opens a nested flyout on hover and keeps both levels open while the pointer is on the flyout', async () => {
    const nestedItems: NavMenuOptionData[] = [
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
              { value: 'one-a-1', label: 'One A 1', href: '/one-a-1' },
              { value: 'one-a-2', label: 'One A 2', href: '/one-a-2' }
            ]
          }
        ]
      }
    ];

    const { unmount } = await renderComponent(SNavMenu, {
      props: { items: nestedItems, delayDuration: 0 }
    });
    const oneTrigger = page.getByRole('link', { name: 'One', exact: true });
    const oneATrigger = page.getByRole('button', { name: 'One A', exact: true });
    const oneA1 = page.getByText('One A 1', { exact: true });

    await userEvent.hover(oneTrigger);
    await expect.element(oneATrigger).toBeVisible();

    await userEvent.hover(oneATrigger);
    await expect.element(oneA1).toBeVisible();

    // Move the real pointer from the sub-trigger into the nested flyout. The child
    // transit corridor + parent `isPointerInTree` must keep both levels open.
    const triggerEl = oneATrigger.elements()[0]!;
    const flyoutEl = document.querySelector('[data-vean-nav-menu-sub-content]')!;
    await movePointerBetween(triggerEl, flyoutEl);

    await expect.element(oneA1).toBeVisible();
    await expect.element(oneATrigger).toBeVisible();

    unmount();
  });

  it('closes the nested flyout when the pointer leaves the flyout corridor', async () => {
    const nestedItems: NavMenuOptionData[] = [
      {
        value: 'one',
        label: 'One',
        href: '/one',
        children: [
          {
            value: 'one-a',
            label: 'One A',
            href: '/one-a',
            children: [{ value: 'one-a-1', label: 'One A 1', href: '/one-a-1' }]
          }
        ]
      }
    ];

    const { unmount } = await renderComponent(SNavMenu, {
      props: { items: nestedItems, delayDuration: 0 }
    });
    const oneTrigger = page.getByRole('link', { name: 'One', exact: true });
    const oneATrigger = page.getByRole('button', { name: 'One A', exact: true });
    const oneA1 = page.getByText('One A 1', { exact: true });

    await userEvent.hover(oneTrigger);
    await userEvent.hover(oneATrigger);
    await expect.element(oneA1).toBeVisible();

    // Move the real pointer far below the flyout: both the flyout and the root close.
    const session = cdp();
    const t = oneATrigger.elements()[0]!.getBoundingClientRect();
    const startX = t.x + t.width / 2;
    const startY = t.y + t.height / 2;
    const endY = Math.min(startY + 500, window.innerHeight - 20);
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      const y = startY + ((endY - startY) * i) / steps;
      await session.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: startX, y });
    }

    await expect.element(oneA1).not.toBeInTheDocument();
    await expect.element(oneATrigger).not.toBeInTheDocument();

    unmount();
  });
});
