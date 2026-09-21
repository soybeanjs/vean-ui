export const COLLECTION_ITEM_ATTRIBUTE = 'data-vean-collection-item';

export const GRACE_AREA_TRIGGER_ATTR = 'data-grace-area-trigger';

/**
 * Marks elements outside an open floating layer (the `mark` channel of
 * `markOthers`), for CSS hooks such as dimmed backgrounds and outside-press
 * detection. Independent of the `inert` / `aria-hidden` control attributes.
 */
export const INERT_MARKER_ATTR = 'data-vean-inert';

/** Shared inject key so ConfigProvider and raw consumers resolve the same context. */
export const CONFIG_PROVIDER_CONTEXT_KEY = Symbol.for('ConfigProvider');
