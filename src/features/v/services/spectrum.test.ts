import { describe, expect, it } from 'vitest';
import { calculateSpectrum, dominantSpectrumBins, sampleSignal } from './spectrum.js';

describe('VSL teaching spectrum', () => {
  it.each([5, 7, 12])('finds the fundamental and second harmonic at %i cycles', (frequency) => {
    const spectrum = calculateSpectrum(sampleSignal(frequency));

    expect(spectrum).toHaveLength(33);
    expect(dominantSpectrumBins(spectrum)).toEqual([frequency, frequency * 2]);
    expect(spectrum[frequency]?.magnitude).toBeCloseTo(1, 10);
    expect(spectrum[frequency * 2]?.magnitude).toBeCloseTo(0.45, 10);
  });

  it('rejects fundamentals whose second harmonic reaches the Nyquist boundary', () => {
    expect(() => sampleSignal(16)).toThrow(RangeError);
  });

  it('rejects invalid sample sequences', () => {
    expect(() => calculateSpectrum([1])).toThrow(RangeError);
    expect(() => calculateSpectrum([0, Number.NaN])).toThrow(RangeError);
  });
});
