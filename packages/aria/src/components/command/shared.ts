import type {
  CommandGroupOptionData,
  CommandOptionData,
  CommandSearchOptionData,
  CommandSingleOptionData
} from './types';

export function isGroupOption<T extends CommandSingleOptionData = CommandSingleOptionData>(
  item: CommandOptionData<T>
): item is CommandGroupOptionData<T> {
  return 'items' in item;
}

export function getCommandSearchOptions<T extends CommandSingleOptionData = CommandSingleOptionData>(
  items: CommandOptionData<T>[]
) {
  return items.flatMap(item => {
    if (!isGroupOption(item)) {
      return [item as CommandSearchOptionData<T>];
    }

    return item.items.map(groupItem => ({
      groupValue: item.value,
      groupLabel: item.label,
      groupSeparator: item.separator,
      ...groupItem
    }));
  });
}

export function getCommandItemOptions<T extends CommandSingleOptionData = CommandSingleOptionData>(
  options: CommandSearchOptionData<T>[]
) {
  type SearchGroup = CommandGroupOptionData<CommandSearchOptionData<T>>;
  type SearchOption = CommandSearchOptionData<T> | SearchGroup;

  const itemsByGroup = options.reduce(
    (acc, item) => {
      const { groupValue, groupLabel, groupSeparator, ...rest } = item;

      if (groupValue) {
        if (!acc[groupValue]) {
          acc[groupValue] = {
            value: groupValue,
            label: groupLabel ?? groupValue,
            separator: groupSeparator,
            items: []
          } satisfies SearchGroup;
        }

        (acc[groupValue] as SearchGroup).items.push(rest as CommandSearchOptionData<T>);
      } else {
        acc[`item-${item.value}`] = rest as CommandSearchOptionData<T>;
      }

      return acc;
    },
    {} as Record<string, SearchOption>
  );

  return Object.values(itemsByGroup);
}
