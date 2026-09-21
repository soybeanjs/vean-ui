import type { BreadcrumbCompactProps, BreadcrumbOptionData } from './types';

export function getEllipsisRange<T extends BreadcrumbOptionData>(
  items: T[],
  ellipsis?: BreadcrumbCompactProps<T>['ellipsis']
) {
  const MIN_ITEM_COUNT_WITH_ELLIPSIS = 5;

  if (!ellipsis || items.length < MIN_ITEM_COUNT_WITH_ELLIPSIS) {
    return null;
  }

  if (ellipsis === true) {
    return [1, items.length - 2] as const;
  }

  let [start, end] = ellipsis;

  if (start === 0) {
    start = 1;
  }

  if (end === items.length) {
    end = items.length - 1;
  }

  return [start, end] as const;
}
