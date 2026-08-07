import { describe, expect, it } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const componentsDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = resolve(componentsDirectory, '../..');

async function readSource(path: string): Promise<string> {
  return readFile(resolve(sourceDirectory, path), 'utf8');
}

describe('global site shell', () => {
  it('renders the homepage through the same SectionLayout shell as every world', async () => {
    const homepage = await readSource('pages/index.astro');

    expect(homepage).toMatch(/import SectionLayout from ['"]\.\.\/layouts\/SectionLayout\.astro['"]/);
    expect(homepage).not.toMatch(/import (?:Header|Footer) from/);
    expect(homepage).toContain('<SectionLayout');
  });

  it('derives desktop and mobile navigation from one canonical projection', async () => {
    const [header, mobile] = await Promise.all([
      readSource('shared/components/SiteHeader.astro'),
      readSource('shared/components/MobileNav.astro'),
    ]);

    expect(header).toContain('getPrimaryNavigation');
    expect(header).toContain('<MobileNav');
    expect(header).toContain('<DigitalNestMark');
    expect(mobile).not.toContain("from '@/data/project-worlds");
    expect(mobile).toContain('PrimaryNavigationItem[]');
  });

  it('sources footer routes and contact links from canonical data', async () => {
    const footer = await readSource('shared/components/SiteFooter.astro');

    expect(footer).toContain('getFooterRoutes');
    expect(footer).toContain("from '@/data/profile");
    expect(footer).not.toMatch(/mailto:[\w.+-]+@[\w.-]+/);
    expect(footer).not.toContain('Astro 7');
  });

  it('uses original SVG identity instead of emoji shell icons', async () => {
    const shell = (
      await Promise.all([
        readSource('shared/components/SiteHeader.astro'),
        readSource('shared/components/MobileNav.astro'),
        readSource('shared/components/SiteFooter.astro'),
      ])
    ).join('\n');

    expect(shell).not.toMatch(/[⬢☰✕🐦]/u);
    expect(shell).toContain('<svg');
  });

  it('removes the superseded homepage-only header and footer components', async () => {
    await expect(access(resolve(componentsDirectory, 'Header.astro'))).rejects.toThrow();
    await expect(access(resolve(componentsDirectory, 'Footer.astro'))).rejects.toThrow();
  });
});
