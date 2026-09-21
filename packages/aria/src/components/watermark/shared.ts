import type { WatermarkRootProps } from './types';

interface WatermarkConfig {
  content?: string;
  image?: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: number | string;
  rotate: number;
  gap: [number, number];
  offset: [number, number];
  width?: number;
  height?: number;
  cross: boolean;
}

/**
 * Generates a canvas data URL for the watermark pattern.
 * Returns undefined when neither content nor loadedImage is provided.
 *
 * @param config - The watermark configuration.
 * @param loadedImage - Optional pre-loaded HTMLImageElement for image watermarks.
 */
export function generateWatermarkDataUrl(config: WatermarkConfig, loadedImage?: HTMLImageElement): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const { content, fontSize, fontFamily, fontColor, fontWeight, rotate, gap, offset, cross } = config;

  if (!content && !loadedImage) {
    return undefined;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return undefined;
  }

  const rotateRad = (rotate * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotateRad));
  const cos = Math.abs(Math.cos(rotateRad));

  if (loadedImage) {
    const canvasWidth = config.width ?? Math.ceil(loadedImage.width * cos + loadedImage.height * sin + gap[0]);
    const canvasHeight = config.height ?? Math.ceil(loadedImage.width * sin + loadedImage.height * cos + gap[1]);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const dc: DrawContext = { loadedImage, rotateRad, offset };

    if (cross) {
      drawCrossPattern(ctx, canvasWidth, canvasHeight, drawImageTile, dc);
    } else {
      drawSingle(ctx, canvasWidth, canvasHeight, drawImageTile, dc);
    }
  } else {
    const textWidthValue = measureTextWidth(content!, fontSize, fontFamily, fontWeight);
    const textHeight = fontSize;

    const canvasWidth = config.width ?? Math.ceil(textWidthValue * cos + textHeight * sin + gap[0]);
    const canvasHeight = config.height ?? Math.ceil(textWidthValue * sin + textHeight * cos + gap[1]);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const dc: DrawContext = {
      content: content!,
      fontSize,
      fontFamily,
      fontColor,
      fontWeight,
      rotateRad,
      offset
    };

    if (cross) {
      drawCrossPattern(ctx, canvasWidth, canvasHeight, drawTextTile, dc);
    } else {
      drawSingle(ctx, canvasWidth, canvasHeight, drawTextTile, dc);
    }
  }

  return canvas.toDataURL();
}

interface DrawContext {
  content?: string;
  loadedImage?: HTMLImageElement;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  fontWeight?: number | string;
  rotateRad: number;
  offset: [number, number];
}

function drawSingle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  drawFn: (ctx: CanvasRenderingContext2D, cx: number, cy: number, rotateRad: number, dc: DrawContext) => void,
  dc: DrawContext
) {
  drawFn(ctx, w / 2 + dc.offset[0], h / 2 + dc.offset[1], dc.rotateRad, dc);
}

function drawCrossPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  drawFn: (ctx: CanvasRenderingContext2D, cx: number, cy: number, rotateRad: number, dc: DrawContext) => void,
  dc: DrawContext
) {
  // Draw along the main diagonal (top-left to bottom-right)
  drawFn(ctx, w / 2, h / 2, dc.rotateRad, dc);

  // Draw along the anti-diagonal (top-right to bottom-left) with opposite rotation
  drawFn(ctx, w / 2, h / 2, -dc.rotateRad, dc);
}

function drawTextTile(ctx: CanvasRenderingContext2D, cx: number, cy: number, rotateRad: number, dc: DrawContext) {
  const { content, fontSize, fontFamily, fontColor, fontWeight } = dc;

  if (!content || fontSize === undefined || fontFamily === undefined || fontColor === undefined) return;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotateRad);
  ctx.font = `${fontWeight ?? 'normal'} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content, 0, 0);
  ctx.restore();
}

function drawImageTile(ctx: CanvasRenderingContext2D, cx: number, cy: number, rotateRad: number, dc: DrawContext) {
  const { loadedImage } = dc;

  if (!loadedImage) return;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotateRad);
  ctx.drawImage(loadedImage, -loadedImage.width / 2, -loadedImage.height / 2);
  ctx.restore();
}

function measureTextWidth(
  content: string | undefined,
  fontSize: number,
  fontFamily: string,
  fontWeight: number | string
): number {
  if (!content) return 0;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return 0;

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  return ctx.measureText(content).width;
}

export interface WatermarkDefaults {
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  fontWeight: number | string;
  rotate: number;
  gap: [number, number];
  offset: [number, number];
  cross: boolean;
}

export const DEFAULT_WATERMARK_CONFIG: WatermarkDefaults = {
  fontSize: 16,
  fontFamily: 'sans-serif',
  fontColor: 'rgba(0, 0, 0, 0.15)',
  fontWeight: 'normal',
  rotate: -22,
  gap: [100, 100],
  offset: [0, 0],
  cross: false
};

export function resolveWatermarkConfig(props: WatermarkRootProps): WatermarkConfig {
  return {
    content: props.content,
    image: props.image,
    fontSize: props.fontSize ?? DEFAULT_WATERMARK_CONFIG.fontSize,
    fontFamily: props.fontFamily ?? DEFAULT_WATERMARK_CONFIG.fontFamily,
    fontColor: props.fontColor ?? DEFAULT_WATERMARK_CONFIG.fontColor,
    fontWeight: props.fontWeight ?? DEFAULT_WATERMARK_CONFIG.fontWeight,
    rotate: props.rotate ?? DEFAULT_WATERMARK_CONFIG.rotate,
    gap: props.gap ?? DEFAULT_WATERMARK_CONFIG.gap,
    offset: props.offset ?? DEFAULT_WATERMARK_CONFIG.offset,
    width: props.width,
    height: props.height,
    cross: props.cross ?? DEFAULT_WATERMARK_CONFIG.cross
  };
}
