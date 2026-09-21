import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'الصفحة الأولى',
    prevPage: 'الصفحة السابقة',
    nextPage: 'الصفحة التالية',
    lastPage: 'الصفحة الأخيرة',
    pageLabel: 'صفحة {value}'
  },
  pageTabs: {
    closeTab: 'إغلاق التبويب',
    pinTab: 'تثبيت التبويب',
    unpinTab: 'إلغاء تثبيت التبويب'
  },
  table: {
    emptyTitle: 'لا توجد بيانات',
    emptyDescription: 'لا توجد بيانات لعرضها.',
    selectAllRows: 'تحديد جميع الصفوف',
    sortByColumn: 'فرز حسب {column}',
    sortByColumnAsc: 'فرز حسب {column}، تصاعديًا حاليًا',
    sortByColumnDesc: 'فرز حسب {column}، تنازليًا حاليًا',
    resizeColumn: 'تغيير عرض عمود {column}',
    expandRow: 'توسيع الصف {row}',
    collapseRow: 'طي الصف {row}',
    selectRow: 'تحديد الصف {row}',
    filterSelected: 'تم تحديد {count}',
    filterKeywordActive: 'الكلمة الأساسية نشطة',
    filterOptionsCount: '{count} خيارات',
    filterNoOptions: 'لا توجد خيارات تصفية',
    filterEdit: 'تعديل الفلتر لـ {column}',
    filter: 'تصفية {column}',
    filterSearch: 'البحث عن خيارات التصفية لـ {column}',
    filterNoMatching: 'لا توجد خيارات مطابقة',
    filterClear: 'مسح',
    filterSelect: 'تحديد {label}',
    filterSearchPlaceholder: 'البحث في {column}'
  },
  calendar: {
    prevPage: 'الصفحة السابقة',
    nextPage: 'الصفحة التالية',
    selectMonth: 'اختر الشهر',
    selectYear: 'اختر السنة'
  },
  datePicker: {
    toggle: 'فتح التقويم',
    popupLabel: 'اختر التاريخ'
  },
  dateRangePicker: {
    toggle: 'فتح التقويم',
    popupLabel: 'اختر نطاق التاريخ'
  },
  carousel: {
    previous: 'الشريحة السابقة',
    next: 'الشريحة التالية',
    ariaLabel: 'عرض شرائح'
  },
  cascader: {
    clear: 'مسح',
    noResults: 'لا توجد بيانات',
    removeTag: 'إزالة {label}',
    search: 'بحث'
  },
  clipboard: {
    copy: 'نسخ',
    copied: 'تم النسخ'
  },
  layout: {
    toggleSidebar: 'تبديل الشريط الجانبي'
  },
  input: {
    clear: 'مسح الإدخال'
  },
  inputNumber: {
    increment: 'زيادة',
    decrement: 'إنقاص',
    clear: 'مسح القيمة'
  },
  textarea: {
    clear: 'مسح النص'
  },
  tag: {
    remove: 'إزالة {label}'
  },
  tagsInput: {
    addTag: 'إضافة وسم',
    clear: 'مسح الوسوم'
  },
  treeMenu: {
    openActions: 'فتح إجراءات {label}'
  },
  progress: {
    ariaLabel: 'التقدم',
    loading: 'جارٍ التحميل'
  },
  alert: {
    close: 'إغلاق التنبيه'
  },
  anchor: {
    nav: 'المرساة'
  },
  breadcrumb: {
    nav: 'مسار التنقل'
  },
  stepper: {
    step: 'الخطوة {step}',
    ariaLabel: 'التقدم خطوة بخطوة',
    stepOf: 'الخطوة {current} من {total}'
  },
  editable: {
    cancel: 'إلغاء',
    edit: 'تحرير',
    submit: 'إرسال'
  },
  combobox: {
    clear: 'مسح',
    clearInput: 'مسح الإدخال',
    noResults: 'لم يتم العثور على نتائج.',
    search: 'بحث',
    options: 'الخيارات'
  },
  autocomplete: {
    toggleSuggestions: 'تبديل الاقتراحات',
    clearInput: 'مسح الإدخال',
    noResults: 'لم يتم العثور على نتائج.',
    options: 'الخيارات'
  },
  command: {
    noResults: 'لم يتم العثور على نتائج.'
  },
  select: {
    clear: 'مسح'
  },
  dialog: {
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    fullscreen: 'ملء الشاشة',
    exitFullscreen: 'الخروج من ملء الشاشة',
    close: 'إغلاق'
  },
  rating: {
    ariaLabel: 'التقييم',
    starN: '{count} من {max} نجوم',
    empty: 'بدون تقييم'
  },
  slider: {
    valueN: 'القيمة {index} من {total}',
    minimum: 'الحد الأدنى',
    maximum: 'الحد الأقصى'
  },
  password: {
    clearInput: 'مسح الإدخال',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور'
  },
  date: {
    daySegment: 'اليوم، ',
    monthSegment: 'الشهر، ',
    yearSegment: 'السنة، ',
    hourSegment: 'الساعة، ',
    minuteSegment: 'الدقيقة، ',
    secondSegment: 'الثانية، ',
    dayPeriodSegment: 'ص/م، ',
    timeZoneSegment: 'المنطقة الزمنية، ',
    empty: 'فارغ',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const ar: LocaleRegistry = {
  name: 'العربية',
  key: 'ar',
  dir: 'rtl',
  messages
};

export default ar;
