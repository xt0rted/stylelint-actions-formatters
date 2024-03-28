/**
 * Based on https://github.com/stylelint/stylelint/blob/16.0.2/lib/formatters/__tests__/stringFormatter.test.mjs
 */
import process from 'node:process';

import { jest } from '@jest/globals';

import { getCleanFormatterOutput } from './getCleanOutput.mjs';
import stringFormatter from '../stringFormatter.mjs';

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
          warnings: [],
        },
      ];

      const output = stringFormatter(results);

      expect(output).toBe('');
    });

    it('outputs warnings', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs warnings contains non-ASCII characters', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar',
              severity: 'error',
              text: '简体中文こんにちは안녕하세요',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('removes rule name from warning text', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'rule-name',
              severity: 'warning',
              text: 'Unexpected foo (rule-name)',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs warnings without stdout `TTY`', () => {
      process.stdout.isTTY = false;

      const results = [
        {
          source: '/test-project/path/to/file.css',
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar',
              severity: 'error',
              text: 'Unexpected foo',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs warnings with more than 80 characters and `process.stdout.columns` equal 90 characters', () => {
      // For Windows tests
      process.stdout.isTTY = true;
      process.stdout.columns = 90;

      const results = [
        {
          source: '/test-project/path/to/file.css',
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar-very-very-very-very-very-long',
              severity: 'error',
              text: 'Unexpected very very very very very very very very very very very very very long foo',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs warnings with more than 80 non-ASCII characters and `process.stdout.columns` equal 90 characters', () => {
      // For Windows tests
      process.stdout.isTTY = true;
      process.stdout.columns = 90;

      const results = [
        {
          source: '/test-project/path/to/file.css',
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar-very-very-very-very-very-long',
              severity: 'error',
              text:
                '简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文' +
                'こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요简体中文こんにちは안녕하세요',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('condenses deprecations and invalid option warnings', () => {
      const results = [
        {
          source: 'file.css',
          deprecations: [
            {
              text: 'Deprecated foo.',
              reference: 'bar',
            },
          ],
          invalidOptionWarnings: [
            {
              text: 'Unexpected option for baz',
            },
          ],
          warnings: [],
        },
        {
          source: 'file2.css',
          deprecations: [
            {
              text: 'Deprecated foo.',
              reference: 'bar',
            },
          ],
          invalidOptionWarnings: [
            {
              text: 'Unexpected option for baz',
            },
          ],
          warnings: [],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('handles ignored file', () => {
      const results = [
        {
          source: 'file.css',
          warnings: [],
          ignored: true,
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toBe('');
    });

    it('handles empty messages', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          warnings: [
            {
              line: 1,
              column: 1,
              rule: 'bar',
              severity: 'error',
              text: '',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });

    it('outputs parse errors and warnings without rule and severity', () => {
      const results = [
        {
          source: '/test-project/path/to/file.css',
          parseErrors: [
            {
              line: 1,
              column: 1,
              stylelintType: 'foo-error',
              text: 'Cannot parse foo',
            },
          ],
          warnings: [
            {
              line: 3,
              column: 1,
              rule: 'no-bar',
              severity: 'error',
              text: 'Disallow bar',
            },
            {
              line: 2,
              column: 1,
              text: 'Anonymous error',
            },
          ],
        },
      ];

      const output = getCleanFormatterOutput(results, stringFormatter);

      expect(output).toMatchSnapshot();
    });
  }
});
