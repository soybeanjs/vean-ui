import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'Primeira página',
    prevPage: 'Página anterior',
    nextPage: 'Próxima página',
    lastPage: 'Última página',
    pageLabel: 'Página {value}'
  },
  pageTabs: {
    closeTab: 'Fechar aba',
    pinTab: 'Fixar aba',
    unpinTab: 'Desafixar aba'
  },
  table: {
    emptyTitle: 'Sem dados',
    emptyDescription: 'Não há dados para exibir.',
    selectAllRows: 'Selecionar todas as linhas',
    sortByColumn: 'Ordenar por {column}',
    sortByColumnAsc: 'Ordenar por {column}, atualmente em ordem crescente',
    sortByColumnDesc: 'Ordenar por {column}, atualmente em ordem decrescente',
    resizeColumn: 'Redimensionar a coluna {column}',
    expandRow: 'Expandir linha {row}',
    collapseRow: 'Recolher linha {row}',
    selectRow: 'Selecionar linha {row}',
    filterSelected: '{count} selecionado(s)',
    filterKeywordActive: 'Palavra-chave ativa',
    filterOptionsCount: '{count} opções',
    filterNoOptions: 'Nenhuma opção de filtro',
    filterEdit: 'Editar filtro de {column}',
    filter: 'Filtrar {column}',
    filterSearch: 'Pesquisar opções de filtro de {column}',
    filterNoMatching: 'Nenhuma opção correspondente',
    filterClear: 'Limpar',
    filterSelect: 'Selecionar {label}',
    filterSearchPlaceholder: 'Pesquisar {column}'
  },
  calendar: {
    prevPage: 'Página anterior',
    nextPage: 'Próxima página',
    selectMonth: 'Selecionar mês',
    selectYear: 'Selecionar ano'
  },
  datePicker: {
    toggle: 'Abrir calendário',
    popupLabel: 'Escolher data'
  },
  dateRangePicker: {
    toggle: 'Abrir calendário',
    popupLabel: 'Escolher intervalo de datas'
  },
  carousel: {
    previous: 'Slide anterior',
    next: 'Próximo slide',
    ariaLabel: 'Carrossel'
  },
  cascader: {
    clear: 'Limpar',
    noResults: 'Sem dados',
    removeTag: 'Remover {label}',
    search: 'Pesquisar'
  },
  clipboard: {
    copy: 'Copiar',
    copied: 'Copiado'
  },
  layout: {
    toggleSidebar: 'Alternar barra lateral'
  },
  input: {
    clear: 'Limpar entrada'
  },
  inputNumber: {
    increment: 'Aumentar',
    decrement: 'Diminuir',
    clear: 'Limpar valor'
  },
  textarea: {
    clear: 'Limpar área de texto'
  },
  tag: {
    remove: 'Remover {label}'
  },
  tagsInput: {
    addTag: 'Adicionar tag',
    clear: 'Limpar tags'
  },
  treeMenu: {
    openActions: 'Abrir ações de {label}'
  },
  progress: {
    ariaLabel: 'Progresso',
    loading: 'Carregando'
  },
  alert: {
    close: 'Fechar alerta'
  },
  anchor: {
    nav: 'Navegação por âncoras'
  },
  breadcrumb: {
    nav: 'Trilha de navegação'
  },
  stepper: {
    step: 'Etapa {step}',
    ariaLabel: 'Progresso por etapas',
    stepOf: 'Etapa {current} de {total}'
  },
  editable: {
    cancel: 'Cancelar',
    edit: 'Editar',
    submit: 'Salvar'
  },
  combobox: {
    clear: 'Limpar',
    clearInput: 'Limpar entrada',
    noResults: 'Nenhum resultado encontrado.',
    search: 'Pesquisar',
    options: 'Opções'
  },
  autocomplete: {
    toggleSuggestions: 'Alternar sugestões',
    clearInput: 'Limpar entrada',
    noResults: 'Nenhum resultado encontrado.',
    options: 'Opções'
  },
  command: {
    noResults: 'Nenhum resultado encontrado.'
  },
  select: {
    clear: 'Limpar'
  },
  dialog: {
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    fullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    close: 'Fechar'
  },
  rating: {
    ariaLabel: 'Avaliação',
    starN: '{count} de {max} estrelas',
    empty: 'Sem avaliação'
  },
  slider: {
    valueN: 'Valor {index} de {total}',
    minimum: 'Mínimo',
    maximum: 'Máximo'
  },
  password: {
    clearInput: 'Limpar entrada',
    showPassword: 'Mostrar senha',
    hidePassword: 'Ocultar senha'
  },
  date: {
    daySegment: 'dia,',
    monthSegment: 'mês,',
    yearSegment: 'ano,',
    hourSegment: 'hora,',
    minuteSegment: 'minuto,',
    secondSegment: 'segundo,',
    dayPeriodSegment: 'AM/PM,',
    timeZoneSegment: 'fuso horário,',
    empty: 'Vazio',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const ptBR: LocaleRegistry = {
  name: 'Português (Brasil)',
  key: 'pt-BR',
  dir: 'ltr',
  messages
};

export default ptBR;
