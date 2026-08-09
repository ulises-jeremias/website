/**
 * Lightweight stage playback controller (Toolkit Control Room pattern).
 * Native DOM only — no framework. Honors prefers-reduced-motion.
 */

export type StagePlaybackOptions = {
  root: HTMLElement;
  stageCount: number;
  intervalMs?: number;
  autoplayOnce?: boolean;
  onChange: (index: number) => void;
};

export function createStagePlayback(options: StagePlaybackOptions) {
  const { root, stageCount, intervalMs = 1800, autoplayOnce = true, onChange } = options;
  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let autoplayed = false;

  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setIndex = (next: number) => {
    index = ((next % stageCount) + stageCount) % stageCount;
    onChange(index);
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
      setIndex(index + 1);
    }, intervalMs);
  };

  const pause = () => stop();

  const prev = () => {
    stop();
    setIndex(index - 1);
  };

  const next = () => {
    stop();
    setIndex(index + 1);
  };

  const replay = () => {
    stop();
    setIndex(0);
    play();
  };

  const maybeAutoplay = () => {
    if (!autoplayOnce || autoplayed || reduced) return;
    autoplayed = true;
    play();
  };

  root.querySelectorAll<HTMLElement>('[data-vf-play]').forEach((el) => el.addEventListener('click', play));
  root.querySelectorAll<HTMLElement>('[data-vf-pause]').forEach((el) => el.addEventListener('click', pause));
  root.querySelectorAll<HTMLElement>('[data-vf-prev]').forEach((el) => el.addEventListener('click', prev));
  root.querySelectorAll<HTMLElement>('[data-vf-next]').forEach((el) => el.addEventListener('click', next));
  root.querySelectorAll<HTMLElement>('[data-vf-replay]').forEach((el) => el.addEventListener('click', replay));

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

  setIndex(0);

  return { setIndex, play, pause, prev, next, replay, stop, getIndex: () => index };
}
