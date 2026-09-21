import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: '第一页',
    prevPage: '上一页',
    nextPage: '下一页',
    lastPage: '最后一页',
    pageLabel: '第 {value} 页'
  },
  pageTabs: {
    closeTab: '关闭标签页',
    pinTab: '固定标签页',
    unpinTab: '取消固定标签页'
  },
  table: {
    emptyTitle: '暂无数据',
    emptyDescription: '当前没有可显示的数据。',
    selectAllRows: '全选',
    sortByColumn: '按{column}排序',
    sortByColumnAsc: '按{column}排序，当前升序',
    sortByColumnDesc: '按{column}排序，当前降序',
    resizeColumn: '调整{column}列宽',
    expandRow: '展开行 {row}',
    collapseRow: '收起行 {row}',
    selectRow: '选择行 {row}',
    filterSelected: '已选 {count} 项',
    filterKeywordActive: '关键字筛选生效',
    filterOptionsCount: '{count} 个选项',
    filterNoOptions: '无筛选项',
    filterEdit: '编辑「{column}」筛选',
    filter: '筛选「{column}」',
    filterSearch: '搜索「{column}」的筛选选项',
    filterNoMatching: '无匹配选项',
    filterClear: '清除',
    filterSelect: '选择 {label}',
    filterSearchPlaceholder: '搜索 {column}'
  },
  calendar: {
    prevPage: '上一页',
    nextPage: '下一页',
    selectMonth: '选择月份',
    selectYear: '选择年份'
  },
  datePicker: {
    toggle: '打开日历',
    popupLabel: '选择日期'
  },
  dateRangePicker: {
    toggle: '打开日历',
    popupLabel: '选择日期范围'
  },
  carousel: {
    previous: '上一张幻灯片',
    next: '下一张幻灯片',
    ariaLabel: '轮播图'
  },
  cascader: {
    clear: '清除',
    noResults: '暂无数据',
    removeTag: '移除 {label}',
    search: '搜索'
  },
  clipboard: {
    copy: '复制',
    copied: '已复制'
  },
  layout: {
    toggleSidebar: '切换侧边栏'
  },
  input: {
    clear: '清除输入'
  },
  inputNumber: {
    increment: '增加',
    decrement: '减少',
    clear: '清除数值'
  },
  textarea: {
    clear: '清除文本域'
  },
  tag: {
    remove: '移除 {label}'
  },
  tagsInput: {
    addTag: '添加标签',
    clear: '清除标签'
  },
  treeMenu: {
    openActions: '打开 {label} 的操作'
  },
  progress: {
    ariaLabel: '进度',
    loading: '加载中'
  },
  alert: {
    close: '关闭提示'
  },
  anchor: {
    nav: '锚点导航'
  },
  breadcrumb: {
    nav: '面包屑'
  },
  stepper: {
    step: '第 {step} 步',
    ariaLabel: '分步进度',
    stepOf: '第 {current} 步，共 {total} 步'
  },
  editable: {
    cancel: '取消',
    edit: '编辑',
    submit: '提交'
  },
  combobox: {
    clear: '清除',
    clearInput: '清除输入',
    noResults: '无匹配结果。',
    search: '搜索',
    options: '选项'
  },
  autocomplete: {
    toggleSuggestions: '切换建议列表',
    clearInput: '清除输入',
    noResults: '无匹配结果。',
    options: '选项'
  },
  command: {
    noResults: '无匹配结果。'
  },
  select: {
    clear: '清除'
  },
  dialog: {
    cancel: '取消',
    confirm: '确认',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    close: '关闭'
  },
  rating: {
    ariaLabel: '评分',
    starN: '{count}/{max} 星',
    empty: '未评分'
  },
  slider: {
    valueN: '第 {index} 个值，共 {total} 个',
    minimum: '最小值',
    maximum: '最大值'
  },
  password: {
    clearInput: '清除输入',
    showPassword: '显示密码',
    hidePassword: '隐藏密码'
  },
  date: {
    daySegment: '日,',
    monthSegment: '月, ',
    yearSegment: '年, ',
    hourSegment: '时, ',
    minuteSegment: '分, ',
    secondSegment: '秒, ',
    dayPeriodSegment: '上午/下午, ',
    timeZoneSegment: '时区, ',
    empty: '空',
    placeholder: {
      year: '年',
      month: '月',
      day: '日',
      time: '––'
    }
  }
};

const zhCN: LocaleRegistry = {
  name: '简体中文',
  key: 'zh-CN',
  dir: 'ltr',
  messages
};

export default zhCN;
