/**
 * Scroll reveal — one progressive-enhancement primitive for the whole site.
 *
 * Elements marked with `data-reveal` fade/rise the first time they enter the
 * viewport. No-JS and reduced-motion users see everything immediately.
 *
 * Safety net: all elements are revealed after a short timeout so content is
 * never permanently hidden (full-page screenshots, printing, bots).
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

  // Safety net: reveal everything after 3 s so full-page screenshots,
  // printing, and non-scrolling contexts never show hidden content.
  setTimeout(() => targets.forEach(show), 3000);
})();
