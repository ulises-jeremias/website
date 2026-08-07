import { describe, expect, it } from 'vitest';
import { getExampleById, getExamples } from '@/features/_feature-template_/services/exampleService';

describe('exampleService', () => {
  it('returns examples', () => {
    const examples = getExamples();
    expect(examples.length).toBeGreaterThan(0);
    expect(examples[0]).toHaveProperty('id');
    expect(examples[0]).toHaveProperty('title');
  });

  it('returns example by id', () => {
    const example = getExampleById('static-html');
    expect(example).toBeDefined();
    expect(example?.title).toBe('Static HTML output');
  });

  it('returns undefined for unknown id', () => {
    expect(getExampleById('unknown')).toBeUndefined();
  });
});
