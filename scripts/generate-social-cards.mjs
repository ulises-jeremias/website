import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const cards = [
  {
    id: 'home',
    title: 'DIGITAL NEST',
    subtitle: 'Agent tooling · Linux desktops · V · scaffolding',
    accent: '#ff4fd8',
    art: 'logo-nest.webp',
  },
  {
    id: 'dotfiles',
    title: 'HORNERO\nCONFIG',
    subtitle: 'Personal Arch config · HorneroOS components',
    accent: '#ffb0ca',
    art: 'island-dotfiles.webp',
  },
  {
    id: 'agentic-workstation',
    title: 'AGENTIC\nWORKSTATION',
    subtitle: 'Machine provisioning · profiles · LLM policy',
    accent: '#1cefff',
    art: 'island-workstation.webp',
  },
  {
    id: 'agent-toolkit',
    title: 'AGENT\nTOOLKIT',
    subtitle: 'Portable skills · agents · loops · CLI runtime',
    accent: '#ff4fd8',
    art: 'island-agent.webp',
  },
  {
    id: 'agentic-harness',
    title: 'AGENTIC\nHARNESS',
    subtitle: 'Persistent workspace context · knowledge · state',
    accent: '#34d399',
    art: 'island-harness.webp',
  },
  {
    id: 'v',
    title: 'V ECOSYSTEM',
    subtitle: 'Systems · scientific computing · reactive tools',
    accent: '#70b7ff',
    art: 'island-v.webp',
  },
  {
    id: 'create-awesome',
    title: 'CREATE\nAWESOME',
    subtitle: 'Node · Python · V · Rust application scaffolds',
    accent: '#ff9a62',
    art: 'island-scaffold.webp',
  },
  {
    id: 'community',
    title: 'COMMUNITY',
    subtitle: 'Choose a contribution path in the shared workshop',
    accent: '#a78bfa',
    art: 'island-community.webp',
  },
  {
    id: 'blog',
    title: 'FIELD NOTES',
    subtitle: 'Developer experience · systems · open source',
    accent: '#ff7eb6',
    art: 'island-blog.webp',
  },
  {
    id: 'projects',
    title: 'WORK',
    subtitle: 'Four areas of open-source developer tooling',
    accent: '#1cefff',
    art: 'island-projects.webp',
  },
  {
    id: 'open-source',
    title: 'OPEN SOURCE',
    subtitle: 'Evidence-based contributions across ecosystems',
    accent: '#ffb45e',
    art: 'island-oss.webp',
  },
  {
    id: 'about',
    title: 'ABOUT',
    subtitle: 'Developer tooling · open source · the trajectory',
    accent: '#a78bfa',
    artPath: path.join('public', 'media', 'social', 'builder-trajectory.svg'),
  },
  {
    id: 'agentic',
    title: 'AGENTIC\nDEVELOPER STACK',
    subtitle: 'Toolkit · Workstation · Harness — composable',
    accent: '#ff4fd8',
    artPath: path.join('public', 'media', 'social', 'agentic-stack.svg'),
  },
  {
    id: 'hornero-os',
    title: 'HORNERO OS',
    subtitle: 'Early-stage Arch desktop · not yet installable',
    accent: '#f2b749',
    // Project-owned MIT brand mark (HorneroOS/config assets/brand/logo.svg).
    artPath: path.join('public', 'media', 'hornero-os', 'hornero-logo.svg'),
  },
  {
    id: 'sponsor',
    title: 'SPONSOR\nTHE WORK',
    subtitle: 'Support the tools · infrastructure · community',
    accent: '#ff42d0',
    artPath: path.join('public', 'media', 'social', 'support-dock.svg'),
  },
];

const root = process.cwd();
const assetRoot = path.join(root, 'public', 'assets', 'nest');
const outputRoot = path.join(root, 'public', 'social');
const background = path.join(assetRoot, 'hero-bg.webp');
mkdirSync(outputRoot, { recursive: true });

function resolveFont(query) {
  const result = spawnSync('fc-match', ['-f', '%{file}', query], { encoding: 'utf8' });
  if (result.status !== 0 || !result.stdout.trim()) {
    throw new Error(`Unable to resolve required font: ${query}`);
  }
  return result.stdout.trim();
}

const boldFont = resolveFont('Noto Sans:style=Bold');
const regularFont = resolveFont('Noto Sans:style=Regular');

const scratch = mkdtempSync(path.join(os.tmpdir(), 'social-cards-'));
const accentRgba = (hex, alpha) => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16));
  if (!channels || channels.length !== 3) throw new Error(`Invalid card accent: ${hex}`);
  return `rgba(${channels.join(',')},${alpha})`;
};

/** Rasterize an SVG art source once, so density never leaks into text rendering. */
function rasterize(relativePath) {
  const output = path.join(scratch, `${path.basename(relativePath, path.extname(relativePath))}.png`);
  const result = spawnSync(
    process.env.MAGICK ?? 'magick',
    ['-background', 'none', '-density', '384', path.join(root, relativePath), '-resize', '760x760', output],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) throw new Error(result.stderr || `ImageMagick failed to rasterize ${relativePath}`);
  return output;
}

for (const card of cards) {
  const output = path.join(outputRoot, `${card.id}.jpg`);
  const result = spawnSync(
    process.env.MAGICK ?? 'magick',
    [
      background,
      '-resize',
      '1200x630^',
      '-gravity',
      'center',
      '-extent',
      '1200x630',
      '-fill',
      'rgba(4,2,18,0.58)',
      '-draw',
      'rectangle 0,0 1200,630',
      '-fill',
      accentRgba(card.accent, 0.16),
      '-draw',
      'circle 930,314 1130,314',
      '-stroke',
      accentRgba(card.accent, 0.46),
      '-strokewidth',
      '2',
      '-fill',
      'none',
      '-draw',
      'ellipse 930,314 232,184 0,360',
      '-stroke',
      accentRgba(card.accent, 0.24),
      '-strokewidth',
      '1',
      '-draw',
      'ellipse 930,314 258,196 14,194',
      '-stroke',
      'none',
      '-fill',
      'rgba(4,2,18,0.72)',
      '-draw',
      'polygon 0,0 720,0 635,630 0,630',
      '(',
      card.artPath ? rasterize(card.artPath) : path.join(assetRoot, card.art),
      '-resize',
      card.artPath ? '430x430' : '500x500',
      ')',
      '-gravity',
      'east',
      '-geometry',
      '+58+0',
      '-compose',
      'screen',
      '-composite',
      '-fill',
      card.accent,
      '-draw',
      'rectangle 78,112 90,500',
      '-font',
      boldFont,
      '-gravity',
      'northwest',
      '-pointsize',
      '28',
      '-fill',
      card.accent,
      '-annotate',
      '+112+92',
      'DIGITAL NEST / ULISES JEREMIAS',
      '-pointsize',
      '62',
      '-fill',
      '#fff7ff',
      '-interline-spacing',
      '-8',
      '-annotate',
      '+112+190',
      card.title,
      '-font',
      regularFont,
      '-pointsize',
      '28',
      '-fill',
      '#d8cfea',
      '-annotate',
      '+112+470',
      card.subtitle,
      '-strip',
      '-interlace',
      'Plane',
      '-quality',
      '86',
      output,
    ],
    { encoding: 'utf8' },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || `ImageMagick failed for ${card.id}`);
  }
}

process.stdout.write(`Generated ${cards.length} social cards in ${path.relative(root, outputRoot)}\n`);
