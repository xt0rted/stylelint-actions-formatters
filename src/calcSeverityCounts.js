/**
 * https://github.com/stylelint/stylelint/blob/15.2.0/lib/formatters/calcSeverityCounts.js
 */
'use strict';

/**
 * @typedef {import('stylelint').Severity} Severity
 *
 * @param {Severity} severity
 * @param {Record<Severity, number>} counts
 * @returns {void}
 */
module.exports = function calcSeverityCounts(severity, counts) {
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
};
