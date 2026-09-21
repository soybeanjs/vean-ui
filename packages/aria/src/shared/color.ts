import type { CSSProperties } from 'vue';
import { colord, getFormat } from '@soybeanjs/colord';
import type { HslColor, HsvColor, OklchColor, RgbColor } from '@soybeanjs/colord';
import type {
  ColorValue,
  ColorChannel,
  ColorChannelRange,
  ColorFormat,
  ColorObjectSpace,
  ColorSpace,
  NormalizedColor
} from '../types';
import { clamp } from '.';

const FALLBACK_COLOR = '#000000';
const DEFAULT_CHROMA_MAX = 0.4;

function normalizeLegacyFunctionalColorString(input: string) {
  const match = input.trim().match(/^(rgba?|hsla?)\((.*)\)$/i);

  if (!match) {
    return input;
  }

  const functionName = match[1].toLowerCase();
  const rawValue = match[2];

  if (!rawValue.includes(',')) {
    return input;
  }

  const parts = rawValue
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  if (parts.length !== 3 && parts.length !== 4) {
    return input;
  }

  const baseFunctionName = functionName.startsWith('rgb') ? 'rgb' : 'hsl';

  if (parts.length === 4) {
    return `${baseFunctionName}(${parts[0]} ${parts[1]} ${parts[2]} / ${parts[3]})`;
  }

  return `${baseFunctionName}(${parts[0]} ${parts[1]} ${parts[2]})`;
}

function normalizeColorInput(input: ColorValue): ColorValue;
function normalizeColorInput(input: undefined): undefined;
function normalizeColorInput(input: ColorValue | undefined) {
  if (typeof input !== 'string') {
    return input;
  }

  return normalizeLegacyFunctionalColorString(input);
}

function fromOklchLightnessValue(value: number) {
  return clamp(value, 0, 1) * 100;
}

function toOklchLightnessValue(value: number) {
  return clamp(value, 0, 100) / 100;
}

function getColorInstance(input: ColorValue | undefined, fallback: ColorValue = FALLBACK_COLOR) {
  const normalizedInput = normalizeColorInput(input ?? fallback);
  const instance = colord(normalizedInput);

  return instance.isValid() ? instance : colord(fallback);
}

function wrapHue(value: number) {
  const normalized = value % 360;

  return normalized < 0 ? normalized + 360 : normalized;
}

function toAlphaValue(value: number) {
  return clamp(value, 0, 100) / 100;
}

function toHueChannelSpace(colorSpace: ColorSpace): ColorSpace {
  if (colorSpace === 'oklch') {
    return 'oklch';
  }

  return colorSpace === 'hsv' ? 'hsv' : 'hsl';
}

export function resolveColorFormat(input: ColorValue | undefined, fallback: ColorFormat = 'hex'): ColorFormat {
  const normalizedInput = input ? normalizeColorInput(input) : undefined;
  const format = normalizedInput ? getFormat(normalizedInput) : undefined;

  switch (format) {
    case 'rgb':
      return 'rgb';
    case 'hsl':
      return 'hsl';
    case 'oklch':
      return 'oklch';
    case 'hex':
      return 'hex';
    default:
      return fallback;
  }
}

export function isValidColor(input: ColorValue | undefined) {
  if (input == null || input === '') {
    return false;
  }

  return colord(normalizeColorInput(input)).isValid();
}

export function toColorObject(input: ColorValue | undefined, space: 'rgb'): RgbColor;
export function toColorObject(input: ColorValue | undefined, space: 'hsl'): HslColor;
export function toColorObject(input: ColorValue | undefined, space: 'hsv'): HsvColor;
export function toColorObject(input: ColorValue | undefined, space: 'oklch'): OklchColor;
export function toColorObject(input: ColorValue | undefined, space?: ColorObjectSpace): NormalizedColor;
export function toColorObject(input: ColorValue | undefined, space: ColorObjectSpace = 'rgb'): NormalizedColor {
  const instance = getColorInstance(input);

  switch (space) {
    case 'hsl':
      return instance.toHsl();
    case 'hsv':
      return instance.toHsv();
    case 'oklch':
      return instance.toOklch();
    default:
      return instance.toRgb();
  }
}

export function normalizeColor(input: ColorValue | undefined, space: ColorObjectSpace = 'rgb') {
  return toColorObject(input, space);
}

export function formatColor(input: ColorValue | undefined, format: ColorFormat = 'hex') {
  const instance = getColorInstance(input);

  switch (format) {
    case 'rgb':
      return instance.toRgbString();
    case 'hsl':
      return instance.toHslString();
    case 'oklch':
      return instance.toOklchString();
    default:
      return instance.toHex();
  }
}

export function getChannelObjectSpace(channel: ColorChannel, colorSpace: ColorSpace = 'hsl'): ColorObjectSpace {
  switch (channel) {
    case 'red':
    case 'green':
    case 'blue':
      return 'rgb';
    case 'brightness':
      return 'hsv';
    case 'saturation':
      return 'hsl';
    case 'lightness':
      return colorSpace === 'oklch' ? 'oklch' : 'hsl';
    case 'chroma':
      return 'oklch';
    case 'alpha':
      return toHueChannelSpace(colorSpace);
    case 'hue':
    default:
      return toHueChannelSpace(colorSpace);
  }
}

export function getChannelRange(channel: ColorChannel): ColorChannelRange {
  switch (channel) {
    case 'red':
    case 'green':
    case 'blue':
      return { min: 0, max: 255, step: 1 };
    case 'alpha':
      return { min: 0, max: 100, step: 1 };
    case 'chroma':
      return { min: 0, max: DEFAULT_CHROMA_MAX, step: 0.001 };
    case 'hue':
      return { min: 0, max: 360, step: 1 };
    default:
      return { min: 0, max: 100, step: 1 };
  }
}

export function getChannelName(channel: ColorChannel) {
  switch (channel) {
    case 'red':
      return 'Red';
    case 'green':
      return 'Green';
    case 'blue':
      return 'Blue';
    case 'hue':
      return 'Hue';
    case 'saturation':
      return 'Saturation';
    case 'lightness':
      return 'Lightness';
    case 'brightness':
      return 'Brightness';
    case 'chroma':
      return 'Chroma';
    case 'alpha':
      return 'Alpha';
    default:
      return channel;
  }
}

export function getChannelValue(input: ColorValue | undefined, channel: ColorChannel, colorSpace: ColorSpace = 'hsl') {
  switch (channel) {
    case 'red': {
      const color = toColorObject(input, 'rgb');
      return color.r;
    }
    case 'green': {
      const color = toColorObject(input, 'rgb');
      return color.g;
    }
    case 'blue': {
      const color = toColorObject(input, 'rgb');
      return color.b;
    }
    case 'hue': {
      const space = toHueChannelSpace(colorSpace);

      if (space === 'hsv') {
        return wrapHue(toColorObject(input, 'hsv').h);
      }

      if (space === 'oklch') {
        return wrapHue(toColorObject(input, 'oklch').h);
      }

      return wrapHue(toColorObject(input, 'hsl').h);
    }
    case 'saturation': {
      const color = toColorObject(input, 'hsl');
      return color.s;
    }
    case 'lightness': {
      if (colorSpace === 'oklch') {
        return fromOklchLightnessValue(toColorObject(input, 'oklch').l);
      }

      const color = toColorObject(input, 'hsl');
      return color.l;
    }
    case 'brightness': {
      const color = toColorObject(input, 'hsv');
      return color.v;
    }
    case 'chroma': {
      const color = toColorObject(input, 'oklch');
      return color.c;
    }
    case 'alpha': {
      const space = toHueChannelSpace(colorSpace);

      if (space === 'hsv') {
        return toColorObject(input, 'hsv').alpha * 100;
      }

      if (space === 'oklch') {
        return toColorObject(input, 'oklch').alpha * 100;
      }

      return toColorObject(input, 'hsl').alpha * 100;
    }
    default:
      return 0;
  }
}

export function setChannelValue(
  input: ColorValue | undefined,
  channel: ColorChannel,
  value: number,
  colorSpace: ColorSpace = 'hsl'
): NormalizedColor {
  const objectSpace = getChannelObjectSpace(channel, colorSpace);
  switch (objectSpace) {
    case 'rgb': {
      const color = { ...toColorObject(input, 'rgb') };
      if (channel === 'red') color.r = clamp(value, 0, 255);
      if (channel === 'green') color.g = clamp(value, 0, 255);
      if (channel === 'blue') color.b = clamp(value, 0, 255);
      if (channel === 'alpha') color.alpha = toAlphaValue(value);
      return color;
    }
    case 'hsv': {
      const color = { ...toColorObject(input, 'hsv') };
      if (channel === 'hue') color.h = wrapHue(value);
      if (channel === 'brightness') color.v = clamp(value, 0, 100);
      if (channel === 'alpha') color.alpha = toAlphaValue(value);
      return color;
    }
    case 'oklch': {
      const color = { ...toColorObject(input, 'oklch') };
      if (channel === 'hue') color.h = wrapHue(value);
      if (channel === 'lightness') color.l = toOklchLightnessValue(value);
      if (channel === 'chroma') color.c = clamp(value, 0, DEFAULT_CHROMA_MAX);
      if (channel === 'alpha') color.alpha = toAlphaValue(value);
      return color;
    }
    default: {
      const color = { ...toColorObject(input, 'hsl') };
      if (channel === 'hue') color.h = wrapHue(value);
      if (channel === 'saturation') color.s = clamp(value, 0, 100);
      if (channel === 'lightness') color.l = clamp(value, 0, 100);
      if (channel === 'alpha') color.alpha = toAlphaValue(value);
      return color;
    }
  }
}

export function setChannelValues(
  input: ColorValue | undefined,
  values: Array<{ channel: ColorChannel; value: number }>,
  colorSpace: ColorSpace = 'hsl'
) {
  if (values.length === 0) {
    return toColorObject(input, toHueChannelSpace(colorSpace));
  }

  const objectSpace = values.reduce<ColorObjectSpace>(
    (space, item) => {
      const nextSpace = getChannelObjectSpace(item.channel, colorSpace);

      if (space === 'rgb' || nextSpace === 'rgb') {
        return 'rgb';
      }

      if (space === 'oklch' || nextSpace === 'oklch') {
        return 'oklch';
      }

      if (space === 'hsv' || nextSpace === 'hsv') {
        return 'hsv';
      }

      return nextSpace;
    },
    getChannelObjectSpace(values[0]!.channel, colorSpace)
  );

  const color = { ...toColorObject(input, objectSpace) };

  if (objectSpace === 'rgb') {
    const rgb = color as RgbColor;

    for (const item of values) {
      if (item.channel === 'red') rgb.r = clamp(item.value, 0, 255);
      if (item.channel === 'green') rgb.g = clamp(item.value, 0, 255);
      if (item.channel === 'blue') rgb.b = clamp(item.value, 0, 255);
      if (item.channel === 'alpha') rgb.alpha = toAlphaValue(item.value);
    }

    return rgb;
  }

  if (objectSpace === 'oklch') {
    const oklch = color as OklchColor;

    for (const item of values) {
      if (item.channel === 'hue') oklch.h = wrapHue(item.value);
      if (item.channel === 'lightness') oklch.l = toOklchLightnessValue(item.value);
      if (item.channel === 'chroma') oklch.c = clamp(item.value, 0, DEFAULT_CHROMA_MAX);
      if (item.channel === 'alpha') oklch.alpha = toAlphaValue(item.value);
    }

    return oklch;
  }

  if (objectSpace === 'hsv') {
    const hsv = color as HsvColor;

    for (const item of values) {
      if (item.channel === 'hue') hsv.h = wrapHue(item.value);
      if (item.channel === 'brightness') hsv.v = clamp(item.value, 0, 100);
      if (item.channel === 'alpha') hsv.alpha = toAlphaValue(item.value);
    }

    return hsv;
  }

  const hsl = color as HslColor;

  for (const item of values) {
    if (item.channel === 'hue') hsl.h = wrapHue(item.value);
    if (item.channel === 'saturation') hsl.s = clamp(item.value, 0, 100);
    if (item.channel === 'lightness') hsl.l = clamp(item.value, 0, 100);
    if (item.channel === 'alpha') hsl.alpha = toAlphaValue(item.value);
  }

  return hsl;
}

export function hasVisibleChromaticity(input: ColorValue | undefined, colorSpace: ColorSpace = 'hsl') {
  if (colorSpace === 'oklch') {
    return getChannelValue(input, 'chroma', colorSpace) > 0.001;
  }

  return getChannelValue(input, 'saturation', colorSpace) > 0;
}

export function areColorsEqual(a: ColorValue | undefined, b: ColorValue | undefined) {
  return formatColor(a, 'rgb') === formatColor(b, 'rgb');
}

export function getColorLabel(input: ColorValue | undefined, label?: string) {
  if (label) {
    return label;
  }

  const instance = getColorInstance(input);

  if (instance.alpha() === 0) {
    return 'transparent';
  }

  return formatColor(input, resolveColorFormat(input, 'hex'));
}

export function getColorContrast(input: ColorValue | undefined) {
  return getColorInstance(input).isLight() ? 'dark' : 'light';
}

export function formatChannelValue(channel: ColorChannel, value: number) {
  if (channel === 'alpha') {
    return `${Math.round(value)}%`;
  }

  if (channel === 'chroma') {
    return value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  }

  return String(Math.round(value));
}

export function getAreaBackgroundStyle(
  input: ColorValue | undefined,
  xChannel: ColorChannel,
  yChannel: ColorChannel,
  colorSpace: ColorSpace = 'hsl'
): CSSProperties {
  if (xChannel === 'saturation' && yChannel === 'brightness') {
    const hue = getChannelValue(input, 'hue', 'hsv');

    return {
      backgroundColor: formatColor({ h: hue, s: 100, v: 100, alpha: 1 }, 'rgb'),
      backgroundImage:
        'linear-gradient(to top, rgb(0 0 0 / 1), rgb(0 0 0 / 0)), linear-gradient(to right, rgb(255 255 255 / 1), rgb(255 255 255 / 0))'
    };
  }

  if (xChannel === 'chroma' && yChannel === 'lightness') {
    const hue = getChannelValue(input, 'hue', 'oklch');
    const saturated = { l: 0.65, c: DEFAULT_CHROMA_MAX, h: hue, alpha: 1 };

    return {
      backgroundImage: `linear-gradient(to top, rgb(0 0 0 / 1), rgb(255 255 255 / 0)), linear-gradient(to right, ${formatColor(
        { l: 0.65, c: 0, h: hue, alpha: 1 },
        'rgb'
      )}, ${formatColor(saturated, 'rgb')})`
    };
  }

  const hue = getChannelValue(input, 'hue', colorSpace);

  return {
    backgroundColor: formatColor({ h: hue, s: 100, l: 50, alpha: 1 }, 'rgb'),
    backgroundImage:
      'linear-gradient(to top, rgb(0 0 0 / 1), rgb(0 0 0 / 0) 50%, rgb(255 255 255 / 1)), linear-gradient(to right, rgb(128 128 128 / 1), rgb(128 128 128 / 0))'
  };
}

function getAlphaSliderBackgroundStyle(input: ColorValue | undefined): CSSProperties {
  const rgb = toColorObject(input, 'rgb');
  const transparent = `rgb(${rgb.r} ${rgb.g} ${rgb.b} / 0)`;
  const opaque = `rgb(${rgb.r} ${rgb.g} ${rgb.b} / 1)`;

  return {
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(to right, ${transparent}, ${opaque})`
  };
}

export function getSliderBackgroundStyle(
  input: ColorValue | undefined,
  channel: ColorChannel,
  colorSpace: ColorSpace = 'hsl'
): CSSProperties {
  switch (channel) {
    case 'hue':
      return {
        backgroundImage:
          'linear-gradient(to right, rgb(255 0 0), rgb(255 255 0), rgb(0 255 0), rgb(0 255 255), rgb(0 0 255), rgb(255 0 255), rgb(255 0 0))'
      };
    case 'alpha':
      return getAlphaSliderBackgroundStyle(input);
    case 'saturation': {
      const hsl = toColorObject(input, 'hsl');

      return {
        backgroundImage: `linear-gradient(to right, ${formatColor({ ...hsl, s: 0 }, 'rgb')}, ${formatColor(
          {
            ...hsl,
            s: 100
          },
          'rgb'
        )})`
      };
    }
    case 'lightness': {
      if (colorSpace === 'oklch') {
        const oklch = toColorObject(input, 'oklch');

        return {
          backgroundImage: `linear-gradient(to right, ${formatColor({ ...oklch, l: 0 }, 'rgb')}, ${formatColor(
            {
              ...oklch,
              l: 0.5
            },
            'rgb'
          )}, ${formatColor({ ...oklch, l: 1 }, 'rgb')})`
        };
      }

      const hsl = toColorObject(input, 'hsl');

      return {
        backgroundImage: `linear-gradient(to right, ${formatColor({ ...hsl, l: 0 }, 'rgb')}, ${formatColor(
          {
            ...hsl,
            l: 50
          },
          'rgb'
        )}, ${formatColor({ ...hsl, l: 100 }, 'rgb')})`
      };
    }
    case 'brightness': {
      const hsv = toColorObject(input, 'hsv');

      return {
        backgroundImage: `linear-gradient(to right, ${formatColor({ ...hsv, v: 0 }, 'rgb')}, ${formatColor(
          {
            ...hsv,
            v: 100
          },
          'rgb'
        )})`
      };
    }
    case 'red': {
      const rgb = toColorObject(input, 'rgb');

      return {
        backgroundImage: `linear-gradient(to right, ${formatColor({ ...rgb, r: 0 }, 'rgb')}, ${formatColor(
          {
            ...rgb,
            r: 255
          },
          'rgb'
        )})`
      };
    }
    case 'green': {
      const rgb = toColorObject(input, 'rgb');

      return {
        backgroundImage: `linear-gradient(to right, ${formatColor({ ...rgb, g: 0 }, 'rgb')}, ${formatColor(
          {
            ...rgb,
            g: 255
          },
          'rgb'
        )})`
      };
    }
    case 'blue': {
      const rgb = toColorObject(input, 'rgb');

      return {
        backgroundImage: `linear-gradient(to right, ${formatColor({ ...rgb, b: 0 }, 'rgb')}, ${formatColor(
          {
            ...rgb,
            b: 255
          },
          'rgb'
        )})`
      };
    }
    case 'chroma': {
      const oklch = toColorObject(input, 'oklch');

      return {
        backgroundImage: `linear-gradient(to right, ${formatColor({ ...oklch, c: 0 }, 'rgb')}, ${formatColor(
          {
            ...oklch,
            c: DEFAULT_CHROMA_MAX
          },
          'rgb'
        )})`
      };
    }
    default:
      return {
        backgroundImage: `linear-gradient(to right, ${formatColor(input, 'rgb')}, ${formatColor(input, 'rgb')})`
      };
  }
}
