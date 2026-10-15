import type { ChartPoint, ChartTheme, ChartTooltipContent } from '@tanstack/charts';
import { tooltip } from '@tanstack/charts/tooltip';

/**
 * shadcn 风格的图表主题配置，仅供文档图表示例使用。
 *
 * 文档中的图表直接基于 TanStack Charts 渲染（没有 @soybeanjs/chart 之类的
 * 封装包）。shadcn 的 "chart config" 模式把每个系列 key 映射到一个文案标签与
 * 主题色，`ChartContainer` 再将其转换为 `--color-<key>` CSS 自定义属性，
 * 图元通过 `var(--color-<key>)` 引用颜色，从而自动跟随明/暗主题
 * （颜色来自主题 token `--chart-1..5`）。
 */

/**
 * 主题图表面板色，值包裹为合法 CSS 颜色。
 *
 * 主题引擎把 `--chart-N` 存为原始 HSL 通道三元组（如 `20.5 90.2% 48.2%`），
 * 因此这里用 `hsl()` 包裹；引用时用本数组而不是逐处手写单色 token。
 */
export const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
] as const;

/** 声明式系列配置：key 为系列/数据字段名，值为文案标签与颜色。 */
export type ChartConfig = Record<string, { label?: string; color?: string }>;

/**
 * 对齐 TanStack shadcn 示例的 SVG 主题：网格与坐标轴文字取自文档主题 token。
 *
 * 主题 token 是 HSL 三元组，SVG 属性需要完整颜色，因此用 `hsl()` 包裹。
 */
export const chartSvgTheme: Partial<ChartTheme> = {
  foreground: 'hsl(var(--muted-foreground))',
  grid: 'hsl(var(--border) / var(--border-alpha, 1))',
  background: 'transparent'
};

/**
 * shadcn 风格的 x 轴表现：隐藏轴线与刻度线，仅保留文字，
 * 文字与图表间距 10px。`format` 将标签截断为 3 个字符（月份简写）。
 */
export const chartXAxisOptions = {
  line: false,
  ticks: {
    size: 0,
    padding: 10,
    format: (value: string) => value.slice(0, 3)
  }
} as const;

/** 将 shadcn 示例的 tooltip 点位映射为标题 + 千分位数值行。 */
export function toChartTooltipContent(points: readonly ChartPoint[]): ChartTooltipContent {
  return {
    title: String(points[0]?.xValue ?? ''),
    rows: points.map(point => ({
      label: titleCase(
        String(point.group ?? point.markId.replace(/-?(bars|lines|areas|slices|values|radar|dots)$/u, ''))
      ),
      value: Number(point.yValue ?? point.xValue ?? 0).toLocaleString('en-US'),
      color: point.color
    }))
  };
}

/** 首字母大写，供 tooltip 与极坐标图表的内容回调复用。 */
export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * shadcn 风格的 tooltip 配置：锚定在 x 分组中心、按颜色域排序，
 * 内容走 `toChartTooltipContent`。
 */
export const chartTooltip = {
  use: tooltip,
  className: 'chart-tooltip',
  anchor: 'group-center',
  placement: 'auto',
  sort: 'color-domain',
  content: (points: readonly ChartPoint[]) => toChartTooltipContent(points)
} as const;
