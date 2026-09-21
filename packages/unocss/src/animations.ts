/**
 * 最小化动画 preset，参考 `unocss-preset-animations`
 * （https://github.com/xsjcTony/unocss-preset-animations）实现。
 *
 * 只实现 UI 样式实际用到的工具类：
 * - `animate-in` / `animate-out`（shortcut，含 `keyframes-vean-in/out`）
 * - `fade-in/out[-n]`、`zoom-in/out[-n]`、`slide-in-from-*` / `slide-out-to-*`
 *
 * CSS 变量（`--vean-enter-opacity` / `--vean-exit-scale` …）沿用 `--vean-` 命名空间
 * —— 前缀只从**主题 token 层**移除（`--background` / `--radius` 等），组件与预设自己的变量保留，
 * keyframe 名 `vean-in` / `vean-out` 沿用 tailwindcss-animate 的生态约定。
 */
import type { CSSObject, Preset, Rule, Shortcut } from 'unocss';
import type { Theme } from 'unocss/preset-mini';

// ---- constants -------------------------------------------------------------

const CSS_VARIABLE_PREFIX = '--vean';
const ENTER_ANIMATION_NAME = 'vean-in';
const EXIT_ANIMATION_NAME = 'vean-out';
const DEFAULT_SLIDE_TRANSLATE = '100%';
const ANIMATION_LAYER = 'vean-base';

// ---- value handlers（@unocss/preset-mini `h.cssvar.*` 的最小等价实现） -------

const NUMBER_WITH_UNIT_RE =
  /^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i;

/** `95` / `95%` → `0.95`（fade/zoom 的透明度/缩放比例） */
function percentValue(input: string): string | undefined {
  const num = Number.parseFloat(input.replace(/%$/, ''));

  return Number.isNaN(num) ? undefined : `${num / 100}`;
}

/** `2` → `0.5rem`；`100%` → `100%`；`2px` → `2px` */
function remValue(input: string): string | undefined {
  const match = input.match(NUMBER_WITH_UNIT_RE);

  if (!match) {
    return undefined;
  }

  const num = Number.parseFloat(match[1]);

  if (Number.isNaN(num)) {
    return undefined;
  }

  if (num === 0) {
    return '0';
  }

  return match[2] ? `${num}${match[2]}` : `${num / 4}rem`;
}

/** `full` / `1/2` → 百分比；其余回退 rem（slide 位移值） */
function slideLength(input: string): string | undefined {
  if (input === 'full') {
    return '100%';
  }

  const [left, right] = input.split('/');

  if (right !== undefined) {
    const ratio = Number.parseFloat(left) / Number.parseFloat(right);

    if (!Number.isNaN(ratio)) {
      return ratio === 0 ? '0' : `${ratio * 100}%`;
    }
  }

  return remValue(input);
}

// ---- slide helpers ---------------------------------------------------------

const DIRECTION_SHORTHAND: Record<string, string> = {
  t: 'top',
  b: 'bottom',
  l: 'left',
  r: 'right'
};

/** top/left 方向位移取负，与 tailwindcss-animate 约定一致 */
function negateForDirection(value: string, direction: string): string {
  if (direction !== 'top' && direction !== 'left') {
    return value;
  }

  if (value.startsWith('-')) {
    return value.slice(1);
  }

  return value === '0' ? value : `-${value}`;
}

/** 生成 enter/exit 位移 CSS 变量；无合法长度时返回 undefined 使规则不匹配 */
function slideVar(dir: string, val: string | undefined, mode: 'enter' | 'exit'): CSSObject | undefined {
  const length = slideLength(val ?? DEFAULT_SLIDE_TRANSLATE);

  if (!length) {
    return undefined;
  }

  const direction = DIRECTION_SHORTHAND[dir] ?? dir;
  const value = negateForDirection(length, direction);
  const axis = direction === 'top' || direction === 'bottom' ? 'y' : 'x';

  return { [`${CSS_VARIABLE_PREFIX}-${mode}-translate-${axis}`]: value };
}

// ---- rules -----------------------------------------------------------------

const FADE_RULES: Rule<Theme>[] = [
  [
    /^fade-in(?:-(.+))?$/,
    ([, opacity]) => ({ [`${CSS_VARIABLE_PREFIX}-enter-opacity`]: percentValue(opacity ?? '0') }),
    { autocomplete: 'fade-(in|out)-<percent>' }
  ],
  [/^fade-out(?:-(.+))?$/, ([, opacity]) => ({ [`${CSS_VARIABLE_PREFIX}-exit-opacity`]: percentValue(opacity ?? '0') })]
];

const ZOOM_RULES: Rule<Theme>[] = [
  [
    /^zoom-in(?:-(.+))?$/,
    ([, scale]) => ({ [`${CSS_VARIABLE_PREFIX}-enter-scale`]: percentValue(scale ?? '0') }),
    { autocomplete: 'zoom-(in|out)-<percent>' }
  ],
  [/^zoom-out(?:-(.+))?$/, ([, scale]) => ({ [`${CSS_VARIABLE_PREFIX}-exit-scale`]: percentValue(scale ?? '0') })]
];

const SLIDE_DIRECTION = '(t|b|l|r|top|bottom|left|right)';

const SLIDE_RULES: Rule<Theme>[] = [
  [
    new RegExp(`^slide-in(?:-from)?-${SLIDE_DIRECTION}(?:-(.+))?$`),
    ([, dir, val]) => slideVar(dir, val, 'enter'),
    {
      autocomplete: [
        `slide-(in|out)-${SLIDE_DIRECTION}-<percent>`,
        `slide-(in|out)-${SLIDE_DIRECTION}-full`,
        `slide-in-from-${SLIDE_DIRECTION}-<percent>`,
        `slide-in-from-${SLIDE_DIRECTION}-full`
      ]
    }
  ],
  [
    new RegExp(`^slide-out(?:-to)?-${SLIDE_DIRECTION}(?:-(.+))?$`),
    ([, dir, val]) => slideVar(dir, val, 'exit'),
    {
      autocomplete: [`slide-out-to-${SLIDE_DIRECTION}-<percent>`, `slide-out-to-${SLIDE_DIRECTION}-full`]
    }
  ]
];

// ---- shortcuts -------------------------------------------------------------

export interface PresetAnimationsOptions {
  /** 时间单位（duration/delay） */
  unit?: 's' | 'ms';
  /** 默认动画延迟 */
  delay?: number;
  /** 默认动画方向 */
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  /** 默认动画时长 */
  duration?: number;
  /** 默认动画填充模式 */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  /** 默认动画执行次数 */
  iterationCount?: number | 'infinite';
  /** 默认动画播放状态 */
  playState?: 'running' | 'paused';
  /** 默认动画缓动函数 */
  timingFunction?: string;
}

/** animate-in/out 共用的动画基础属性（时长默认取 theme.duration.DEFAULT） */
function sharedAnimationProps(theme: Theme, options: PresetAnimationsOptions): CSSObject {
  const { unit = 'ms' } = options;

  return {
    'animation-duration': options.duration ? `${options.duration}${unit}` : theme.duration?.DEFAULT || '150ms',
    ...(options.delay && { 'animation-delay': `${options.delay}${unit}` }),
    ...(options.direction && { 'animation-direction': options.direction }),
    ...(options.fillMode && { 'animation-fill-mode': options.fillMode }),
    ...(options.iterationCount && { 'animation-iteration-count': options.iterationCount }),
    ...(options.playState && { 'animation-play-state': options.playState }),
    ...(options.timingFunction && { 'animation-timing-function': options.timingFunction })
  };
}

function buildShortcuts(options: PresetAnimationsOptions): Shortcut<Theme>[] {
  const enter = (theme: Theme) => [
    `keyframes-${ENTER_ANIMATION_NAME}`,
    {
      'animation-name': ENTER_ANIMATION_NAME,
      ...sharedAnimationProps(theme, options),
      [`${CSS_VARIABLE_PREFIX}-enter-opacity`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-enter-scale`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-enter-rotate`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-enter-translate-x`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-enter-translate-y`]: 'initial'
    }
  ];

  const exit = (theme: Theme) => [
    `keyframes-${EXIT_ANIMATION_NAME}`,
    {
      'animation-name': EXIT_ANIMATION_NAME,
      ...sharedAnimationProps(theme, options),
      // Hold the exit keyframe after it finishes: the element stays mounted
      // until the presence layer hears `animationend`, and without a fill the
      // final frame would paint the resting style for a frame first — a visible
      // flash when dismissing a drawer mid-drag.
      'animation-fill-mode': options.fillMode ?? 'forwards',
      [`${CSS_VARIABLE_PREFIX}-exit-opacity`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-exit-scale`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-exit-rotate`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-exit-translate-x`]: 'initial',
      [`${CSS_VARIABLE_PREFIX}-exit-translate-y`]: 'initial'
    }
  ];

  return [
    [/^animate-in$/, (_, { theme }) => enter(theme), { layer: ANIMATION_LAYER, autocomplete: 'animate-in' }],
    [/^animate-out$/, (_, { theme }) => exit(theme), { layer: ANIMATION_LAYER, autocomplete: 'animate-out' }]
  ];
}

// ---- theme -----------------------------------------------------------------

/** enter/exit 的 @keyframes 定义，与 `--vean-enter-*` / `--vean-exit-*` 变量联动 */
const ANIMATION_THEME = {
  animation: {
    keyframes: {
      [ENTER_ANIMATION_NAME]: `{from{opacity:var(${CSS_VARIABLE_PREFIX}-enter-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-enter-translate-x,0),var(${CSS_VARIABLE_PREFIX}-enter-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1),var(${CSS_VARIABLE_PREFIX}-enter-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-enter-rotate,0))}}`,
      [EXIT_ANIMATION_NAME]: `{to{opacity:var(${CSS_VARIABLE_PREFIX}-exit-opacity,1);transform:translate3d(var(${CSS_VARIABLE_PREFIX}-exit-translate-x,0),var(${CSS_VARIABLE_PREFIX}-exit-translate-y,0),0) scale3d(var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1),var(${CSS_VARIABLE_PREFIX}-exit-scale,1)) rotate(var(${CSS_VARIABLE_PREFIX}-exit-rotate,0))}}`
    }
  }
};

// ---- preset ----------------------------------------------------------------

/**
 * 动画 preset，接入 `presetUi` 后提供 `animate-in/out`、`fade-*`、
 * `zoom-*`、`slide-in-from-*` / `slide-out-to-*` 工具类。
 *
 * `animate-in` / `animate-out` 位于 `vean-base` 层（低优先级），
 * 允许默认 utilities（如 `duration-500`）覆盖其动画时长。
 */
export function presetAnimations(options: PresetAnimationsOptions = {}): Preset {
  return {
    name: 'vean-uno-animations',
    theme: ANIMATION_THEME,
    layers: { [ANIMATION_LAYER]: -999 },
    shortcuts: buildShortcuts(options),
    rules: [...FADE_RULES, ...ZOOM_RULES, ...SLIDE_RULES]
  };
}
