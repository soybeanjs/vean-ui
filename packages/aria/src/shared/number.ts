/**
 * Locale-aware number formatting and parsing built on `Intl.NumberFormat`.
 */

export interface NumberFormatterLike {
  format: (value: number) => string;
  resolvedOptions: () => Intl.ResolvedNumberFormatOptions;
}

export interface NumberParserLike {
  parse: (value: string) => number;
  isValidPartialNumber: (value: string, min: number | undefined, max: number | undefined) => boolean;
}

interface NumberSymbols {
  decimalSeparator: string;
  groupSeparator: string;
  minusSign: string;
  plusSign: string;
  /** Locale digit glyphs in 0-9 order (may be non-ASCII numerals). */
  digits: string;
  isDecimalPresent: boolean;
}

function getDigitMap(locale: string, options: Intl.NumberFormatOptions): string {
  const formatter = new Intl.NumberFormat(locale, { ...options, useGrouping: false });
  // Format each digit separately so map[d] is the glyph for digit value d.
  let digitMap = '';

  for (let digit = 0; digit <= 9; digit += 1) {
    digitMap += formatter.format(digit);
  }

  return digitMap.replace(/\D/g, '');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveSymbols(locale: string, options: Intl.NumberFormatOptions): NumberSymbols {
  const sample = new Intl.NumberFormat(locale, options);
  const signed = new Intl.NumberFormat(locale, { ...options, signDisplay: 'always' });
  const sampleParts = sample.formatToParts(1234567.89);
  const decimalPart = sampleParts.find(part => part.type === 'decimal');
  const groupPart = sampleParts.find(part => part.type === 'group');
  const minusPart = sample.formatToParts(-1).find(part => part.type === 'minusSign');
  const plusPart = signed.formatToParts(1).find(part => part.type === 'plusSign');

  return {
    decimalSeparator: decimalPart?.value ?? '.',
    groupSeparator: groupPart?.value ?? ',',
    minusSign: minusPart?.value ?? '-',
    plusSign: plusPart?.value ?? '+',
    digits: getDigitMap(locale, options),
    isDecimalPresent: Boolean(decimalPart)
  };
}

/** Maps locale numeral glyphs onto their ASCII 0-9 counterparts. */
function mapToAsciiDigits(value: string, digitMap: string): string {
  if (!digitMap) {
    return value;
  }

  return Array.from(value)
    .map(char => {
      const index = digitMap.indexOf(char);

      return index === -1 ? char : String(index);
    })
    .join('');
}

export function createNumberFormatter(locale: string, options: Intl.NumberFormatOptions): NumberFormatterLike {
  const formatter = new Intl.NumberFormat(locale, options);

  return {
    format: value => formatter.format(value),
    resolvedOptions: () => formatter.resolvedOptions()
  };
}

export function createNumberParser(locale: string, options: Intl.NumberFormatOptions): NumberParserLike {
  const symbols = resolveSymbols(locale, options);
  const groupPattern = new RegExp(escapeRegExp(symbols.groupSeparator), 'g');
  const decimalPattern = new RegExp(escapeRegExp(symbols.decimalSeparator), 'g');
  const minusPattern = new RegExp(escapeRegExp(symbols.minusSign), 'g');
  const plusPattern = new RegExp(escapeRegExp(symbols.plusSign), 'g');

  function normalize(value: string): string {
    const ascii = mapToAsciiDigits(value, symbols.digits);

    return ascii
      .replace(groupPattern, '')
      .replace(decimalPattern, '.')
      .replace(minusPattern, '-')
      .replace(plusPattern, '+');
  }

  function parse(value: string): number {
    let normalized = normalize(value).replace(/[.,+-]+$/, match => (match === '-' ? match : ''));

    if (!normalized || normalized === '-' || normalized === '+') {
      return Number.NaN;
    }

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }

  function isValidPartialNumber(value: string, minValue?: number, maxValue?: number): boolean {
    if (!value.length) {
      return true;
    }

    if (value === symbols.minusSign || value === '-') {
      return (minValue ?? 0) < 0;
    }

    if (value === symbols.decimalSeparator || value === '.') {
      return symbols.isDecimalPresent && (minValue ?? 0) < 1 && (maxValue ?? 0) >= 0;
    }

    const normalized = normalize(value);
    const hasMinus = normalized.startsWith('-');

    if (hasMinus && (minValue ?? 0) >= 0) {
      return false;
    }

    const unsigned = normalized.replace(/^-/, '');

    // A partial value may only contain ASCII digits (after numeral mapping)
    // and at most one decimal point.
    if (!/^\d*(\.\d*)?$/.test(unsigned)) {
      return false;
    }

    if (!symbols.isDecimalPresent && unsigned.includes('.')) {
      return false;
    }

    const parsed = parse(value);

    if (Number.isNaN(parsed)) {
      return false;
    }

    if (parsed > (maxValue ?? Number.POSITIVE_INFINITY)) {
      return false;
    }

    // Values below `min` stay typable: the user may still be building up to
    // an in-range number (e.g. typing "10" when the minimum is 100).
    return true;
  }

  return { parse, isValidPartialNumber };
}
