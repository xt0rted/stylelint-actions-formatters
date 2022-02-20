/**
 * https://github.com/stylelint/stylelint/blob/14.4.0/lib/formatters/__tests__/prepareFormatterOutput.js
 */
const stripAnsi = require('strip-ansi');

const symbolConversions = new Map();

symbolConversions.set('ℹ', 'i');
symbolConversions.set('✔', '√');
symbolConversions.set('⚠', '‼');
symbolConversions.set('✖', '×');

module.exports = function (results, formatter, cwd) {
  let output = stripAnsi(formatter(results, { cwd })).trim();

  for (const [nix, win] of symbolConversions.entries()) {
    output = output.replace(new RegExp(nix, 'g'), win);
  }

  return output;
};
