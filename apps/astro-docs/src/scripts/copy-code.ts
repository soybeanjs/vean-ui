/**
 * Copy-to-clipboard behavior for the build-time rendered code blocks.
 *
 * The ubean docs hydrate a `<CopyButton>` Vue component per code fence. The Astro
 * build already emits the button markup (see `plugin/code-highlight.ts`), so the
 * behavior is a single delegated listener instead of one component instance per
 * fence — one script for the whole page, no island.
 *
 * Loaded by `layouts/DefaultLayout.astro` with a static `import`, which Astro
 * bundles as an entry script on every page that has the layout.
 */

/** Read the label pair the layout put on `<html>` (locale-specific copy). */
function labels(): { copy: string; copied: string } {
  const root = document.documentElement;

  return {
    copy: root.dataset.copyLabel ?? 'Copy code',
    copied: root.dataset.copiedLabel ?? 'Copied'
  };
}

function decodeBase64(value: string): string {
  // `atob` yields one char per byte; the payload is UTF-8 (see `encodeBase64Utf8`
  // in `apps/docs/src/shared/encode.ts`), so it must be re-decoded as such.
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

document.addEventListener('click', async event => {
  const target = event.target as HTMLElement | null;
  const button = target?.closest<HTMLButtonElement>('[data-copy-code]');

  if (!button) {
    return;
  }

  const payload = button.dataset.copyCode;

  if (!payload) {
    return;
  }

  const { copy, copied } = labels();

  try {
    await navigator.clipboard.writeText(decodeBase64(payload));
    button.setAttribute('aria-label', copied);
    button.dataset.copied = 'true';

    setTimeout(() => {
      button.setAttribute('aria-label', copy);
      delete button.dataset.copied;
    }, 2000);
  } catch {
    // Clipboard access can be denied (insecure context, permissions). Leaving the
    // label unchanged is the same behavior as the ubean button.
  }
});
