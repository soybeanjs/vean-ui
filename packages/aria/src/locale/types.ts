import type { Direction } from '../types';

export interface LocaleAlertMessages {
  /** Aria-label for the alert close button. */
  close: string;
}

export interface LocaleAnchorMessages {
  /** Aria-label for the anchor `<nav>` landmark. */
  nav: string;
}

export interface LocaleBreadcrumbMessages {
  /** Aria-label for the breadcrumb `<nav>` landmark. */
  nav: string;
}

export interface LocaleAutocompleteMessages {
  /** Aria-label for the suggestions toggle trigger. */
  toggleSuggestions: string;
  /** Default aria-label for the clear button. */
  clearInput: string;
  /** Default text for the empty state. */
  noResults: string;
  /** Fallback aria-label for the options viewport. */
  options: string;
}

export interface LocaleCalendarMessages {
  /** Aria-label and default slot content for the "previous page" button. */
  prevPage: string;
  /** Aria-label and default slot content for the "next page" button. */
  nextPage: string;
  /** Aria-label for the month select trigger. */
  selectMonth: string;
  /** Aria-label for the year select trigger. */
  selectYear: string;
}

export interface LocaleCarouselMessages {
  /** Aria-label and default slot content for the "previous slide" button. */
  previous: string;
  /** Aria-label and default slot content for the "next slide" button. */
  next: string;
  /** Default aria-label for the carousel region when no `aria-label` is provided. */
  ariaLabel: string;
}

export interface LocaleCascaderMessages {
  /** Default aria-label for the clear button. */
  clear: string;
  /** Default text for the empty state. */
  noResults: string;
  /** Aria-label template for the tag remove button. Supports the `{label}` placeholder. */
  removeTag: string;
  /** Fallback aria-label for the search input. */
  search: string;
}

export interface LocaleClipboardMessages {
  /** Default text and aria-label for the copy button before copying. */
  copy: string;
  /** Default text and aria-label for the copy button after a successful copy. */
  copied: string;
}

export interface LocaleComboboxMessages {
  /** Default aria-label for the trigger clear button. */
  clear: string;
  /** Default aria-label for the popup input clear button. */
  clearInput: string;
  /** Default text for the empty state. */
  noResults: string;
  /** Fallback aria-label for the search input. */
  search: string;
  /** Fallback aria-label for the options viewport. */
  options: string;
}

export interface LocaleCommandMessages {
  /** Default text for the empty state. */
  noResults: string;
}

export interface LocaleSelectMessages {
  /** Default aria-label for the trigger clear button. */
  clear: string;
}

export interface LocaleDatePlaceholderMessages {
  /**
   * Placeholder shown in the year segment when empty.
   */
  year: string;
  /**
   * Placeholder shown in the month segment when empty.
   */
  month: string;
  /**
   * Placeholder shown in the day segment when empty.
   */
  day: string;
  /**
   * Placeholder shown in time segments (hour/minute/second) when empty.
   */
  time: string;
}

export interface LocaleDateMessages {
  /** Aria-label for the day segment. */
  daySegment: string;
  /** Aria-label for the month segment. */
  monthSegment: string;
  /** Aria-label for the year segment. */
  yearSegment: string;
  /** Aria-label for the hour segment. */
  hourSegment: string;
  /** Aria-label for the minute segment. */
  minuteSegment: string;
  /** Aria-label for the second segment. */
  secondSegment: string;
  /** Aria-label for the AM/PM (day period) segment. */
  dayPeriodSegment: string;
  /** Aria-label for the time zone segment. */
  timeZoneSegment: string;
  /** Aria-valuetext for an empty/unfilled segment. */
  empty: string;
  /**
   * Placeholders for date segments when empty. These are used by the date and time field components to populate the segment placeholders, and should be kept in sync with the `dataPlaceholders` messages.
   */
  placeholder: LocaleDatePlaceholderMessages;
}

export interface LocaleDatePickerMessages {
  /** Aria-label for the calendar toggle trigger. */
  toggle: string;
  /** Aria-label for the calendar popup dialog. */
  popupLabel: string;
}

export interface LocaleDateRangePickerMessages {
  /** Aria-label for the calendar toggle trigger. */
  toggle: string;
  /** Aria-label for the calendar range popup dialog. */
  popupLabel: string;
}

export interface LocaleDialogMessages {
  /** Default slot content for the cancel trigger. */
  cancel: string;
  /** Default slot content for the confirm trigger. */
  confirm: string;
  /** Aria-label for the icon-only close trigger. */
  close: string;
  /** Aria-label for the fullscreen toggle when the dialog is not fullscreen. */
  fullscreen: string;
  /** Aria-label for the fullscreen toggle when the dialog is fullscreen. */
  exitFullscreen: string;
}

export interface LocaleEditableMessages {
  /** Default aria-label and slot content for the cancel trigger. */
  cancel: string;
  /** Default aria-label and slot content for the edit trigger. */
  edit: string;
  /** Default aria-label and slot content for the submit trigger. */
  submit: string;
}

export interface LocaleInputNumberMessages {
  /** Aria-label for the increment button. */
  increment: string;
  /** Aria-label for the decrement button. */
  decrement: string;
  /** Aria-label for the clear button. */
  clear: string;
}

export interface LocaleInputMessages {
  /** Aria-label for the clear button. */
  clear: string;
}

export interface LocaleLayoutMessages {
  /** Aria-label and title for the sidebar toggle trigger/rail. */
  toggleSidebar: string;
}

export interface LocalePaginationMessages {
  /**
   * Aria-label and default slot content for the "first page" button.
   */
  firstPage: string;
  /**
   * Aria-label and default slot content for the "previous page" button.
   */
  prevPage: string;
  /**
   * Aria-label and default slot content for the "next page" button.
   */
  nextPage: string;
  /**
   * Aria-label and default slot content for the "last page" button.
   */
  lastPage: string;
  /**
   * Aria-label template for a page number button. Supports the `{value}` placeholder.
   */
  pageLabel: string;
}

export interface LocalePageTabsMessages {
  /** Aria-label for the tab close button. */
  closeTab: string;
  /** Aria-label for the tab pin button when the tab is not pinned. */
  pinTab: string;
  /** Aria-label for the tab pin button when the tab is pinned. */
  unpinTab: string;
}

export interface LocalePasswordMessages {
  /** Fallback aria-label for the clear button. */
  clearInput: string;
  /** Aria-label for the visibility toggle when password is hidden. */
  showPassword: string;
  /** Aria-label for the visibility toggle when password is visible. */
  hidePassword: string;
}

export interface LocaleProgressMessages {
  /** Default aria-label for the progress bar when no `aria-label` is provided. */
  ariaLabel: string;
  /** Aria-label for the progress bar. */
  loading: string;
}

export interface LocaleRatingMessages {
  /** Aria-label for the rating slider. */
  ariaLabel: string;
  /** Aria-valuetext template for the rating. Supports `{count}` and `{max}` placeholders. */
  starN: string;
  /** Aria-valuetext for an empty rating. */
  empty: string;
}

export interface LocaleSliderMessages {
  /**
   * Aria-label template for a thumb when there are more than two values.
   * Supports `{index}` (1-based) and `{total}` placeholders.
   */
  valueN: string;
  /** Aria-label for the minimum thumb in a range slider. */
  minimum: string;
  /** Aria-label for the maximum thumb in a range slider. */
  maximum: string;
}

export interface LocaleStepperMessages {
  /**
   * Default slot content for the step indicator.
   * Supports `{step}` placeholder.
   */
  step: string;
  /**
   * Default `aria-label` for the stepper group when no `aria-label` is provided.
   */
  ariaLabel: string;
  /**
   * Screen-reader announcement of the current step progress.
   * Supports `{current}` and `{total}` placeholders.
   */
  stepOf: string;
}

export interface LocaleTableMessages {
  /** Title shown in the empty-state slot when there are no rows. */
  emptyTitle: string;
  /** Description shown in the empty-state slot when there are no rows. */
  emptyDescription: string;
  /** Aria-label for the "select all rows" header checkbox. */
  selectAllRows: string;
  /**
   * Aria-label template for the sort button when no sort is active.
   * Supports `{column}` placeholder.
   */
  sortByColumn: string;
  /**
   * Aria-label template for the sort button when sort is ascending.
   * Supports `{column}` placeholder.
   */
  sortByColumnAsc: string;
  /**
   * Aria-label template for the sort button when sort is descending.
   * Supports `{column}` placeholder.
   */
  sortByColumnDesc: string;
  /**
   * Aria-label template for the column resize handle.
   * Supports `{column}` placeholder.
   */
  resizeColumn: string;
  /**
   * Aria-label template for expanding a row.
   * Supports `{row}` placeholder.
   */
  expandRow: string;
  /**
   * Aria-label template for collapsing a row.
   * Supports `{row}` placeholder.
   */
  collapseRow: string;
  /**
   * Aria-label template for selecting a row.
   * Supports `{row}` placeholder.
   */
  selectRow: string;
  /**
   * Summary shown in the filter popover footer when values are selected.
   * Supports `{count}` placeholder.
   */
  filterSelected: string;
  /** Summary shown in the filter popover footer when a keyword is active. */
  filterKeywordActive: string;
  /**
   * Summary shown in the filter popover footer when no value is selected.
   * Supports `{count}` placeholder.
   */
  filterOptionsCount: string;
  /** Summary shown in the filter popover footer when the column has no filter options. */
  filterNoOptions: string;
  /**
   * Aria-label template for the filter trigger when the column is filtered.
   * Supports `{column}` placeholder.
   */
  filterEdit: string;
  /**
   * Aria-label template for the filter trigger.
   * Supports `{column}` placeholder.
   */
  filter: string;
  /**
   * Aria-label template for the filter search input.
   * Supports `{column}` placeholder.
   */
  filterSearch: string;
  /** Text shown when the keyword search returns no matching options. */
  filterNoMatching: string;
  /** Default text for the clear filter button. */
  filterClear: string;
  /**
   * Aria-label template for a filter option.
   * Supports `{label}` placeholder.
   */
  filterSelect: string;
  /**
   * Placeholder template for the filter search input.
   * Supports `{column}` placeholder.
   */
  filterSearchPlaceholder: string;
}

export interface LocaleTagsInputMessages {
  /** Fallback aria-label for the input element. */
  addTag: string;
  /** Aria-label for the clear button. */
  clear: string;
}

export interface LocaleTagMessages {
  /**
   * Aria-label for the close button of a closable tag.
   * Supports the `{label}` placeholder.
   */
  remove: string;
}

export interface LocaleTreeMenuMessages {
  /**
   * Aria-label template for the item actions trigger button.
   * Supports the `{label}` placeholder.
   */
  openActions: string;
}

export interface LocaleTextareaMessages {
  /** Aria-label for the clear button. */
  clear: string;
}

export interface LocaleMessages {
  alert: LocaleAlertMessages;
  anchor: LocaleAnchorMessages;
  autocomplete: LocaleAutocompleteMessages;
  breadcrumb: LocaleBreadcrumbMessages;
  calendar: LocaleCalendarMessages;
  carousel: LocaleCarouselMessages;
  cascader: LocaleCascaderMessages;
  clipboard: LocaleClipboardMessages;
  combobox: LocaleComboboxMessages;
  command: LocaleCommandMessages;
  date: LocaleDateMessages;
  datePicker: LocaleDatePickerMessages;
  dateRangePicker: LocaleDateRangePickerMessages;
  dialog: LocaleDialogMessages;
  editable: LocaleEditableMessages;
  input: LocaleInputMessages;
  inputNumber: LocaleInputNumberMessages;
  layout: LocaleLayoutMessages;
  pagination: LocalePaginationMessages;
  pageTabs: LocalePageTabsMessages;
  password: LocalePasswordMessages;
  progress: LocaleProgressMessages;
  rating: LocaleRatingMessages;
  select: LocaleSelectMessages;
  slider: LocaleSliderMessages;
  stepper: LocaleStepperMessages;
  table: LocaleTableMessages;
  tag: LocaleTagMessages;
  tagsInput: LocaleTagsInputMessages;
  textarea: LocaleTextareaMessages;
  treeMenu: LocaleTreeMenuMessages;
}

export interface LocaleRegistry {
  name: string;
  key: string;
  dir?: Direction;
  messages: LocaleMessages;
}

export type LocaleMessagesOverrides = {
  [K in keyof LocaleMessages]?: Partial<LocaleMessages[K]>;
};
