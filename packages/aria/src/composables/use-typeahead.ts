import { refAutoReset } from '@vueuse/core';
import { getActiveElement, getNextMatch } from '../shared';
import type { CollectionItemData } from './use-collection';

export function useTypeahead(callback?: (search: string) => void) {
  // Reset `search` 1 second after it was last updated
  const search = refAutoReset('', 1000);

  const handleTypeaheadSearch = (key: string, items: CollectionItemData[]) => {
    search.value += key;

    if (callback) {
      callback(key);
      return undefined;
    }

    const currentItem = getActiveElement();
    const itemsWithTextValue = items.map(item => ({
      ...item,
      textValue: item.data?.textValue ?? item.element.textContent?.trim() ?? ''
    }));
    const currentMatch = itemsWithTextValue.find(item => item.element === currentItem);
    const values = itemsWithTextValue.map(item => item.textValue);
    const nextMatch = getNextMatch(values, search.value, currentMatch?.textValue);

    const newItem = itemsWithTextValue.find(item => item.textValue === nextMatch);

    if (newItem) {
      newItem.element.focus();
    }

    return newItem?.element;
  };

  const resetTypeahead = () => {
    search.value = '';
  };

  return {
    search,
    handleTypeaheadSearch,
    resetTypeahead
  };
}
