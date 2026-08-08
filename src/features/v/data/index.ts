import type {
  VBackend,
  VDiagramStep,
  VLicenseEntry,
  VOperatorGroup,
  VProject,
  VSection,
  VtlMaturity,
} from '../types/index.js';

/**
 * Ownership / roles (verified GitHub contribution signal, 2026-08-07):
 * - vlang/v — Core Team contributor (compiler/tooling ecosystem)
 * - vlang/vsl — primary maintainer (dominant contributions)
 * - vlang/vtl — primary maintainer
 * - ulises-jeremias/rxv — author
 * - vlang/setup-v — maintainer
 * - vlang/awesome-v — contributor (scientific / template listings); community-curated list
 *
 * setup-v pin: upstream README documents `uses: vlang/setup-v@v1.7` (latest release tag).
 */

export const SETUP_V_PIN = 'vlang/setup-v@v1.7';

export const vProjects: VProject[] = [
  {
    id: 'v',
    title: 'V',
    shortLabel: 'v',
    description: 'Simple, fast, safe compiled language — Go-like syntax, C-like speed, single bootstrap.',
    href: 'https://github.com/vlang/v',
    repo: 'vlang/v',
    icon: 'v',
    role: 'Core Team — compiler, tooling, docs, ecosystem',
    highlights: [
      'Single-file bootstrap via C + tcc',
      'Immutable by default, fast compile',
      'Self-host compile <1 s (upstream README)',
    ],
    license: 'MIT',
  },
  {
    id: 'vsl',
    title: 'VSL',
    shortLabel: 'vsl',
    description: 'V Scientific Library — pure-V BLAS/LAPACK, linear algebra, stats, visualization.',
    href: 'https://github.com/vlang/vsl',
    repo: 'vlang/vsl',
    icon: 'vsl',
    role: 'Maintainer — pure-V backends, compute dispatch, scientific modules',
    highlights: ['Pure-V default, zero deps', 'Optional CBLAS/LAPACKe', 'Experimental GPU: OpenCL / CUDA / Vulkan'],
    license: 'MIT',
  },
  {
    id: 'vtl',
    title: 'VTL',
    shortLabel: 'vtl',
    description: 'V Tensor Library — n-dimensional Tensor[T], autograd, neural networks, VSL-backed LA.',
    href: 'https://github.com/vlang/vtl',
    repo: 'vlang/vtl',
    icon: 'vtl',
    role: 'Maintainer — Tensor core, autograd graph, Sequential API',
    highlights: ['CPU training default', 'Reverse-mode autograd', 'CUDA / Vulkan experimental'],
    license: 'MIT',
  },
  {
    id: 'rxv',
    title: 'RxV',
    shortLabel: 'rxv',
    description: 'ReactiveX for V — generic Observable[T], channel pipelines, composable operators.',
    href: 'https://github.com/ulises-jeremias/rxv',
    repo: 'ulises-jeremias/rxv',
    icon: 'rxv',
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
    icon: 'ci',
    role: 'Maintainer — install flow, caching, arch detection',
    highlights: [SETUP_V_PIN, 'Version file + cache', 'Linux / macOS / Windows'],
    license: 'MIT',
  },
  {
    id: 'awesome-v',
    title: 'Awesome V',
    shortLabel: 'awesome',
    description: 'Community-curated catalog — libraries, tools, and resources for the V ecosystem (CC0).',
    href: 'https://github.com/vlang/awesome-v',
    repo: 'vlang/awesome-v',
    icon: 'list',
    role: 'Contributor — scientific + template listings (community-curated list)',
    highlights: ['Community curated', 'Scientific + templates', 'CC0 1.0 list license'],
    license: 'CC0 1.0',
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
      'High-performance numerics without system deps. Pure-V BLAS/LAPACK ships by default; opt into C or experimental GPU backends when you need them.',
    bullets: [
      'BLAS Level 1-3 + LAPACK (pure-V, 0 deps)',
      'Flags: -d vsl_blas_cblas / -d vsl_lapack_lapacke',
      'GPU paths (OpenCL/VCL, CUDA, Vulkan) are experimental',
    ],
  },
  {
    id: 'vtl',
    title: 'VTL — tensors & autograd',
    eyebrow: '03 · tensors',
    description:
      'Tensor[T] with slicing, broadcasting, and reverse-mode autograd. CPU training is the default path; CUDA and Vulkan remain experimental opt-in.',
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
      `Pin: ${SETUP_V_PIN} (upstream README / latest release)`,
      'Arch-aware (x64, arm64) with warning fallback',
      'Cache key: version + os + arch → ~seconds restores',
    ],
  },
];

/** VSL backends from vlang/vsl README backend status table. */
export const vslBackends: VBackend[] = [
  {
    id: 'pure-v',
    label: 'Pure V',
    flag: 'default',
    maturity: 'default',
    bestFor: 'Zero-dep deploy, portable BLAS/LAPACK-style routines',
  },
  {
    id: 'cblas',
    label: 'C BLAS / LAPACK',
    flag: '-d vsl_blas_cblas · -d vsl_lapack_lapacke',
    maturity: 'stable-opt-in',
    bestFor: 'Optimized CPU kernels when C libs are available',
  },
  {
    id: 'opencl',
    label: 'OpenCL / VCL',
    flag: 'module-specific',
    maturity: 'experimental',
    bestFor: 'Cross-vendor GPU kernels (not a beta gate)',
  },
  {
    id: 'cuda',
    label: 'CUDA',
    flag: '-d cuda',
    maturity: 'experimental',
    bestFor: 'cuBLAS/cuDNN GEMM, activations, Conv2D (VTL training)',
  },
  {
    id: 'vulkan',
    label: 'Vulkan',
    flag: '-d vulkan',
    maturity: 'experimental',
    bestFor: 'GEMM / Conv2D / fused Adam (VTL f32 path)',
  },
  {
    id: 'mpi',
    label: 'MPI',
    flag: 'optional',
    maturity: 'optional',
    bestFor: 'Cluster linear algebra (OpenMPI)',
  },
];

export const vtlMaturity: VtlMaturity[] = [
  {
    id: 'cpu',
    label: 'CPU',
    maturity: 'default',
    note: 'Default training path — tensors, autograd, layers, optimizers, datasets',
  },
  {
    id: 'cuda',
    label: 'CUDA',
    maturity: 'experimental',
    note: 'Opt-in Linear/Conv2D forward + backward, activations, Adam slots',
  },
  {
    id: 'vulkan',
    label: 'Vulkan',
    maturity: 'experimental',
    note: 'Opt-in f32 Linear, Conv2D same-padding, ReLU/Sigmoid, fused Adam',
  },
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
  { id: 'setup', label: 'setup-v', description: 'CI · action', detail: SETUP_V_PIN },
];

export const licenseEntries: VLicenseEntry[] = [
  {
    component: 'website (this site)',
    license: 'MIT',
    source: 'LICENSE — Copyright (c) 2025-2026 Ulises Jeremias Cornejo Fandos',
    notes: 'V feature content and /v page under the site MIT license.',
  },
  {
    component: 'V + VSL + VTL + setup-v + Awesome V',
    license: 'MIT / CC0 (awesome-v list)',
    source: 'vlang/* LICENSE (MIT); awesome-v CC0 1.0',
    notes: 'Core V libraries maintained with the V community. awesome-v catalog is CC0.',
  },
  {
    component: 'RxV',
    license: 'MIT',
    source: 'ulises-jeremias/rxv/LICENSE (MIT)',
    notes: 'ReactiveX for V by Ulises Jeremias. Zero dependencies, public API MIT.',
  },
  {
    component: 'Veasel / V mascot',
    license: 'CC BY-NC 4.0 — not used commercially here',
    source: 'github.com/vlang/v-mascot',
    notes:
      'This site does not ship Veasel assets. Commercial or derivative use requires checking v-mascot LICENSE (CC BY-NC). Prefer original V-inspired diagrams.',
  },
];

export const vMeta = {
  title: 'V Ecosystem — Fast, clear, scientific',
  description:
    'V, VSL, VTL (V Tensor Library), RxV, setup-v@v1.7 — computational lab. Core Team @ V; verified contributions only.',
  accent: '#1e5a8a',
  accentStrong: '#16446a',
  accentLight: '#5b9bd5',
  accentSubtle: 'var(--world-accent-subtle)',
};
