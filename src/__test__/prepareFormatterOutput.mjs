/**
 * https://github.com/stylelint/stylelint/blob/15.10.3/lib/formatters/__tests__/prepareFormatterOutput.mjs
 */
import stripAnsi from 'strip-ansi';

const symbolConversions = new Map();

symbolConversions.set('ℹ', 'i');
symbolConversions.set('✔', '√');
symbolConversions.set('⚠', '‼');
symbolConversions.set('✖', '×');

export default function prepareFormatterOutput(results, formatter, returnValue) {
  returnValue = returnValue || {
    ruleMetadata: {},
  };
  let output = stripAnsi(formatter(results, returnValue)).trim();

  for (const [nix, win] of symbolConversions.entries()) {
    output = output.replace(new RegExp(nix, 'g'), win);
  }

  return output;
}
