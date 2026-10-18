/** Normalize a name for matching: lowercase, strip accents, collapse whitespace.
 *  Ensures "Jack Jhonson", "jack jhonson" and "  Jack  Jhonson " all match. */
export function normalizeName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining accent marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}
