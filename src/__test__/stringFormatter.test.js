/**
 * Based on https://github.com/stylelint/stylelint/blob/14.11.0/lib/formatters/__tests__/stringFormatter.test.js
 */
'use strict';

const { stripIndent } = require('common-tags');

const prepareFormatterOutput = require('./prepareFormatterOutput');
const stringFormatter = require('../stringFormatter');

describe('stringFormatter', () => {
  let actualTTY;
  let actualColumns;

  beforeAll(() => {
    jest.spyOn(process, 'cwd').mockReturnValue('/test-project');

    actualTTY = process.stdout.isTTY;
    actualColumns = process.stdout.columns;

    // This is needed when running on github actions
    delete process.env.GITHUB_WORKSPACE;
  });

  afterAll(() => {
    process.stdout.isTTY = actualTTY;
    process.stdout.columns = actualColumns;
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

      const output = stringFormatter(results);

      expect(output).toBe('');
    });

    it('outputs warnings', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('removes rule name from warning text', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'rule-name',
              severity: 'warning',
              text: 'Unexpected foo (rule-name)',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs warnings without stdout `TTY`', () => {
      process.stdout.isTTY = false;

      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('output warnings with more than 80 characters and `process.stdout.columns` equal 90 characters', () => {
      // For Windows tests
      process.stdout.isTTY = true;
      process.stdout.columns = 90;

      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar-very-very-very-very-very-long',
              severity: 'error',
              text: 'Unexpected very very very very very very very very very very very very very long foo',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('condenses deprecations and invalid option warnings', () => {
      const results = [
        {
          source: 'file.css',
          deprecations: [
            {
              text: 'Deprecated foo',
              reference: 'bar',
            },
          ],
          invalidOptionWarnings: [
            {
              text: 'Unexpected option for baz',
            },
          ],
          errored: true,
          warnings: [],
        },
        {
          source: 'file2.css',
          deprecations: [
            {
              text: 'Deprecated foo',
              reference: 'bar',
            },
          ],
          invalidOptionWarnings: [
            {
              text: 'Unexpected option for baz',
            },
          ],
          errored: true,
          warnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('handles ignored file', () => {
      const results = [
        {
          source: 'file.css',
          warnings: [],
          deprecations: [],
          invalidOptionWarnings: [],
          ignored: true,
        },
      ];

      const output = prepareFormatterOutput(results, stringFormatter);

      expect(output).toBe('');
    });

    it('handles empty messages', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          errored: true,
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar',
              severity: 'error',
              text: '',
            },
          ],
          deprecations: [],
          invalidOptionWarnings: [],
        },
      ];

      const output = prepareFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });
  }
});
