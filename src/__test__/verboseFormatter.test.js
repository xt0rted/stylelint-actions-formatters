/**
 * Based on https://github.com/stylelint/stylelint/blob/14.12.0/lib/formatters/__tests__/verboseFormatter.test.js
 */
'use strict';

const { stripIndent } = require('common-tags');

const prepareFormatterOutput = require('./prepareFormatterOutput');
const verboseFormatter = require('../verboseFormatter');

describe('verboseFormatter', () => {
  beforeAll(() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/test-project');

    // This is needed when running on github actions
    delete process.env.GITHUB_WORKSPACE;
  });

  describe('using cwd', () => {
    runTestSuite();
  });

  describe('using GITHUB_WORKSPACE', () => {
    beforeAll(() => {
      process.env.GITHUB_WORKSPACE = '/test-project/path';
    });

    afterAll(() => {
      delete process.env.GITHUB_WORKSPACE;
    });

    runTestSuite();
  });

  function runTestSuite() {
    it('outputs no warnings', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: false,
          warnings: [],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();
    });

    it("outputs one warnings (of severity 'error')", () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 2,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs 0 stdout column', () => {
      const stdoutColumn = process.stdout.columns;

      process.stdout.columns = 0;

      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 2,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();

      process.stdout.columns = stdoutColumn;
    });

    it('outputs less than 80 stdout column', () => {
      const stdoutColumn = process.stdout.columns;

      process.stdout.columns = 79;

      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 2,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();

      process.stdout.columns = stdoutColumn;
    });

    it("outputs two of the same warnings of 'error' and one of 'warning' across two files", () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 2,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
            {
              line: 2,
              column: 3,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
        {
          source: '/test-project/path/to/file2.css',
          errored: true,
          warnings: [
            {
              line: 3,
              column: 1,
              rule: 'baz',
              severity: 'warning',
              text: 'Expected cat',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs lineless syntax error', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: false,
          warnings: [
            {
              rule: 'SyntaxError',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs one ignored file', () => {
      const results = [
        {
          source: 'file.css',
          warnings: [],
          deprecations: [],
          invalidOptionWarnings: [],
          ignored: true,
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs input CSS', () => {
      const results = [
        {
          source: '<input css>',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 2,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs plugin rule warnings', () => {
      const results = [
        {
          source: '/test-project/path/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 2,
              rule: 'plugin/bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, verboseFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs rule warnings with metadata', () => {
      const results = [
        {
          source: '/test-project/path/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 2,
              rule: 'no-foo',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];
      const returnValue = {
        ruleMetadata: {
          'no-foo': { url: 'https://stylelint.io', fixable: true },
        },
      };

      const output = prepareFormatterOutput(results, verboseFormatter, returnValue);

      expect(output).toMatchSnapshot();
    });
  }
});
