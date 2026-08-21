import { describe, expect, it } from 'vitest';
import { inspectLighthouseThresholds } from './lighthouse-thresholds.mjs';

const config = {
  categories: {
    accessibility: { level: 'error', minScore: 0.9 },
    performance: { level: 'warning', minScore: 0.8 },
  },
  audits: {
    'largest-contentful-paint': { level: 'warning', maxNumericValue: 2500 },
  },
};

const passingResult = {
  categories: {
    accessibility: { score: 1 },
    performance: { score: 0.95 },
  },
  audits: {
    'largest-contentful-paint': { numericValue: 2200 },
  },
};

describe('Lighthouse thresholds', () => {
  it('accepts complete results within the configured thresholds', () => {
    expect(inspectLighthouseThresholds(config, '/', passingResult)).toEqual({ failures: [], warnings: [] });
  });

  it('fails when Lighthouse reports a runtime error', () => {
    const result = {
      ...passingResult,
      runtimeError: { code: 'NO_FCP', message: 'The page did not paint any content.' },
    };

    expect(inspectLighthouseThresholds(config, '/', result).failures).toContain(
      '/ Lighthouse runtime error NO_FCP: The page did not paint any content.',
    );
  });

  it('fails when a required category has no numeric score', () => {
    const result = {
      ...passingResult,
      categories: { ...passingResult.categories, accessibility: { score: null } },
    };

    expect(inspectLighthouseThresholds(config, '/community/', result).failures).toContain(
      '/community/ accessibility did not return a numeric score',
    );
  });

  it('warns when a warning-level metric is unavailable', () => {
    const result = {
      ...passingResult,
      audits: { 'largest-contentful-paint': {} },
    };

    expect(inspectLighthouseThresholds(config, '/projects/', result).warnings).toContain(
      '/projects/ largest-contentful-paint did not return a numeric value',
    );
  });
});
