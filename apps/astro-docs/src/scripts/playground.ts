/**
 * Playground card behavior: device / view switching and fullscreen scroll lock.
 *
 * One delegated listener for the whole page, mirroring what
 * `apps/docs/src/components/playground-gallery.vue` does per example in Vue state.
 * The frames are copied from `apps/docs/src/constants/playground.ts` so the two
 * sites show the same preview geometry.
 */

const DEVICE_FRAMES: Record<string, string> = {
  desktop: 'min-h-36 w-full',
  mobile: 'min-h-100 w-full max-w-[390px] mx-auto overflow-auto overscroll-contain',
  ipad: 'min-h-125 w-full max-w-[768px] mx-auto overflow-auto overscroll-contain',
  fullscreen: 'min-h-0 grow w-full overflow-auto overscroll-contain'
};

/** Classes the active/inactive state toggles on the device buttons. */
const ACTIVE_BUTTON = ['bg-accent', 'text-accent-foreground'];

function applyDevice(card: HTMLElement, device: string): void {
  card.dataset.device = device;

  const preview = card.querySelector<HTMLElement>('[data-playground-panel="preview"]');

  if (preview) {
    // Reset to the shared frame class, then layer the device-specific geometry.
    preview.className = `rounded-md border border-dashed p-4 sm:p-5 ${DEVICE_FRAMES[device] ?? DEVICE_FRAMES.desktop}`;
  }

  for (const button of card.querySelectorAll<HTMLButtonElement>('[data-playground-device]')) {
    const active = button.dataset.playgroundDevice === device;

    button.classList.toggle(ACTIVE_BUTTON[0], active);
    button.classList.toggle(ACTIVE_BUTTON[1], active);
    button.setAttribute('aria-pressed', String(active));
  }

  // The exit button is only meaningful in fullscreen preview mode.
  const exit = card.querySelector<HTMLButtonElement>('[data-playground-exit]');
  const tab = card.dataset.tab ?? 'preview';

  if (exit) {
    exit.classList.toggle('hidden', !(device === 'fullscreen' && tab === 'preview'));
  }

  // Body scroll locks while a fullscreen preview is open (mirrors `useBodyScrollLock`).
  const anyFullscreen = [...document.querySelectorAll<HTMLElement>('[data-playground-card]')].some(
    element => element.dataset.device === 'fullscreen' && element.dataset.tab === 'preview'
  );

  document.body.style.overflow = anyFullscreen ? 'hidden' : '';
}

function applyTab(card: HTMLElement, tab: string): void {
  card.dataset.tab = tab;

  for (const panel of card.querySelectorAll<HTMLElement>('[data-playground-panel]')) {
    panel.hidden = panel.dataset.playgroundPanel !== tab;
  }

  for (const button of card.querySelectorAll<HTMLButtonElement>('[data-playground-tab]')) {
    const active = button.dataset.playgroundTab === tab;

    button.classList.toggle(ACTIVE_BUTTON[0], active);
    button.classList.toggle(ACTIVE_BUTTON[1], active);
    button.setAttribute('aria-pressed', String(active));
  }

  const exit = card.querySelector<HTMLButtonElement>('[data-playground-exit]');

  if (exit) {
    exit.classList.toggle('hidden', !(card.dataset.device === 'fullscreen' && tab === 'preview'));
  }
}

document.addEventListener('click', event => {
  const target = event.target as HTMLElement | null;
  const card = target?.closest<HTMLElement>('[data-playground-card]');

  if (!card) {
    return;
  }

  const deviceButton = target?.closest<HTMLButtonElement>('[data-playground-device]');

  if (deviceButton?.dataset.playgroundDevice) {
    applyDevice(card, deviceButton.dataset.playgroundDevice);
    return;
  }

  const tabButton = target?.closest<HTMLButtonElement>('[data-playground-tab]');

  if (tabButton?.dataset.playgroundTab) {
    applyTab(card, tabButton.dataset.playgroundTab);
    return;
  }

  if (target?.closest('[data-playground-exit]')) {
    applyDevice(card, 'desktop');
  }
});

// Escape leaves fullscreen, same as the original's `useEscapeKeyDown`.
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') {
    return;
  }

  for (const card of document.querySelectorAll<HTMLElement>('[data-playground-card]')) {
    if (card.dataset.device === 'fullscreen') {
      applyDevice(card, 'desktop');
    }
  }
});
