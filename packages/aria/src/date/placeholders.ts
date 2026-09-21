import { resolveLocale } from '../locale/locales';

export function getPlaceholder(
  field: 'year' | 'month' | 'day' | 'era' | 'hour' | 'minute' | 'second' | 'dayPeriod',
  value: string,
  locale: string
) {
  if (field === 'year' || field === 'month' || field === 'day') {
    const messages = resolveLocale(locale);

    const datePlaceholders = messages.date.placeholder;
    if (datePlaceholders) {
      return datePlaceholders[field];
    }
  }

  if (field === 'era' || field === 'dayPeriod') {
    return value;
  }

  return '––';
}
