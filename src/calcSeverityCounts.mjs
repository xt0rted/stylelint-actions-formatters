/**
 * https://github.com/stylelint/stylelint/blob/16.2.0/lib/formatters/calcSeverityCounts.mjs
 */
/**
 * @typedef {import('stylelint').Severity} Severity
 *
 * @param {Severity} severity
 * @param {Record<Severity, number>} counts
 * @returns {void}
 */
export default function calcSeverityCounts(severity, counts) {
  switch (severity) {
    case 'error':
      counts.error += 1;
      break;
    case 'warning':
      counts.warning += 1;
      break;
    default:
      throw new Error(`Unknown severity: "${severity}"`);
  }
}
