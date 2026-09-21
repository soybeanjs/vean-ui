// @unocss-include
import { scv } from '@soybeanjs/cva';
import { dialogVariants } from './dialog';

/**
 * The popup position is fully CSS-variable driven: the Aria gesture layer
 * writes `--vean-drawer-snap-point-offset` (resting snap position) and
 * `--vean-drawer-swipe-movement-x/y` (live drag), and this transform plus a
 * transform transition turns every snap change or release into a CSS animation.
 * The `animate-in`/`animate-out` keyframes only define `from`/`to`, so open and
 * close slide to and from the variable-driven resting position seamlessly.
 *
 * Vertical panels clamp the translate at the viewport edge: a drag that pushes
 * the popup past its resting edge (e.g. upwards on a bottom sheet) would lift
 * the anchored edge and expose the overlay through a gap, so the overflow is
 * applied to `height` instead — the popup grows past its resting size with the
 * same square-root damping and springs back through the height transition.
 *
 * The class strings below are written out in full on purpose: UnoCSS extracts
 * tokens from raw source text, so interpolated template literals are never
 * picked up and their rules would silently vanish from the stylesheet.
 */
const POPUP_TRANSFORM_VERTICAL_BOTTOM =
  '[transform:translateY(max(0px,calc(var(--vean-drawer-snap-point-offset,0px)_+_var(--vean-drawer-swipe-movement-y,0px))))_scale(var(--vean-drawer-nested-scale,1))]';
const POPUP_TRANSFORM_VERTICAL_TOP =
  '[transform:translateY(min(0px,calc(var(--vean-drawer-snap-point-offset,0px)_+_var(--vean-drawer-swipe-movement-y,0px))))_scale(var(--vean-drawer-nested-scale,1))]';
const POPUP_HEIGHT_GROWTH_BOTTOM =
  '[height:calc(var(--vean-drawer-height,auto)_+_max(0px,calc(-1_*_var(--vean-drawer-snap-point-offset,0px)_-_var(--vean-drawer-swipe-movement-y,0px))))]';
const POPUP_HEIGHT_GROWTH_TOP =
  '[height:calc(var(--vean-drawer-height,auto)_+_max(0px,calc(var(--vean-drawer-snap-point-offset,0px)_+_var(--vean-drawer-swipe-movement-y,0px))))]';
const POPUP_TRANSFORM_HORIZONTAL =
  '[transform:translateX(calc(var(--vean-drawer-snap-point-offset,0px)_+_var(--vean-drawer-swipe-movement-x,0px)))_scale(var(--vean-drawer-nested-scale,1))]';
const POPUP_TRANSITION =
  '[transition:transform_0.5s_cubic-bezier(0.32,0.72,0,1),height_0.5s_cubic-bezier(0.32,0.72,0,1),opacity_0.5s_cubic-bezier(0.32,0.72,0,1)]';
/**
 * `dvh` follows the mobile browser chrome as it hides and shows, so it keeps a
 * bottom sheet's top edge on screen while the address bar animates. Browsers
 * without it (Chrome < 108, older WebViews) drop the whole declaration instead
 * of falling back on their own, which leaves the panel uncapped and taller than
 * the screen. The `@supports not` guard makes exactly one of the two win, so
 * newer browsers keep the `dvh` behaviour.
 *
 * A snap-point drawer replaces the viewport cap with its largest snap point: a
 * resting position is reached by translating the box down, so a box taller than
 * the largest snap leaves its far edge below the viewport, hiding the end of the
 * scrolling content from every snap level. Both declarations therefore read the
 * same variable, which equals when it is set — the `@supports` guard only has to
 * disambiguate the fallback.
 */
const POPUP_VIEWPORT_MAX_HEIGHT =
  'max-h-[var(--vean-drawer-max-height,calc(100dvh-2rem))] [@supports(not_(height:100dvh))]:max-h-[var(--vean-drawer-max-height,calc(100vh-2rem))]';
/** The horizontal counterpart, used by the `start`/`end` sides. */
const POPUP_VIEWPORT_MAX_WIDTH = 'max-w-[var(--vean-drawer-max-width,100%)]';
/**
 * Fullscreen, driven by the Aria `data-fullscreen` attribute, has to be
 * re-declared here: this recipe drops the inherited dialog `popup` slot
 * (`extendIgnore`), so the dialog's `data-[fullscreen]:*` rules never reach the
 * panel. Every per-side dimension needs an override, because each side sizes the
 * panel from its own edge:
 *
 * - vertical panels (`top`/`bottom`) are capped by `POPUP_VIEWPORT_MAX_HEIGHT`
 *   and sized by the gesture height growth, so here `height` is pinned and
 *   `max-height` released. `100dvh` follows the mobile browser chrome exactly
 *   like the resting cap does, with the same `@supports` fallback for engines
 *   that cannot parse it.
 * - horizontal panels (`start`/`end`) are already full height, but `w-3/4` plus
 *   `sm:max-w-sm` and `POPUP_VIEWPORT_MAX_WIDTH` keep them narrow.
 * - the anchored corner radius would leave two rounded corners floating inside
 *   the viewport, so it is reset as well.
 *
 * `data-[fullscreen]:*` compiles to a `[data-fullscreen]`-qualified selector, so
 * it outranks the side, `sm:` and arbitrary-property utilities by specificity —
 * the overrides win wherever UnoCSS happens to order them.
 */
const POPUP_FULLSCREEN = [
  `data-[fullscreen]:w-full data-[fullscreen]:max-w-none`,
  `data-[fullscreen]:h-[100dvh] data-[fullscreen]:max-h-none`,
  `[@supports(not_(height:100dvh))]:data-[fullscreen]:h-[100vh]`,
  `data-[fullscreen]:rounded-none`
];

export const sheetVariants = scv({
  extend: [dialogVariants],
  // The drawer redefines both slots: the popup drives its position from the
  // gesture CSS vars, and the overlay tracks the swipe progress with a
  extendIgnore: ['popup'],
  slots: {
    popup: [
      `fixed z-base flex flex-col justify-between items-stretch border bg-popover outline-none`,
      POPUP_TRANSITION,
      ...POPUP_FULLSCREEN,
      `data-[state=open]:animate-in data-[state=open]:duration-500`,
      `data-[state=closed]:animate-out data-[state=closed]:duration-300`
    ]
  },
  variants: {
    size: {
      xs: {
        popup: `gap-y-1.5 px-2 py-1.5 text-2xs`
      },
      sm: {
        popup: `gap-y-2 px-3 py-2 text-xs`
      },
      md: {
        popup: `gap-y-3 px-4 py-3 text-sm`
      },
      lg: {
        popup: `gap-y-4 px-5 py-4 text-base`
      },
      xl: {
        popup: `gap-y-5 px-6 py-5 text-lg`
      },
      '2xl': {
        popup: `gap-y-6 px-7 py-6 text-xl`
      }
    },
    side: {
      top: {
        // Vertical panels are anchored to one edge, so their height must be capped:
        // without a cap a long body grows past the viewport and the `overflow-auto`
        // content slot never scrolls.
        popup: [
          `inset-x-0 top-0 ${POPUP_VIEWPORT_MAX_HEIGHT} origin-top border-b rounded-b-md`,
          POPUP_TRANSFORM_VERTICAL_TOP,
          POPUP_HEIGHT_GROWTH_TOP,
          `data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top`
        ]
      },
      bottom: {
        popup: [
          `inset-x-0 bottom-0 ${POPUP_VIEWPORT_MAX_HEIGHT} origin-bottom border-t rounded-t-md`,
          POPUP_TRANSFORM_VERTICAL_BOTTOM,
          POPUP_HEIGHT_GROWTH_BOTTOM,
          `data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom`
        ]
      },
      left: {
        popup: [
          `inset-y-0 start-0 h-full origin-left sm:max-w-sm w-3/4 border-e rounded-e-md ${POPUP_VIEWPORT_MAX_WIDTH}`,
          POPUP_TRANSFORM_HORIZONTAL,
          `data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left`,
          `[&[dir=rtl]]:data-[state=open]:slide-in-from-right [&[dir=rtl]]:data-[state=closed]:slide-out-to-right`
        ]
      },
      right: {
        popup: [
          `inset-y-0 end-0 h-full origin-right sm:max-w-sm w-3/4 border-s rounded-s-md ${POPUP_VIEWPORT_MAX_WIDTH}`,
          POPUP_TRANSFORM_HORIZONTAL,
          `data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right`,
          `[&[dir=rtl]]:data-[state=open]:slide-in-from-left [&[dir=rtl]]:data-[state=closed]:slide-out-to-left`
        ]
      }
    }
  },
  defaultVariants: {
    size: 'md',
    side: 'right'
  }
});
