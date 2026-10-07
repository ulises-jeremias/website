(function initializeRouteFinder() {
  const finder = document.querySelector<HTMLElement>('[data-route-finder]');
  const query = document.querySelector<HTMLInputElement>('#lost-route-query');
  const liveRegion = document.querySelector<HTMLElement>('#lost-route-status');
  const emptyState = document.querySelector<HTMLElement>('[data-route-empty]');
  const entries = Array.from(document.querySelectorAll<HTMLElement>('[data-route-entry]'));
  const groups = Array.from(document.querySelectorAll<HTMLElement>('[data-route-group]'));

  if (finder && query && liveRegion && emptyState && entries.length > 0) {
    finder.hidden = false;

    const normalize = (value: string) => value.trim().toLowerCase().replace(/\/+$/, '');
    let lastAcquiredHref = '';

    const updateAtlas = () => {
      const needle = normalize(query.value);
      const visibleEntries = entries.filter((entry) => {
        const link = entry.querySelector<HTMLAnchorElement>('a');
        const haystack = normalize(`${link?.textContent ?? ''} ${link?.getAttribute('href') ?? ''}`);
        const matches = !needle || haystack.includes(needle);

        entry.hidden = !matches;
        entry.removeAttribute('data-exact-match');
        return matches;
      });

      groups.forEach((group) => {
        group.hidden = !group.querySelector('[data-route-entry]:not([hidden])');
      });

      emptyState.hidden = visibleEntries.length > 0;

      if (needle && visibleEntries.length === 1) {
        const entry = visibleEntries[0];
        const link = entry.querySelector<HTMLAnchorElement>('a');
        if (!link) return;

        entry.setAttribute('data-exact-match', 'true');
        const label = link.querySelector('strong')?.textContent?.trim() ?? 'Destination';
        liveRegion.textContent = `Signal acquired: ${label}. Press Enter to open it.`;

        if (link.href !== lastAcquiredHref && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          entry.animate(
            [
              { transform: 'translateX(-0.45rem)', opacity: 0.68 },
              { transform: 'translateX(0)', opacity: 1 },
            ],
            { duration: 460, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
          );
        }

        lastAcquiredHref = link.href;
      } else if (needle && visibleEntries.length === 0) {
        liveRegion.textContent = 'No destinations found. Clear the search to view every route.';
        lastAcquiredHref = '';
      } else if (needle) {
        liveRegion.textContent = `${visibleEntries.length} destinations remain. Refine the signal to one route.`;
        lastAcquiredHref = '';
      } else {
        liveRegion.textContent = `Search is ready for ${entries.length} verified destinations.`;
        lastAcquiredHref = '';
      }
    };

    query.addEventListener('input', updateAtlas);
    query.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;

      const match = entries.find((entry) => !entry.hidden && entry.dataset.exactMatch === 'true');
      const link = match?.querySelector<HTMLAnchorElement>('a');
      if (!link) return;

      event.preventDefault();
      window.location.assign(link.href);
    });
  }
})();
