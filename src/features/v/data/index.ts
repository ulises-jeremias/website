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
 * Ownership / roles (reverified against repository permissions and current contributions, 2026-08-10):
 * - vlang/v — public organization member and repository contributor; the existing Core Team title is human-gated
 * - vlang/vsl — maintainer
 * - vlang/vtl — maintainer
 * - ulises-jeremias/rxv — author
 * - vlang/setup-v — maintainer
 * - vlang/awesome-v — contributor (scientific / template listings); community-curated list
 *
 * setup-v pin: the current upstream README recommends `uses: vlang/setup-v@v1.7`.
 */

export const vSourceFacts = {
  verifiedAt: '2026-08-10',
  releases: {
    v: '0.5.2',
    vsl: '0.2.0-beta.1',
    vtl: '0.2.0-beta.1',
  },
  setupV: {
    recommendedPin: 'vlang/setup-v@v1.7',
    outputs: ['bin-path', 'v-bin-path', 'version', 'architecture'],
    cacheRequiresExplicitVersion: true,
    runnerFamilies: ['Linux', 'macOS', 'Windows'],
  },
  rxv: {
    completion: 'channel closure',
    defaultBufferSize: 0,
    operatorGroups: [
      {
        category: 'Creating',
        operators: [
          'just',
          'from_slice',
          'from_channel',
          'create',
          'empty',
          'throw',
          'range',
          'repeat',
          'interval',
          'timer',
          'defer_',
        ],
      },
      {
        category: 'Filtering',
        operators: [
          'filter',
          'take',
          'skip',
          'take_last',
          'first',
          'last',
          'distinct',
          'distinct_until_changed',
          'timeout',
          'contains',
          'is_empty',
          'element_at',
          'all',
          'any',
          'find',
        ],
      },
      { category: 'Timing', operators: ['debounce_', 'sample', 'throttle_first_'] },
      { category: 'Transforming', operators: ['map_', 'flat_map_', 'concat_map_'] },
      { category: 'Aggregating', operators: ['scan_', 'reduce_', 'count_'] },
      { category: 'Combining', operators: ['merge', 'concat'] },
      { category: 'Mathematical (f64)', operators: ['average_f64', 'sum_f64'] },
      { category: 'Subscribing', operators: ['observe', 'for_each'] },
    ] satisfies readonly VOperatorGroup[],
  },
  licenses: {
    website: 'MIT',
    v: 'MIT',
    vsl: 'MIT',
    vtl: 'MIT',
    rxv: 'MIT',
    setupV: 'MIT',
    awesomeV: 'CC0 1.0',
    vMascot: 'CC BY-NC 4.0',
  },
} as const;

export const SETUP_V_PIN = vSourceFacts.setupV.recommendedPin;

export const vProjects: VProject[] = [
  {
    id: 'v',
    title: 'V',
    shortLabel: 'v',
    description: 'Simple, fast, safe compiled language with a self-hosted compiler and C as its primary backend.',
    href: 'https://github.com/vlang/v',
    repo: 'vlang/v',
    icon: 'v',
    role: 'Core Team — compiler, tooling, docs, ecosystem',
    highlights: [
      'Self-hosted compiler · primary C backend',
      'Immutable bindings by default',
      'Built-in fmt · test · doc tooling',
    ],
    license: vSourceFacts.licenses.v,
  },
  {
    id: 'vsl',
    title: 'VSL',
    shortLabel: 'vsl',
    description: 'Scientific computing for V with a portable pure-V path and optional CPU and GPU backends.',
    href: 'https://github.com/vlang/vsl',
    repo: 'vlang/vsl',
    icon: 'vsl',
    role: 'Maintainer — scientific modules, compute dispatch, backend integration',
    highlights: [
      'Pure-V default · QR caveat documented',
      'Optional CBLAS / LAPACKE',
      'Module-specific VCL · CUDA · Vulkan',
    ],
    license: vSourceFacts.licenses.vsl,
  },
  {
    id: 'vtl',
    title: 'VTL',
    shortLabel: 'vtl',
    description: 'Beta tensor, reverse-mode autograd, and neural-network library backed by VSL.',
    href: 'https://github.com/vlang/vtl',
    repo: 'vlang/vtl',
    icon: 'vtl',
    role: 'Maintainer — Tensor core, autograd graph, Sequential API',
    highlights: [
      `${vSourceFacts.releases.vtl} · CPU default`,
      'Reverse-mode autograd · NN modules',
      'Feature-scoped CUDA / Vulkan experimental',
    ],
    license: vSourceFacts.licenses.vtl,
  },
  {
    id: 'rxv',
    title: 'RxV',
    shortLabel: 'rxv',
    description:
      'ReactiveX implementation for V with generic observables, channel pipelines, and composable operators.',
    href: 'https://github.com/ulises-jeremias/rxv',
    repo: 'ulises-jeremias/rxv',
    icon: 'rxv',
    role: 'Author — channels, operators, specs',
    highlights: ['Thread + chan Item[T] per operator', 'filter / map_ / merge / reduce_', 'Zero dependencies'],
    license: vSourceFacts.licenses.rxv,
  },
  {
    id: 'setup-v',
    title: 'setup-v',
    shortLabel: 'setup-v',
    description:
      'GitHub Action that installs V for Linux, macOS, and Windows runners, using prebuilts when available and a source fallback otherwise.',
    href: 'https://github.com/vlang/setup-v',
    repo: 'vlang/setup-v',
    icon: 'ci',
    role: 'Maintainer — install flow, caching, arch detection',
    highlights: [SETUP_V_PIN, 'Version file · explicit-version cache', 'Mapped prebuilt · source fallback'],
    license: vSourceFacts.licenses.setupV,
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
    highlights: ['Community curated', 'Libraries · tools · resources', 'CC0 1.0 list license'],
    license: vSourceFacts.licenses.awesomeV,
  },
];

export const vSections: VSection[] = [
  {
    id: 'v',
    title: 'V — language core',
    eyebrow: '01 · language',
    description:
      'V is a simple, fast, safe compiled language. Its self-hosted compiler uses C as the primary backend and includes formatter, test, and documentation tooling.',
    bullets: [
      'Static typing, sum types, option/result, no null',
      'Primary C backend plus JavaScript and native backend work',
      'Built-in v fmt, v vet, v test, and v doc commands',
    ],
  },
  {
    id: 'vsl',
    title: 'VSL — scientific computing',
    eyebrow: '02 · scientific',
    description:
      'Portable pure-V routines are the default path. C backends are optional, while VCL, CUDA, and Vulkan support remains module- and operation-specific.',
    bullets: [
      'Pure-V scientific path; current QR caveat is documented upstream',
      'Flags: -d vsl_blas_cblas / -d vsl_lapack_lapacke',
      'VCL, CUDA, and Vulkan paths are opt-in and experimental for beta',
    ],
  },
  {
    id: 'vtl',
    title: 'VTL — tensors & autograd',
    eyebrow: '03 · tensors',
    description:
      'The beta API covers tensors, broadcasting, reverse-mode autograd, neural-network modules, and CPU training. CUDA and Vulkan are feature-scoped experimental paths.',
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
      'Each operator spawns a thread and connects through chan Item[T]. Values and errors travel as items; completion is channel closure.',
    bullets: [
      'Creating: just / range / from_slice / interval / timer',
      'Filtering, timing, transforming, aggregating, and combining',
      'Errors use Item[T]; completion closes the channel',
    ],
  },
  {
    id: 'setup-v',
    title: 'setup-v — V in CI',
    eyebrow: '05 · CI',
    description:
      'The Action resolves a ref or version-file value, selects the architecture, uses an explicit-version cache when configured, and installs a prebuilt or builds from source.',
    bullets: [
      `README-recommended pin: ${SETUP_V_PIN}`,
      'x64 and arm64 with source fallback when no prebuilt exists',
      'Outputs: bin-path, v-bin-path, version, architecture',
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
    bestFor: 'Portable default path; pure-V QR currently has a documented caveat',
  },
  {
    id: 'cblas',
    label: 'C BLAS / LAPACK',
    flag: '-d vsl_blas_cblas · -d vsl_lapack_lapacke',
    maturity: 'optional',
    bestFor: 'Optimized CPU kernels; recommended for QR correctness today',
  },
  {
    id: 'opencl',
    label: 'OpenCL / VCL',
    flag: 'module-specific',
    maturity: 'experimental',
    bestFor: 'Module-specific cross-vendor kernels and examples',
  },
  {
    id: 'cuda',
    label: 'CUDA',
    flag: '-d cuda',
    maturity: 'experimental',
    bestFor: 'Operation-specific cuBLAS/cuDNN primitives used by VTL',
  },
  {
    id: 'vulkan',
    label: 'Vulkan',
    flag: '-d vulkan',
    maturity: 'experimental',
    bestFor: 'Operation-specific GEMM, Conv2D, and fused Adam for VTL f32 paths',
  },
  {
    id: 'mpi',
    label: 'MPI',
    flag: 'optional',
    maturity: 'optional',
    bestFor: 'OpenMPI wrapper for parallel computing on Linux and BSD',
  },
];

export const vtlMaturity: VtlMaturity[] = [
  {
    id: 'cpu',
    label: 'CPU',
    maturity: 'default',
    note: 'Default beta path — f32 tensors, autograd, layers, optimizers, datasets',
  },
  {
    id: 'cuda',
    label: 'CUDA',
    maturity: 'experimental',
    note: 'Opt-in experimental f32 Linear/Conv2D paths, activations, and Adam state',
  },
  {
    id: 'vulkan',
    label: 'Vulkan',
    maturity: 'experimental',
    note: 'Opt-in experimental f32 Linear, selected Conv2D paths, activations, and fused Adam',
  },
];

export const vtlModules: Array<{ id: string; title: string; desc: string }> = [
  { id: 'tensor', title: 'vtl', desc: 'Tensor[T] · create, slice, reshape, transpose, broadcast' },
  { id: 'autograd', title: 'vtl.autograd', desc: 'Context, Variable, gates, backprop()' },
  { id: 'la', title: 'vtl.la', desc: 'VSL-backed LA: matmul, solve, SVD, QR, Cholesky' },
  { id: 'nn', title: 'vtl.nn', desc: 'Layers, losses, internal init (Kaiming/Xavier)' },
  { id: 'models', title: 'vtl.nn.models', desc: 'Sequential builder — input → linear → forward' },
];

export const rxvOperatorGroups: readonly VOperatorGroup[] = vSourceFacts.rxv.operatorGroups;

export const setupVPipeline: VDiagramStep[] = [
  {
    id: 'resolve',
    label: 'Resolve',
    description: 'version / version-file / stable',
    detail: 'Tag, branch, SHA, or value read from a version file',
  },
  {
    id: 'arch',
    label: 'Arch',
    description: 'detect target architecture',
    detail: 'Use a mapped prebuilt or fall back to a source build',
  },
  {
    id: 'cache',
    label: 'Cache',
    description: 'restore for explicit version',
    detail: 'Key: v + version + OS + architecture',
  },
  {
    id: 'install',
    label: 'Install',
    description: 'prebuilt or source build + PATH',
    detail: 'Use a release asset when available; otherwise build',
  },
  {
    id: 'verify',
    label: 'Verify',
    description: 'v version + outputs',
    detail: 'Expose bin-path, v-bin-path, version, architecture',
  },
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
    license: vSourceFacts.licenses.website,
    source: 'LICENSE — Copyright (c) 2025-2026 Ulises Jeremias Cornejo Fandos',
    notes: 'V feature content and /v page under the site MIT license.',
  },
  {
    component: 'V',
    license: vSourceFacts.licenses.v,
    source: 'github.com/vlang/v/blob/master/LICENSE',
    notes: 'The V compiler and standard-library repository uses the MIT license.',
  },
  {
    component: 'VSL',
    license: vSourceFacts.licenses.vsl,
    source: 'github.com/vlang/vsl/blob/main/LICENSE',
    notes: 'VSL is MIT; bundled PocketFFT carries its own license notice.',
  },
  {
    component: 'VTL',
    license: vSourceFacts.licenses.vtl,
    source: 'github.com/vlang/vtl/blob/main/LICENSE',
    notes: 'The V Tensor Library uses the MIT license.',
  },
  {
    component: 'RxV',
    license: vSourceFacts.licenses.rxv,
    source: 'ulises-jeremias/rxv/LICENSE (MIT)',
    notes: 'ReactiveX for V by Ulises Jeremias. Zero dependencies, public API MIT.',
  },
  {
    component: 'setup-v',
    license: vSourceFacts.licenses.setupV,
    source: 'github.com/vlang/setup-v/blob/main/LICENSE',
    notes: 'The GitHub Action uses the MIT license.',
  },
  {
    component: 'Awesome V',
    license: vSourceFacts.licenses.awesomeV,
    source: 'github.com/vlang/awesome-v/blob/master/LICENSE',
    notes: 'The curated catalog is released under CC0 1.0 Universal.',
  },
  {
    component: 'Veasel / V mascot',
    license: vSourceFacts.licenses.vMascot,
    source: 'github.com/vlang/v-mascot/blob/add-mascot/LICENSE',
    notes:
      'Veasel shown with attribution under CC BY-NC 4.0 (noncommercial use). This is a personal portfolio site; trademark rights are not granted.',
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
