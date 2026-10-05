import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enhanceCodeBlocks } from './code-copy';

describe('blog code copy controls', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <div class="blog-prose">
          <pre class="astro-code" data-language="typescript"><code>const answer = 42;\n</code></pre>
          <pre><code class="language-javascript">const answer = 42;</code></pre>
          <pre><code>plain text</code></pre>
        </div>
      </main>
    `;
  });

  it('adds one labeled copy control per code block and copies code text only', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const content = document.querySelector('.blog-prose')!;

    enhanceCodeBlocks(content, { writeText });
    enhanceCodeBlocks(content, { writeText });

    const buttons = content.querySelectorAll<HTMLButtonElement>('.blog-code__copy');
    expect(buttons).toHaveLength(3);
    expect(buttons[0].getAttribute('aria-label')).toBe('Copy typescript code');
    expect(buttons[1].getAttribute('aria-label')).toBe('Copy javascript code');
    expect(buttons[2].getAttribute('aria-label')).toBe('Copy code');

    buttons[0].click();

    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('const answer = 42;\n'));
    expect(buttons[0].textContent).toBe('Copied');
    expect(content.querySelector('[role="status"]')?.textContent).toBe('Code copied to clipboard.');
  });

  it('keeps code manually copyable and explains when clipboard access fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('permission denied'));
    const content = document.querySelector('.blog-prose')!;
    enhanceCodeBlocks(content, { writeText });

    const button = content.querySelector<HTMLButtonElement>('.blog-code__copy')!;
    button.click();

    await vi.waitFor(() =>
      expect(content.querySelector('[role="status"]')?.textContent).toBe(
        'Copy failed. Select and copy the code manually.',
      ),
    );
    expect(button.textContent).toBe('Copy failed');
    expect(content.querySelector('pre code')?.textContent).toBe('const answer = 42;\n');
  });
});
