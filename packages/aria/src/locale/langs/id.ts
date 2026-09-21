import type { LocaleMessages, LocaleRegistry } from '../types';

const messages: LocaleMessages = {
  pagination: {
    firstPage: 'Halaman pertama',
    prevPage: 'Halaman sebelumnya',
    nextPage: 'Halaman berikutnya',
    lastPage: 'Halaman terakhir',
    pageLabel: 'Halaman {value}'
  },
  pageTabs: {
    closeTab: 'Tutup tab',
    pinTab: 'Sematkan tab',
    unpinTab: 'Lepas sematan tab'
  },
  table: {
    emptyTitle: 'Tidak ada data',
    emptyDescription: 'Tidak ada data yang dapat ditampilkan.',
    selectAllRows: 'Pilih semua baris',
    sortByColumn: 'Urutkan berdasarkan {column}',
    sortByColumnAsc: 'Urutkan berdasarkan {column}, saat ini menaik',
    sortByColumnDesc: 'Urutkan berdasarkan {column}, saat ini menurun',
    resizeColumn: 'Ubah ukuran kolom {column}',
    expandRow: 'Buka baris {row}',
    collapseRow: 'Tutup baris {row}',
    selectRow: 'Pilih baris {row}',
    filterSelected: '{count} dipilih',
    filterKeywordActive: 'Kata kunci aktif',
    filterOptionsCount: '{count} opsi',
    filterNoOptions: 'Tidak ada opsi filter',
    filterEdit: 'Edit filter untuk {column}',
    filter: 'Filter {column}',
    filterSearch: 'Cari opsi filter untuk {column}',
    filterNoMatching: 'Tidak ada opsi yang cocok',
    filterClear: 'Bersihkan',
    filterSelect: 'Pilih {label}',
    filterSearchPlaceholder: 'Cari {column}'
  },
  calendar: {
    prevPage: 'Halaman sebelumnya',
    nextPage: 'Halaman berikutnya',
    selectMonth: 'Pilih bulan',
    selectYear: 'Pilih tahun'
  },
  datePicker: {
    toggle: 'Buka kalender',
    popupLabel: 'Pilih tanggal'
  },
  dateRangePicker: {
    toggle: 'Buka kalender',
    popupLabel: 'Pilih rentang tanggal'
  },
  carousel: {
    previous: 'Slide sebelumnya',
    next: 'Slide berikutnya',
    ariaLabel: 'Korsel'
  },
  cascader: {
    clear: 'Hapus',
    noResults: 'Tidak ada data',
    removeTag: 'Hapus {label}',
    search: 'Cari'
  },
  clipboard: {
    copy: 'Salin',
    copied: 'Disalin'
  },
  layout: {
    toggleSidebar: 'Alihkan bilah sisi'
  },
  input: {
    clear: 'Hapus input'
  },
  inputNumber: {
    increment: 'Naikkan',
    decrement: 'Turunkan',
    clear: 'Hapus nilai'
  },
  textarea: {
    clear: 'Hapus area teks'
  },
  tag: {
    remove: 'Hapus {label}'
  },
  tagsInput: {
    addTag: 'Tambahkan tag',
    clear: 'Hapus tag'
  },
  treeMenu: {
    openActions: 'Buka tindakan {label}'
  },
  progress: {
    ariaLabel: 'Progres',
    loading: 'Memuat'
  },
  alert: {
    close: 'Tutup alerta'
  },
  anchor: {
    nav: 'Navigasi jangkar'
  },
  breadcrumb: {
    nav: 'Breadcrumb'
  },
  stepper: {
    step: 'Langkah {step}',
    ariaLabel: 'Progres langkah',
    stepOf: 'Langkah {current} dari {total}'
  },
  editable: {
    cancel: 'Batal',
    edit: 'Edit',
    submit: 'Simpan'
  },
  combobox: {
    clear: 'Hapus',
    clearInput: 'Hapus input',
    noResults: 'Tidak ada hasil.',
    search: 'Cari',
    options: 'Opsi'
  },
  autocomplete: {
    toggleSuggestions: 'Alihkan saran',
    clearInput: 'Hapus input',
    noResults: 'Tidak ada hasil.',
    options: 'Opsi'
  },
  command: {
    noResults: 'Tidak ada hasil.'
  },
  select: {
    clear: 'Hapus'
  },
  dialog: {
    cancel: 'Batal',
    confirm: 'Konfirmasi',
    fullscreen: 'Layar penuh',
    exitFullscreen: 'Keluar dari layar penuh',
    close: 'Tutup'
  },
  rating: {
    ariaLabel: 'Rating',
    starN: '{count} dari {max} bintang',
    empty: 'Belum dinilai'
  },
  slider: {
    valueN: 'Nilai {index} dari {total}',
    minimum: 'Minimum',
    maximum: 'Maksimum'
  },
  password: {
    clearInput: 'Hapus input',
    showPassword: 'Tampilkan kata sandi',
    hidePassword: 'Sembunyikan kata sandi'
  },
  date: {
    daySegment: 'hari,',
    monthSegment: 'bulan,',
    yearSegment: 'tahun,',
    hourSegment: 'jam,',
    minuteSegment: 'menit,',
    secondSegment: 'detik,',
    dayPeriodSegment: 'AM/PM,',
    timeZoneSegment: 'zona waktu,',
    empty: 'Kosong',
    placeholder: {
      year: 'yyyy',
      month: 'mm',
      day: 'dd',
      time: '––'
    }
  }
};

const id: LocaleRegistry = {
  name: 'Bahasa Indonesia',
  key: 'id',
  dir: 'ltr',
  messages
};

export default id;
