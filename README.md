# stylelint-actions-formatters

[![CI](https://github.com/xt0rted/stylelint-actions-formatters/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/xt0rted/stylelint-actions-formatters/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/stylelint-actions-formatters)](https://www.npmjs.com/package/stylelint-actions-formatters)

These are copies of the built-in formatters with modified file paths so that `Checks Annotations` can be created on `GitHub Actions` when your `package.json` is not in the root of the repository.
This package should be used with the [stylelint-problem-matcher](https://github.com/xt0rted/stylelint-problem-matcher) action.

## Usage

### String formatter

```console
 stylelint "scss/**/*.scss" --custom-formatter=node_modules/stylelint-actions-formatters
```

### Verbose formatter

```console
 stylelint "scss/**/*.scss" --custom-formatter=node_modules/stylelint-actions-formatters/verboseFormatter.js
```

> Note: If you're not running on GitHub Actions then these reporters will function the same as the ones that ship with Stylelint.
