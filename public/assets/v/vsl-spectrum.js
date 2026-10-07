(() => {
  const SAMPLE_COUNT = 64;

  function sampleSignal(frequency) {
    return Array.from({ length: SAMPLE_COUNT }, (_, sample) => {
      const phase = (2 * Math.PI * frequency * sample) / SAMPLE_COUNT;
      return Math.sin(phase) + 0.45 * Math.sin(2 * phase + Math.PI / 4);
    });
  }

  function spectrumOf(samples) {
    const lastBin = Math.floor(samples.length / 2);
    return Array.from({ length: lastBin + 1 }, (_, bin) => {
      let real = 0;
      let imaginary = 0;
      for (let sample = 0; sample < samples.length; sample += 1) {
        const angle = (2 * Math.PI * bin * sample) / samples.length;
        real += samples[sample] * Math.cos(angle);
        imaginary -= samples[sample] * Math.sin(angle);
      }
      const edgeBin = bin === 0 || (samples.length % 2 === 0 && bin === lastBin);
      return { bin, magnitude: (Math.hypot(real, imaginary) * (edgeBin ? 1 : 2)) / samples.length };
    });
  }

  function dominantBins(spectrum) {
    return [...spectrum]
      .sort((left, right) => right.magnitude - left.magnitude)
      .slice(0, 2)
      .map(({ bin }) => bin)
      .sort((left, right) => left - right);
  }

  function init(root) {
    const controls = root.querySelector('[data-vsl-controls]');
    const frequencyInput = root.querySelector('[data-vsl-frequency]');
    const frequencyReadout = root.querySelector('[data-vsl-frequency-readout]');
    const signal = root.querySelector('[data-vsl-signal]');
    const bins = root.querySelector('[data-vsl-bins]');
    const peaksPath = root.querySelector('[data-vsl-peaks]');
    const equation = root.querySelector('[data-vsl-equation]');
    const summary = root.querySelector('[data-vsl-summary]');
    const description = root.querySelector('[data-vsl-description]');
    const status = root.querySelector('[data-v-scene-live]');
    const runButton = root.querySelector('[data-vsl-run]');

    if (
      !(controls instanceof HTMLElement) ||
      !(frequencyInput instanceof HTMLInputElement) ||
      !(frequencyReadout instanceof HTMLOutputElement) ||
      !(signal instanceof SVGPolylineElement) ||
      !(bins instanceof SVGPathElement) ||
      !(peaksPath instanceof SVGPathElement) ||
      !(equation instanceof HTMLElement) ||
      !(summary instanceof HTMLElement) ||
      !(description instanceof SVGDescElement) ||
      !(status instanceof HTMLElement) ||
      !(runButton instanceof HTMLButtonElement)
    ) {
      return;
    }

    const animations = new Set();
    let run = 0;
    const stopAnimations = () => {
      run += 1;
      for (const animation of animations) animation.cancel();
      animations.clear();
      signal.style.removeProperty('stroke-dasharray');
      signal.style.removeProperty('stroke-dashoffset');
    };
    const render = () => {
      stopAnimations();
      const frequency = Number(frequencyInput.value);
      const samples = sampleSignal(frequency);
      const spectrum = spectrumOf(samples);
      const peaks = dominantBins(spectrum);
      const points = samples
        .map(
          (sample, index) =>
            `${(72 + (index / (SAMPLE_COUNT - 1)) * 576).toFixed(2)},${(119 - sample * 34).toFixed(2)}`,
        )
        .join(' ');
      const toPath = (predicate) =>
        spectrum
          .filter(predicate)
          .map(({ bin, magnitude }) => {
            const height = Math.max(0.8, magnitude * 58);
            const x = 72 + bin * (576 / spectrum.length) + 576 / (spectrum.length * 2);
            return `M${x.toFixed(2)} 314v-${height.toFixed(2)}`;
          })
          .join(' ');

      signal.setAttribute('points', points);
      bins.setAttribute(
        'd',
        toPath(({ magnitude }) => magnitude <= 0.05),
      );
      peaksPath.setAttribute(
        'd',
        toPath(({ magnitude }) => magnitude > 0.05),
      );
      const equationText = `x[n] = sin(2π · ${frequency}n/64) + 0.45 sin(2π · ${frequency * 2}n/64 + π/4)`;
      const peakText = peaks.join(' and ');
      frequencyReadout.value = `${frequency} cycles / window`;
      frequencyInput.setAttribute('aria-valuetext', `${frequency} cycles per window`);
      equation.textContent = equationText;
      summary.textContent = `${SAMPLE_COUNT} samples · dominant bins ${peakText}`;
      description.textContent = `A synthetic 64-sample signal combines a ${frequency}-cycle fundamental with a ${frequency * 2}-cycle harmonic. Its discrete Fourier transform has peaks at bins ${peakText}.`;
      return { frequency, peaks };
    };
    const animateTransform = async () => {
      const { peaks } = render();
      const currentRun = run;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        status.textContent = `DFT complete · dominant bins ${peaks.join(' and ')}.`;
        return;
      }
      const length = signal.getTotalLength();
      signal.style.strokeDasharray = String(length);
      signal.style.strokeDashoffset = String(length);
      status.textContent = 'DFT running · following 64 samples into frequency bins.';
      const trace = signal.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
        duration: 850,
        easing: 'ease-in-out',
      });
      animations.add(trace);
      [bins, peaksPath].forEach((path, index) => {
        const animation = path.animate(
          [
            { transform: 'scaleY(0.04)', opacity: 0.2 },
            { transform: 'scaleY(1)', opacity: index === 1 ? 1 : 0.58 },
          ],
          { duration: 420, delay: 580 + index * 180, easing: 'cubic-bezier(.2,.8,.2,1)' },
        );
        animations.add(animation);
      });
      await Promise.allSettled([...animations].map((animation) => animation.finished));
      if (currentRun === run) {
        signal.style.removeProperty('stroke-dasharray');
        signal.style.removeProperty('stroke-dashoffset');
        status.textContent = `DFT complete · dominant bins ${peaks.join(' and ')}.`;
        animations.clear();
      }
    };

    frequencyInput.addEventListener('input', () => {
      const { peaks } = render();
      status.textContent = '';
      summary.textContent = `${SAMPLE_COUNT} samples · dominant bins ${peaks.join(' and ')} · ready to run`;
    });
    frequencyInput.addEventListener('change', () => {
      const { frequency, peaks } = render();
      summary.textContent = `${SAMPLE_COUNT} samples · dominant bins ${peaks.join(' and ')} · ready to run`;
      status.textContent = `Signal set to ${frequency} cycles per window. Dominant bins ${peaks.join(' and ')}.`;
    });
    runButton.addEventListener('click', animateTransform);
    frequencyInput.disabled = false;
    runButton.disabled = false;
    controls.hidden = false;
    status.textContent = 'Ready · change the fundamental or run the discrete Fourier transform.';
  }

  document.querySelectorAll('[data-v-scene="vsl"]').forEach(init);
})();
