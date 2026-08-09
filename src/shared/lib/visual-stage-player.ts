/**
 * Shared stage scrubber + playback wiring (Toolkit Control Room / Workstation Boot pattern).
 * Native DOM only. Honors prefers-reduced-motion. Never uses innerHTML.
 *
 * ONE controller for the visual-first pass — do not duplicate in feature scripts
 * or `playback.ts` (removed).
 */

export type StagePlayerOptions = {
  root: HTMLElement;
  stageCount: number;
  onStage: (index: number) => void;
  autoplayOnce?: boolean;
  intervalMs?: number;
  /** When true, stage indices on scrubber buttons are 0-based (default). */
  zeroBased?: boolean;
};

export type StagePlayer = {
  setStage: (index: number) => void;
  play: () => void;
  pause: () => void;
  prev: () => void;
  next: () => void;
  replay: () => void;
  getIndex: () => number;
};

const INTERACTIVE_SELECTOR =
  'button, a, input, textarea, select, summary, option, [role="slider"], [role="spinbutton"], [contenteditable="true"]';

function isInteractiveTarget(target: HTMLElement): boolean {
  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export function initStagePlayer(options: StagePlayerOptions): StagePlayer {
  const { root, stageCount, onStage, autoplayOnce = true, intervalMs = 2000, zeroBased = true } = options;

  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let autoplayed = false;

  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrubberButtons = () =>
    Array.from(root.querySelectorAll<HTMLButtonElement>('[data-stage-index], [data-stage]'));

  const syncScrubber = () => {
    scrubberButtons().forEach((button) => {
      const raw = button.dataset.stageIndex;
      const buttonIndex = raw !== undefined && raw !== '' ? Number(raw) : scrubberButtons().indexOf(button);
      const normalized = zeroBased ? buttonIndex : buttonIndex - 1;
      button.setAttribute('aria-pressed', normalized === index ? 'true' : 'false');
    });
  };

  const setStage = (next: number) => {
    if (stageCount < 1) return;
    index = ((next % stageCount) + stageCount) % stageCount;
    syncScrubber();
    onStage(index);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const play = () => {
    if (reduced || stageCount < 2) return;
    stop();
    timer = setInterval(() => {
      if (index >= stageCount - 1) {
        stop();
        return;
      }
      setStage(index + 1);
    }, intervalMs);
  };

  const pause = () => stop();

  const prev = () => {
    stop();
    setStage(index - 1);
  };

  const next = () => {
    stop();
    setStage(index + 1);
  };

  const replay = () => {
    stop();
    setStage(0);
    play();
  };

  const maybeAutoplay = () => {
    if (!autoplayOnce || autoplayed || reduced) return;
    autoplayed = true;
    play();
  };

  scrubberButtons().forEach((button) => {
    button.addEventListener('click', () => {
      stop();
      const raw = button.dataset.stageIndex;
      let nextIndex = raw !== undefined && raw !== '' ? Number(raw) : scrubberButtons().indexOf(button);
      if (!zeroBased) nextIndex -= 1;
      setStage(nextIndex);
    });
  });

  root.querySelectorAll<HTMLElement>('[data-play], [data-vf-play]').forEach((el) => el.addEventListener('click', play));
  root
    .querySelectorAll<HTMLElement>('[data-pause], [data-vf-pause]')
    .forEach((el) => el.addEventListener('click', pause));
  root.querySelectorAll<HTMLElement>('[data-prev], [data-vf-prev]').forEach((el) => el.addEventListener('click', prev));
  root.querySelectorAll<HTMLElement>('[data-next], [data-vf-next]').forEach((el) => el.addEventListener('click', next));
  root
    .querySelectorAll<HTMLElement>('[data-replay], [data-vf-replay]')
    .forEach((el) => el.addEventListener('click', replay));

  root.addEventListener('keydown', (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (!root.contains(e.target)) return;
    if (isInteractiveTarget(e.target) && e.target !== root) {
      // Space on buttons already activates them; never steal arrows from form controls / links / summary.
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return;
      if (e.key === ' ' || e.code === 'Space') return;
    }
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (timer) pause();
      else play();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  });

  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) maybeAutoplay();
          else stop();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(root);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });

  setStage(0);

  return { setStage, play, pause, prev, next, replay, getIndex: () => index };
}
