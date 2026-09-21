import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'Erste Seite',
    prevPage: 'Vorherige Seite',
    nextPage: 'Nächste Seite',
    lastPage: 'Letzte Seite',
    pageLabel: 'Seite {value}'
  },
  pageTabs: {
    closeTab: 'Tab schließen',
    pinTab: 'Tab anheften',
    unpinTab: 'Tab lösen'
  },
  table: {
    emptyTitle: 'Keine Daten',
    emptyDescription: 'Es sind keine Daten zum Anzeigen vorhanden.',
    selectAllRows: 'Alle Zeilen auswählen',
    sortByColumn: 'Nach {column} sortieren',
    sortByColumnAsc: 'Nach {column} sortieren, aktuell aufsteigend',
    sortByColumnDesc: 'Nach {column} sortieren, aktuell absteigend',
    resizeColumn: 'Größe der Spalte {column} ändern',
    expandRow: 'Zeile {row} erweitern',
    collapseRow: 'Zeile {row} einklappen',
    selectRow: 'Zeile {row} auswählen',
    filterSelected: '{count} ausgewählt',
    filterKeywordActive: 'Stichwort aktiv',
    filterOptionsCount: '{count} Optionen',
    filterNoOptions: 'Keine Filteroptionen',
    filterEdit: 'Filter für {column} bearbeiten',
    filter: '{column} filtern',
    filterSearch: 'Filteroptionen für {column} durchsuchen',
    filterNoMatching: 'Keine passenden Optionen',
    filterClear: 'Löschen',
    filterSelect: '{label} auswählen',
    filterSearchPlaceholder: '{column} durchsuchen'
  },
  calendar: {
    prevPage: 'Vorherige Seite',
    nextPage: 'Nächste Seite',
    selectMonth: 'Monat auswählen',
    selectYear: 'Jahr auswählen'
  },
  datePicker: {
    toggle: 'Kalender öffnen',
    popupLabel: 'Datum auswählen'
  },
  dateRangePicker: {
    toggle: 'Kalender öffnen',
    popupLabel: 'Datumsbereich auswählen'
  },
  carousel: {
    previous: 'Vorherige Folie',
    next: 'Nächste Folie',
    ariaLabel: 'Karussell'
  },
  cascader: {
    clear: 'Leeren',
    noResults: 'Keine Daten',
    removeTag: '{label} entfernen',
    search: 'Suchen'
  },
  clipboard: {
    copy: 'Kopieren',
    copied: 'Kopiert'
  },
  layout: {
    toggleSidebar: 'Seitenleiste umschalten'
  },
  input: {
    clear: 'Eingabe löschen'
  },
  inputNumber: {
    increment: 'Erhöhen',
    decrement: 'Verringern',
    clear: 'Wert löschen'
  },
  textarea: {
    clear: 'Textbereich löschen'
  },
  tag: {
    remove: '{label} entfernen'
  },
  tagsInput: {
    addTag: 'Tag hinzufügen',
    clear: 'Tags löschen'
  },
  treeMenu: {
    openActions: 'Aktionen für {label} öffnen'
  },
  progress: {
    ariaLabel: 'Fortschritt',
    loading: 'Laden'
  },
  alert: {
    close: 'Meldung schließen'
  },
  anchor: {
    nav: 'Ankernavigation'
  },
  breadcrumb: {
    nav: 'Breadcrumb'
  },
  stepper: {
    step: 'Schritt {step}',
    ariaLabel: 'Schritt-für-Schritt-Fortschritt',
    stepOf: 'Schritt {current} von {total}'
  },
  editable: {
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    submit: 'Speichern'
  },
  combobox: {
    clear: 'Leeren',
    clearInput: 'Eingabe löschen',
    noResults: 'Keine Ergebnisse gefunden.',
    search: 'Suchen',
    options: 'Optionen'
  },
  autocomplete: {
    toggleSuggestions: 'Vorschläge umschalten',
    clearInput: 'Eingabe löschen',
    noResults: 'Keine Ergebnisse gefunden.',
    options: 'Optionen'
  },
  command: {
    noResults: 'Keine Ergebnisse gefunden.'
  },
  select: {
    clear: 'Leeren'
  },
  dialog: {
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    fullscreen: 'Vollbild',
    exitFullscreen: 'Vollbild beenden',
    close: 'Schließen'
  },
  rating: {
    ariaLabel: 'Bewertung',
    starN: '{count} von {max} Sternen',
    empty: 'Keine Bewertung'
  },
  slider: {
    valueN: 'Wert {index} von {total}',
    minimum: 'Minimum',
    maximum: 'Maximum'
  },
  password: {
    clearInput: 'Eingabe löschen',
    showPassword: 'Passwort anzeigen',
    hidePassword: 'Passwort ausblenden'
  },
  date: {
    daySegment: 'Tag,',
    monthSegment: 'Monat,',
    yearSegment: 'Jahr,',
    hourSegment: 'Stunde,',
    minuteSegment: 'Minute,',
    secondSegment: 'Sekunde,',
    dayPeriodSegment: 'AM/PM,',
    timeZoneSegment: 'Zeitzone,',
    empty: 'Leer',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const de: LocaleRegistry = {
  name: 'Deutsch',
  key: 'de',
  dir: 'ltr',
  messages
};

export default de;
