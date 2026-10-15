/**
 * Convert a heading title into a URL-safe anchor id.
 *
 * Mirrors ubean's markdown `slugify` convention: no prefix, CJK preserved,
 * non-word characters (including em-dashes) stripped, whitespace collapsed
 * to single hyphens. DocMd assigns these ids to headings client-side and the
 * document outline reuses the same ids, so anchors are stable and deep links
 * (`#comparison`) match the natural heading slug.
 */
export function toHeadingId(title: string): string {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'section';
}
