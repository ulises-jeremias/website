// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildSnapshot,
  checkCatalogs,
  classifyDrift,
  commitRefresh,
  DEFAULT_PATHS,
  fetchSourceFile,
  loadPinnedInputs,
  normalizeFamily,
  refreshCatalogs,
  stableJson,
  validateLockFile,
  validateRegistrySchema,
  validateRegistrySemantics,
  verifySemanticReferences,
} from './catalogs.mjs';
import { CREATE_AWESOME_SOURCES } from './sources.mjs';

const syntheticLock = (familyId) => {
  const commit = 'a'.repeat(40);
  const file = (path) => ({
    path,
    url: `https://raw.githubusercontent.com/example/catalog/${commit}/${path}`,
    gitBlobSha: 'b'.repeat(40),
    sha256: 'c'.repeat(64),
  });
  return {
    repository: 'example/catalog',
    commit,
    commitDate: '2026-01-01T00:00:00Z',
    registry: file('templates.json'),
    schema: file('templates.schema.json'),
    cliReference: {
      repository: 'example/cli',
      commit: 'd'.repeat(40),
      commitDate: '2026-01-01T00:00:00Z',
    },
    semanticReferences: [
      {
        role: 'test-reference',
        repository: 'example/cli',
        commit: 'd'.repeat(40),
        commitDate: '2026-01-01T00:00:00Z',
        ...file('semantic.txt'),
      },
    ],
    id: familyId,
  };
};

describe('Create Awesome catalog generator', () => {
  it('regenerates the committed snapshot byte-for-byte from pinned inputs', async () => {
    const first = await checkCatalogs();
    const second = await checkCatalogs();
    expect(first.snapshotSha256).toBe(second.snapshotSha256);
    expect(stableJson(first.snapshot)).toBe(stableJson(second.snapshot));
  });

  it('builds identical output twice from the same pinned source cache', async () => {
    const { familyInputs } = await loadPinnedInputs();
    const first = stableJson(buildSnapshot(familyInputs));
    const second = stableJson(buildSnapshot(familyInputs));
    expect(first).toBe(second);
  });

  it('normalizes Python all-wildcard and symmetric one-sided conflicts', () => {
    const source = CREATE_AWESOME_SOURCES.find((candidate) => candidate.id === 'python');
    const registry = {
      categories: [{ slug: 'apps', name: 'Apps', description: 'Apps', labels: [] }],
      templates: [
        {
          slug: 'api',
          name: 'API',
          description: 'API template',
          url: 'https://example.com/api',
          type: ['api'],
          category: 'apps',
          labels: [],
        },
        {
          slug: 'cli',
          name: 'CLI',
          description: 'CLI template',
          url: 'https://example.com/cli',
          type: 'cli',
          category: 'apps',
          labels: [],
        },
      ],
      extensions: [
        {
          slug: 'all-projects',
          name: 'All projects',
          description: 'Applies everywhere',
          url: 'https://example.com/all',
          type: 'all',
          category: 'apps',
          labels: [],
          incompatibleWith: ['api-only'],
        },
        {
          slug: 'api-only',
          name: 'API only',
          description: 'Applies to APIs',
          url: 'https://example.com/api-only',
          type: ['api'],
          category: 'apps',
          labels: [],
        },
      ],
    };
    const normalized = normalizeFamily(source, registry, syntheticLock('python'));
    const allProjects = normalized.addons.find((addon) => addon.id === 'all-projects');
    const apiOnly = normalized.addons.find((addon) => addon.id === 'api-only');
    expect(allProjects.compatibleTemplateIds).toEqual(['api', 'cli']);
    expect(apiOnly.compatibleTemplateIds).toEqual(['api']);
    expect(allProjects.declaredIncompatibleAddonIds).toEqual(['api-only']);
    expect(allProjects.incompatibleAddonIds).toEqual(['api-only']);
    expect(apiOnly.declaredIncompatibleAddonIds).toEqual([]);
    expect(apiOnly.incompatibleAddonIds).toEqual(['all-projects']);
  });

  it('verifies every pinned semantic tripwire from the offline source cache', async () => {
    const { familyInputs } = await loadPinnedInputs();
    for (const source of CREATE_AWESOME_SOURCES) {
      const input = familyInputs.get(source.id);
      expect(() => verifySemanticReferences(source, input.semanticReferences)).not.toThrow();
    }
  });

  it('rejects invalid V compatibility references before normalization', async () => {
    const { familyInputs } = await loadPinnedInputs();
    const source = CREATE_AWESOME_SOURCES.find((candidate) => candidate.id === 'v');
    const registry = structuredClone(familyInputs.get('v').registry);
    registry.addons[0].compatibleWith = ['missing-template'];
    expect(() => validateRegistrySemantics(source, registry)).toThrow(/unknown template missing-template/);
  });

  it('rejects schema-valid V entries with contradictory collection semantics', async () => {
    const { familyInputs } = await loadPinnedInputs();
    const source = CREATE_AWESOME_SOURCES.find((candidate) => candidate.id === 'v');

    const wrongKind = structuredClone(familyInputs.get('v').registry);
    wrongKind.addons[0].kind = 'template';
    expect(() => validateRegistrySemantics(source, wrongKind)).toThrow(/declares a non-addon kind/);

    const templateCompatibility = structuredClone(familyInputs.get('v').registry);
    templateCompatibility.templates[0].compatibleWith = [];
    expect(() => validateRegistrySemantics(source, templateCompatibility)).toThrow(
      /declares addon-only compatibility metadata/,
    );
  });

  it('allows only the catalog schema declaration outside the pinned source schema', async () => {
    const { familyInputs } = await loadPinnedInputs();
    const source = CREATE_AWESOME_SOURCES.find((candidate) => candidate.id === 'node');
    const input = familyInputs.get('node');
    expect(() => validateRegistrySchema(source, input.registry, input.schema)).not.toThrow();
    const malformed = { ...input.registry, inventedField: true };
    expect(() => validateRegistrySchema(source, malformed, input.schema)).toThrow(/violates templates\.schema\.json/);
  });

  it('stops when an upstream schema no longer declares its configured draft', async () => {
    const { familyInputs } = await loadPinnedInputs();
    const source = CREATE_AWESOME_SOURCES.find((candidate) => candidate.id === 'v');
    const input = familyInputs.get('v');
    const mismatchedSchema = { ...input.schema, $schema: 'http://json-schema.org/draft-04/schema#' };
    expect(() => validateRegistrySchema(source, input.registry, mismatchedSchema)).toThrow(
      /declares an unexpected JSON Schema draft/,
    );
  });

  it('rejects a mixed known and unknown typed-addon contract', async () => {
    const { familyInputs } = await loadPinnedInputs();
    const source = CREATE_AWESOME_SOURCES.find((candidate) => candidate.id === 'node');
    const registry = structuredClone(familyInputs.get('node').registry);
    const knownType = Array.isArray(registry.templates[0].type)
      ? registry.templates[0].type[0]
      : registry.templates[0].type;
    registry.extensions[0].type = [knownType, 'invented-type'];
    expect(() => validateRegistrySemantics(source, registry)).toThrow(
      /type not understood by the pinned CLI semantics/,
    );
  });

  it('binds semantic references to their resolved catalog or CLI commit', async () => {
    const lock = JSON.parse(await readFile(DEFAULT_PATHS.sourceLock, 'utf8'));
    lock.families[0].semanticReferences[0].commit = 'f'.repeat(40);
    expect(() => validateLockFile(lock)).toThrow(/semantic reference commit is not source-pinned/);
  });

  it('binds immutable provenance URLs to the exact locked path', async () => {
    const lock = JSON.parse(await readFile(DEFAULT_PATHS.sourceLock, 'utf8'));
    lock.families[0].registry.url = lock.families[0].registry.url.replace('templates.json', 'other.json');
    expect(() => validateLockFile(lock)).toThrow(/mutable or mismatched provenance URL/);
  });

  it('rejects decoded GitHub content that does not match its claimed blob SHA', async () => {
    const fetchImplementation = async () => ({
      ok: true,
      json: async () => ({
        type: 'file',
        encoding: 'base64',
        sha: 'a'.repeat(40),
        content: Buffer.from('corrupt response').toString('base64'),
      }),
    });
    await expect(
      fetchSourceFile('Create-Node-App/cna-templates', 'b'.repeat(40), 'templates.json', fetchImplementation),
    ).rejects.toThrow(/blob SHA does not match decoded content/);
  });

  it('bounds every GitHub API request with an abort signal', async () => {
    let requestSignal;
    const fetchImplementation = async (_url, options) => {
      requestSignal = options.signal;
      return {
        ok: false,
        status: 503,
      };
    };
    await expect(
      fetchSourceFile('Create-Node-App/cna-templates', 'b'.repeat(40), 'templates.json', fetchImplementation),
    ).rejects.toThrow(/GitHub API 503/);
    expect(requestSignal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    {
      name: 'no change',
      pinnedCommit: 'a',
      currentCommit: 'a',
      files: [{ role: 'registry', pinnedGitBlobSha: '1', currentGitBlobSha: '1' }],
      expected: { status: 'current', driftDetected: false },
    },
    {
      name: 'HEAD-only change',
      pinnedCommit: 'a',
      currentCommit: 'b',
      files: [
        { role: 'registry', pinnedGitBlobSha: '1', currentGitBlobSha: '1' },
        { role: 'schema', pinnedGitBlobSha: '2', currentGitBlobSha: '2' },
      ],
      expected: { status: 'head-only', driftDetected: false },
    },
    {
      name: 'CLI HEAD-only change',
      pinnedCommit: 'a',
      currentCommit: 'a',
      additionalHeadChanged: true,
      files: [{ role: 'semantic', pinnedGitBlobSha: '1', currentGitBlobSha: '1' }],
      expected: { status: 'head-only', driftDetected: false },
    },
    {
      name: 'catalog change',
      pinnedCommit: 'a',
      currentCommit: 'b',
      files: [{ role: 'registry', pinnedGitBlobSha: '1', currentGitBlobSha: '9' }],
      expected: { status: 'catalog-drift', driftDetected: true },
    },
    {
      name: 'schema change',
      pinnedCommit: 'a',
      currentCommit: 'b',
      files: [{ role: 'schema', pinnedGitBlobSha: '2', currentGitBlobSha: '9' }],
      expected: { status: 'schema-drift', driftDetected: true },
    },
    {
      name: 'semantic change',
      pinnedCommit: 'a',
      currentCommit: 'a',
      additionalHeadChanged: true,
      files: [{ role: 'semantic', pinnedGitBlobSha: '3', currentGitBlobSha: '9' }],
      expected: { status: 'semantic-drift', driftDetected: true },
    },
    {
      name: 'catalog and schema change',
      pinnedCommit: 'a',
      currentCommit: 'b',
      files: [
        { role: 'registry', pinnedGitBlobSha: '1', currentGitBlobSha: '9' },
        { role: 'schema', pinnedGitBlobSha: '2', currentGitBlobSha: '8' },
      ],
      expected: { status: 'catalog+schema-drift', driftDetected: true },
    },
  ])('classifies $name without treating every HEAD move as catalog drift', ({ expected, ...input }) => {
    expect(classifyDrift(input)).toEqual(expect.objectContaining(expected));
  });

  it('leaves the previous snapshot intact when a refresh fails before validation completes', async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'create-awesome-refresh-'));
    const pinnedDirectory = join(temporaryRoot, 'pinned');
    const snapshot = join(temporaryRoot, 'compatibility.json');
    await mkdir(pinnedDirectory, { recursive: true });
    await writeFile(join(pinnedDirectory, 'marker.txt'), 'previous pinned data\n', 'utf8');
    await writeFile(snapshot, 'previous snapshot\n', 'utf8');
    const paths = {
      root: temporaryRoot,
      pinnedDirectory,
      sourceLock: join(pinnedDirectory, 'source-lock.json'),
      snapshot,
      snapshotSchema: DEFAULT_PATHS.snapshotSchema,
    };

    await expect(
      refreshCatalogs({
        paths,
        fetchImplementation: async () => {
          throw new Error('fixture network failure');
        },
      }),
    ).rejects.toThrow('fixture network failure');
    expect(await readFile(snapshot, 'utf8')).toBe('previous snapshot\n');
    expect(await readFile(join(pinnedDirectory, 'marker.txt'), 'utf8')).toBe('previous pinned data\n');
  });

  it('restores both pinned inputs and snapshot when the snapshot install fails', async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'create-awesome-commit-'));
    const pinnedDirectory = join(temporaryRoot, 'pinned');
    const snapshot = join(temporaryRoot, 'compatibility.json');
    await mkdir(pinnedDirectory, { recursive: true });
    await writeFile(join(pinnedDirectory, 'marker.txt'), 'previous pinned data\n', 'utf8');
    await writeFile(snapshot, 'previous snapshot\n', 'utf8');
    const paths = {
      root: temporaryRoot,
      pinnedDirectory,
      sourceLock: join(pinnedDirectory, 'source-lock.json'),
      snapshot,
      snapshotSchema: DEFAULT_PATHS.snapshotSchema,
    };

    await expect(
      commitRefresh(paths, { generation: 'new' }, new Map(), 'new snapshot\n', {
        renameImplementation: async (from, to) => {
          if (from.startsWith(`${snapshot}.refresh-`) && to === snapshot) {
            throw new Error('simulated snapshot install failure');
          }
          await rename(from, to);
        },
      }),
    ).rejects.toThrow('simulated snapshot install failure');

    expect(await readFile(snapshot, 'utf8')).toBe('previous snapshot\n');
    expect(await readFile(join(pinnedDirectory, 'marker.txt'), 'utf8')).toBe('previous pinned data\n');
    expect((await readdir(temporaryRoot)).sort()).toEqual(['compatibility.json', 'pinned']);
  });

  it('preserves the original commit failure when a restore operation also fails', async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'create-awesome-rollback-'));
    const pinnedDirectory = join(temporaryRoot, 'pinned');
    const snapshot = join(temporaryRoot, 'compatibility.json');
    await mkdir(pinnedDirectory, { recursive: true });
    await writeFile(join(pinnedDirectory, 'marker.txt'), 'previous pinned data\n', 'utf8');
    await writeFile(snapshot, 'previous snapshot\n', 'utf8');
    const paths = {
      root: temporaryRoot,
      pinnedDirectory,
      sourceLock: join(pinnedDirectory, 'source-lock.json'),
      snapshot,
      snapshotSchema: DEFAULT_PATHS.snapshotSchema,
    };

    const originalFailure = Object.freeze(new Error('original snapshot install failure'));
    const operation = commitRefresh(paths, { generation: 'new' }, new Map(), 'new snapshot\n', {
      renameImplementation: async (from, to) => {
        if (from.startsWith(`${snapshot}.refresh-`) && to === snapshot) {
          throw originalFailure;
        }
        if (from.startsWith(`${snapshot}.backup-`) && to === snapshot) {
          throw new Error('secondary snapshot restore failure');
        }
        await rename(from, to);
      },
    });

    await expect(operation).rejects.toBe(originalFailure);
    expect(await readFile(join(pinnedDirectory, 'marker.txt'), 'utf8')).toBe('previous pinned data\n');
  });
});
