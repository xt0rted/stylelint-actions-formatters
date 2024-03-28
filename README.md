# stylelint-actions-formatters

[![CI](https://github.com/xt0rted/stylelint-actions-formatters/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/xt0rted/stylelint-actions-formatters/actions/workflows/ci.yml)
[![CodeQL](https://github.com/xt0rted/stylelint-actions-formatters/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/xt0rted/stylelint-actions-formatters/actions/workflows/codeql-analysis.yml)
[![npm version](https://img.shields.io/npm/v/stylelint-actions-formatters)](https://www.npmjs.com/package/stylelint-actions-formatters)

These are copies of the built-in [Stylelint](https://github.com/stylelint/stylelint) formatters with modified file paths so that `Checks Annotations` can be created on `GitHub Actions` when your `package.json` is not in the root of the repository.
This package should be used with the [stylelint-problem-matcher](https://github.com/xt0rted/stylelint-problem-matcher) action.

To help with compatibility the version of this package matches the version of StyleLint that the formatters came from.
It also has a peer dependency on that version.

## Usage

### String formatter

```console
 stylelint "scss/**/*.scss" --custom-formatter=node_modules/stylelint-actions-formatters
```

### Verbose formatter

```console
 stylelint "scss/**/*.scss" --custom-formatter=node_modules/stylelint-actions-formatters/src/verboseFormatter.mjs
```

> Note: If you're not running on GitHub Actions then these reporters will function the same as the ones that ship with Stylelint.
