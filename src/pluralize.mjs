/**
 * https://github.com/stylelint/stylelint/blob/16.0.1/lib/utils/pluralize.mjs
 */
/**
 * Returns the plural form of the given word.
 *
 * @param {string} singular
 * @param {number} count
 * @returns {string}
 */
export default function pluralize(singular, count) {
  return count === 1 ? singular : `${singular}s`;
}
