const LEGACY_COPY_FAILED_MESSAGE = 'Legacy clipboard copy failed.';
const CLIPBOARD_UNSUPPORTED_MESSAGE = 'Clipboard API is not supported.';

function createLegacyTextarea(value: string): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');

  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '2em';
  textarea.style.height = '2em';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';

  return textarea;
}

export function isClipboardWriteSupported(): boolean {
  return typeof navigator?.clipboard?.writeText === 'function';
}

export async function legacyCopy(value: string): Promise<void> {
  if (typeof document === 'undefined') {
    throw new Error(CLIPBOARD_UNSUPPORTED_MESSAGE);
  }

  const textarea = createLegacyTextarea(value);

  document.body.appendChild(textarea);

  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, value.length);

    const success = document.execCommand('copy');

    if (!success) {
      throw new Error(LEGACY_COPY_FAILED_MESSAGE);
    }
  } finally {
    textarea.remove();
  }
}

export async function copyTextToClipboard(value: string, legacy: boolean): Promise<void> {
  if (isClipboardWriteSupported()) {
    try {
      await navigator.clipboard.writeText(value);

      return;
    } catch (error) {
      if (!legacy) {
        throw error;
      }
    }
  }

  if (legacy) {
    await legacyCopy(value);

    return;
  }

  throw new Error(CLIPBOARD_UNSUPPORTED_MESSAGE);
}
