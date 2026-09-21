import { nextTick } from 'vue';
import type { TransitionProps } from 'vue';
import { prefersReducedMotion } from './dom';

/**
 * Options for the collapse motion transition.
 */
export interface CollapseMotionOptions {
  /**
   * Transition name forwarded to the rendered element, so consumers can hook
   * additional CSS onto the enter/leave phases.
   *
   * @defaultValue 'vean-motion-collapse'
   */
  name?: string;
  /**
   * Duration of the height/opacity transition.
   *
   * @defaultValue '200ms'
   */
  duration?: string;
  /**
   * Timing function of the height/opacity transition.
   *
   * @defaultValue 'cubic-bezier(0.4, 0, 0.2, 1)'
   */
  easing?: string;
}

/**
 * Shared defaults for every collapse-motion variant (Transition-driven and
 * content-observed), so all height animations stay visually in sync.
 */
export const COLLAPSE_MOTION_DEFAULTS = {
  duration: '200ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
} as const;

const DEFAULT_NAME = 'vean-motion-collapse';

function asHTMLElement(el: Element): HTMLElement {
  return el as HTMLElement;
}

function prepare(el: HTMLElement, transition: string) {
  el.style.overflow = 'hidden';
  el.style.transition = transition;
}

function cleanup(el: HTMLElement) {
  el.style.height = '';
  el.style.opacity = '';
  el.style.overflow = '';
  el.style.transition = '';
}

/**
 * Vue `<Transition>` props that animate an element between `height: 0` and its
 * measured content height (opacity follows). Enter measures `scrollHeight`,
 * leave pins `offsetHeight` before collapsing to `0`; inline styles are cleared
 * on finish so the element returns to natural sizing.
 *
 * The hooks drive everything through inline styles, so no companion CSS is
 * required. Disabled in test environments: happy-dom has no CSS transition
 * support, and Vue would then stall waiting for `transitionend`. Also
 * disabled when the user prefers reduced motion.
 *
 * @param options Duration/easing/name overrides.
 * @returns Props to spread onto a `<Transition>`.
 */
export function collapseMotion(options: CollapseMotionOptions = {}): TransitionProps {
  if (import.meta.env.MODE === 'test' || prefersReducedMotion()) return {};

  const {
    name = DEFAULT_NAME,
    duration = COLLAPSE_MOTION_DEFAULTS.duration,
    easing = COLLAPSE_MOTION_DEFAULTS.easing
  } = options;
  const transition = `height ${duration} ${easing}, opacity ${duration} ${easing}`;

  return {
    name,
    css: true,
    onBeforeEnter: el => {
      const node = asHTMLElement(el);

      prepare(node, transition);
      node.style.height = '0px';
      node.style.opacity = '0';
    },
    onEnter: el => {
      const node = asHTMLElement(el);

      nextTick(() => {
        node.style.height = `${node.scrollHeight}px`;
        node.style.opacity = '1';
      });
    },
    onAfterEnter: el => cleanup(asHTMLElement(el)),
    onBeforeLeave: el => {
      const node = asHTMLElement(el);

      prepare(node, transition);
      node.style.height = `${node.offsetHeight}px`;
    },
    onLeave: el => {
      const node = asHTMLElement(el);

      setTimeout(() => {
        node.style.height = '0px';
        node.style.opacity = '0';
      });
    },
    onAfterLeave: el => cleanup(asHTMLElement(el))
  };
}
