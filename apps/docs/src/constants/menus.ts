export interface MenuData {
  value: string;
  i18n: string;
  items: string[];
}

export const newlyComponentKeys = [
  'colorField',
  'colorSlider',
  'colorSwatch',
  'colorSwatchPicker',
  'colorPicker',
  'pageTabs',
  'calendar',
  'dateField',
  'datePicker',
  'dateRangeField',
  'dateRangePicker',
  'calendarRange',
  'timeField',
  'timeRangeField',
  'splitNav',
  'appShell'
];

export const menuData: MenuData[] = [
  {
    value: 'general',
    i18n: 'sidebar.general',
    items: ['configProvider', 'button', 'clipboard', 'icon', 'link', 'spinner']
  },
  {
    value: 'groupLayout',
    i18n: 'sidebar.layout',
    items: ['appShell', 'aspectRatio', 'layout', 'separator', 'splitter', 'toolbar']
  },
  {
    value: 'navigation',
    i18n: 'sidebar.navigation',
    items: [
      'anchor',
      'breadcrumb',
      'command',
      'contextMenu',
      'dropdownMenu',
      'menu',
      'menubar',
      'navMenu',
      'navigationMenu',
      'pageTabs',
      'pagination',
      'splitNav',
      'stepper',
      'tabs',
      'tree',
      'treeMenu',
      'treeNav'
    ]
  },
  {
    value: 'forms',
    i18n: 'sidebar.forms',
    items: [
      'autocomplete',
      'calendar',
      'colorArea',
      'colorField',
      'colorPicker',
      'colorSlider',
      'colorSwatchPicker',
      'palettePicker',
      'cascader',
      'combobox',
      'dateField',
      'datePicker',
      'dateRangeField',
      'dateRangePicker',
      'editable',
      'calendarRange',
      'form',
      'label',
      'input',
      'inputNumber',
      'inputOtp',
      'password',
      'textarea',
      'timeField',
      'timeRangeField',
      'checkbox',
      'radioGroup',
      'segment',
      'select',
      'slider',
      'switch',
      'tagsInput',
      'toggle',
      'toggleGroup'
    ]
  },
  {
    value: 'dataDisplay',
    i18n: 'sidebar.data_display',
    items: [
      'accordion',
      'affix',
      'carousel',
      'colorSwatch',
      'collapsible',
      'card',
      'empty',
      'list',
      'avatar',
      'backtop',
      'badge',
      'kbd',
      'progress',
      'scrollArea',
      'skeleton',
      'tag',
      'table',
      'virtualizer',
      'watermark'
    ]
  },
  {
    value: 'feedback',
    i18n: 'sidebar.feedback',
    items: ['alert', 'toast']
  },
  {
    value: 'overlay',
    i18n: 'sidebar.overlay',
    items: ['dialog', 'drawer', 'hoverCard', 'popconfirm', 'popover', 'sheet', 'tooltip']
  },
  {
    value: 'utilities',
    i18n: 'sidebar.utilities',
    items: ['visuallyHidden']
  },
  {
    // aria product line — placeholder until the aria docs land (D8)
    value: 'aria',
    i18n: 'sidebar.aria',
    items: []
  }
];

// Peripheral package menu data — items are placeholders to be filled as components are added.

export const chartNewlyComponentKeys: string[] = [];

export const chartMenuData: MenuData[] = [
  {
    value: 'charts',
    i18n: 'chart.sidebar.charts',
    items: ['area', 'bar', 'line', 'pie', 'scatter']
  }
];
