import { computed, onMounted, onUnmounted, shallowRef, watch } from 'vue';
import type { ShallowRef } from 'vue';
import type { InputOtpPushPasswordManagerStrategy } from './types';

const PASSWORD_MANAGER_BADGE_MARGIN_RIGHT = 18;
const PASSWORD_MANAGER_BADGE_SPACE_WIDTH_PX = 40;

const PASSWORD_MANAGER_BADGE_SPACE_WIDTH = `${PASSWORD_MANAGER_BADGE_SPACE_WIDTH_PX}px`;

const PASSWORD_MANAGER_SELECTORS = [
  '[data-lastpass-icon-root]',
  'com-1password-button',
  '[data-dashlanecreated]',
  '[style$="2147483647 !important;"]'
].join(',');

export function usePasswordManagerBadge(params: {
  containerElement: ShallowRef<HTMLDivElement | null>;
  inputElement: ShallowRef<HTMLInputElement | null>;
  pushPasswordManagerStrategy: () => InputOtpPushPasswordManagerStrategy;
  isFocused: ShallowRef<boolean>;
}) {
  const { containerElement, inputElement, pushPasswordManagerStrategy, isFocused } = params;

  const hasBadge = shallowRef(false);
  const hasBadgeSpace = shallowRef(false);
  const detectionDone = shallowRef(false);
  const hasRefocused = shallowRef(false);

  const willPushPWMBadge = computed(() => {
    if (pushPasswordManagerStrategy() === 'none') {
      return false;
    }

    return hasBadge.value && hasBadgeSpace.value;
  });

  const checkAvailableSpace = () => {
    if (pushPasswordManagerStrategy() === 'none') {
      return;
    }

    const container = containerElement.value;
    const currentWindow = globalThis.window;

    if (!container || !currentWindow) {
      return;
    }

    const distanceToRightEdge = currentWindow.innerWidth - container.getBoundingClientRect().right;
    hasBadgeSpace.value = distanceToRightEdge >= PASSWORD_MANAGER_BADGE_SPACE_WIDTH_PX;
  };

  const trackBadge = () => {
    const currentDocument = globalThis.document;
    const container = containerElement.value;
    const input = inputElement.value;

    if (!currentDocument || !container || !input || detectionDone.value || pushPasswordManagerStrategy() === 'none') {
      return;
    }

    const rightCornerX = container.getBoundingClientRect().left + container.offsetWidth;
    const centeredY = container.getBoundingClientRect().top + container.offsetHeight / 2;
    const maybeBadgeElement = currentDocument.elementFromPoint(
      rightCornerX - PASSWORD_MANAGER_BADGE_MARGIN_RIGHT,
      centeredY
    );
    const knownBadges = currentDocument.querySelectorAll(PASSWORD_MANAGER_SELECTORS);

    if (knownBadges.length === 0 && maybeBadgeElement === container) {
      return;
    }

    hasBadge.value = true;
    detectionDone.value = true;

    if (!hasRefocused.value && currentDocument.activeElement === input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      input.blur();
      input.focus();

      if (selectionStart !== null && selectionEnd !== null) {
        input.setSelectionRange(selectionStart, selectionEnd);
      }

      hasRefocused.value = true;
    }
  };

  let spaceTimer = 0;

  onMounted(() => {
    checkAvailableSpace();
    spaceTimer = window.setInterval(checkAvailableSpace, 1000);
  });

  onUnmounted(() => {
    window.clearInterval(spaceTimer);
  });

  watch([isFocused, inputElement], ([focused, input], _, onCleanup) => {
    const currentDocument = globalThis.document;
    const strategy = pushPasswordManagerStrategy();
    const isActuallyFocused = focused || currentDocument?.activeElement === input;

    if (strategy === 'none' || !isActuallyFocused) {
      return;
    }

    const timers = [0, 2000, 5000].map(delay => window.setTimeout(trackBadge, delay));
    const doneTimer = window.setTimeout(() => {
      detectionDone.value = true;
    }, 6000);

    onCleanup(() => {
      timers.forEach(timer => window.clearTimeout(timer));
      window.clearTimeout(doneTimer);
    });
  });

  return {
    willPushPWMBadge,
    PASSWORD_MANAGER_BADGE_SPACE_WIDTH
  };
}
