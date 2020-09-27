# stylelint-actions-formatters

[![CI](https://github.com/xt0rted/stylelint-actions-formatters/workflows/CI/badge.svg)](https://github.com/xt0rted/stylelint-actions-formatters/actions?query=workflow%3ACI)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=xt0rted/stylelint-actions-formatters)](https://dependabot.com)
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
