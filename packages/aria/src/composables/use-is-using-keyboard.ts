import { computed, onWatcherCleanup, shallowRef, watchPostEffect } from 'vue';
import { isClient } from '../shared';

let subscribers = 0;
const isUsingKeyboardRef = shallowRef(false);
let isListening = false;

function handlePointer() {
  isUsingKeyboardRef.value = false;
}

function handleKeyDown() {
  isUsingKeyboardRef.value = true;
}

function addEventListeners() {
  if (isListening) return;

  document.addEventListener('keydown', handleKeyDown, { capture: true, passive: true });
  document.addEventListener('pointerdown', handlePointer, { capture: true, passive: true });
  document.addEventListener('pointermove', handlePointer, { capture: true, passive: true });
  isListening = true;
}

function removeEventListeners() {
  if (!isListening) return;

  document.removeEventListener('keydown', handleKeyDown, { capture: true });
  document.removeEventListener('pointerdown', handlePointer, { capture: true });
  document.removeEventListener('pointermove', handlePointer, { capture: true });
  isListening = false;
}

export function useIsUsingKeyboard() {
  watchPostEffect(() => {
    // Ensure we're in a browser environment
    if (!isClient) {
      return;
    }

    // Subscribe to keyboard usage tracking
    subscribers++;

    // Add event listeners when the first subscriber appears
    if (subscribers === 1) {
      addEventListeners();
    }

    onWatcherCleanup(() => {
      // Unsubscribe from keyboard usage tracking
      subscribers = Math.max(0, subscribers - 1);

      // Remove event listeners when the last subscriber unsubscribes
      if (subscribers === 0) {
        removeEventListeners();
        // Reset state when no subscribers are left
        isUsingKeyboardRef.value = false;
      }
    });
  });

  return computed(() => isUsingKeyboardRef.value);
}
