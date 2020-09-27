/**
 * https://github.com/stylelint/stylelint/blob/0eaf3d456cdecdd698d5e4a9edc54d205d47d907/lib/formatters/__tests__/prepareFormatterOutput.js
 */
const stripAnsi = require('strip-ansi');

const symbolConversions = new Map();

symbolConversions.set('ℹ', 'i');
symbolConversions.set('✔', '√');
symbolConversions.set('⚠', '‼');
symbolConversions.set('✖', '×');

module.exports = function (results, formatter) {
  let output = stripAnsi(formatter(results)).trim();

  symbolConversions.forEach((win, nix) => {
    output = output.replace(new RegExp(nix, 'g'), win);
  });

  return output;
};
