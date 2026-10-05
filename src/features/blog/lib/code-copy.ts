export type ClipboardWriter = Pick<Clipboard, 'writeText'>;

function getLanguage(pre: HTMLElement, code: HTMLElement): string | undefined {
  const languageClass = Array.from(code.classList).find((name) => name.startsWith('language-'));
  const language = pre.dataset.language ?? code.dataset.language ?? languageClass?.slice('language-'.length);
  if (language) pre.dataset.language = language;
  return language?.replace(/[-_]+/g, ' ').trim() || undefined;
}

/** Add copy controls to rendered code blocks without changing their static fallback. */
export function enhanceCodeBlocks(root: ParentNode, clipboard?: ClipboardWriter): void {
  for (const pre of root.querySelectorAll<HTMLElement>('.blog-prose pre')) {
    const code = pre.querySelector<HTMLElement>('code');
    if (!code || pre.dataset.copyReady === 'true') continue;

    pre.dataset.copyReady = 'true';

    const language = getLanguage(pre, code);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'blog-code__copy';
    button.textContent = 'Copy code';
    button.setAttribute('aria-label', language ? `Copy ${language} code` : 'Copy code');

    const status = document.createElement('span');
    status.className = 'blog-code__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    button.addEventListener('click', async () => {
      try {
        const writer = clipboard ?? navigator.clipboard;
        if (!writer) throw new Error('Clipboard unavailable');
        await writer.writeText(code.textContent ?? '');
        button.textContent = 'Copied';
        status.textContent = 'Code copied to clipboard.';
      } catch {
        button.textContent = 'Copy failed';
        status.textContent = 'Copy failed. Select and copy the code manually.';
      }
    });

    pre.append(button, status);
  }
}
