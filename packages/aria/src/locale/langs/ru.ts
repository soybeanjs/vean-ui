import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'Первая страница',
    prevPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',
    lastPage: 'Последняя страница',
    pageLabel: 'Страница {value}'
  },
  pageTabs: {
    closeTab: 'Закрыть вкладку',
    pinTab: 'Закрепить вкладку',
    unpinTab: 'Открепить вкладку'
  },
  table: {
    emptyTitle: 'Нет данных',
    emptyDescription: 'Нет данных для отображения.',
    selectAllRows: 'Выбрать все строки',
    sortByColumn: 'Сортировать по {column}',
    sortByColumnAsc: 'Сортировать по {column}, сейчас по возрастанию',
    sortByColumnDesc: 'Сортировать по {column}, сейчас по убыванию',
    resizeColumn: 'Изменить ширину столбца {column}',
    expandRow: 'Развернуть строку {row}',
    collapseRow: 'Свернуть строку {row}',
    selectRow: 'Выбрать строку {row}',
    filterSelected: 'Выбрано: {count}',
    filterKeywordActive: 'Ключевое слово активно',
    filterOptionsCount: 'Вариантов: {count}',
    filterNoOptions: 'Нет вариантов фильтра',
    filterEdit: 'Изменить фильтр для «{column}»',
    filter: 'Фильтр «{column}»',
    filterSearch: 'Поиск вариантов фильтра для «{column}»',
    filterNoMatching: 'Нет подходящих вариантов',
    filterClear: 'Очистить',
    filterSelect: 'Выбрать {label}',
    filterSearchPlaceholder: 'Поиск «{column}»'
  },
  calendar: {
    prevPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',
    selectMonth: 'Выбрать месяц',
    selectYear: 'Выбрать год'
  },
  datePicker: {
    toggle: 'Открыть календарь',
    popupLabel: 'Выбрать дату'
  },
  dateRangePicker: {
    toggle: 'Открыть календарь',
    popupLabel: 'Выбрать диапазон дат'
  },
  carousel: {
    previous: 'Предыдущий слайд',
    next: 'Следующий слайд',
    ariaLabel: 'Карусель'
  },
  cascader: {
    clear: 'Очистить',
    noResults: 'Нет данных',
    removeTag: 'Удалить {label}',
    search: 'Поиск'
  },
  clipboard: {
    copy: 'Копировать',
    copied: 'Скопировано'
  },
  layout: {
    toggleSidebar: 'Переключить боковую панель'
  },
  input: {
    clear: 'Очистить ввод'
  },
  inputNumber: {
    increment: 'Увеличить',
    decrement: 'Уменьшить',
    clear: 'Очистить значение'
  },
  textarea: {
    clear: 'Очистить текстовое поле'
  },
  tag: {
    remove: 'Удалить {label}'
  },
  tagsInput: {
    addTag: 'Добавить тег',
    clear: 'Очистить теги'
  },
  treeMenu: {
    openActions: 'Открыть действия для «{label}»'
  },
  progress: {
    ariaLabel: 'Прогресс',
    loading: 'Загрузка'
  },
  alert: {
    close: 'Закрыть уведомление'
  },
  anchor: {
    nav: 'Якорная навигация'
  },
  breadcrumb: {
    nav: 'Хлебные крошки'
  },
  stepper: {
    step: 'Шаг {step}',
    ariaLabel: 'Пошаговый прогресс',
    stepOf: 'Шаг {current} из {total}'
  },
  editable: {
    cancel: 'Отмена',
    edit: 'Редактировать',
    submit: 'Сохранить'
  },
  combobox: {
    clear: 'Очистить',
    clearInput: 'Очистить ввод',
    noResults: 'Ничего не найдено.',
    search: 'Поиск',
    options: 'Опции'
  },
  autocomplete: {
    toggleSuggestions: 'Переключить подсказки',
    clearInput: 'Очистить ввод',
    noResults: 'Ничего не найдено.',
    options: 'Опции'
  },
  command: {
    noResults: 'Ничего не найдено.'
  },
  select: {
    clear: 'Очистить'
  },
  dialog: {
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    fullscreen: 'Во весь экран',
    exitFullscreen: 'Выйти из полноэкранного режима',
    close: 'Закрыть'
  },
  rating: {
    ariaLabel: 'Оценка',
    starN: '{count} из {max} звёзд',
    empty: 'Без оценки'
  },
  slider: {
    valueN: 'Значение {index} из {total}',
    minimum: 'Минимум',
    maximum: 'Максимум'
  },
  password: {
    clearInput: 'Очистить ввод',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль'
  },
  date: {
    daySegment: 'день,',
    monthSegment: 'месяц,',
    yearSegment: 'год,',
    hourSegment: 'час,',
    minuteSegment: 'минута,',
    secondSegment: 'секунда,',
    dayPeriodSegment: 'AM/PM,',
    timeZoneSegment: 'часовой пояс,',
    empty: 'Пусто',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const ru: LocaleRegistry = {
  name: 'Русский',
  key: 'ru',
  dir: 'ltr',
  messages
};

export default ru;
