import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: '第一頁',
    prevPage: '上一頁',
    nextPage: '下一頁',
    lastPage: '最後一頁',
    pageLabel: '第 {value} 頁'
  },
  pageTabs: {
    closeTab: '關閉分頁',
    pinTab: '固定分頁',
    unpinTab: '取消固定分頁'
  },
  table: {
    emptyTitle: '暫無資料',
    emptyDescription: '目前沒有可顯示的資料。',
    selectAllRows: '全選',
    sortByColumn: '依 {column} 排序',
    sortByColumnAsc: '依 {column} 排序，目前為升冪',
    sortByColumnDesc: '依 {column} 排序，目前為降冪',
    resizeColumn: '調整 {column} 欄寬',
    expandRow: '展開列 {row}',
    collapseRow: '收合列 {row}',
    selectRow: '選取列 {row}',
    filterSelected: '已選 {count} 項',
    filterKeywordActive: '關鍵字篩選生效',
    filterOptionsCount: '{count} 個選項',
    filterNoOptions: '無篩選項',
    filterEdit: '編輯「{column}」篩選',
    filter: '篩選「{column}」',
    filterSearch: '搜尋「{column}」的篩選選項',
    filterNoMatching: '無符合選項',
    filterClear: '清除',
    filterSelect: '選擇 {label}',
    filterSearchPlaceholder: '搜尋 {column}'
  },
  calendar: {
    prevPage: '上一頁',
    nextPage: '下一頁',
    selectMonth: '選擇月份',
    selectYear: '選擇年份'
  },
  datePicker: {
    toggle: '開啟日曆',
    popupLabel: '選擇日期'
  },
  dateRangePicker: {
    toggle: '開啟日曆',
    popupLabel: '選擇日期範圍'
  },
  carousel: {
    previous: '上一張幻燈片',
    next: '下一張幻燈片',
    ariaLabel: '輪播圖'
  },
  cascader: {
    clear: '清除',
    noResults: '暫無資料',
    removeTag: '移除 {label}',
    search: '搜尋'
  },
  clipboard: {
    copy: '複製',
    copied: '已複製'
  },
  layout: {
    toggleSidebar: '切換側邊欄'
  },
  input: {
    clear: '清除輸入'
  },
  inputNumber: {
    increment: '增加',
    decrement: '減少',
    clear: '清除數值'
  },
  textarea: {
    clear: '清除文字區域'
  },
  tag: {
    remove: '移除 {label}'
  },
  tagsInput: {
    addTag: '新增標籤',
    clear: '清除標籤'
  },
  treeMenu: {
    openActions: '開啟 {label} 的操作'
  },
  progress: {
    ariaLabel: '進度',
    loading: '載入中'
  },
  alert: {
    close: '關閉提示'
  },
  anchor: {
    nav: '錨點導覽'
  },
  breadcrumb: {
    nav: '麵包屑'
  },
  stepper: {
    step: '第 {step} 步',
    ariaLabel: '分步進度',
    stepOf: '第 {current} 步，共 {total} 步'
  },
  editable: {
    cancel: '取消',
    edit: '編輯',
    submit: '提交'
  },
  combobox: {
    clear: '清除',
    clearInput: '清除輸入',
    noResults: '無符合結果。',
    search: '搜尋',
    options: '選項'
  },
  autocomplete: {
    toggleSuggestions: '切換建議清單',
    clearInput: '清除輸入',
    noResults: '無符合結果。',
    options: '選項'
  },
  command: {
    noResults: '無符合結果。'
  },
  select: {
    clear: '清除'
  },
  dialog: {
    cancel: '取消',
    confirm: '確認',
    fullscreen: '全螢幕',
    exitFullscreen: '結束全螢幕',
    close: '關閉'
  },
  rating: {
    ariaLabel: '評分',
    starN: '{count}/{max} 星',
    empty: '未評分'
  },
  slider: {
    valueN: '第 {index} 個值，共 {total} 個',
    minimum: '最小值',
    maximum: '最大值'
  },
  password: {
    clearInput: '清除輸入',
    showPassword: '顯示密碼',
    hidePassword: '隱藏密碼'
  },
  date: {
    daySegment: '日,',
    monthSegment: '月,',
    yearSegment: '年,',
    hourSegment: '時,',
    minuteSegment: '分,',
    secondSegment: '秒,',
    dayPeriodSegment: '上午/下午,',
    timeZoneSegment: '時區,',
    empty: '空',
    placeholder: {
      year: '年',
      month: '月',
      day: '日',
      time: '––'
    }
  }
};

const zhTW: LocaleRegistry = {
  name: '繁體中文',
  key: 'zh-TW',
  dir: 'ltr',
  messages
};

export default zhTW;
