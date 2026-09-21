import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'First page',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    pageLabel: 'Page {value}'
  },
  pageTabs: {
    closeTab: 'Close tab',
    pinTab: 'Pin tab',
    unpinTab: 'Unpin tab'
  },
  table: {
    emptyTitle: 'No data',
    emptyDescription: 'There is no data to display.',
    selectAllRows: 'Select all rows',
    sortByColumn: 'Sort by {column}',
    sortByColumnAsc: 'Sort by {column}, currently ascending',
    sortByColumnDesc: 'Sort by {column}, currently descending',
    resizeColumn: 'Resize {column} column',
    expandRow: 'Expand row {row}',
    collapseRow: 'Collapse row {row}',
    selectRow: 'Select row {row}',
    filterSelected: '{count} selected',
    filterKeywordActive: 'Keyword active',
    filterOptionsCount: '{count} options',
    filterNoOptions: 'No filter options',
    filterEdit: 'Edit filter for {column}',
    filter: 'Filter {column}',
    filterSearch: 'Search filter options for {column}',
    filterNoMatching: 'No matching options',
    filterClear: 'Clear',
    filterSelect: 'Select {label}',
    filterSearchPlaceholder: 'Search {column}'
  },
  calendar: {
    prevPage: 'Previous page',
    nextPage: 'Next page',
    selectMonth: 'Select month',
    selectYear: 'Select year'
  },
  datePicker: {
    toggle: 'Open calendar',
    popupLabel: 'Choose date'
  },
  dateRangePicker: {
    toggle: 'Open calendar',
    popupLabel: 'Choose date range'
  },
  carousel: {
    previous: 'Previous slide',
    next: 'Next slide',
    ariaLabel: 'Carousel'
  },
  cascader: {
    clear: 'Clear value',
    noResults: 'No data',
    removeTag: 'Remove {label}',
    search: 'Search'
  },
  clipboard: {
    copy: 'Copy',
    copied: 'Copied'
  },
  layout: {
    toggleSidebar: 'Toggle Sidebar'
  },
  input: {
    clear: 'Clear input'
  },
  inputNumber: {
    increment: 'Increase',
    decrement: 'Decrease',
    clear: 'Clear value'
  },
  textarea: {
    clear: 'Clear textarea'
  },
  tag: {
    remove: 'Remove {label}'
  },
  tagsInput: {
    addTag: 'Add tag',
    clear: 'Clear tags'
  },
  treeMenu: {
    openActions: 'Open {label} actions'
  },
  progress: {
    ariaLabel: 'Progress',
    loading: 'Loading'
  },
  alert: {
    close: 'Close alert'
  },
  anchor: {
    nav: 'Anchor'
  },
  breadcrumb: {
    nav: 'breadcrumb'
  },
  stepper: {
    step: 'Step {step}',
    ariaLabel: 'Step-by-step progress',
    stepOf: 'Step {current} of {total}'
  },
  editable: {
    cancel: 'Cancel',
    edit: 'Edit',
    submit: 'Submit'
  },
  combobox: {
    clear: 'Clear value',
    clearInput: 'Clear input',
    noResults: 'No results found.',
    search: 'Search',
    options: 'Options'
  },
  autocomplete: {
    toggleSuggestions: 'Toggle suggestions',
    clearInput: 'Clear input',
    noResults: 'No results found.',
    options: 'Options'
  },
  command: {
    noResults: 'No results found.'
  },
  select: {
    clear: 'Clear value'
  },
  dialog: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    close: 'Close'
  },
  rating: {
    ariaLabel: 'Rating',
    starN: '{count} of {max} stars',
    empty: 'No rating'
  },
  slider: {
    valueN: 'Value {index} of {total}',
    minimum: 'Minimum',
    maximum: 'Maximum'
  },
  password: {
    clearInput: 'Clear input',
    showPassword: 'Show password',
    hidePassword: 'Hide password'
  },
  date: {
    daySegment: 'day,',
    monthSegment: 'month, ',
    yearSegment: 'year, ',
    hourSegment: 'hour, ',
    minuteSegment: 'minute, ',
    secondSegment: 'second, ',
    dayPeriodSegment: 'AM/PM, ',
    timeZoneSegment: 'time zone, ',
    empty: 'Empty',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const en: LocaleRegistry = {
  name: 'English',
  key: 'en',
  dir: 'ltr',
  messages
};

export default en;
