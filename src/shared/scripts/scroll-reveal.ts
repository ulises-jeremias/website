/**
 * Scroll reveal — one progressive-enhancement primitive for the whole site.
 *
 * Elements marked with `data-reveal` fade/rise in the first time they enter
 * the viewport. No-JS and reduced-motion users see everything immediately:
 * the hidden state is only applied when JS is running (`.reveal-ready` on
 * <html>) and the global reduced-motion kill switch freezes the transition.
 */
(() => {
  const doc = document.documentElement;
  if (doc.classList.contains('reveal-ready')) return;
  doc.classList.add('reveal-ready');

  const targets = Array.from(document.querySelectorAll('[data-reveal]'));
  if (targets.length === 0) return;

  const show = (el) => el.classList.add('is-revealed');

  if (!('IntersectionObserver' in window)) {
    targets.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );

  for (const el of targets) {
    // Above-the-fold elements reveal immediately to avoid a flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) show(el);
    else observer.observe(el);
  }
})();
