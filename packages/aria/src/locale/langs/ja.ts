import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: '最初のページ',
    prevPage: '前のページ',
    nextPage: '次のページ',
    lastPage: '最後のページ',
    pageLabel: '{value}ページ'
  },
  pageTabs: {
    closeTab: 'タブを閉じる',
    pinTab: 'タブを固定',
    unpinTab: 'タブの固定を解除'
  },
  table: {
    emptyTitle: 'データなし',
    emptyDescription: '表示できるデータはありません。',
    selectAllRows: 'すべての行を選択',
    sortByColumn: '{column}で並べ替え',
    sortByColumnAsc: '{column}で並べ替え、現在昇順',
    sortByColumnDesc: '{column}で並べ替え、現在降順',
    resizeColumn: '{column}列の幅を変更',
    expandRow: '行 {row} を展開',
    collapseRow: '行 {row} を折りたたむ',
    selectRow: '行 {row} を選択',
    filterSelected: '{count} 件選択中',
    filterKeywordActive: 'キーワードが有効',
    filterOptionsCount: '{count} 件のオプション',
    filterNoOptions: 'フィルターオプションなし',
    filterEdit: '{column} のフィルターを編集',
    filter: '{column} でフィルター',
    filterSearch: '{column} のフィルターオプションを検索',
    filterNoMatching: '一致するオプションなし',
    filterClear: 'クリア',
    filterSelect: '{label} を選択',
    filterSearchPlaceholder: '{column} を検索'
  },
  calendar: {
    prevPage: '前のページ',
    nextPage: '次のページ',
    selectMonth: '月を選択',
    selectYear: '年を選択'
  },
  datePicker: {
    toggle: 'カレンダーを開く',
    popupLabel: '日付を選択'
  },
  dateRangePicker: {
    toggle: 'カレンダーを開く',
    popupLabel: '日付範囲を選択'
  },
  carousel: {
    previous: '前のスライド',
    next: '次のスライド',
    ariaLabel: 'カルーセル'
  },
  cascader: {
    clear: 'クリア',
    noResults: 'データなし',
    removeTag: '{label} を削除',
    search: '検索'
  },
  clipboard: {
    copy: 'コピー',
    copied: 'コピーしました'
  },
  layout: {
    toggleSidebar: 'サイドバーの切り替え'
  },
  input: {
    clear: '入力をクリア'
  },
  inputNumber: {
    increment: '増加',
    decrement: '減少',
    clear: '値をクリア'
  },
  textarea: {
    clear: 'テキストエリアをクリア'
  },
  tag: {
    remove: '{label} を削除'
  },
  tagsInput: {
    addTag: 'タグを追加',
    clear: 'タグをクリア'
  },
  treeMenu: {
    openActions: '{label} の操作を開く'
  },
  progress: {
    ariaLabel: '進捗',
    loading: '読み込み中'
  },
  alert: {
    close: 'アラートを閉じる'
  },
  anchor: {
    nav: 'アンカーナビゲーション'
  },
  breadcrumb: {
    nav: 'パンくずリスト'
  },
  stepper: {
    step: 'ステップ {step}',
    ariaLabel: 'ステップ進行状況',
    stepOf: 'ステップ {current} / {total}'
  },
  editable: {
    cancel: 'キャンセル',
    edit: '編集',
    submit: '保存'
  },
  combobox: {
    clear: 'クリア',
    clearInput: '入力をクリア',
    noResults: '結果が見つかりません。',
    search: '検索',
    options: 'オプション'
  },
  autocomplete: {
    toggleSuggestions: '候補を切り替え',
    clearInput: '入力をクリア',
    noResults: '結果が見つかりません。',
    options: 'オプション'
  },
  command: {
    noResults: '結果が見つかりません。'
  },
  select: {
    clear: 'クリア'
  },
  dialog: {
    cancel: 'キャンセル',
    confirm: '確認',
    fullscreen: '全画面',
    exitFullscreen: '全画面を終了',
    close: '閉じる'
  },
  rating: {
    ariaLabel: '評価',
    starN: '{max} 件中 {count} 件',
    empty: '未評価'
  },
  slider: {
    valueN: '{total} 個中 {index} 番目の値',
    minimum: '最小',
    maximum: '最大'
  },
  password: {
    clearInput: '入力をクリア',
    showPassword: 'パスワードを表示',
    hidePassword: 'パスワードを非表示'
  },
  date: {
    daySegment: '日,',
    monthSegment: '月,',
    yearSegment: '年,',
    hourSegment: '時,',
    minuteSegment: '分,',
    secondSegment: '秒,',
    dayPeriodSegment: '午前/午後,',
    timeZoneSegment: 'タイムゾーン,',
    empty: '空',
    placeholder: {
      year: '年',
      month: '月',
      day: '日',
      time: '––'
    }
  }
};

const ja: LocaleRegistry = {
  name: '日本語',
  key: 'ja',
  dir: 'ltr',
  messages
};

export default ja;
