import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'İlk sayfa',
    prevPage: 'Önceki sayfa',
    nextPage: 'Sonraki sayfa',
    lastPage: 'Son sayfa',
    pageLabel: 'Sayfa {value}'
  },
  pageTabs: {
    closeTab: 'Sekmeyi kapat',
    pinTab: 'Sekmeyi sabitle',
    unpinTab: 'Sekmeyi sabitlemeyi kaldır'
  },
  table: {
    emptyTitle: 'Veri yok',
    emptyDescription: 'Gösterilecek veri yok.',
    selectAllRows: 'Tüm satırları seç',
    sortByColumn: '{column} sütununa göre sırala',
    sortByColumnAsc: '{column} sütununa göre sırala, şu anda artan',
    sortByColumnDesc: '{column} sütununa göre sırala, şu anda azalan',
    resizeColumn: '{column} sütununu yeniden boyutlandır',
    expandRow: '{row} satırını genişlet',
    collapseRow: '{row} satırını daralt',
    selectRow: '{row} satırını seç',
    filterSelected: '{count} seçildi',
    filterKeywordActive: 'Anahtar kelime aktif',
    filterOptionsCount: '{count} seçenek',
    filterNoOptions: 'Filtre seçeneği yok',
    filterEdit: '{column} için filtreyi düzenle',
    filter: '{column} filtresi',
    filterSearch: '{column} için filtre seçeneklerini ara',
    filterNoMatching: 'Eşleşen seçenek yok',
    filterClear: 'Temizle',
    filterSelect: '{label} seç',
    filterSearchPlaceholder: '{column} ara'
  },
  calendar: {
    prevPage: 'Önceki sayfa',
    nextPage: 'Sonraki sayfa',
    selectMonth: 'Ay seç',
    selectYear: 'Yıl seç'
  },
  datePicker: {
    toggle: 'Takvimi aç',
    popupLabel: 'Tarih seç'
  },
  dateRangePicker: {
    toggle: 'Takvimi aç',
    popupLabel: 'Tarih aralığı seç'
  },
  carousel: {
    previous: 'Önceki slayt',
    next: 'Sonraki slayt',
    ariaLabel: 'Karusel'
  },
  cascader: {
    clear: 'Temizle',
    noResults: 'Veri yok',
    removeTag: '{label} kaldır',
    search: 'Ara'
  },
  clipboard: {
    copy: 'Kopyala',
    copied: 'Kopyalandı'
  },
  layout: {
    toggleSidebar: 'Yan çubuğu aç veya kapat'
  },
  input: {
    clear: 'Girdiyi temizle'
  },
  inputNumber: {
    increment: 'Artır',
    decrement: 'Azalt',
    clear: 'Değeri temizle'
  },
  textarea: {
    clear: 'Metin alanını temizle'
  },
  tag: {
    remove: '{label} kaldır'
  },
  tagsInput: {
    addTag: 'Etiket ekle',
    clear: 'Etiketleri temizle'
  },
  treeMenu: {
    openActions: '{label} işlemlerini aç'
  },
  progress: {
    ariaLabel: 'İlerleme',
    loading: 'Yükleniyor'
  },
  alert: {
    close: 'Uyarıyı kapat'
  },
  anchor: {
    nav: 'Çapa gezinmesi'
  },
  breadcrumb: {
    nav: 'Gezinti yolu'
  },
  stepper: {
    step: 'Adım {step}',
    ariaLabel: 'Adım adım ilerleme',
    stepOf: 'Adım {current} / {total}'
  },
  editable: {
    cancel: 'İptal',
    edit: 'Düzenle',
    submit: 'Kaydet'
  },
  combobox: {
    clear: 'Temizle',
    clearInput: 'Girdiyi temizle',
    noResults: 'Sonuç bulunamadı.',
    search: 'Ara',
    options: 'Seçenekler'
  },
  autocomplete: {
    toggleSuggestions: 'Önerileri aç veya kapat',
    clearInput: 'Girdiyi temizle',
    noResults: 'Sonuç bulunamadı.',
    options: 'Seçenekler'
  },
  command: {
    noResults: 'Sonuç bulunamadı.'
  },
  select: {
    clear: 'Temizle'
  },
  dialog: {
    cancel: 'İptal',
    confirm: 'Onayla',
    fullscreen: 'Tam ekran',
    exitFullscreen: 'Tam ekrandan çık',
    close: 'Kapat'
  },
  rating: {
    ariaLabel: 'Derecelendirme',
    starN: '{max} yıldızdan {count}',
    empty: 'Derecelendirme yok'
  },
  slider: {
    valueN: '{total} değerden {index}. değer',
    minimum: 'Minimum',
    maximum: 'Maksimum'
  },
  password: {
    clearInput: 'Girdiyi temizle',
    showPassword: 'Parolayı göster',
    hidePassword: 'Parolayı gizle'
  },
  date: {
    daySegment: 'gün,',
    monthSegment: 'ay,',
    yearSegment: 'yıl,',
    hourSegment: 'saat,',
    minuteSegment: 'dakika,',
    secondSegment: 'saniye,',
    dayPeriodSegment: 'ÖÖ/ÖS,',
    timeZoneSegment: 'saat dilimi,',
    empty: 'Boş',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const tr: LocaleRegistry = {
  name: 'Türkçe',
  key: 'tr',
  dir: 'ltr',
  messages
};

export default tr;
