export const EVENT_ROOT_CONTENT_DISMISS = 'navMenu.rootContentDismiss';
export const LINK_SELECT = 'navMenu.linkSelect';
/**
 * Marker set on the shared click event when a link dismisses the menu, so a sibling
 * trigger listener (as-child trigger) can skip re-opening it.
 */
export const LINK_DISMISSED = 'soybeanNavMenuLinkDismissed';

export function createTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`;
}

export function createContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`;
}
