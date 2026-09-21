// @unocss-include
import { scv } from '@soybeanjs/cva';
import type { VariantProps } from '@soybeanjs/cva';
import type { ThemeSize } from '@/theme';
import { buttonIconVariants } from './button';
import { sheetVariants } from './sheet';

/**
 * The layout's own spacing step, one declaration per size.
 *
 * The root declares it for every region to read; the mobile drawer repeats the
 * declaration because it is teleported out of the root, and a portal is where
 * custom-property inheritance stops.
 */
const layoutSpacing = {
  xs: '[--sl-spacing:0.75rem]',
  sm: '[--sl-spacing:0.875rem]',
  md: '[--sl-spacing:1rem]',
  lg: '[--sl-spacing:1.25rem]',
  xl: '[--sl-spacing:1.5rem]',
  '2xl': '[--sl-spacing:1.75rem]'
} satisfies Record<ThemeSize, string>;

/** Half of `--sl-spacing`: the tighter step of the inset pairs. Declared with the alias, for the same reason. */
const layoutHalfSpacing = '[--sl-half-spacing:calc(var(--sl-spacing)/2)]';

export const layoutVariants = scv({
  extendBase: props => ({
    trigger: buttonIconVariants({ size: props.size }),
    mobileDrawer: sheetVariants({ size: props.size, side: props.side }).popup
  }),
  slots: {
    // --sl-* 是本库的间距/gap 别名(Aria 注入的 --layout-* 保持不变),在 root 上按状态计算,各槽位直接应用
    root: [
      'group/layout relative h-full bg-background transition-all-200',
      layoutHalfSpacing,
      // 起点间距取「侧栏占位」与「末端内嵌」中的较大者。侧栏不占布局流时（移动端是抽屉、
      // 或 sidebarVisible=false）Aria 发布的起点间距已经是 0，各变体随 `max()`
      // 回落到自身的末端间距：sidebar/floating 通栏，inset 前后对称内嵌
      '[--sl-end-gap:0px]',
      '[--sl-main-gap:max(var(--vean-layout-start-gap),var(--sl-end-gap))]',
      '[--sl-header-gap:max(var(--vean-layout-header-start-gap),var(--sl-end-gap))]',
      '[--sl-footer-gap:max(var(--vean-layout-footer-start-gap),var(--sl-end-gap))]'
    ],
    main: 'flex flex-col h-full group-data-[scroll-behavior=wrapper]/layout:overflow-y-auto transition-all-200',
    // `lt-md:hidden` 是首帧兜底：SSR 没有 matchMedia，手机必须先按桌面渲染再由 CSS 藏起来。
    // 但宿主显式要求桌面模式（data-mobile-source=explicit）时兜底必须让位，否则侧栏被藏起来
    // 而布局仍按桌面预留宽度，只剩一条空槽。
    sidebarRoot: 'lt-md:hidden group-data-[mobile-source=explicit]/layout:block',
    sidebarWrapper: [
      `absolute inset-y-0 z-[--vean-layout-sidebar-z-index] flex h-[--vean-layout-sidebar-height] w-[--vean-sidebar-width] transition-[width,opacity]-200 lt-md:hidden group-data-[mobile-source=explicit]/layout:flex`,
      'group-data-[state=collapsed]/layout:w-[--vean-collapsed-sidebar-width] mt-[--vean-layout-sidebar-top-gap] mb-[--vean-layout-sidebar-bottom-gap]',
      // 侧栏没有自己的宽度（split 模式解析不出任何列）时整列都不画：变体的包裹层是
      // 「侧栏宽度 + 一个 spacing」，只把宽度归零仍会留下内边距与卡片的边框/阴影。
      // 状态都在 root 上，这里用 group-data 变体；再链上 mobile=false 是为让这条规则
      // 按特异性压过 `data-mobile-source=explicit` 的 `flex` 兜底，而不是靠工具类顺序
      'group-data-[sidebar-flow=false]/layout:group-data-[mobile=false]/layout:hidden'
    ],
    sidebar: [
      `flex flex-col w-full h-full bg-sidebar`,
      `group-data-[variant=floating]/layout:rounded-lg group-data-[variant=floating]/layout:border group-data-[variant=floating]/layout:border-border group-data-[variant=floating]/layout:border-solid group-data-[variant=floating]/layout:shadow`
    ],
    // 抽屉被传送到 body 之外，root 上的自定义属性不再继承：间距别名与 `--vean-sidebar-width`
    // 一样要在抽屉上重新声明，否则侧栏内容里的 `px-[--sl-spacing]` 会解析为空
    mobileDrawer: ['w-[--vean-sidebar-width] bg-sidebar p-0', layoutHalfSpacing],
    mobileOverlay: [
      // 移动端导航遮罩比模态遮罩更重：同一个 token，用修饰符覆盖浓度
      `fixed inset-0 z-base bg-mask/80`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0`
    ],
    mobile: 'flex flex-col w-full h-full',
    rail: [
      'absolute inset-y-0 z-20 flex w-[--sl-spacing] -translate-x-1/2 rtl:translate-x-1/2 transition-all lt-sm:hidden group-data-[mobile-source=explicit]/layout:flex',
      'after:absolute after:inset-y-0 after:start-1/2 after:content-empty after:w-[calc(var(--sl-spacing)/8)] hover:after:bg-sidebar-border'
    ],
    trigger: '',
    header: [
      'shrink-0 flex items-center h-[--vean-layout-header-height] bg-card transition-all-200',
      'group-data-[fixed-top=true]/layout:absolute z-[--vean-layout-header-z-index] top-0 inset-x-0'
    ],
    headerPlaceholder: 'shrink-0 h-[--vean-layout-header-height] overflow-hidden',
    tab: [
      'group-data-[fixed-top=true]/layout:absolute inset-x-0 top-[--vean-layout-header-height] shrink-0 h-[--vean-layout-tab-height] bg-card z-[--vean-layout-tab-z-index] transition-all-200',
      // 头部隐藏后顶部那条 header 带子不存在（区域与占位符都不渲染），fixed tab 必须顶到布局顶部：
      // 继续按 header 高度偏移会让它和自己的占位符错位，并在顶上留一条空白带
      'group-data-[header-visible=false]/layout:top-0'
    ],
    tabPlaceholder: 'shrink-0 h-[--vean-layout-tab-height] overflow-hidden',
    content: `relative grow bg-card group-data-[scroll-behavior=content]/layout:overflow-y-auto`,
    footer: [
      'shrink-0 h-[--vean-layout-footer-height] bg-card transition-all-200',
      'group-data-[fixed-footer=true]/layout:absolute z-[--vean-layout-footer-z-index] inset-x-0 bottom-0'
    ],
    footerPlaceholder: 'shrink-0 h-[--vean-layout-footer-height] overflow-hidden'
  },
  variants: {
    size: {
      xs: {
        root: `text-2xs ${layoutSpacing.xs}`,
        mobileDrawer: layoutSpacing.xs
      },
      sm: {
        root: `text-xs ${layoutSpacing.sm}`,
        mobileDrawer: layoutSpacing.sm
      },
      md: {
        root: `text-sm ${layoutSpacing.md}`,
        mobileDrawer: layoutSpacing.md
      },
      lg: {
        root: `text-base ${layoutSpacing.lg}`,
        mobileDrawer: layoutSpacing.lg
      },
      xl: {
        root: `text-lg ${layoutSpacing.xl}`,
        mobileDrawer: layoutSpacing.xl
      },
      '2xl': {
        root: `text-xl ${layoutSpacing['2xl']}`,
        mobileDrawer: layoutSpacing['2xl']
      }
    },
    side: {
      left: {
        main: ['ms-[var(--sl-main-gap)]', 'me-[var(--sl-end-gap)]'],
        sidebarWrapper: 'start-0 border-e',
        rail: 'cursor-w-resize group-data-[state=collapsed]/layout:cursor-e-resize -end-[var(--sl-spacing)]',
        header: ['group-data-[fixed-top=true]/layout:ms-[var(--sl-header-gap)]', 'me-[var(--sl-end-gap)]'],
        tab: [
          'group-data-[full-content=false]/layout:group-data-[fixed-top=true]/layout:ms-[var(--sl-main-gap)]',
          'group-data-[full-content=false]/layout:group-data-[fixed-top=true]/layout:me-[var(--sl-end-gap)]'
        ],
        footer: [
          'group-data-[fixed-footer=true]/layout:ms-[var(--sl-footer-gap)]',
          'group-data-[fixed-footer=true]/layout:me-[var(--sl-end-gap)]'
        ]
      },
      right: {
        main: ['me-[var(--sl-main-gap)]', 'ms-[var(--sl-end-gap)]'],
        sidebarWrapper: 'end-0 border-s',
        rail: 'cursor-e-resize group-data-[state=collapsed]/layout:cursor-w-resize start-0',
        header: ['group-data-[fixed-top=true]/layout:me-[var(--sl-header-gap)]', 'ms-[var(--sl-end-gap)]'],
        tab: [
          'group-data-[full-content=false]/layout:group-data-[fixed-top=true]/layout:me-[var(--sl-main-gap)]',
          'group-data-[full-content=false]/layout:group-data-[fixed-top=true]/layout:ms-[var(--sl-end-gap)]'
        ],
        footer: [
          'group-data-[fixed-footer=true]/layout:me-[var(--sl-footer-gap)]',
          'group-data-[fixed-footer=true]/layout:ms-[var(--sl-end-gap)]'
        ]
      }
    },
    variant: {
      sidebar: {
        sidebarGapHandler: 'group-data-[collapsible=icon]/layout:w-[--vean-collapsed-sidebar-width]',
        sidebarWrapper: `group-data-[collapsible=icon]/layout:w-[--vean-collapsed-sidebar-width] group-data-[side=left]/layout:border-e group-data-[side=right]/layout:border-s`
      },
      floating: {
        root: [
          // 以下间距都在侧栏宽度之外再加一个 spacing，属于「侧栏包裹层比侧栏宽」的桌面补偿：
          // 只有桌面端且侧栏确实有自己的列（data-sidebar-flow=true）时才成立。移动端抽屉、
          // sidebarVisible=false 以及解析不出列的 split 侧栏都由 root 上的 max() 兜底规则接管
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[state=expanded]:[--sl-main-gap:calc(var(--vean-layout-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[state=expanded]:[--sl-footer-gap:calc(var(--vean-layout-footer-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[collapsible=icon]:[--sl-main-gap:calc(var(--vean-layout-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[collapsible=icon]:[--sl-footer-gap:calc(var(--vean-layout-footer-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[state=expanded]:data-[orientation=horizontal]:[--sl-header-gap:calc(var(--vean-layout-header-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[collapsible=icon]:data-[orientation=horizontal]:[--sl-header-gap:calc(var(--vean-layout-header-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[orientation=vertical]:data-[stretch-footer=true]:[--sl-footer-gap:0px]'
        ],
        sidebarGapHandler: `w-[calc(var(--vean-sidebar-width)+var(--sl-spacing))] group-data-[collapsible=icon]/layout:group-data-[state=collapsed]/layout:w-[calc(var(--vean-collapsed-sidebar-width)+var(--sl-spacing))]`,
        sidebarWrapper: `w-[calc(var(--vean-sidebar-width)+var(--sl-spacing))] p-[--sl-half-spacing] group-data-[collapsible=icon]/layout:group-data-[state=collapsed]/layout:w-[calc(var(--vean-collapsed-sidebar-width)+var(--sl-spacing))] bg-card border-e-0`
      },
      inset: {
        root: [
          'py-[--sl-half-spacing] bg-sidebar',
          // data-[variant=inset] 前缀用于保证特异性高于 base 上的默认值；
          // 相同地，间距补偿只在桌面端且侧栏确实有自己的列时成立（见 floating），
          // 没有列时起点间距由 root 的 max() 回落到末端间距（半间距）
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[variant=inset]:[--sl-main-gap:calc(var(--vean-layout-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[variant=inset]:[--sl-footer-gap:calc(var(--vean-layout-footer-start-gap)+var(--sl-spacing))]',
          'data-[mobile=false]:data-[sidebar-flow=true]:data-[variant=inset]:data-[orientation=horizontal]:[--sl-header-gap:calc(var(--vean-layout-header-start-gap)+var(--sl-spacing))]',
          // 垂直方向 header 横跨顶部（侧栏在其下方），本就与布局自身的边缘对齐，无需侧栏补偿
          'data-[mobile=false]:data-[variant=inset]:data-[orientation=vertical]:[--sl-header-gap:var(--sl-half-spacing)]',
          'data-[variant=inset]:[--sl-end-gap:var(--sl-half-spacing)]',
          'data-[mobile=false]:data-[variant=inset]:data-[orientation=vertical]:data-[stretch-footer=true]:[--sl-footer-gap:var(--sl-half-spacing)]'
        ],
        sidebarGapHandler: `w-[calc(var(--vean-sidebar-width)+var(--sl-spacing))] group-data-[collapsible=icon]/layout:group-data-[state=collapsed]/layout:w-[calc(var(--vean-collapsed-sidebar-width)+var(--sl-spacing))]`,
        sidebarWrapper: `p-[--sl-half-spacing] w-[calc(var(--vean-sidebar-width)+var(--sl-spacing))] group-data-[collapsible=icon]/layout:group-data-[state=collapsed]/layout:w-[calc(var(--vean-collapsed-sidebar-width)+var(--sl-spacing))] border-e-0`,
        main: `rounded-xl shadow`,
        header: [
          `top-[--sl-half-spacing] rounded-t-xl`,
          `group-data-[orientation=vertical]/layout:border-0`,
          `group-data-[orientation=vertical]/layout:shadow group-data-[orientation=vertical]/layout:rounded-xl`
        ],
        tab: [
          `top-[calc(var(--vean-layout-header-height)+var(--sl-half-spacing))]`,
          // 同上：头部隐藏时基准高度归零，只保留 inset 自己的半间距；full-content 下
          // tab 走 `fixed top-0`，所以这条覆盖要排除该状态，否则会把 tab 又推下去
          `group-data-[full-content=false]/layout:group-data-[header-visible=false]/layout:top-[--sl-half-spacing]`
        ],
        footer: [
          'bottom-[--sl-half-spacing] rounded-b-xl',
          `group-data-[orientation=vertical]/layout:shadow group-data-[orientation=vertical]/layout:rounded-xl`,
          `group-data-[orientation=vertical]/layout:group-data-[stretch-footer=true]/layout:bottom-[calc(var(--sl-half-spacing)-2px)]`
        ]
      }
    },
    collapsible: {
      offcanvas: {
        sidebarWrapper: 'group-data-[state=collapsed]/layout:opacity-0 group-data-[state=collapsed]/layout:z-0',
        rail: `translate-x-0 after:start-full hover:bg-sidebar`
      },
      icon: {}
    },
    fullContent: {
      true: {
        tab: ['fixed top-0 z-[--vean-layout-base-z-index] rounded-none', 'group-data-[fixed-top=true]/layout:fixed'],
        content: `fixed inset-0 z-[--vean-layout-base-z-index] group-data-[tab-visible=true]/layout:mt-[--vean-layout-tab-height] overflow-auto`
      }
    }
  },
  compoundVariants: [
    {
      side: 'left',
      collapsible: 'offcanvas',
      class: {
        rail: '-end-[--sl-half-spacing]'
      }
    },
    {
      side: 'right',
      collapsible: 'offcanvas',
      class: {
        rail: '-start-[--sl-half-spacing]'
      }
    },
    {
      side: 'left',
      variant: 'inset',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]/layout:end-0'
      }
    },
    {
      side: 'right',
      variant: 'inset',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]/layout:start-0'
      }
    },
    {
      side: 'left',
      variant: 'floating',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]/layout:end-[--sl-half-spacing]'
      }
    },
    {
      side: 'right',
      variant: 'floating',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]/layout:start-[--sl-half-spacing]'
      }
    },
    {
      variant: 'inset',
      collapsible: 'offcanvas',
      class: {
        main: 'md:group-data-[state=collapsed]/layout:ms-[--sl-half-spacing]'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    variant: 'sidebar',
    collapsible: 'icon',
    side: 'left'
  }
});

type LayoutVariants = VariantProps<typeof layoutVariants>;

export type LayoutVariant = NonNullable<LayoutVariants['variant']>;
export type LayoutCollapsible = NonNullable<LayoutVariants['collapsible']>;
export type LayoutSide = NonNullable<LayoutVariants['side']>;
