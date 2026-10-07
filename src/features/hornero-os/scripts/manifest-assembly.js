(() => {
  const manifest = document.querySelector('.hos-yaml');
  const traceButton = manifest?.querySelector('[data-hos-trace]');
  const status = manifest?.querySelector('[data-hos-trace-status]');
  const steps = [...(manifest?.querySelectorAll('.hos-yaml__slot') || [])];
  if (!manifest || !traceButton || !status || steps.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;

  traceButton.hidden = false;

  const finishTrace = () => {
    steps.forEach((step) => step.classList.add('is-current'));
    manifest.dataset.traceState = 'complete';
    traceButton.textContent = 'Replay manifest assembly';
    status.textContent = 'Manifest trace complete. Installer and ISO slots remain reserved for future work.';
  };

  const stopTrace = () => {
    window.clearInterval(timer);
    window.clearTimeout(timer);
    steps.forEach((step) => {
      step.getAnimations().forEach((animation) => animation.cancel());
      step.classList.remove('is-current');
    });
  };

  const dockStep = (step) => {
    if (typeof step.animate !== 'function' || reducedMotion.matches) return;

    const animation = step.animate(
      [
        {
          transform: 'translate3d(-1.4rem, 0.8rem, -1.5rem) rotateX(13deg) rotateZ(-1.5deg) scale(0.94)',
          filter: 'brightness(0.72)',
          offset: 0,
        },
        {
          transform: 'translate3d(0.25rem, -0.1rem, 1.25rem) rotateX(0) rotateZ(0) scale(1.015)',
          filter: 'brightness(1.3)',
          offset: 0.7,
        },
        {
          transform: 'translate3d(0.25rem, -0.1rem, 1.25rem) rotateX(0) rotateZ(0) scale(1)',
          filter: 'brightness(1)',
          offset: 1,
        },
      ],
      { duration: 620, easing: 'cubic-bezier(0.18, 0.78, 0.24, 1)' },
    );

    animation.onfinish = () => animation.cancel();
  };

  traceButton.addEventListener('click', () => {
    stopTrace();
    traceButton.textContent = 'Restart assembly trace';
    manifest.dataset.traceState = 'running';

    if (reducedMotion.matches) {
      finishTrace();
      return;
    }

    let index = 0;
    const showStep = () => {
      const step = steps[index++];
      if (!step) return;

      step.classList.add('is-current');
      dockStep(step);

      const name = step.querySelector('.hos-yaml__key')?.textContent?.slice(0, -1);
      const state = step.querySelector('.hos-yaml__status')?.textContent;
      const value = step.querySelector('.hos-yaml__value')?.textContent;
      status.textContent = `${name}: ${state} ${value}`;

      if (index === steps.length) {
        window.clearInterval(timer);
        timer = window.setTimeout(finishTrace, 700);
      }
    };
    showStep();
    timer = window.setInterval(showStep, 700);
  });

  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches || manifest.dataset.traceState !== 'running') return;
    stopTrace();
    finishTrace();
  });
})();
