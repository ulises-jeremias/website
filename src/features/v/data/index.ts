import type { VBackend, VDiagramStep, VLicenseEntry, VOperatorGroup, VProject, VSection } from '../types/index.js';

export const vProjects: VProject[] = [
  {
    id: 'v',
    title: 'V',
    shortLabel: 'v',
    description: 'Simple, fast, safe compiled language — Go-like syntax, C-like speed, single bootstrap.',
    href: 'https://github.com/vlang/v',
    repo: 'vlang/v',
    icon: '\u{1F984}',
    role: 'Core Team — compiler, tooling, docs, ecosystem',
    highlights: ['Single-file bootstrap via C + tcc', 'Immutable by default, fast compile', '4M+ LoC compiled <1 s'],
    license: 'MIT',
  },
  {
    id: 'vsl',
    title: 'VSL',
    shortLabel: 'vsl',
    description: 'V Scientific Library — pure-V BLAS/LAPACK, linear algebra, stats, visualization.',
    href: 'https://github.com/vlang/vsl',
    repo: 'vlang/vsl',
    icon: '\u{1F52C}',
    role: 'Maintainer — pure-V backends, fractals, benchmarks',
    highlights: ['Pure-V default, zero deps', 'Optional CBLAS/LAPACKe', 'Sierpinski + Mandelbrot + Julia'],
    license: 'MIT',
  },
  {
    id: 'vtl',
    title: 'VTL',
    shortLabel: 'vtl',
    description: 'V Tensor Library — n-dimensional Tensor[T], autograd, neural networks, VSL-backed LA.',
    href: 'https://github.com/vlang/vtl',
    repo: 'vlang/vtl',
    icon: '\u{1F9EE}',
    role: 'Maintainer — Tensor core, autograd graph, Sequential API',
    highlights: ['Reverse-mode autograd', 'Layers, losses, optimizers', 'Broadcast + map/reduce'],
    license: 'MIT',
  },
  {
    id: 'rxv',
    title: 'RxV',
    shortLabel: 'rxv',
    description: 'ReactiveX for V — generic Observable[T], channel pipelines, composable operators.',
    href: 'https://github.com/ulises-jeremias/rxv',
    repo: 'ulises-jeremias/rxv',
    icon: '\u{26A1}',
    role: 'Author — channels, operators, specs',
    highlights: ['chan Item[T] per operator', 'filter / map / merge / reduce', 'Zero dependencies'],
    license: 'MIT',
  },
  {
    id: 'setup-v',
    title: 'setup-v',
    shortLabel: 'setup-v',
    description: 'GitHub Action for V — version, arch, cache, install, verify. One line, every OS.',
    href: 'https://github.com/vlang/setup-v',
    repo: 'vlang/setup-v',
    icon: '\u{2699}',
    role: 'Maintainer — install flow, caching, arch detection',
    highlights: ['vlang/setup-v@v1', 'Version file + cache', 'Linux / macOS / Windows'],
    license: 'MIT',
  },
  {
    id: 'awesome-v',
    title: 'Awesome V',
    shortLabel: 'awesome',
    description: 'Curated catalog — libraries, tools, and community picks for the V ecosystem.',
    href: 'https://github.com/vlang/awesome-v',
    repo: 'vlang/awesome-v',
    icon: '\u{2B50}',
    role: 'Curator — scientific + template picks',
    highlights: ['Community curated', 'Scientific + templates', 'Weekly ecosystem scan'],
    license: 'CC0 / MIT (list)',
  },
];

export const vSections: VSection[] = [
  {
    id: 'v',
    title: 'V — language core',
    eyebrow: '01 · language',
    description:
      'V is a compiled language built to be simple and fast. One self-hosted compiler, C output, tcc bootstrap, predictable performance.',
    bullets: [
      'Static typing, sum types, option/result, no null',
      'C interop without header pain, fast incremental',
      'vfmt, vvet, docs via doc/comment → markdown',
    ],
  },
  {
    id: 'vsl',
    title: 'VSL — pure-V scientific stack',
    eyebrow: '02 · scientific',
    description:
      'High-performance numerics without system deps. Pure-V BLAS/LAPACK ships by default; drop in OpenBLAS/LAPACKe with a flag when you need peak throughput.',
    bullets: [
      'BLAS Level 1-3 + LAPACK (pure-V, 0 deps)',
      'Flags: -d vsl_blas_cblas / -d vsl_lapack_lapacke',
      'Stats, FFT, optimization, visualization (Plotly style)',
    ],
  },
  {
    id: 'vtl',
    title: 'VTL — tensors & autograd',
    eyebrow: '03 · tensors',
    description:
      'Tensor[T] with slicing, broadcasting, and reverse-mode autograd. Build arbitrary graphs — then let nn layers compose them for you.',
    bullets: [
      'Context + Variable + gates → backprop()',
      'Sequential API: Linear/Conv2D/LSTM/Attention',
      'Optimizers: Adam, AdamW, RMSProp, AdaGrad, SGD',
    ],
  },
  {
    id: 'rxv',
    title: 'RxV — observables as channels',
    eyebrow: '04 · reactive',
    description:
      'Each operator spawns a lightweight thread and connects via chan Item[T]. No scheduler, no hidden state — just V channels.',
    bullets: [
      'Creating: just / range / from_slice / interval / timer',
      'Filtering, transforming, combining',
      'Error + completion as first-class events',
    ],
  },
  {
    id: 'setup-v',
    title: 'setup-v — one line, every runner',
    eyebrow: '05 · CI',
    description:
      'The Action resolves version (tag, branch, commit, or .v-version), detects arch, restores cache, installs the binary, and verifies v version.',
    bullets: [
      'Uses PAT-less binary fetch for tags (no rate-limit pain)',
      'Arch-aware (x64, arm64) with warning fallback',
      'Cache key: version + os + arch → ~seconds restores',
    ],
  },
];

export const vslBackends: VBackend[] = [
  { id: 'pure-v', label: 'Pure V', flag: 'default', bestFor: 'Zero-dep deploy, cross-platform' },
  {
    id: 'cblas',
    label: 'OpenBLAS (CBLAS)',
    flag: '-d vsl_blas_cblas',
    bestFor: 'Max throughput when C libs available',
  },
  { id: 'lapacke', label: 'LAPACKE', flag: '-d vsl_lapack_lapacke', bestFor: 'LAPACK at C speed' },
  { id: 'opencl', label: 'OpenCL', flag: 'experimental', bestFor: 'GPU kernels (VSL roadmap)' },
  { id: 'mpi', label: 'MPI', flag: 'optional', bestFor: 'Cluster linear algebra' },
];

export const vtlModules: Array<{ id: string; title: string; desc: string }> = [
  { id: 'tensor', title: 'vtl', desc: 'Tensor[T] · create, slice, reshape, transpose, broadcast' },
  { id: 'autograd', title: 'vtl.autograd', desc: 'Context, Variable, gates, backprop()' },
  { id: 'la', title: 'vtl.la', desc: 'VSL-backed LA: matmul, solve, SVD, QR, Cholesky' },
  { id: 'nn', title: 'vtl.nn', desc: 'Layers, losses, internal init (Kaiming/Xavier)' },
  { id: 'models', title: 'vtl.nn.models', desc: 'Sequential builder — input → linear → forward' },
];

export const rxvOperatorGroups: VOperatorGroup[] = [
  { category: 'Creating', operators: ['just', 'from_slice', 'range', 'interval', 'timer', 'defer_'] },
  { category: 'Filtering', operators: ['filter', 'take', 'skip', 'take_last', 'first'] },
  { category: 'Transforming', operators: ['map_', 'flat_map', 'scan', 'buffer', 'group_by'] },
  { category: 'Combining', operators: ['merge', 'concat', 'zip', 'combine_latest'] },
  { category: 'Utility', operators: ['reduce_', 'for_each', 'distinct', 'retry'] },
];

export const setupVPipeline: VDiagramStep[] = [
  {
    id: 'resolve',
    label: 'Resolve',
    description: 'version / .v-version / stable',
    detail: 'Semver tag, branch, commit or file',
  },
  { id: 'arch', label: 'Arch', description: 'detect x64 / arm64', detail: 'Warn + fallback for exotic arches' },
  { id: 'cache', label: 'Cache', description: 'restore cached binary', detail: 'Key: v-version + os + arch' },
  { id: 'install', label: 'Install', description: 'fetch + unpack + PATH', detail: 'Prebuilt binary, no sudo' },
  { id: 'verify', label: 'Verify', description: 'v version + outputs', detail: 'Expose v-version, cache-hit' },
];

export const vEcosystemSteps: VDiagramStep[] = [
  { id: 'v', label: 'V', description: 'compiler · tooling', detail: 'vlang/v' },
  { id: 'vsl', label: 'VSL', description: 'scientific · BLAS', detail: 'vlang/vsl' },
  { id: 'vtl', label: 'VTL', description: 'tensors · autograd', detail: 'vlang/vtl' },
  { id: 'rxv', label: 'RxV', description: 'reactive · channels', detail: 'ulises-jeremias/rxv' },
  { id: 'setup', label: 'setup-v', description: 'CI · action', detail: 'vlang/setup-v' },
];

export const licenseEntries: VLicenseEntry[] = [
  {
    component: 'website (este sitio)',
    license: 'MIT',
    source: 'LICENSE — Copyright (c) 2025-2026 Ulises Jeremias Cornejo Fandos',
    notes: 'Contenido del feature v y pagina /v bajo MIT del sitio.',
  },
  {
    component: 'V + VSL + VTL + setup-v + Awesome V',
    license: 'MIT',
    source: 'vlang/* LICENSE (MIT)',
    notes: 'Librerias core V mantenidas por V community. Uso y atribucion MIT estandar.',
  },
  {
    component: 'RxV',
    license: 'MIT',
    source: 'ulises-jeremias/rxv/LICENSE (MIT)',
    notes: 'ReactiveX para V por Ulises Jeremias. Sin dependencias, public API MIT.',
  },
  {
    component: 'Veasel / V mascot',
    license: 'Revisar vlang/v-mascot/LICENSE',
    source: 'github.com/vlang/v-mascot',
    notes:
      'Veasel solo si LICENSE lo permite con atribucion; caso ambiguo usa ilustracion original V-inspirada (no derivada). Este sitio no incluye binario Veasel.',
  },
];

export const vMeta = {
  title: 'V Ecosystem — Fast, clear, scientific',
  description:
    'V, VSL, VTL, RxV, setup-v — laboratorio computacional. Core Team @ V, contribuciones verificadas (no vanity counts).',
  accent: '#1e5a8a',
  accentStrong: '#16446a',
  accentLight: '#5b9bd5',
  accentSubtle: 'color-mix(in srgb, #1e5a8a 7%, var(--color-warm-paper))',
  quote: 'Simple enough for a Friday afternoon. Fast enough for a production pipeline.',
};
