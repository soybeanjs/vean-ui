/**
 * Scrollbar 样式 preset，参考 `unocss-preset-scrollbar`
 * （https://github.com/unocss-community/unocss-preset-scrollbar）实现。
 *
 * 提供：
 * - shortcuts：`scrollbar` / `scrollbar-rounded` / `scrollbar-thin` / `scrollbar-none`
 * - 伪元素变体：`scrollbar:` / `scrollbar-track:` / `scrollbar-thumb:`，分别映射到
 *   `::-webkit-scrollbar` / `::-webkit-scrollbar-track` / `::-webkit-scrollbar-thumb`
 * - 工具类：`scrollbar-{track|thumb}-color-*`、`scrollbar-{track|thumb}-op-*`、
 *   `scrollbar-{width|height|background-color|border-radius}-*`、
 *   `scrollbar-{w|h|radius|track-radius|thumb-radius}-*`
 *
 * 样式值经宿主元素上的 CSS 变量（默认 `--vean-scrollbar-*`，`varPrefix` 可覆盖）
 * 下发，伪元素通过 `var()` 继承，因此颜色、尺寸均可被单个工具类覆盖。
 * `compatible: true` 时启用标准属性 `scrollbar-color` / `scrollbar-width`（Firefox）；
 * 注意一旦使用 `scrollbar-color`，`::-webkit-scrollbar` 定制按规范整体失效，
 * 圆角与 `scrollbar-w` / `scrollbar-h` 等不再生效。
 */
import type { Preset, Shortcut, VariantHandler } from 'unocss';
import type { Theme } from 'unocss/preset-mini';
import { colorResolver, handler as h } from '@unocss/preset-mini/utils';

// ---- options ----------------------------------------------------------------

/** {@link presetScrollbar} 的选项。 */
export interface PresetScrollbarOptions {
  /**
   * 默认滚动条宽度。
   *
   * @default '8px'
   */
  scrollbarWidth?: string;
  /**
   * 默认滚动条高度。
   *
   * @default '8px'
   */
  scrollbarHeight?: string;
  /**
   * 默认滚动条 track 圆角。
   *
   * @default '4px'
   */
  scrollbarTrackRadius?: string;
  /**
   * 默认滚动条 thumb 圆角。
   *
   * @default '4px'
   */
  scrollbarThumbRadius?: string;
  /**
   * 默认滚动条 track 背景色。
   *
   * @default '#f5f5f5'
   */
  scrollbarTrackColor?: string;
  /**
   * 默认滚动条 thumb 背景色。
   *
   * @default '#ddd'
   */
  scrollbarThumbColor?: string;
  /**
   * CSS 变量前缀，生成 `--{prefix}-scrollbar-*`。
   *
   * @default 'vean'
   */
  varPrefix?: string;
}

const DEFAULT_OPTIONS: Required<PresetScrollbarOptions> = {
  scrollbarWidth: '8px',
  scrollbarHeight: '8px',
  scrollbarTrackRadius: '4px',
  scrollbarThumbRadius: '4px',
  scrollbarTrackColor: '#f5f5f5',
  scrollbarThumbColor: '#ddd',
  varPrefix: 'vean'
};

/** 语义别名 → 写入的 CSS 变量（`scrollbar-radius-*` 同时写 track/thumb 两个圆角变量） */
const SIZE_VARIABLE_ALIASES: Record<string, string[]> = {
  radius: ['track-radius', 'thumb-radius'],
  w: ['width'],
  h: ['height'],
  'track-radius': ['track-radius'],
  'thumb-radius': ['thumb-radius']
};

/** 匹配 `scrollbar:` / `scrollbar-track:` / `scrollbar-thumb:` 伪元素变体 */
const SCROLLBAR_VARIANT_RE = /^(scrollbar(-track|-thumb)?):.+$/;

// ---- preset -----------------------------------------------------------------

/**
 * Scrollbar 样式 preset，经 `presetUi` 默认接入，也可单独使用：
 *
 * ```ts
 * // uno.config.ts
 * import { defineConfig } from 'unocss'
 * import { presetScrollbar } from '@vean/unocss'
 *
 * export default defineConfig({
 *   presets: [presetScrollbar({ compatible: true })]
 * })
 * ```
 */
export function presetScrollbar(options: PresetScrollbarOptions = {}): Preset<Theme> {
  const config: Required<PresetScrollbarOptions> = { ...DEFAULT_OPTIONS, ...options };
  const resolveVar = (name: string) => `--${config.varPrefix ? `${config.varPrefix}-` : ''}scrollbar-${name}`;

  return {
    name: 'vean-uno-scrollbar',
    shortcuts: [
      [
        'scrollbar',
        [
          { overflow: 'auto' },
          'scrollbar-custom-property',
          'scrollbar-width-auto',
          `scrollbar-color-[var(${resolveVar('thumb')})_var(${resolveVar('track')})]`,
          `scrollbar-track:scrollbar-background-color-[var(${resolveVar('track')})]`,
          `scrollbar-thumb:scrollbar-background-color-[var(${resolveVar('thumb')})]`,
          `scrollbar:scrollbar-width-[var(${resolveVar('width')})]`,
          `scrollbar:scrollbar-height-[var(${resolveVar('height')})]`
        ]
      ],
      [
        'scrollbar-rounded',
        [
          `scrollbar-track:scrollbar-border-radius-[var(${resolveVar('track-radius')})]`,
          `scrollbar-thumb:scrollbar-border-radius-[var(${resolveVar('thumb-radius')})]`
        ]
      ],
      ['scrollbar-thin', ['scrollbar-w-8px', 'scrollbar-h-8px', 'scrollbar-width-thin']],
      ['scrollbar-none', ['scrollbar:hidden', 'scrollbar-width-none']]
    ] as Shortcut<Theme>[],
    variants: [
      {
        name: 'scrollbar',
        match: (matcher): VariantHandler | undefined => {
          if (!SCROLLBAR_VARIANT_RE.test(matcher)) {
            return;
          }

          const variant = matcher.replace(SCROLLBAR_VARIANT_RE, '$1');
          return {
            matcher: matcher.slice(variant.length + 1),
            selector: (selector: string) => `${selector}::-webkit-${variant}`
          };
        }
      }
    ],
    rules: [
      [/^scrollbar-color-(.+)$/, ([, value]) => ({ 'scrollbar-color': h.bracket.cssvar.auto.fraction.rem(value) })],
      ['scrollbar-width-auto', { 'scrollbar-width': 'auto' }],
      ['scrollbar-width-thin', { 'scrollbar-width': 'thin' }],
      ['scrollbar-width-none', { 'scrollbar-width': 'none' }],
      // 供 `scrollbar-none` 的 `scrollbar:hidden` 使用（独立于 wind3 使用本 preset 时兜底）
      ['hidden', { display: 'none' }],
      [
        'scrollbar-custom-property',
        {
          [resolveVar('track')]: config.scrollbarTrackColor,
          [resolveVar('thumb')]: config.scrollbarThumbColor,
          [resolveVar('width')]: config.scrollbarWidth,
          [resolveVar('height')]: config.scrollbarHeight,
          [resolveVar('track-radius')]: config.scrollbarTrackRadius,
          [resolveVar('thumb-radius')]: config.scrollbarThumbRadius
        }
      ],
      [
        /^scrollbar-(thumb|track)-color-(.+)$/,
        (match, ctx) => {
          const [, type, body] = match;
          return colorResolver(resolveVar(type), `scrollbar-${type}`)(['', body], ctx);
        },
        { autocomplete: 'scrollbar-(thumb|track)-color-$colors' }
      ],
      [
        /^scrollbar-(thumb|track)-op(?:acity)?-?(.+)$/,
        ([, type, opacity]) => ({
          [`${resolveVar(type)}-opacity`]: h.bracket.percent.cssvar(opacity)
        }),
        { autocomplete: 'scrollbar-(thumb|track)-(op|opacity)-<percent>' }
      ],
      [
        /^scrollbar-(width|height|background-color|border-radius)-(.+)$/,
        ([, prop, value]) => ({ [prop]: h.bracket.cssvar(value) })
      ],
      [
        new RegExp(`^scrollbar-(${Object.keys(SIZE_VARIABLE_ALIASES).join('|')})-(.+)$`),
        ([, type, value]) => {
          const val = h.bracket.cssvar.numberWithUnit.rem(value);
          return Object.fromEntries((SIZE_VARIABLE_ALIASES[type] ?? []).map(name => [resolveVar(name), val]));
        },
        { autocomplete: `scrollbar-(${Object.keys(SIZE_VARIABLE_ALIASES).join('|')})-<num>` }
      ]
    ]
  };
}
