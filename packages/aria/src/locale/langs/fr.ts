import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'Première page',
    prevPage: 'Page précédente',
    nextPage: 'Page suivante',
    lastPage: 'Dernière page',
    pageLabel: 'Page {value}'
  },
  pageTabs: {
    closeTab: "Fermer l'onglet",
    pinTab: "Épingler l'onglet",
    unpinTab: "Désépingler l'onglet"
  },
  table: {
    emptyTitle: 'Pas de données',
    emptyDescription: "Il n'y a pas de données à afficher.",
    selectAllRows: 'Sélectionner toutes les lignes',
    sortByColumn: 'Trier par {column}',
    sortByColumnAsc: 'Trier par {column}, actuellement par ordre croissant',
    sortByColumnDesc: 'Trier par {column}, actuellement par ordre décroissant',
    resizeColumn: 'Redimensionner la colonne {column}',
    expandRow: 'Développer la ligne {row}',
    collapseRow: 'Réduire la ligne {row}',
    selectRow: 'Sélectionner la ligne {row}',
    filterSelected: '{count} sélectionné(s)',
    filterKeywordActive: 'Mot-clé actif',
    filterOptionsCount: '{count} options',
    filterNoOptions: 'Aucune option de filtre',
    filterEdit: 'Modifier le filtre pour {column}',
    filter: 'Filtrer {column}',
    filterSearch: 'Rechercher les options de filtre pour {column}',
    filterNoMatching: 'Aucune option correspondante',
    filterClear: 'Effacer',
    filterSelect: 'Sélectionner {label}',
    filterSearchPlaceholder: 'Rechercher {column}'
  },
  calendar: {
    prevPage: 'Page précédente',
    nextPage: 'Page suivante',
    selectMonth: 'Sélectionner un mois',
    selectYear: "Sélectionner l'année"
  },
  datePicker: {
    toggle: 'Ouvrir le calendrier',
    popupLabel: 'Choisir une date'
  },
  dateRangePicker: {
    toggle: 'Ouvrir le calendrier',
    popupLabel: 'Choisir une plage de dates'
  },
  carousel: {
    previous: 'Diapositive précédente',
    next: 'Diapositive suivante',
    ariaLabel: 'Carrousel'
  },
  cascader: {
    clear: 'Effacer',
    noResults: 'Pas de données',
    removeTag: 'Supprimer {label}',
    search: 'Rechercher'
  },
  clipboard: {
    copy: 'Copier',
    copied: 'Copié'
  },
  layout: {
    toggleSidebar: 'Basculer la barre latérale'
  },
  input: {
    clear: 'Effacer la saisie'
  },
  inputNumber: {
    increment: 'Augmenter',
    decrement: 'Diminuer',
    clear: 'Effacer la valeur'
  },
  textarea: {
    clear: 'Effacer la zone de texte'
  },
  tag: {
    remove: 'Supprimer {label}'
  },
  tagsInput: {
    addTag: 'Ajouter une balise',
    clear: 'Effacer les balises'
  },
  treeMenu: {
    openActions: 'Ouvrir les actions de {label}'
  },
  progress: {
    ariaLabel: 'Progression',
    loading: 'Chargement'
  },
  alert: {
    close: "Fermer l'alerte"
  },
  anchor: {
    nav: "Navigation d'ancrage"
  },
  breadcrumb: {
    nav: "Fil d'Ariane"
  },
  stepper: {
    step: 'Étape {step}',
    ariaLabel: 'Progression par étapes',
    stepOf: 'Étape {current} sur {total}'
  },
  editable: {
    cancel: 'Annuler',
    edit: 'Modifier',
    submit: 'Soumettre'
  },
  combobox: {
    clear: 'Effacer',
    clearInput: 'Effacer la saisie',
    noResults: 'Aucun résultat trouvé.',
    search: 'Rechercher',
    options: 'Options'
  },
  autocomplete: {
    toggleSuggestions: 'Basculer les suggestions',
    clearInput: 'Effacer la saisie',
    noResults: 'Aucun résultat trouvé.',
    options: 'Options'
  },
  command: {
    noResults: 'Aucun résultat trouvé.'
  },
  select: {
    clear: 'Effacer'
  },
  dialog: {
    cancel: 'Annuler',
    confirm: 'Confirmer',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    close: 'Fermer'
  },
  rating: {
    ariaLabel: 'Évaluation',
    starN: '{count} sur {max} étoiles',
    empty: 'Aucune évaluation'
  },
  slider: {
    valueN: 'Valeur {index} sur {total}',
    minimum: 'Minimum',
    maximum: 'Maximum'
  },
  password: {
    clearInput: 'Effacer la saisie',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe'
  },
  date: {
    daySegment: 'jour,',
    monthSegment: 'mois,',
    yearSegment: 'année,',
    hourSegment: 'heure,',
    minuteSegment: 'minute,',
    secondSegment: 'seconde,',
    dayPeriodSegment: 'AM/PM,',
    timeZoneSegment: 'fuseau horaire,',
    empty: 'Vide',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const fr: LocaleRegistry = {
  name: 'Français',
  key: 'fr',
  dir: 'ltr',
  messages
};

export default fr;
