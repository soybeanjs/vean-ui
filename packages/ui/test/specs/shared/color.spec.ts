import { describe, expect, it } from 'vitest';
import { getSliderBackgroundStyle, isValidColor, toColorObject, formatColor } from '../../../../aria/src/shared/color';

describe('shared color helpers', () => {
  it('parses legacy rgba strings with commas', () => {
    expect(isValidColor('rgba(236, 72, 153, 0.85)')).toBe(true);
    expect(formatColor('rgba(236, 72, 153, 0.85)', 'hex')).toBe('#ec4899d9');
  });

  it('parses legacy hsla strings with commas', () => {
    expect(isValidColor('hsla(330, 81%, 60%, 0.85)')).toBe(true);
    expect(formatColor('hsla(330, 81%, 60%, 0.85)', 'hex')).toBe('#ec4699d9');
  });

  it('keeps object conversion working for legacy rgba strings', () => {
    expect(toColorObject('rgba(236, 72, 153, 0.85)', 'rgb')).toMatchObject({
      r: 236,
      g: 72,
      b: 153
    });
  });

  it('builds an alpha slider background from the current color with opacity from 0 to 1', () => {
    const style = getSliderBackgroundStyle('rgba(236, 72, 153, 0.85)', 'alpha');
    const rgb = toColorObject('rgba(236, 72, 153, 0.85)', 'rgb');
    const transparent = `rgb(${rgb.r} ${rgb.g} ${rgb.b} / 0)`;
    const opaque = `rgb(${rgb.r} ${rgb.g} ${rgb.b} / 1)`;

    expect(style).toEqual({
      backgroundColor: 'transparent',
      backgroundImage: `linear-gradient(to right, ${transparent}, ${opaque})`
    });
  });
});
