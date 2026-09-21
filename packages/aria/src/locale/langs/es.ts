import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'Primera página',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    lastPage: 'Última página',
    pageLabel: 'Página {value}'
  },
  pageTabs: {
    closeTab: 'Cerrar pestaña',
    pinTab: 'Fijar pestaña',
    unpinTab: 'Desfijar pestaña'
  },
  table: {
    emptyTitle: 'Sin datos',
    emptyDescription: 'No hay datos que mostrar.',
    selectAllRows: 'Seleccionar todas las filas',
    sortByColumn: 'Ordenar por {column}',
    sortByColumnAsc: 'Ordenar por {column}, actualmente en orden ascendente',
    sortByColumnDesc: 'Ordenar por {column}, actualmente en orden descendente',
    resizeColumn: 'Redimensionar la columna {column}',
    expandRow: 'Expandir fila {row}',
    collapseRow: 'Contraer fila {row}',
    selectRow: 'Seleccionar fila {row}',
    filterSelected: '{count} seleccionado(s)',
    filterKeywordActive: 'Palabra clave activa',
    filterOptionsCount: '{count} opciones',
    filterNoOptions: 'Sin opciones de filtro',
    filterEdit: 'Editar filtro de {column}',
    filter: 'Filtrar {column}',
    filterSearch: 'Buscar opciones de filtro de {column}',
    filterNoMatching: 'Sin opciones coincidentes',
    filterClear: 'Limpiar',
    filterSelect: 'Seleccionar {label}',
    filterSearchPlaceholder: 'Buscar {column}'
  },
  calendar: {
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    selectMonth: 'Seleccionar mes',
    selectYear: 'Seleccionar año'
  },
  datePicker: {
    toggle: 'Abrir calendario',
    popupLabel: 'Elegir fecha'
  },
  dateRangePicker: {
    toggle: 'Abrir calendario',
    popupLabel: 'Elegir rango de fechas'
  },
  carousel: {
    previous: 'Diapositiva anterior',
    next: 'Diapositiva siguiente',
    ariaLabel: 'Carrusel'
  },
  cascader: {
    clear: 'Limpiar',
    noResults: 'Sin datos',
    removeTag: 'Eliminar {label}',
    search: 'Buscar'
  },
  clipboard: {
    copy: 'Copiar',
    copied: 'Copiado'
  },
  layout: {
    toggleSidebar: 'Alternar barra lateral'
  },
  input: {
    clear: 'Borrar entrada'
  },
  inputNumber: {
    increment: 'Aumentar',
    decrement: 'Disminuir',
    clear: 'Borrar valor'
  },
  textarea: {
    clear: 'Borrar área de texto'
  },
  tag: {
    remove: 'Eliminar {label}'
  },
  tagsInput: {
    addTag: 'Añadir etiqueta',
    clear: 'Borrar etiquetas'
  },
  treeMenu: {
    openActions: 'Abrir acciones de {label}'
  },
  progress: {
    ariaLabel: 'Progreso',
    loading: 'Cargando'
  },
  alert: {
    close: 'Cerrar alerta'
  },
  anchor: {
    nav: 'Navegación por anclas'
  },
  breadcrumb: {
    nav: 'Ruta de navegación'
  },
  stepper: {
    step: 'Paso {step}',
    ariaLabel: 'Progreso por pasos',
    stepOf: 'Paso {current} de {total}'
  },
  editable: {
    cancel: 'Cancelar',
    edit: 'Editar',
    submit: 'Enviar'
  },
  combobox: {
    clear: 'Limpiar',
    clearInput: 'Borrar entrada',
    noResults: 'No se han encontrado resultados.',
    search: 'Buscar',
    options: 'Opciones'
  },
  autocomplete: {
    toggleSuggestions: 'Alternar sugerencias',
    clearInput: 'Borrar entrada',
    noResults: 'No se han encontrado resultados.',
    options: 'Opciones'
  },
  command: {
    noResults: 'No se han encontrado resultados.'
  },
  select: {
    clear: 'Limpiar'
  },
  dialog: {
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    close: 'Cerrar'
  },
  rating: {
    ariaLabel: 'Calificación',
    starN: '{count} de {max} estrellas',
    empty: 'Sin calificación'
  },
  slider: {
    valueN: 'Valor {index} de {total}',
    minimum: 'Mínimo',
    maximum: 'Máximo'
  },
  password: {
    clearInput: 'Borrar entrada',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña'
  },
  date: {
    daySegment: 'día,',
    monthSegment: 'mes,',
    yearSegment: 'año,',
    hourSegment: 'hora,',
    minuteSegment: 'minuto,',
    secondSegment: 'segundo,',
    dayPeriodSegment: 'AM/PM,',
    timeZoneSegment: 'zona horaria,',
    empty: 'Vacío',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const es: LocaleRegistry = {
  name: 'Español',
  key: 'es',
  dir: 'ltr',
  messages
};

export default es;
