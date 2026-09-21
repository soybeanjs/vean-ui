import { INERT_MARKER_ATTR } from '../constants';
import { isClient } from './env';

/**
 * Hides everything outside the given elements from assistive technology while a floating
 * layer is open — the Base UI `markOthers` scheme (the core algorithm inlined and reworked
 * from the `aria-hidden` package), kept dependency-free here so overlay families never need
 * the third-party `aria-hidden` package.
 *
 * Mechanics:
 * - Walks from `body` and applies a control attribute (`inert`, else `aria-hidden="true"`)
 *   to every element outside the keep set (the avoid elements and their ancestor chain).
 * - Reference counts via WeakMaps plus a global `lockCount`, so stacked / nested layers
 *   each hold a lock and attributes are only removed when the last lock releases.
 * - Attributes that already existed before the first lock are recorded as uncontrolled and
 *   preserved on release.
 * - `aria-live` regions stay announced: they and their subtrees are excluded from hiding.
 * - Shadow hosts are corrected through their shadow root; `<script>` elements are skipped.
 * - The independent `mark` channel tags outside elements with `data-vean-inert` for CSS
 *   hooks (dimmed background, disabled text selection) without touching the control
 *   attribute semantics.
 */

type Undo = () => void;

export interface MarkOthersOptions {
  /**
   * Apply `aria-hidden="true"` to elements outside the keep set.
   *
   * @defaultValue false
   */
  ariaHidden?: boolean;
  /**
   * Apply `inert` to elements outside the keep set. Takes precedence over `ariaHidden`
   * when both are set: `inert` removes content from the accessibility tree and the tab
   * order at once, so modal layers prefer it where the runtime supports it.
   *
   * @defaultValue false
   */
  inert?: boolean;
  /**
   * Tag outside elements with `data-vean-inert` (the marker channel).
   *
   * @defaultValue true
   */
  mark?: boolean;
}

type ControlAttribute = 'inert' | 'aria-hidden';

const counters: Record<ControlAttribute, WeakMap<Element, number>> = {
  inert: new WeakMap(),
  'aria-hidden': new WeakMap()
};

const uncontrolledElementsSets: Record<ControlAttribute, WeakSet<Element>> = {
  inert: new WeakSet(),
  'aria-hidden': new WeakSet()
};

let markerCounterMap = new WeakMap<Element, number>();
let lockCount = 0;

/** Local `@floating-ui/utils/dom` equivalents kept here so the package stays on `@floating-ui/dom` alone. */
function isShadowRoot(node: Node): node is ShadowRoot {
  return typeof ShadowRoot !== 'undefined' && node instanceof ShadowRoot;
}

function getNodeName(element: Node): string {
  return (element.nodeName ?? '').toLowerCase();
}

/** Walks up out of a shadow root so keep-set containment works across shadow boundaries. */
function unwrapHost(node: Node | null): Element | null {
  if (!node) {
    return null;
  }

  return isShadowRoot(node) ? node.host : unwrapHost(node.parentNode);
}

/** Maps avoid elements to elements actually contained in `parent` (shadow-host aware). */
function correctElements(parent: HTMLElement, targets: Element[]): Element[] {
  return targets
    .map(target => {
      if (parent.contains(target)) {
        return target;
      }

      const correctedTarget = unwrapHost(target);

      if (parent.contains(correctedTarget)) {
        return correctedTarget;
      }

      return null;
    })
    .filter((element): element is Element => element !== null);
}

/** Every node on the ancestor chains of the given elements (the keep set). */
function buildKeepSet(targets: Element[]): Set<Node> {
  const keep = new Set<Node>();

  for (const target of targets) {
    let node: Node | null = target;

    while (node && !keep.has(node)) {
      keep.add(node);
      node = node.parentNode;
    }
  }

  return keep;
}

/** Collects the top-most elements outside the keep set, without descending into them. */
function collectOutsideElements(root: HTMLElement, keepElements: Set<Node>): Element[] {
  const outside: Element[] = [];

  const walk = (parent: Element | null) => {
    if (!parent) {
      return;
    }

    for (const node of Array.from(parent.children)) {
      if (getNodeName(node) === 'script') {
        continue;
      }

      if (keepElements.has(node)) {
        // A keep member's entire subtree stays interactive (e.g. the popup inside its
        // positioner, or a live region's content); descending would hide the layer's
        // own content because the keep set only holds ancestor chains.
        continue;
      }

      outside.push(node);
    }
  };

  walk(root);

  return outside;
}

function applyControlAttribute(
  body: HTMLElement,
  controlAttribute: ControlAttribute,
  avoidElements: Element[]
): { hiddenElements: Element[]; uncontrolledElementsSet: WeakSet<Element> } {
  const counterMap = counters[controlAttribute];
  const uncontrolledElementsSet = uncontrolledElementsSets[controlAttribute];
  const hiddenElements: Element[] = [];

  // Live regions stay announced while the layer is open: they join the keep set alongside
  // the avoid elements so an open popup never silences an in-flight announcement.
  const ariaLiveElements = correctElements(body, Array.from(body.querySelectorAll('[aria-live]')));
  const controlElements = [...avoidElements, ...ariaLiveElements];

  for (const node of collectOutsideElements(body, buildKeepSet(controlElements))) {
    const currentAttribute = node.getAttribute(controlAttribute);
    const alreadyHidden = currentAttribute !== null && currentAttribute !== 'false';
    const counterValue = (counterMap.get(node) ?? 0) + 1;

    counterMap.set(node, counterValue);
    hiddenElements.push(node);

    if (counterValue === 1 && alreadyHidden) {
      uncontrolledElementsSet.add(node);
    }

    if (!alreadyHidden) {
      node.setAttribute(controlAttribute, controlAttribute === 'inert' ? '' : 'true');
    }
  }

  return { hiddenElements, uncontrolledElementsSet };
}

function applyMarker(body: HTMLElement, avoidElements: Element[]): Element[] {
  const markedElements: Element[] = [];

  for (const node of collectOutsideElements(body, buildKeepSet(avoidElements))) {
    const markerValue = (markerCounterMap.get(node) ?? 0) + 1;

    markerCounterMap.set(node, markerValue);
    markedElements.push(node);

    if (markerValue === 1) {
      node.setAttribute(INERT_MARKER_ATTR, '');
    }
  }

  return markedElements;
}

function createUndo(
  controlAttribute: ControlAttribute | null,
  hiddenElements: Element[],
  uncontrolledElementsSet: WeakSet<Element> | null,
  markedElements: Element[]
): Undo {
  return () => {
    if (controlAttribute) {
      const counterMap = counters[controlAttribute];

      for (const element of hiddenElements) {
        const counterValue = (counterMap.get(element) ?? 0) - 1;

        counterMap.set(element, counterValue);

        if (counterValue === 0) {
          if (uncontrolledElementsSet && !uncontrolledElementsSet.has(element)) {
            element.removeAttribute(controlAttribute);
          }

          uncontrolledElementsSet?.delete(element);
        }
      }
    }

    for (const element of markedElements) {
      const markerValue = (markerCounterMap.get(element) ?? 0) - 1;

      markerCounterMap.set(element, markerValue);

      if (markerValue === 0) {
        element.removeAttribute(INERT_MARKER_ATTR);
      }
    }

    lockCount -= 1;

    if (lockCount === 0) {
      counters.inert = new WeakMap();
      counters['aria-hidden'] = new WeakMap();
      uncontrolledElementsSets.inert = new WeakSet();
      uncontrolledElementsSets['aria-hidden'] = new WeakSet();
      markerCounterMap = new WeakMap();
    }
  };
}

/**
 * Marks every element outside `avoidElements` per `options` and returns the undo function.
 * Call the undo exactly once per `markOthers` call (usually in a cleanup hook).
 *
 * @param avoidElements - Elements (and their ancestor chains) that stay visible and announced.
 * @param options - Which channels to apply: `inert`, `ariaHidden`, and/or the `mark` tag.
 */
export function markOthers(avoidElements: Element[], options: MarkOthersOptions = {}): Undo {
  const { ariaHidden = false, inert = false, mark = true } = options;

  if (!isClient || avoidElements.length === 0) {
    return () => {};
  }

  const body = avoidElements[0].ownerDocument.body;
  const correctedAvoidElements = correctElements(body, avoidElements);
  const controlAttribute: ControlAttribute | null = inert ? 'inert' : ariaHidden ? 'aria-hidden' : null;

  lockCount += 1;

  let hiddenElements: Element[] = [];
  let uncontrolledElementsSet: WeakSet<Element> | null = null;

  if (controlAttribute) {
    const applied = applyControlAttribute(body, controlAttribute, correctedAvoidElements);
    hiddenElements = applied.hiddenElements;
    uncontrolledElementsSet = applied.uncontrolledElementsSet;
  }

  const markedElements = mark ? applyMarker(body, correctedAvoidElements) : [];

  return createUndo(controlAttribute, hiddenElements, uncontrolledElementsSet, markedElements);
}
