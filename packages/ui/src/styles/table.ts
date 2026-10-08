// @unocss-include
import { scv } from '@soybeanjs/cva';
import type { VariantProps } from '@soybeanjs/cva';

export const tableVariants = scv({
  slots: {
    root: 'relative overflow-hidden supports-[overflow:clip]:overflow-clip rounded-[--rounded]',
    scroll: 'h-full overflow-auto',
    content: 'min-w-full w-max border-spacing-0',
    header: 'sticky top-0 start-0 z-10 [&>tr:last-child]:border-b-0',
    body: [
      '[&>tr:last-child]:border-b-0',
      '[&>tr:first-child>td:first-child]:rounded-tl-[--rounded] [&>tr:first-child>td:last-child]:rounded-tr-[--rounded]',
      '[&>tr:last-child>td:first-child]:rounded-bl-[--rounded] [&>tr:last-child>td:last-child]:rounded-br-[--rounded]'
    ],
    footer: `font-medium [&>tr:last-child]:border-b-0 [&>tr]:bg-transparent [&>tr]:hover:bg-transparent [&_td]:bg-transparent`,
    row: 'bg-card border-b [&:not([data-empty-row])]:hover:bg-accent transition-colors',
    head: 'box-border bg-muted text-foreground relative font-medium',
    cell: 'box-border data-[fixed]:bg-card',
    fixed: [
      'relative',
      'data-[fixed-last-start]:after:pointer-events-none data-[fixed-last-start]:after:absolute data-[fixed-last-start]:after:bottom-0 data-[fixed-last-start]:after:end-0 data-[fixed-last-start]:after:top-0 data-[fixed-last-start]:after:w-4 data-[fixed-last-start]:after:bg-gradient-to-l data-[fixed-last-start]:after:from-foreground/8 data-[fixed-last-start]:after:to-transparent data-[fixed-last-start]:after:content-empty',
      'data-[fixed-first-end]:before:pointer-events-none data-[fixed-first-end]:before:absolute data-[fixed-first-end]:before:bottom-0 data-[fixed-first-end]:before:start-0 data-[fixed-first-end]:before:top-0 data-[fixed-first-end]:before:w-4 data-[fixed-first-end]:before:bg-gradient-to-r data-[fixed-first-end]:before:from-foreground/8 data-[fixed-first-end]:before:to-transparent data-[fixed-first-end]:before:content-empty'
    ],
    resizeHandle: [
      'absolute end-0 top-1/2 h-2/3 -translate-y-1/2 rounded-xs bg-transparent',
      'cursor-col-resize border-none touch-none select-none',
      'after:bg-border hover:after:bg-primary data-[resizing]:after:bg-primary focus-visible:after:bg-primary',
      'outline-none focus-visible:ring-ring/40 focus-visible:ring-2',
      'after:absolute after:bottom-0 after:end-0 after:top-0 after:w-px after:rounded-full after:content-empty'
    ],
    treeCell: 'flex min-w-0 items-center',
    treeToggle: '',
    treeTogglePlaceholder: 'inline-block shrink-0',
    sortTrigger: 'absolute top-1/2 -translate-y-1/2 data-[sorted]:text-primary',
    filterTrigger: 'absolute top-1/2 -translate-y-1/2 data-[filtered]:text-primary',
    filterInput: '',
    filterPopup: '',
    filterSearch: '',
    filterOptions: 'flex flex-col overflow-auto',
    filterOption: 'w-full rounded-md hover:bg-accent',
    filterOptionLabel: 'min-w-0 flex-1 truncate',
    filterFooter: 'flex items-center justify-between border-t border-border',
    filterCount: 'text-muted-foreground',
    filterAction: [
      'font-medium text-primary rounded-md border-none bg-transparent',
      'transition-colors hover:bg-accent focus-visible:ring-ring outline-none focus-visible:ring-2'
    ],
    filterEmpty: 'text-muted-foreground text-center',
    selection: 'text-foreground',
    radioRoot: [
      'peer relative shrink-0 rounded-full border border-solid shadow cursor-pointer transition-all-150',
      'border-primary focus-visible:ring-primary/30',
      'outline-none focus-visible:ring-3 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-50'
    ],
    radioIndicator: `absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 size-1/2 bg-primary rounded-full`
  },
  variants: {
    size: {
      xs: {
        root: 'text-2xs',
        head: 'p-1.5',
        cell: 'p-1.5',
        treeCell: 'gap-0.5',
        treeTogglePlaceholder: 'size-4',
        radioRoot: 'w-3 h-3',
        sortTrigger: 'end-1 p-0.75',
        resizeHandle: 'w-2',
        filterAction: 'text-3xs px-1.5 py-0.5',
        filterTrigger: 'end-1',
        filterPopup: 'p-1.5',
        filterOptions: 'max-h-50 gap-0.75 py-1.5',
        filterOption: 'p-0.75',
        filterFooter: 'pt-1',
        filterCount: 'text-3xs leading-4',
        filterEmpty: 'text-3xs py-4'
      },
      sm: {
        root: 'text-xs',
        head: 'p-1.75',
        cell: 'p-1.75',
        treeCell: 'gap-0.75',
        treeTogglePlaceholder: 'size-5',
        radioRoot: 'w-3.5 h-3.5',
        sortTrigger: 'end-1.25 p-0.875',
        resizeHandle: 'w-2.5',
        filterAction: 'text-2xs px-1.75 py-0.75',
        filterTrigger: 'end-1.25',
        filterPopup: 'p-1.75',
        filterOptions: 'max-h-55 gap-0.875 py-2',
        filterOption: 'p-0.875',
        filterFooter: 'pt-1.25',
        filterCount: 'text-2xs leading-5',
        filterEmpty: 'text-2xs py-5'
      },
      md: {
        root: 'text-sm',
        head: 'p-2',
        cell: 'p-2',
        treeCell: 'gap-1',
        treeTogglePlaceholder: 'size-6',
        radioRoot: 'w-4 h-4',
        sortTrigger: 'end-1.5 p-1',
        resizeHandle: 'w-3',
        filterAction: 'text-xs px-2 py-1',
        filterTrigger: 'end-1.5',
        filterPopup: 'p-2',
        filterOptions: 'max-h-60 gap-1 py-2.5',
        filterOption: 'p-1',
        filterFooter: 'pt-1.5',
        filterCount: 'text-xs leading-6',
        filterEmpty: 'text-xs py-6'
      },
      lg: {
        root: 'text-base',
        head: 'p-2.5',
        cell: 'p-2.5',
        treeCell: 'gap-1.25',
        treeTogglePlaceholder: 'size-7',
        radioRoot: 'w-4.5 h-4.5',
        sortTrigger: 'end-1.75 p-1.25',
        resizeHandle: 'w-3.5',
        filterAction: 'text-sm px-2.25 py-1.25',
        filterTrigger: 'end-1.75',
        filterPopup: 'p-2.5',
        filterOptions: 'max-h-65 gap-1.25 py-3',
        filterOption: 'p-1.25',
        filterFooter: 'pt-1.75',
        filterCount: 'text-sm leading-7',
        filterEmpty: 'text-sm py-7'
      },
      xl: {
        root: 'text-lg',
        head: 'p-3',
        cell: 'p-3',
        treeCell: 'gap-1.5',
        treeTogglePlaceholder: 'size-8',
        radioRoot: 'w-5 h-5',
        sortTrigger: 'end-2 p-1.5',
        resizeHandle: 'w-4',
        filterAction: 'text-base px-2.5 py-1.5',
        filterTrigger: 'end-2',
        filterPopup: 'p-3',
        filterOptions: 'max-h-70 gap-1.5 py-3.5',
        filterOption: 'p-1.5',
        filterFooter: 'pt-2',
        filterCount: 'text-base leading-8',
        filterEmpty: 'text-base py-8'
      },
      '2xl': {
        root: 'text-xl',
        head: 'p-3.5',
        cell: 'p-3.5',
        treeCell: 'gap-2',
        treeTogglePlaceholder: 'size-10',
        radioRoot: 'w-6 h-6',
        resizeHandle: 'w-4.5',
        sortTrigger: 'end-2.5 p-1.75',
        filterAction: 'text-lg px-3 py-2',
        filterTrigger: 'end-2.5',
        filterPopup: 'p-3.5',
        filterOptions: 'max-h-75 gap-1.75 py-4',
        filterOption: 'p-1.75',
        filterFooter: 'pt-2.5',
        filterCount: 'text-lg leading-9',
        filterEmpty: 'text-lg py-9'
      }
    },
    variant: {
      default: {
        root: 'bg-muted'
      },
      simple: {
        header: [
          '[&>tr:first-child>th:first-child]:rounded-tl-[--rounded] [&>tr:first-child>th:last-child]:rounded-tr-[--rounded]',
          '[&>tr:last-child>th:first-child]:rounded-bl-[--rounded] [&>tr:last-child>th:last-child]:rounded-br-[--rounded]'
        ]
      }
    },
    bordered: {
      true: {
        cell: 'border-s border-border first:border-s-0'
      }
    },
    rounded: {
      true: {
        root: ''
      },
      false: {
        root: '[--rounded:--radius]'
      }
    },
    striped: {
      true: {
        // 洗色而非实心 `muted`：`muted` 与行 hover 的 `accent` 同档（docs/design/theme.md §3.2），
        // 实心斑马纹会让偶数行的 hover 与静止面同色、失去反馈
        row: 'data-[row]:even:bg-muted/40'
      }
    }
  },
  compoundVariants: [
    {
      size: 'xs',
      rounded: true,
      class: {
        root: '[--rounded:0.75rem]'
      }
    },
    {
      size: 'sm',
      rounded: true,
      class: {
        root: '[--rounded:1rem]'
      }
    },
    {
      size: 'md',
      rounded: true,
      class: {
        root: '[--rounded:1.125rem]'
      }
    },
    {
      size: 'lg',
      rounded: true,
      class: {
        root: '[--rounded:1.375rem]'
      }
    },
    {
      size: 'xl',
      rounded: true,
      class: {
        root: '[--rounded:1.625rem]'
      }
    },
    {
      size: '2xl',
      rounded: true,
      class: {
        root: '[--rounded:1.75rem]'
      }
    },
    {
      size: 'xs',
      variant: 'default',
      class: {
        root: 'px-0.75 pb-0.75'
      }
    },
    {
      size: 'sm',
      variant: 'default',
      class: {
        root: 'px-0.875 pb-0.875'
      }
    },
    {
      size: 'md',
      variant: 'default',
      class: {
        root: 'px-1 pb-1'
      }
    },
    {
      size: 'lg',
      variant: 'default',
      class: {
        root: 'px-1.25 pb-1.25'
      }
    },
    {
      size: 'xl',
      variant: 'default',
      class: {
        root: 'px-1.5 pb-1.5'
      }
    },
    {
      size: '2xl',
      variant: 'default',
      class: {
        root: 'px-2 pb-2'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    variant: 'default',
    bordered: false,
    rounded: false,
    striped: false
  }
});

type TableVariantProps = VariantProps<typeof tableVariants>;

export type TableVariant = NonNullable<TableVariantProps['variant']>;
