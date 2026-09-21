import type {
  AutocompleteGroupOptionData,
  AutocompleteOptionData,
  AutocompleteSearchOptionData,
  AutocompleteSingleOptionData
} from './types';

export function isGroupOption<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData>(
  item: AutocompleteOptionData<T>
): item is AutocompleteGroupOptionData<T> {
  return 'items' in item;
}

export function getAutocompleteSearchOptions<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData>(
  items: AutocompleteOptionData<T>[]
) {
  return items.flatMap(item => {
    if (!isGroupOption(item)) {
      return [item as AutocompleteSearchOptionData];
    }

    return item.items.map(child => ({
      ...child,
      groupLabel: item.label,
      groupSeparator: item.separator,
      groupValue: item.label
    }));
  });
}

export function getAutocompleteItemOptions<T extends AutocompleteSingleOptionData = AutocompleteSingleOptionData>(
  options: AutocompleteSearchOptionData[]
) {
  const itemsByGroup = options.reduce(
    (acc, item) => {
      const { groupLabel, groupSeparator, groupValue, ...rest } = item;

      if (groupValue) {
        if (!acc[groupValue]) {
          acc[groupValue] = {
            label: groupLabel ?? groupValue,
            separator: groupSeparator,
            items: []
          } satisfies AutocompleteGroupOptionData<T>;
        }

        const group = acc[groupValue] as AutocompleteGroupOptionData<T>;
        group.items.push(rest as T);
      } else {
        acc[item.value] = rest as T;
      }

      return acc;
    },
    {} as Record<string, AutocompleteOptionData<T>>
  );

  return Object.values(itemsByGroup);
}
