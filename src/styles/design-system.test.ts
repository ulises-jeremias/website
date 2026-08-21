import { describe, expect, it } from 'vitest';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const stylesDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = resolve(stylesDirectory, '..');
const approvedPrimitives = {
  '--nest-midnight-950': '#040212',
  '--nest-midnight-900': '#050317',
  '--nest-midnight-850': '#090428',
  '--nest-void': '#0b0614',
  '--nest-paper': '#f7f5ff',
  '--nest-text-muted': '#b9b2d8',
  '--nest-text-faint': '#8f88b4',
  '--nest-magenta': '#ff42d0',
  '--nest-pink': '#ff84f1',
  '--nest-violet': '#a05cff',
  '--nest-purple': '#7358ff',
  '--nest-blue': '#55b9ff',
  '--nest-cyan': '#1cefff',
  '--nest-sunset-orange': '#ff9a4d',
  '--nest-sunset-pink': '#ff658f',
} as const;
const legacyPalette = {
  warmPaper: '#f7f0e6',
  warmWhite: '#fffdf9',
  deepInk: '#181512',
  inkSoft: '#3a352f',
  mutedInk: '#5a5e4f',
} as const;
const themeContracts = {
  'dotfiles.css': {
    accent: '#8a4d6a',
    strong: '#6f3d55',
    boundary: '#8a4d6a',
    world: '--nest-sunset-pink',
    worldStrong: '--nest-pink',
    worldSecondary: '--nest-magenta',
    worldTertiary: '--nest-sunset-orange',
  },
  'workstation.css': {
    accent: '#1e5a8a',
    strong: '#16446a',
    boundary: '#236f9e',
    world: '--nest-cyan',
    worldStrong: '--nest-cyan',
    worldSecondary: '--nest-violet',
    worldTertiary: '--nest-blue',
  },
  'toolkit.css': {
    accent: '#6b4a9c',
    strong: '#543a7d',
    boundary: '#6b4a9c',
    world: '--nest-violet',
    worldStrong: '--nest-pink',
    worldSecondary: '--nest-cyan',
    worldTertiary: '--nest-sunset-orange',
  },
  'v.css': {
    accent: '#1e5a8a',
    strong: '#16446a',
    boundary: '#236f9e',
    world: '--nest-blue',
    worldStrong: '--nest-cyan',
    worldSecondary: '--nest-cyan',
    worldTertiary: '--nest-sunset-orange',
  },
  'create-awesome.css': {
    accent: '#9a6200',
    strong: '#7a4d00',
    boundary: '#9a6200',
    world: '--nest-sunset-orange',
    worldStrong: '--nest-sunset-orange',
    worldSecondary: '--nest-cyan',
    worldTertiary: '--nest-violet',
  },
  'community.css': {
    accent: '#6b5a4a',
    strong: '#5a4b3e',
    boundary: '#6b5a4a',
    world: '--nest-sunset-orange',
    worldStrong: '--nest-sunset-orange',
    worldSecondary: '--nest-magenta',
    worldTertiary: '--nest-cyan',
  },
} as const;
const themeFiles = Object.keys(themeContracts) as Array<keyof typeof themeContracts>;

async function readSource(relativePath: string): Promise<string> {
  return readFile(resolve(stylesDirectory, relativePath), 'utf8');
}

function getCssImports(source: string): string[] {
  const normalizedSource = withoutComments(source);
  const sideEffectImports = [...normalizedSource.matchAll(/(?:@import|import)\s+['"]([^'"]+\.css)['"]/g)];
  const fromImports = [...normalizedSource.matchAll(/import\s+[^;\n]+?\s+from\s+['"]([^'"]+\.css)['"]/g)];
  const dynamicImports = [...normalizedSource.matchAll(/import\(\s*['"]([^'"]+\.css)['"]\s*\)/g)];

  return [...sideEffectImports, ...fromImports, ...dynamicImports].map((match) => match[1]);
}

function getCustomPropertyValue(source: string, property: string): string | undefined {
  return withoutComments(source)
    .match(new RegExp(`${property}:\\s*([^;]+);`))?.[1]
    .trim();
}

function withoutComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function getCustomPropertyReferences(source: string): Array<{ name: string; hasFallback: boolean }> {
  const normalizedSource = withoutComments(source);

  return [...normalizedSource.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/g)].map((match) => {
    let depth = 0;
    let hasFallback = false;

    for (let index = match.index; index < normalizedSource.length; index++) {
      const character = normalizedSource[index];

      if (character === '(') {
        depth++;
      } else if (character === ')') {
        depth--;
        if (depth === 0) break;
      } else if (character === ',' && depth === 1) {
        hasFallback = true;
      }
    }

    return { name: match[1], hasFallback };
  });
}

function getAstroDefinedVariables(source: string): string[] {
  return [...source.matchAll(/<style\b[^>]*define:vars=\{\{\s*([^}]+)\s*\}\}[^>]*>/g)].flatMap((match) =>
    match[1]
      .split(',')
      .map((entry) =>
        entry
          .split(':')[0]
          .trim()
          .replace(/^['"]|['"]$/g, ''),
      )
      .filter(Boolean)
      .map((name) => `--${name}`),
  );
}

async function collectFiles(directory: string, extension: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        return collectFiles(entryPath, extension);
      }

      return entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : [];
    }),
  );

  return files.flat();
}

async function collectFilesByExtensions(directory: string, extensions: string[]): Promise<string[]> {
  return (await Promise.all(extensions.map((extension) => collectFiles(directory, extension)))).flat();
}

function resolveCssImport(importer: string, cssImport: string): string | undefined {
  if (cssImport.startsWith('@/')) {
    return resolve(sourceDirectory, cssImport.slice(2));
  }

  return cssImport.startsWith('.') ? resolve(dirname(importer), cssImport) : undefined;
}

async function collectGlobalStyleTree(
  filePath = resolve(stylesDirectory, 'index.css'),
  collected = new Map<string, string>(),
): Promise<Map<string, string>> {
  if (collected.has(filePath)) {
    return collected;
  }

  const source = await readFile(filePath, 'utf8');
  collected.set(filePath, source);

  for (const cssImport of getCssImports(source)) {
    if (cssImport.startsWith('.')) {
      await collectGlobalStyleTree(resolve(dirname(filePath), cssImport), collected);
    }
  }

  return collected;
}

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function mixHex(first: string, second: string, firstPercentage: number): string {
  const percentage = firstPercentage / 100;
  const firstChannels = first
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16));
  const secondChannels = second
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16));
  const mixed = firstChannels.map((channel, index) =>
    Math.round(channel * percentage + secondChannels[index] * (1 - percentage)),
  );

  return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function resolveApprovedPrimitive(value: string): string | undefined {
  const token = value.match(/^var\((--nest-[a-z0-9-]+)\)$/)?.[1] as keyof typeof approvedPrimitives | undefined;
  return token ? approvedPrimitives[token] : undefined;
}

function resolveLegacyTint(value: string, accent: string): string | undefined {
  const percentage = value.match(
    /^color-mix\(in srgb, var\(--theme-accent\) ([0-9.]+)%, var\(--color-warm-paper\)\)$/,
  )?.[1];
  return percentage ? mixHex(accent, legacyPalette.warmPaper, Number.parseFloat(percentage)) : undefined;
}

function buildCustomPropertyGraph(sources: string[]): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  for (const source of sources.map(withoutComments)) {
    for (const declaration of source.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
      const dependencies = [...declaration[2].matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/g)].map((match) => match[1]);
      const currentDependencies = graph.get(declaration[1]) ?? new Set<string>();
      dependencies.forEach((dependency) => currentDependencies.add(dependency));
      graph.set(declaration[1], currentDependencies);
    }
  }

  return graph;
}

function findCustomPropertyCycle(graph: Map<string, Set<string>>): string[] | undefined {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const path: string[] = [];

  function visit(variable: string): string[] | undefined {
    if (visiting.has(variable)) {
      const cycleStart = path.indexOf(variable);
      return [...path.slice(cycleStart), variable];
    }

    if (visited.has(variable)) return undefined;

    visiting.add(variable);
    path.push(variable);

    for (const dependency of graph.get(variable) ?? []) {
      if (graph.has(dependency)) {
        const cycle = visit(dependency);
        if (cycle) return cycle;
      }
    }

    path.pop();
    visiting.delete(variable);
    visited.add(variable);
    return undefined;
  }

  for (const variable of graph.keys()) {
    const cycle = visit(variable);
    if (cycle) return cycle;
  }

  return undefined;
}

describe('global design system architecture', () => {
  it('loads each global layer once from its approved owner across source files', async () => {
    const importCapableFiles = await collectFilesByExtensions(sourceDirectory, [
      '.astro',
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.mjs',
      '.css',
    ]);
    const cssImports = (
      await Promise.all(
        importCapableFiles.map(async (filePath) => {
          const source = await readFile(filePath, 'utf8');
          return getCssImports(source)
            .map((cssImport) => resolveCssImport(filePath, cssImport))
            .filter((target): target is string => target !== undefined)
            .map((target) => ({ importer: filePath, target }));
        }),
      )
    ).flat();
    const entryPoint = resolve(stylesDirectory, 'index.css');
    const themesEntryPoint = resolve(stylesDirectory, 'themes/index.css');
    const baseLayout = resolve(sourceDirectory, 'layouts/BaseLayout.astro');
    const indexLayers = [
      'reset.css',
      'fonts.css',
      'tokens.css',
      'typography.css',
      'spacing.css',
      'semantic.css',
      'motion.css',
      'effects.css',
      'themes/index.css',
    ].map((file) => resolve(stylesDirectory, file));
    const themeLayers = themeFiles.map((file) => resolve(stylesDirectory, 'themes', file));
    const globalLayers = new Set([entryPoint, ...indexLayers, ...themeLayers]);
    const globalImports = cssImports.filter(({ target }) => globalLayers.has(target));
    const unexpectedImports = globalImports
      .filter(({ importer, target }) => {
        if (importer === baseLayout && target === entryPoint) return false;
        if (importer === entryPoint && indexLayers.includes(target)) return false;
        if (importer === themesEntryPoint && themeLayers.includes(target)) return false;
        return true;
      })
      .map(({ importer, target }) => ({
        importer: relative(sourceDirectory, importer).replaceAll('\\', '/'),
        target: relative(sourceDirectory, target).replaceAll('\\', '/'),
      }));

    expect(globalImports.filter(({ target }) => target === entryPoint)).toEqual([
      { importer: baseLayout, target: entryPoint },
    ]);
    expect(unexpectedImports).toEqual([]);
  });

  it('orders every global CSS layer through index.css', async () => {
    const entryPoint = await readSource('./index.css');

    expect(getCssImports(entryPoint)).toEqual([
      './reset.css',
      './fonts.css',
      './tokens.css',
      './typography.css',
      './spacing.css',
      './semantic.css',
      './motion.css',
      './effects.css',
      './themes/index.css',
    ]);
  });

  it('exposes the exact approved primitive palette', async () => {
    const tokens = await readSource('./tokens.css');

    for (const [token, value] of Object.entries(approvedPrimitives)) {
      expect(getCustomPropertyValue(tokens, token), token).toBe(value);
    }
  });

  it('keeps legacy paper and ink roles contrast-safe for light route surfaces', async () => {
    const semantic = await readSource('./semantic.css');
    const expectedSemanticAliases = {
      '--color-paper': 'var(--color-warm-paper)',
      '--color-ink': 'var(--color-deep-ink)',
      '--color-ink-soft': 'var(--color-neutral-700)',
      '--color-muted': 'var(--color-moss-strong)',
    };

    for (const [alias, value] of Object.entries(expectedSemanticAliases)) {
      expect(getCustomPropertyValue(semantic, alias), alias).toBe(value);
    }

    expect(contrastRatio(legacyPalette.deepInk, legacyPalette.warmPaper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(legacyPalette.inkSoft, legacyPalette.warmPaper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(legacyPalette.mutedInk, legacyPalette.warmPaper)).toBeGreaterThanOrEqual(4.5);
  });

  it('locks the core dark semantic mappings independently from compatibility aliases', async () => {
    const semantic = await readSource('./semantic.css');
    const expectedCoreRoles = {
      '--color-bg': 'var(--nest-midnight-950)',
      '--color-text': 'var(--nest-paper)',
      '--color-text-muted': 'var(--nest-text-muted)',
      '--color-accent': 'var(--nest-magenta)',
      '--color-focus': 'var(--nest-cyan)',
    };

    for (const [role, value] of Object.entries(expectedCoreRoles)) {
      expect(getCustomPropertyValue(semantic, role), role).toBe(value);
    }
  });

  it('keeps SectionLayout on new dark semantic roles only', async () => {
    const layout = withoutComments(await readSource('../layouts/SectionLayout.astro'));
    const style = layout.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';

    expect(style).toContain('--hero-bg: var(--color-surface);');
    expect(style).toContain('--hero-fg: var(--color-text);');
    expect(style).toContain('--hero-muted: var(--color-text-muted);');
    expect(style).toContain('background: var(--color-bg);');
    expect(style).toContain('color: var(--color-text);');
    expect(style).toMatch(/border-bottom:\s*1px solid color-mix\(in srgb, var\(--world-accent\)/);
    expect(style).toMatch(
      /\.section-content\s*\{[\s\S]*?background:\s*var\(--nest-midnight-950\);[\s\S]*?color:\s*var\(--color-text\);/,
    );
    expect(style).not.toMatch(/var\(--color-(?:paper|ink|ink-soft|muted|warm-white)\b/);
  });

  it('provides focus, motion, effects, reduced-motion, and forced-colors primitives', async () => {
    const [entryPoint, motion, effects] = await Promise.all([
      readSource('./index.css'),
      readSource('./motion.css'),
      readSource('./effects.css'),
    ]);
    const motionPrimitives = [
      '--motion-duration-fast',
      '--motion-duration-base',
      '--motion-duration-ambient',
      '--motion-ease-standard',
      '--motion-ease-out',
    ];
    const effectPrimitives = ['--focus-glow', '--effect-glow-active', '--clip-corner-md', '--atmosphere-field'];

    for (const token of motionPrimitives) {
      expect(getCustomPropertyValue(motion, token), token).toBeDefined();
    }

    for (const token of effectPrimitives) {
      expect(getCustomPropertyValue(effects, token), token).toBeDefined();
    }

    expect(motion).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(motion).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    expect(motion).not.toMatch(/transition\s*:\s*none/);
    expect(`${entryPoint}\n${effects}`).toMatch(/@media\s*\(forced-colors:\s*active\)/);
  });

  it('keeps global custom-property references inside the global style tree', async () => {
    const globalStyles = await collectGlobalStyleTree();
    const sources = [...globalStyles.values()].map(withoutComments);
    const definedVariables = new Set(
      sources.flatMap((source) => [...source.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((match) => match[1])),
    );
    const referencedVariables = new Set(
      sources.flatMap((source) => [...source.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/g)].map((match) => match[1])),
    );
    const unresolvedVariables = [...referencedVariables].filter((variable) => !definedVariables.has(variable)).sort();

    expect(unresolvedVariables).toEqual([]);
  });

  it('has no custom-property dependency cycles in the global style graph', async () => {
    const globalStyles = await collectGlobalStyleTree();
    const graph = buildCustomPropertyGraph([...globalStyles.values()]);

    expect(findCustomPropertyCycle(graph)).toBeUndefined();
  });

  it('resolves route and component variables through project styles or explicit fallbacks', async () => {
    const sourceFiles = [
      ...(await collectFiles(sourceDirectory, '.css')),
      ...(await collectFiles(sourceDirectory, '.astro')),
    ];
    const sources = await Promise.all(
      sourceFiles.map(async (filePath) => ({
        file: relative(sourceDirectory, filePath).replaceAll('\\', '/'),
        source: withoutComments(await readFile(filePath, 'utf8')),
      })),
    );
    const definedVariables = new Set(
      sources.flatMap(({ file, source }) => [
        ...[...source.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((match) => match[1]),
        ...(file.endsWith('.astro') ? getAstroDefinedVariables(source) : []),
      ]),
    );
    const unresolvedVariables = sources
      .flatMap(({ file, source }) =>
        getCustomPropertyReferences(source)
          .filter(({ name, hasFallback }) => !definedVariables.has(name) && !hasFallback)
          .map(({ name }) => `${file}: ${name}`),
      )
      .sort();

    expect(unresolvedVariables).toEqual([]);
  });

  it('classifies current route theme consumers as dark world-surface usages', async () => {
    const [workstationMap, vLab, vCard] = await Promise.all([
      readSource('../features/workstation/components/WorkstationSystemMap.astro'),
      readSource('../features/v/components/VComputationalLab.astro'),
      readSource('../features/v/components/VCards.astro'),
    ]);
    const currentRouteSources = `${workstationMap}\n${vLab}\n${vCard}`;

    expect(currentRouteSources).toMatch(/background:\s*var\(--(?:color-surface|nest-midnight-900|world-surface-tint)/);
    expect(currentRouteSources).not.toMatch(/background:\s*var\(--color-(?:paper|warm-white)/);
    expect(currentRouteSources).toMatch(/color:\s*var\(--(?:color-text|world-accent)/);
    expect(vLab).toMatch(/background:\s*var\(--world-accent/);
    expect(vLab).toMatch(/color:\s*var\(--color-text-on-accent/);
  });

  it('uses the legacy theme contract for current global theme utilities', async () => {
    const themes = await readSource('./themes/index.css');
    const hoverRule = themes.match(/a\.theme-accent:hover\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    const accentBackgroundRule = themes.match(/\.theme-accent-bg\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    const focusRule = themes.match(/\[data-theme\]:focus-within\s*\{([\s\S]*?)\}/)?.[1] ?? '';

    expect(hoverRule).toContain('color: var(--theme-accent);');
    expect(hoverRule).not.toContain('black');
    expect(accentBackgroundRule).toContain('color: var(--color-warm-white);');
    expect(focusRule).toContain('--color-focus: var(--theme-accent-light);');
  });

  for (const themeFile of themeFiles) {
    it(`${themeFile} separates light route roles from dark world roles`, async () => {
      const theme = await readSource(`./themes/${themeFile}`);
      const contract = themeContracts[themeFile];
      const accent = getCustomPropertyValue(theme, '--theme-accent') ?? '';
      const accentStrong = getCustomPropertyValue(theme, '--theme-accent-strong') ?? '';
      const accentLight = getCustomPropertyValue(theme, '--theme-accent-light') ?? '';
      const accentSubtle = getCustomPropertyValue(theme, '--theme-accent-subtle') ?? '';
      const surfaceTint = getCustomPropertyValue(theme, '--theme-surface-tint') ?? '';
      const subtleColor = resolveLegacyTint(accentSubtle, contract.accent);
      const surfaceColor = resolveLegacyTint(surfaceTint, contract.accent);
      const worldAccent = resolveApprovedPrimitive(getCustomPropertyValue(theme, '--world-accent') ?? '');
      const worldStrong = resolveApprovedPrimitive(getCustomPropertyValue(theme, '--world-accent-strong') ?? '');
      const worldSecondary = resolveApprovedPrimitive(getCustomPropertyValue(theme, '--world-accent-secondary') ?? '');
      const worldTertiary = resolveApprovedPrimitive(getCustomPropertyValue(theme, '--world-accent-tertiary') ?? '');

      expect(accent).toBe(contract.accent);
      expect(accentStrong).toBe(contract.strong);
      expect(accentLight).toBe(contract.boundary);
      expect(getCustomPropertyValue(theme, '--theme-border-accent')).toBe('var(--theme-accent-light)');
      expect(subtleColor, '--theme-accent-subtle must tint the legacy light surface').toBeDefined();
      expect(surfaceColor, '--theme-surface-tint must tint the legacy light surface').toBeDefined();
      expect(getCustomPropertyValue(theme, '--world-accent')).toBe(`var(${contract.world})`);
      expect(getCustomPropertyValue(theme, '--world-accent-strong')).toBe(`var(${contract.worldStrong})`);
      expect(getCustomPropertyValue(theme, '--world-accent-secondary')).toBe(`var(${contract.worldSecondary})`);
      expect(getCustomPropertyValue(theme, '--world-accent-tertiary')).toBe(`var(${contract.worldTertiary})`);
      expect(contrastRatio(contract.accent, legacyPalette.warmWhite)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(contract.strong, legacyPalette.warmWhite)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(contract.boundary, legacyPalette.warmWhite)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(contract.boundary, approvedPrimitives['--nest-midnight-950'])).toBeGreaterThanOrEqual(3);

      if (subtleColor && surfaceColor && worldAccent && worldStrong && worldSecondary && worldTertiary) {
        expect(contrastRatio(legacyPalette.deepInk, subtleColor)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(legacyPalette.deepInk, surfaceColor)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(worldAccent, approvedPrimitives['--nest-midnight-950'])).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(worldStrong, approvedPrimitives['--nest-midnight-950'])).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(worldSecondary, approvedPrimitives['--nest-midnight-950'])).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(worldTertiary, approvedPrimitives['--nest-midnight-950'])).toBeGreaterThanOrEqual(3);
      }
    });
  }

  it('uses delivered identity fonts through CSS variables', async () => {
    const [blog, cna, typography, fonts] = await Promise.all([
      readSource('./blog.css'),
      readSource('./cna-landing.css'),
      readSource('./typography.css'),
      readSource('./fonts.css'),
    ]);

    expect(fonts).toContain("font-family: 'Orbitron'");
    expect(fonts).toContain("font-family: 'JetBrains Mono'");
    expect(typography).toContain("'Orbitron'");
    expect(typography).toContain("'JetBrains Mono'");
    const sans = typography.match(/--font-sans:\s*([^;]+);/)?.[1] ?? '';
    const mono = typography.match(/--font-mono:\s*([^;]+);/)?.[1] ?? '';
    expect(sans).not.toContain('JetBrains Mono');
    expect(sans).not.toContain('ui-monospace');
    expect(mono).toContain('JetBrains Mono');
    expect(typography).toMatch(/html\s*\{[\s\S]*?font-family:\s*var\(--font-sans\);/);
    expect(blog).toMatch(/\.blog-page\s*\{[\s\S]*?font-family:\s*var\(--font-sans\);/);
    expect(cna).toMatch(/\.cna-landing\s*\{[\s\S]*?font-family:\s*var\(--font-sans\);/);
    expect(cna).toMatch(/\.cna-landing__code\s*\{[\s\S]*?font-family:\s*var\(--font-mono\);/);
  });

  it('keeps the homepage dark-first without an OS light visual override', async () => {
    const home = await readSource('./home.css');

    expect(home).not.toMatch(/@media\s*\(prefers-color-scheme:\s*light\)/);
    expect(home).toContain('.synthwave-environment__plate');
    expect(home).toContain('object-position: center 38%');
    expect(home).toContain('.project-atlas__worlds');
    expect(home).toContain('.atlas-world:focus-visible');
    expect(home).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
});
