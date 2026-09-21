import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: '첫 페이지',
    prevPage: '이전 페이지',
    nextPage: '다음 페이지',
    lastPage: '마지막 페이지',
    pageLabel: '{value}페이지'
  },
  pageTabs: {
    closeTab: '탭 닫기',
    pinTab: '탭 고정',
    unpinTab: '탭 고정 해제'
  },
  table: {
    emptyTitle: '데이터 없음',
    emptyDescription: '표시할 데이터가 없습니다.',
    selectAllRows: '모든 행 선택',
    sortByColumn: '{column} 기준 정렬',
    sortByColumnAsc: '{column} 기준 정렬, 현재 오름차순',
    sortByColumnDesc: '{column} 기준 정렬, 현재 내림차순',
    resizeColumn: '{column} 열 크기 조정',
    expandRow: '{row}행 펼치기',
    collapseRow: '{row}행 접기',
    selectRow: '{row}행 선택',
    filterSelected: '{count}개 선택됨',
    filterKeywordActive: '키워드 활성화',
    filterOptionsCount: '옵션 {count}개',
    filterNoOptions: '필터 옵션 없음',
    filterEdit: '{column} 필터 편집',
    filter: '{column} 필터',
    filterSearch: '{column} 필터 옵션 검색',
    filterNoMatching: '일치하는 옵션 없음',
    filterClear: '지우기',
    filterSelect: '{label} 선택',
    filterSearchPlaceholder: '{column} 검색'
  },
  calendar: {
    prevPage: '이전 페이지',
    nextPage: '다음 페이지',
    selectMonth: '월 선택',
    selectYear: '연도 선택'
  },
  datePicker: {
    toggle: '달력 열기',
    popupLabel: '날짜 선택'
  },
  dateRangePicker: {
    toggle: '달력 열기',
    popupLabel: '날짜 범위 선택'
  },
  carousel: {
    previous: '이전 슬라이드',
    next: '다음 슬라이드',
    ariaLabel: '캐러셀'
  },
  cascader: {
    clear: '지우기',
    noResults: '데이터 없음',
    removeTag: '{label} 제거',
    search: '검색'
  },
  clipboard: {
    copy: '복사',
    copied: '복사됨'
  },
  layout: {
    toggleSidebar: '사이드바 토글'
  },
  input: {
    clear: '입력 지우기'
  },
  inputNumber: {
    increment: '증가',
    decrement: '감소',
    clear: '값 지우기'
  },
  textarea: {
    clear: '텍스트 영역 지우기'
  },
  tag: {
    remove: '{label} 제거'
  },
  tagsInput: {
    addTag: '태그 추가',
    clear: '태그 지우기'
  },
  treeMenu: {
    openActions: '{label} 작업 열기'
  },
  progress: {
    ariaLabel: '진행',
    loading: '로딩 중'
  },
  alert: {
    close: '알림 닫기'
  },
  anchor: {
    nav: '앵커 탐색'
  },
  breadcrumb: {
    nav: '이동 경로'
  },
  stepper: {
    step: '단계 {step}',
    ariaLabel: '단계 진행 상황',
    stepOf: '단계 {current} / {total}'
  },
  editable: {
    cancel: '취소',
    edit: '편집',
    submit: '저장'
  },
  combobox: {
    clear: '지우기',
    clearInput: '입력 지우기',
    noResults: '결과가 없습니다.',
    search: '검색',
    options: '옵션'
  },
  autocomplete: {
    toggleSuggestions: '추천 목록 전환',
    clearInput: '입력 지우기',
    noResults: '결과가 없습니다.',
    options: '옵션'
  },
  command: {
    noResults: '결과가 없습니다.'
  },
  select: {
    clear: '지우기'
  },
  dialog: {
    cancel: '취소',
    confirm: '확인',
    fullscreen: '전체 화면',
    exitFullscreen: '전체 화면 종료',
    close: '닫기'
  },
  rating: {
    ariaLabel: '평점',
    starN: '{max}개 중 {count}개',
    empty: '평점 없음'
  },
  slider: {
    valueN: '총 {total}개 중 {index}번째 값',
    minimum: '최소',
    maximum: '최대'
  },
  password: {
    clearInput: '입력 지우기',
    showPassword: '비밀번호 표시',
    hidePassword: '비밀번호 숨기기'
  },
  date: {
    daySegment: '일,',
    monthSegment: '월,',
    yearSegment: '년,',
    hourSegment: '시,',
    minuteSegment: '분,',
    secondSegment: '초,',
    dayPeriodSegment: '오전/오후,',
    timeZoneSegment: '시간대,',
    empty: '비어 있음',
    placeholder: {
      year: '년',
      month: '월',
      day: '일',
      time: '––'
    }
  }
};

const ko: LocaleRegistry = {
  name: '한국어',
  key: 'ko',
  dir: 'ltr',
  messages
};

export default ko;
