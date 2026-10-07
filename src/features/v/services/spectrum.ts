export const VSL_SAMPLE_COUNT = 64;
export const VSL_MAX_FUNDAMENTAL = 12;

export interface SpectrumBin {
  bin: number;
  magnitude: number;
}

/** Build a deterministic teaching signal with one visible harmonic. */
export function sampleSignal(frequency: number, sampleCount = VSL_SAMPLE_COUNT): number[] {
  if (!Number.isInteger(frequency) || frequency < 1 || frequency * 2 >= sampleCount / 2) {
    throw new RangeError('The fundamental must be an integer below one quarter of the sample count.');
  }

  return Array.from({ length: sampleCount }, (_, sample) => {
    const phase = (2 * Math.PI * frequency * sample) / sampleCount;
    return Math.sin(phase) + 0.45 * Math.sin(2 * phase + Math.PI / 4);
  });
}

/** Compute the single-sided amplitude spectrum with a direct discrete Fourier transform. */
export function calculateSpectrum(samples: readonly number[]): SpectrumBin[] {
  if (samples.length < 2 || samples.some((sample) => !Number.isFinite(sample))) {
    throw new RangeError('The spectrum requires at least two finite samples.');
  }

  const sampleCount = samples.length;
  const lastBin = Math.floor(sampleCount / 2);
  return Array.from({ length: lastBin + 1 }, (_, bin) => {
    let real = 0;
    let imaginary = 0;
    for (let sample = 0; sample < sampleCount; sample += 1) {
      const angle = (2 * Math.PI * bin * sample) / sampleCount;
      real += samples[sample]! * Math.cos(angle);
      imaginary -= samples[sample]! * Math.sin(angle);
    }

    const isEdgeBin = bin === 0 || (sampleCount % 2 === 0 && bin === lastBin);
    const scale = (isEdgeBin ? 1 : 2) / sampleCount;
    return { bin, magnitude: Math.hypot(real, imaginary) * scale };
  });
}

export function dominantSpectrumBins(spectrum: readonly SpectrumBin[], count = 2): number[] {
  return [...spectrum]
    .sort((left, right) => right.magnitude - left.magnitude)
    .slice(0, count)
    .map(({ bin }) => bin)
    .sort((left, right) => left - right);
}
