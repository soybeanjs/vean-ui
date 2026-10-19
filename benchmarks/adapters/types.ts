/**
 * The contract every adapter honours.
 *
 * Four libraries, three frameworks, one shape. The bench files never import a
 * library: they import an adapter and talk to these four functions, so the
 * measuring code cannot accidentally favour one implementation.
 *
 * The gesture helpers are separate from the mount helpers because they measure
 * different things. `mountAccordion` is "what the page pays before it is
 * usable"; `toggleAccordion` is "what the user pays on every click". A library
 * can be cheap at one and expensive at the other.
 */
export interface AccordionProps {
  readonly items: number;
}

export interface SelectProps {
  readonly options: number;
  /** Mount with the listbox open, so the N options are actually rendered. */
  readonly open?: boolean;
}

export interface Mounted {
  /**
   * The element the library mounted into.
   *
   * Adapters also report their own trigger elements rather than letting the
   * benchmark query for them: `[role="button"]` does not match a plain
   * `<button>`, and `aria-label` placement differs per library, so a shared
   * selector silently finds nothing and measures an empty click.
   */
  readonly root: HTMLElement;
  /** The first accordion trigger, or null if the shape has none. */
  readonly accordionTrigger: () => Element | null;
  /** The select trigger, or null if the shape has none. */
  readonly selectTrigger: () => Element | null;
  /**
   * Flip the first accordion item, using the event that library listens for.
   *
   * Not a shared helper, because the libraries do not agree: a plain `<button>`
   * with a click listener and a trigger that opens on `pointerdown` are both
   * normal. Discovering that difference is not the benchmark's job — it is a
   * correctness detail that belongs in the adapter where it can be read.
   */
  readonly toggleAccordion: () => void;
  /** Open the select, using the event that library listens for. */
  readonly openSelect: () => void;
  /** Dismiss whatever is open, the way a user does: `Escape` on the document. */
  readonly dismiss: () => void;
  /**
   * Resolve once the framework has committed the pending update.
   *
   * Without this the clock stops before the DOM reflects the gesture, and every
   * library looks equally fast. Each adapter resolves at its own framework's
   * settle point: a Vue `nextTick`, a React `flushSync`, a Svelte `flushSync`.
   */
  readonly flush: () => Promise<void>;
  readonly unmount: () => Promise<void>;
}

export interface Adapter {
  readonly name: string;
  readonly mountAccordion: (props: AccordionProps) => Promise<Mounted>;
  readonly mountSelect: (props: SelectProps) => Promise<Mounted>;
}
