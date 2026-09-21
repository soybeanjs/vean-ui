import { onWatcherCleanup, toValue, watchPostEffect } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

let registeredEscapeHandlers: ((e: KeyboardEvent) => void)[] = [];
let currentDocument: Document | undefined;

export function useEscapeKeyDown(
  ownerDocument: MaybeRefOrGetter<Document | undefined>,
  handler: (e: KeyboardEvent) => void
) {
  watchPostEffect(() => {
    const document = toValue(ownerDocument);

    // If no document is available, return early
    if (!document) {
      return;
    }

    // Check if this is the first handler or if the document has changed
    const isFirstHandler = registeredEscapeHandlers.length === 0;
    const isDocumentChanged = currentDocument !== document;

    if (isFirstHandler || isDocumentChanged) {
      // If document has changed, clean up the old listener first
      if (isDocumentChanged && currentDocument) {
        currentDocument.removeEventListener('keydown', cachedHandler);
      }

      // Register new listener
      currentDocument = document;
      document.addEventListener('keydown', cachedHandler);
    }

    // Add handler to array (avoid duplicate registration)
    if (!registeredEscapeHandlers.includes(handler)) {
      registeredEscapeHandlers.push(handler);
    }

    onWatcherCleanup(() => {
      // Remove current handler from array
      registeredEscapeHandlers = registeredEscapeHandlers.filter(registeredHandler => registeredHandler !== handler);

      // If no handlers left, remove event listener
      if (registeredEscapeHandlers.length === 0) {
        currentDocument?.removeEventListener('keydown', cachedHandler);
        currentDocument = undefined;
      }
    });
  });
}

function cachedHandler(e: Event) {
  const event = e as KeyboardEvent;
  if (event.key !== 'Escape') return;

  // Use slice() to create a copy, avoiding array modification during iteration
  for (const registeredHandler of registeredEscapeHandlers.slice()) {
    registeredHandler(event);
  }
}
