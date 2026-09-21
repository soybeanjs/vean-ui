/**
 * Upper edge of the styled layer's `lt-md` breakpoint (UnoCSS `md` is `768px`).
 *
 * The number is the contract, not the query: a host that simulates a viewport —
 * a documentation device frame, an embedded shell — measures its own container
 * against it, so a JS decision (`isMobile`) and the CSS `lt-md` rules land on the
 * very same width instead of one pixel apart.
 */
export const mobileViewportMaxWidth = 767.9;

/**
 * Viewport query used when no host opinion is available.
 *
 * See {@link mobileViewportMaxWidth} for why it stops at `767.9px`.
 */
export const mobileViewportQuery = `(max-width: ${mobileViewportMaxWidth}px)`;
