import { computed, nextTick, onScopeDispose, shallowRef, toValue } from 'vue';
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue';
import { COLLAPSE_MOTION_DEFAULTS, prefersReducedMotion } from '../shared';
import type { DataOrientation, VNodeRef } from '../types';
import { useContext } from './use-context';
import { useForwardElement } from './use-forward-element';

/* -------------------------------------------------------------------------- */
/* Public types                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Payload of every drag lifecycle hook.
 */
export interface SortableListDragEvent {
  /**
   * Id of the dragged item.
   */
  id: string;
  /**
   * Index the drag started from.
   */
  fromIndex: number;
  /**
   * Index the dragged item currently projects onto.
   */
  index: number;
}

/**
 * Options for the sortable list container.
 */
export interface SortableListOptions {
  /**
   * Main axis the items are laid out on. Decides which pointer/keyboard axis
   * drives the reorder.
   *
   * @defaultValue 'horizontal'
   */
  orientation?: MaybeRefOrGetter<DataOrientation>;
  /**
   * Pointer travel in pixels required before a drag begins, so a plain click on
   * an item is never swallowed.
   *
   * @defaultValue 4
   */
  activationDistance?: MaybeRefOrGetter<number>;
  /**
   * Duration of the FLIP slide that moves the surrounding items into place.
   *
   * @defaultValue '200ms'
   */
  duration?: MaybeRefOrGetter<string>;
  /**
   * Timing function of the FLIP slide.
   *
   * @defaultValue 'cubic-bezier(0.4, 0, 0.2, 1)'
   */
  easing?: MaybeRefOrGetter<string>;
  /**
   * Called whenever the projected position changes. Reorder your own data here
   * — the composable never writes to the item list itself, so the rendered
   * order stays owned by the consumer.
   */
  onReorder?: (fromIndex: number, toIndex: number) => void;
  /**
   * Called once the pointer passes the activation distance, or the item is
   * lifted by keyboard.
   */
  onDragStart?: (event: SortableListDragEvent) => void;
  /**
   * Called on every pointer move while dragging, with the projected index.
   */
  onDragMove?: (event: SortableListDragEvent) => void;
  /**
   * Called when the drag is committed.
   */
  onDragEnd?: (event: SortableListDragEvent) => void;
}

/**
 * Options for a single sortable item.
 */
export interface SortableListItemOptions {
  /**
   * Stable id, matched against the indices reported by the list hooks.
   */
  id: MaybeRefOrGetter<string>;
  /**
   * Position of the item inside the rendered list. Establishes the reorder
   * order — the list sorts its registry by this value.
   */
  index?: MaybeRefOrGetter<number>;
  /**
   * Reorder zone. An item only swaps with neighbours sharing the same group, so
   * groups stay aggregated (e.g. pinned items always in front of unpinned
   * ones) without the consumer policing boundaries after the fact.
   *
   * @defaultValue null
   */
  group?: MaybeRefOrGetter<string | number | null | undefined>;
  /**
   * Locks the item in place: it cannot be dragged and it acts as a barrier, so
   * no other item can be inserted before, onto, or after it beyond its own
   * zone window.
   *
   * @defaultValue false
   */
  disabled?: MaybeRefOrGetter<boolean>;
}

/* -------------------------------------------------------------------------- */
/* Internal types                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Snapshot of one registered item: the plain values the reorder helpers work
 * on. Items are always ordered by `order` (their rendered index).
 */
export interface SortableView {
  id: string;
  order: number;
  group: string | number | null;
  disabled: boolean;
  element: HTMLElement | undefined;
}

interface RenderableSortableView extends SortableView {
  element: HTMLElement;
}

/**
 * Registration handle owned by one sortable item.
 */
interface SortableListEntry {
  id: ComputedRef<string>;
  order: ComputedRef<number>;
  group: ComputedRef<string | number | null>;
  disabled: ComputedRef<boolean>;
  element: ShallowRef<HTMLElement | undefined>;
}

/**
 * State of one reorder session. A plain mutable object: it only ever lives
 * inside the pointer/keyboard handlers and is never rendered.
 */
interface SortableListSession {
  id: string;
  /** Projected index the dragged item currently occupies. */
  index: number;
  /** Index the drag started from. */
  initialIndex: number;
  keyboard: boolean;
  element: HTMLElement;
  pointerId: number;
  startX: number;
  startY: number;
  pointerX: number;
  pointerY: number;
  /** Pointer offset inside the element box at drag start. */
  grabX: number;
  grabY: number;
  /** Layout (untransformed) top-left of the dragged element. */
  baseLeft: number;
  baseTop: number;
  /** Axis centre of every other item, in current order. */
  centers: number[];
  /** Whether the pointer already passed the activation distance. */
  started: boolean;
  /** Set while a FLIP pass is in flight, so moves never interleave. */
  swapping: boolean;
}

interface SortableListEngine {
  activeId: ShallowRef<string | null>;
  views: ComputedRef<SortableView[]>;
  registerEntry: (entry: SortableListEntry) => void;
  unregisterEntry: (entry: SortableListEntry) => void;
  pointerDown: (entry: SortableListEntry, event: PointerEvent) => void;
  consumeDragClick: (id: string) => boolean;
  listProps: ComputedRef<Record<string, unknown>>;
}

/* -------------------------------------------------------------------------- */
/* Pure helpers (exported for unit tests)                                     */
/* -------------------------------------------------------------------------- */

/**
 * Insertion window of the dragged item: the contiguous run of neighbours it may
 * swap with. Bounded by a group change or a locked item on either side, which
 * is what keeps pinned groups aggregated in front and locked items immovable.
 */
export function getSortableInsertionRange(
  views: readonly SortableView[],
  activeIndex: number
): { min: number; max: number } {
  const active = views[activeIndex];

  if (!active) return { min: activeIndex, max: activeIndex };

  const swapsWithActive = (view: SortableView) => !view.disabled && view.group === active.group;

  let min = activeIndex;

  while (min > 0 && swapsWithActive(views[min - 1]!)) {
    min -= 1;
  }

  let max = activeIndex;

  while (max < views.length - 1 && swapsWithActive(views[max + 1]!)) {
    max += 1;
  }

  return { min, max };
}

/**
 * Index the dragged item projects onto: how many other items sit before the
 * pointer, clamped into the insertion window.
 */
export function getSortableProjectedIndex(
  centers: readonly number[],
  pointerAxis: number,
  range: { min: number; max: number }
): number {
  const before = centers.filter(center => pointerAxis > center).length;

  return Math.min(Math.max(before, range.min), range.max);
}

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                           */
/* -------------------------------------------------------------------------- */

function isRenderable(view: SortableView): view is RenderableSortableView {
  return Boolean(view.element);
}

function getAxisCenter(rect: DOMRect, orientation: DataOrientation): number {
  return orientation === 'horizontal' ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
}

function getPointerAxis(x: number, y: number, orientation: DataOrientation): number {
  return orientation === 'horizontal' ? x : y;
}

function parseDurationMs(duration: string): number {
  const amount = Number.parseFloat(duration);

  if (Number.isNaN(amount)) return 0;

  return duration.trim().endsWith('ms') ? amount : amount * 1000;
}

/** Drops the inline motion styles this composable owns. */
function clearMotion(element: HTMLElement | undefined): void {
  if (!element) return;

  element.style.transition = '';
  element.style.transform = '';
}

/**
 * FLIP "invert": pin the element back onto its pre-reorder box with a
 * transform, so the next frame can "play" it into the new box. Returns whether
 * the element actually moved.
 */
function invertMotion(
  element: HTMLElement | undefined,
  previous: DOMRect | undefined,
  next: DOMRect | undefined
): boolean {
  if (!element || !previous || !next) return false;

  const dx = previous.left - next.left;
  const dy = previous.top - next.top;

  if (!dx && !dy) return false;

  element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

  return true;
}

/* -------------------------------------------------------------------------- */
/* Engine                                                                     */
/* -------------------------------------------------------------------------- */

function createSortableListEngine(options: SortableListOptions): SortableListEngine {
  const orientation = computed<DataOrientation>(() => toValue(options.orientation) ?? 'horizontal');
  const activationDistance = computed(() => toValue(options.activationDistance) ?? 4);
  const duration = computed(() => toValue(options.duration) ?? COLLAPSE_MOTION_DEFAULTS.duration);
  const easing = computed(() => toValue(options.easing) ?? COLLAPSE_MOTION_DEFAULTS.easing);

  const registered = shallowRef<SortableListEntry[]>([]);
  const activeId = shallowRef<string | null>(null);

  // Flatten the entry refs into plain values so every helper below works on
  // data instead of unwrapping `.value` at each call site.
  const views = computed<SortableView[]>(() =>
    registered.value
      .map(entry => ({
        id: entry.id.value,
        order: entry.order.value,
        group: entry.group.value,
        disabled: entry.disabled.value,
        element: entry.element.value
      }))
      .sort((a, b) => a.order - b.order)
  );

  let session: SortableListSession | null = null;

  /** Id whose click must be swallowed because it concluded a real drag. */
  let clickedAfterDrag: string | null = null;

  const isInstant = () => import.meta.env.MODE === 'test' || prefersReducedMotion();

  /** Measures the true layout box of every rendered item (transforms ignored via clear-first). */
  const measure = (list: readonly SortableView[]): Map<string, DOMRect> =>
    new Map(list.filter(isRenderable).map(view => [view.id, view.element.getBoundingClientRect()]));

  const collectCenters = (list: readonly SortableView[], boxes: Map<string, DOMRect>, skipId: string): number[] =>
    list
      .filter(isRenderable)
      .filter(view => view.id !== skipId)
      .flatMap(view => {
        const box = boxes.get(view.id);

        return box ? [getAxisCenter(box, orientation.value)] : [];
      });

  const indexOf = (id: string) => views.value.findIndex(view => view.id === id);

  /** Index the session's item currently sits at, re-resolved so removals mid-drag stay safe. */
  function resolveActiveIndex(current: SortableListSession): number {
    const found = indexOf(current.id);

    return found < 0 ? current.index : found;
  }

  function reportDragMove(current: SortableListSession): void {
    options.onDragMove?.({ id: current.id, fromIndex: current.initialIndex, index: current.index });
  }

  /**
   * The dragged item stays in flow — its own box is the placeholder, so the
   * surrounding items keep their size and never jump — and is translated to
   * follow the pointer. Only `transform` is written, so the browser composites
   * instead of re-laying out.
   */
  function applyFloatingTransform(current: SortableListSession): void {
    const x = current.pointerX - current.grabX - current.baseLeft;
    const y = current.pointerY - current.grabY - current.baseTop;

    current.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function scheduleCleanup(elements: HTMLElement[], ms: number): void {
    setTimeout(() => elements.forEach(element => clearMotion(element)), ms);
  }

  /** Settles the dragged item into its final slot with a short slide. */
  function settleElement(current: SortableListSession): void {
    if (isInstant()) {
      clearMotion(current.element);

      return;
    }

    current.element.style.transition = `transform ${duration.value} ${easing.value}`;
    current.element.style.transform = '';
    scheduleCleanup([current.element], parseDurationMs(duration.value));
  }

  /**
   * Reorder to `nextIndex`: snapshot the current boxes, let the consumer move
   * its data, then FLIP the surrounding items into their new boxes.
   */
  async function commitIndex(nextIndex: number): Promise<void> {
    const current = session;

    if (!current || current.swapping || nextIndex === current.index) return;

    const fromIndex = resolveActiveIndex(current);

    if (nextIndex === fromIndex) {
      current.index = nextIndex;

      return;
    }

    current.swapping = true;

    const before = measure(views.value);

    current.index = nextIndex;
    options.onReorder?.(fromIndex, nextIndex);

    await nextTick();

    // The session may have ended inside the tick (a pointerup in the same
    // frame). The data already moved, so the FLIP pass still has to run — only
    // the floating transform stops being re-applied.
    const floating = session === current;

    // Clear first so the read below returns true layout boxes, then pin the
    // moved items back onto their previous boxes before playing them forward.
    views.value.filter(isRenderable).forEach(view => clearMotion(view.element));

    const after = measure(views.value);
    const moved: HTMLElement[] = [];
    const instant = isInstant();

    for (const view of views.value.filter(isRenderable)) {
      const isFloating = floating && view.id === current.id && !current.keyboard;

      if (isFloating) {
        current.baseLeft = after.get(view.id)?.left ?? current.baseLeft;
        current.baseTop = after.get(view.id)?.top ?? current.baseTop;
        applyFloatingTransform(current);

        continue;
      }

      if (instant) {
        clearMotion(view.element);

        continue;
      }

      if (invertMotion(view.element, before.get(view.id), after.get(view.id))) {
        moved.push(view.element);
      }
    }

    current.centers = collectCenters(views.value, after, current.id);
    current.swapping = false;

    if (!moved.length) return;

    requestAnimationFrame(() => {
      const slide = `transform ${duration.value} ${easing.value}`;

      moved.forEach(element => {
        element.style.transition = slide;
        element.style.transform = '';
      });

      scheduleCleanup(moved, parseDurationMs(duration.value));
    });
  }

  function detachPointerListeners(): void {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerCancel);
    window.removeEventListener('keydown', handleSessionKeydown);
  }

  function attachPointerListeners(): void {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    window.addEventListener('keydown', handleSessionKeydown);
  }

  function releaseSession(current: SortableListSession, committed: boolean): void {
    if (session === current) session = null;

    activeId.value = null;
    detachPointerListeners();
    settleElement(current);

    if (!committed) {
      clickedAfterDrag = null;

      return;
    }

    clickedAfterDrag = current.id;

    options.onDragEnd?.({
      id: current.id,
      fromIndex: current.initialIndex,
      index: current.index
    });
  }

  /** Pointer-cancel (e.g. the browser claiming a touch gesture) rolls the order back. */
  function rollback(current: SortableListSession): void {
    const target = resolveActiveIndex(current);

    if (target !== current.initialIndex) {
      current.index = current.initialIndex;
      options.onReorder?.(target, current.initialIndex);
    }
  }

  function startPointerDrag(current: SortableListSession): void {
    current.started = true;
    activeId.value = current.id;

    const boxes = measure(views.value);
    const box = boxes.get(current.id);

    if (box) {
      current.baseLeft = box.left;
      current.baseTop = box.top;
    }

    current.centers = collectCenters(views.value, boxes, current.id);

    current.element.style.transition = 'none';
    applyFloatingTransform(current);

    try {
      current.element.setPointerCapture(current.pointerId);
    } catch {
      // The pointer may already be gone (e.g. a cancelled touch). Window-level
      // listeners keep the session working, so capture is best-effort only.
    }

    options.onDragStart?.({
      id: current.id,
      fromIndex: current.initialIndex,
      index: current.index
    });
  }

  function handlePointerMove(event: PointerEvent): void {
    const current = session;

    if (!current || current.keyboard || event.pointerId !== current.pointerId) return;

    current.pointerX = event.clientX;
    current.pointerY = event.clientY;

    if (!current.started) {
      const travelled = Math.hypot(event.clientX - current.startX, event.clientY - current.startY);

      if (travelled < activationDistance.value) return;

      startPointerDrag(current);
    }

    if (current.swapping) return;

    applyFloatingTransform(current);

    const axis = getPointerAxis(event.clientX, event.clientY, orientation.value);
    const range = getSortableInsertionRange(views.value, resolveActiveIndex(current));

    void commitIndex(getSortableProjectedIndex(current.centers, axis, range));

    reportDragMove(current);
  }

  function handlePointerUp(event: PointerEvent): void {
    const current = session;

    if (!current || current.keyboard || event.pointerId !== current.pointerId) return;

    current.swapping = false;
    releaseSession(current, current.started);
  }

  function handlePointerCancel(event: PointerEvent): void {
    const current = session;

    if (!current || current.keyboard || event.pointerId !== current.pointerId) return;

    rollback(current);
    releaseSession(current, false);
  }

  /** Escape aborts an in-flight drag without committing the projected order. */
  function handleSessionKeydown(event: KeyboardEvent): void {
    const current = session;

    if (!current || event.key !== 'Escape') return;

    event.preventDefault();

    if (!current.keyboard) rollback(current);

    releaseSession(current, false);
  }

  function startKeyboardDrag(entry: SortableListEntry, index: number): void {
    const element = entry.element.value;

    if (!element) return;

    session = {
      id: entry.id.value,
      index,
      initialIndex: index,
      keyboard: true,
      element,
      pointerId: -1,
      startX: 0,
      startY: 0,
      pointerX: 0,
      pointerY: 0,
      grabX: 0,
      grabY: 0,
      baseLeft: 0,
      baseTop: 0,
      centers: collectCenters(views.value, measure(views.value), entry.id.value),
      started: true,
      swapping: false
    };

    activeId.value = session.id;

    options.onDragStart?.({ id: session.id, fromIndex: index, index });
  }

  /**
   * Keyboard reorder: Space lifts the focused item, the main-axis arrows slide
   * it, Home/End jump to the window bounds, Space or Enter drops, Escape aborts.
   * Runs in the capture phase on the container so the lifted item keeps the
   * arrow keys instead of the roving focus group.
   */
  function handleListKeydown(event: KeyboardEvent): void {
    const current = session;

    if (!current) {
      if (event.key !== ' ' || event.target === null) return;

      const entry = registered.value.find(item => item.element.value === event.target);

      if (!entry || entry.disabled.value) return;

      const index = indexOf(entry.id.value);

      if (index < 0) return;

      event.preventDefault();
      event.stopPropagation();

      attachPointerListeners();
      startKeyboardDrag(entry, index);

      return;
    }

    if (!current.keyboard) return;

    const forward = orientation.value === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const backward = orientation.value === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const range = getSortableInsertionRange(views.value, resolveActiveIndex(current));

    const accept = () => {
      event.preventDefault();
      event.stopPropagation();
    };

    if (event.key === forward || event.key === backward) {
      accept();

      const step = event.key === forward ? 1 : -1;
      const next = Math.min(Math.max(current.index + step, range.min), range.max);

      void commitIndex(next).then(() => reportDragMove(current));

      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      accept();

      void commitIndex(event.key === 'Home' ? range.min : range.max).then(() => reportDragMove(current));

      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      accept();
      releaseSession(current, true);

      return;
    }

    if (event.key === 'Escape') {
      accept();
      releaseSession(current, false);
    }
  }

  const listProps = computed<Record<string, unknown>>(() => {
    const reorderable = views.value.filter(view => !view.disabled).length;

    return {
      'aria-dropeffect': reorderable > 1 ? 'move' : undefined,
      onKeydownCapture: handleListKeydown
    };
  });

  onScopeDispose(() => {
    if (session) releaseSession(session, false);
  });

  return {
    activeId,
    views,
    listProps,
    registerEntry: entry => {
      registered.value = [...registered.value, entry];
    },
    unregisterEntry: entry => {
      registered.value = registered.value.filter(item => item !== entry);
    },
    pointerDown: (entry, event) => {
      if (session || event.button !== 0 || entry.disabled.value) return;

      const element = entry.element.value;
      const index = indexOf(entry.id.value);

      if (!element || index < 0) return;

      const box = element.getBoundingClientRect();

      clickedAfterDrag = null;
      session = {
        id: entry.id.value,
        index,
        initialIndex: index,
        keyboard: false,
        element,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        pointerX: event.clientX,
        pointerY: event.clientY,
        grabX: event.clientX - box.left,
        grabY: event.clientY - box.top,
        baseLeft: box.left,
        baseTop: box.top,
        centers: [],
        started: false,
        swapping: false
      };

      attachPointerListeners();
    },
    consumeDragClick: id => {
      if (clickedAfterDrag !== id) return false;

      clickedAfterDrag = null;

      return true;
    }
  };
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const [provideSortableListContext, useSortableListContext] = useContext(
  'SortableList',
  (options: SortableListOptions) => createSortableListEngine(options)
);

/* -------------------------------------------------------------------------- */
/* Public hooks                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Sortable list container as a pure hook: no render shell. Spread the returned
 * `listProps` onto the element that wraps the items — it carries the
 * `aria-dropeffect` announcement and the capture-phase keyboard reorder.
 *
 * The composable owns no item data: it reports the projected indices through
 * `onReorder`, and the consumer moves its own list, so the rendered order stays
 * a single source of truth. Reordering slides use FLIP (`transform` only), so
 * the layout is never recalculated mid-drag.
 *
 * @param options - Reorder callbacks, axis, activation distance and motion timing.
 * @returns Props for the list element, plus the reactive id of the dragged item.
 */
export function useSortableList(options: SortableListOptions = {}) {
  const { listProps, activeId, views } = provideSortableListContext(options);

  return { listProps, activeId, views };
}

/**
 * Sortable item as a pure hook: registers the item with the nearest sortable
 * list and returns the pointer binding plus its drag state.
 *
 * @param options - Item id, rendered index, reorder group and locked state.
 * @returns An element ref binder, the pointer props, the drag state, and the
 * click guard that swallows the click concluding a drag.
 */
export function useSortableListItem(options: SortableListItemOptions) {
  const { registerEntry, unregisterEntry, pointerDown, consumeDragClick, activeId } =
    useSortableListContext('SortableListItem');

  const id = computed(() => String(toValue(options.id)));

  const [elementRef, setItemElement] = useForwardElement<HTMLElement>();

  const entry: SortableListEntry = {
    id,
    order: computed(() => toValue(options.index) ?? 0),
    group: computed(() => toValue(options.group) ?? null),
    disabled: computed(() => Boolean(toValue(options.disabled))),
    element: elementRef
  };

  registerEntry(entry);

  onScopeDispose(() => unregisterEntry(entry));

  const dragging = computed(() => activeId.value === id.value);

  const itemProps = computed<Record<string, unknown>>(() => ({
    onPointerdown: (event: PointerEvent) => pointerDown(entry, event)
  }));

  return {
    setItemElement,
    itemProps,
    dragging,
    consumeDragClick: () => consumeDragClick(id.value)
  } as {
    setItemElement: (nodeRef: VNodeRef) => void;
    itemProps: ComputedRef<Record<string, unknown>>;
    dragging: ComputedRef<boolean>;
    consumeDragClick: () => boolean;
  };
}
