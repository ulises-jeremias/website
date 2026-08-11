import Ajv from 'ajv';
import AjvDraft04 from 'ajv-draft-04';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CREATE_AWESOME_SOURCES, NORMALIZATION_VERSION, SNAPSHOT_SCHEMA_VERSION, SOURCE_REF } from './sources.mjs';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_PATHS = Object.freeze({
  root: resolve(moduleDirectory, '../../..'),
  pinnedDirectory: resolve(moduleDirectory, 'pinned'),
  sourceLock: resolve(moduleDirectory, 'pinned/source-lock.json'),
  snapshot: resolve(moduleDirectory, '../../../src/features/create-awesome/data/generated/compatibility.json'),
  snapshotSchema: resolve(
    moduleDirectory,
    '../../../src/features/create-awesome/data/generated/compatibility.schema.json',
  ),
});

const FULL_SHA = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const GITHUB_API_ORIGIN = 'https://api.github.com';
const GITHUB_RAW_ORIGIN = 'https://raw.githubusercontent.com';
const SCHEMA_DRAFT_URIS = Object.freeze({
  'draft-04': 'http://json-schema.org/draft-04/schema#',
  'draft-07': 'http://json-schema.org/draft-07/schema#',
});

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

export const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const gitBlobSha = (value) =>
  createHash('sha1')
    .update(`blob ${Buffer.byteLength(value)}\0`)
    .update(value)
    .digest('hex');

const parseJson = (value, label) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
};

const readJson = async (path, label = path) => parseJson(await readFile(path, 'utf8'), label);

const unique = (values) => [...new Set(values)];

const strings = (value, label) => {
  const list = typeof value === 'string' ? [value] : value;
  assert(Array.isArray(list), `${label} must be a string or string array`);
  assert(list.length > 0, `${label} must not be empty`);
  for (const item of list) {
    assert(typeof item === 'string' && item.length > 0, `${label} contains an invalid identifier`);
  }
  return unique(list);
};

const optionalStrings = (value, label) => {
  if (value === undefined || value === null) return [];
  assert(Array.isArray(value), `${label} must be an array`);
  for (const item of value) {
    assert(typeof item === 'string' && item.length > 0, `${label} contains an invalid identifier`);
  }
  return unique(value);
};

const entryId = (familyId, entry) => (familyId === 'v' ? entry.name : entry.slug);

const familyAddons = (familyId, registry) => (familyId === 'v' ? registry.addons : registry.extensions);

const createSchemaValidator = (draft) => {
  const options = { allErrors: true, strict: false, validateFormats: false };
  return draft === 'draft-04' ? new AjvDraft04(options) : new Ajv(options);
};

const formatSchemaErrors = (errors = []) =>
  errors.map((error) => `${error.instancePath || '/'} ${error.message}`).join('; ');

export const validateRegistrySchema = (source, registry, schema) => {
  assert(
    schema.$schema === SCHEMA_DRAFT_URIS[source.schemaDraft],
    `[${source.id}] ${source.schemaPath} declares an unexpected JSON Schema draft`,
  );
  const ajv = createSchemaValidator(source.schemaDraft);
  const validate = ajv.compile(schema);
  const { $schema: declaredSchema, ...catalogPayload } = registry;
  if (declaredSchema !== undefined) {
    assert(
      declaredSchema === `./${source.schemaPath}`,
      `[${source.id}] registry declares unexpected schema ${declaredSchema}`,
    );
  }
  if (!validate(catalogPayload)) {
    throw new Error(
      `[${source.id}] ${source.registryPath} violates ${source.schemaPath}: ${formatSchemaErrors(validate.errors)}`,
    );
  }
};

const contractError = (familyId, message) =>
  new Error(`[${familyId}] UPSTREAM CONTRACT CONTRADICTION — HUMAN RESOLUTION REQUIRED: ${message}`);

export const verifySemanticReferences = (source, referenceContents) => {
  const byRole = new Map(referenceContents.map((reference) => [reference.role, reference.content]));

  if (source.id === 'node') {
    const cli = byRole.get('cli-compatibility-reference') ?? '';
    if (
      !cli.includes('safeExtensionType.some') ||
      !cli.includes('safeType.includes(extensionType)') ||
      !cli.includes('findIncompatiblePairs')
    ) {
      throw contractError('node', 'the CNA CLI no longer exposes the verified type-intersection/conflict contract');
    }
    if (/extensionType\s*===?\s*["']all["']/.test(cli)) {
      throw contractError(
        'node',
        'the CNA CLI now appears to define wildcard semantics not represented by this adapter',
      );
    }
    return;
  }

  if (source.id === 'python') {
    const cli = byRole.get('cli-compatibility-reference') ?? '';
    if (
      !/ext_type\s+in\s+template_types\s+or\s+ext_type\s*==\s*["']all["']/.test(cli) ||
      !cli.includes('find_incompatible_pairs') ||
      !cli.includes('incompatibleWith')
    ) {
      throw contractError(
        'python',
        'the CPA CLI no longer exposes the verified type-intersection, all-wildcard, and conflict contract',
      );
    }
    return;
  }

  const cli = byRole.get('cli-catalog-reference') ?? '';
  const registryHelper = byRole.get('catalog-compatibility-reference') ?? '';
  if (!cli.includes('resolve_slug') || !cli.includes('CatalogEntry')) {
    throw contractError('v', 'the CVA CLI catalog resolution reference changed unexpectedly');
  }
  if (cli.includes('compatibleWith') || cli.includes('incompatibleWith')) {
    throw contractError(
      'v',
      'the CVA CLI now consumes compatibility fields; its behavior must be reconciled before refresh',
    );
  }
  if (
    !registryHelper.includes('compatible = addon.get("compatibleWith") or []') ||
    !registryHelper.includes('if not compatible:') ||
    !registryHelper.includes('return template.get("name") in compatible') ||
    !registryHelper.includes('addon.get("incompatibleWith") or []') ||
    !registryHelper.includes('candidate.get("incompatibleWith") or []')
  ) {
    throw contractError(
      'v',
      'the cva-templates compatibility helper no longer exposes the verified empty-means-all and symmetric-conflict contract',
    );
  }
};

const validateCommonEntry = (familyId, kind, entry, index) => {
  const id = entryId(familyId, entry);
  assert(typeof id === 'string' && id.length > 0, `[${familyId}] ${kind}[${index}] has no canonical ID`);
  assert(typeof entry.name === 'string' && entry.name.length > 0, `[${familyId}] ${kind} ${id} has no name`);
  assert(
    typeof entry.description === 'string' && entry.description.length > 0,
    `[${familyId}] ${kind} ${id} has no description`,
  );
  assert(typeof entry.url === 'string' && entry.url.length > 0, `[${familyId}] ${kind} ${id} has no source URL`);
  return id;
};

const assertUniqueIds = (familyId, kind, entries) => {
  const ids = entries.map((entry, index) => validateCommonEntry(familyId, kind, entry, index));
  assert(new Set(ids).size === ids.length, `[${familyId}] duplicate normalized ${kind} ID`);
  return ids;
};

export const validateRegistrySemantics = (source, registry) => {
  const templates = registry.templates;
  const addons = familyAddons(source.id, registry);
  assert(Array.isArray(templates) && templates.length > 0, `[${source.id}] templates must not be empty`);
  assert(Array.isArray(addons), `[${source.id}] addons/extensions must be an array`);

  const templateIds = assertUniqueIds(source.id, 'template', templates);
  const addonIds = assertUniqueIds(source.id, 'addon', addons);
  const templateIdSet = new Set(templateIds);
  const addonIdSet = new Set(addonIds);

  if (source.id === 'v') {
    for (const template of templates) {
      const id = entryId(source.id, template);
      assert(
        template.kind === undefined || template.kind === 'template',
        `[${source.id}] template ${id} declares a non-template kind`,
      );
      assert(
        template.compatibleWith === undefined && template.incompatibleWith === undefined,
        `[${source.id}] template ${id} declares addon-only compatibility metadata`,
      );
    }
    for (const addon of addons) {
      const id = entryId(source.id, addon);
      assert(
        addon.kind === undefined || addon.kind === 'addon',
        `[${source.id}] addon ${id} declares a non-addon kind`,
      );
    }
  } else {
    const templateTypes = new Set();
    for (const template of templates) {
      assert(
        typeof template.category === 'string' && template.category.length > 0,
        `[${source.id}] template ${template.slug} has no category`,
      );
      for (const type of strings(template.type, `[${source.id}] template ${template.slug}.type`)) {
        templateTypes.add(type);
      }
    }
    for (const addon of addons) {
      assert(
        typeof addon.category === 'string' && addon.category.length > 0,
        `[${source.id}] addon ${addon.slug} has no category`,
      );
      const types = strings(addon.type, `[${source.id}] addon ${addon.slug}.type`);
      const hasOnlyKnownTypes = types.every(
        (type) => templateTypes.has(type) || (source.id === 'python' && type === 'all'),
      );
      assert(
        hasOnlyKnownTypes,
        `[${source.id}] addon ${addon.slug} has a type not understood by the pinned CLI semantics`,
      );
    }
  }

  for (const addon of addons) {
    const id = entryId(source.id, addon);
    if (source.id === 'v') {
      for (const templateId of optionalStrings(addon.compatibleWith, `[${source.id}] addon ${id}.compatibleWith`)) {
        assert(templateIdSet.has(templateId), `[${source.id}] addon ${id} references unknown template ${templateId}`);
      }
    }
    for (const addonId of optionalStrings(addon.incompatibleWith, `[${source.id}] addon ${id}.incompatibleWith`)) {
      assert(addonIdSet.has(addonId), `[${source.id}] addon ${id} references unknown addon ${addonId}`);
      assert(addonId !== id, `[${source.id}] addon ${id} cannot conflict with itself`);
    }
  }
};

const labelsForEntry = (source, entry) =>
  optionalStrings(source.id === 'v' ? entry.tags : entry.labels, `[${source.id}] labels`);

const categoryForEntry = (source, entry) => (source.id === 'v' ? null : entry.category);

const typesForEntry = (source, entry) =>
  source.id === 'v' ? [] : strings(entry.type, `[${source.id}] ${entryId(source.id, entry)}.type`);

const compatibleTemplateIds = (source, addon, templates) => {
  if (source.id === 'v') {
    const declared = optionalStrings(addon.compatibleWith, `[${source.id}] addon ${addon.name}.compatibleWith`);
    return declared.length === 0
      ? templates.map((template) => entryId(source.id, template))
      : templates.filter((template) => declared.includes(template.name)).map((template) => template.name);
  }

  const addonTypes = strings(addon.type, `[${source.id}] addon ${addon.slug}.type`);
  return templates
    .filter((template) => {
      const templateTypes = strings(template.type, `[${source.id}] template ${template.slug}.type`);
      return addonTypes.some((type) => templateTypes.includes(type) || (source.id === 'python' && type === 'all'));
    })
    .map((template) => template.slug);
};

const provenanceFile = (file) => ({
  path: file.path,
  url: file.url,
  gitBlobSha: file.gitBlobSha,
  sha256: file.sha256,
});

export const normalizeFamily = (source, registry, lockFamily) => {
  validateRegistrySemantics(source, registry);
  const templates = registry.templates;
  const addons = familyAddons(source.id, registry);
  const allTemplateIds = templates.map((template) => entryId(source.id, template));

  const normalizedTemplates = templates.map((template, sourceOrder) => {
    const id = entryId(source.id, template);
    return {
      id,
      sourceId: id,
      sourceOrder,
      name: template.name,
      description: template.description,
      sourceUrl: template.url,
      category: categoryForEntry(source, template),
      labels: labelsForEntry(source, template),
      typeIds: typesForEntry(source, template),
    };
  });

  const declaredConflictMap = new Map(
    addons.map((addon) => [
      entryId(source.id, addon),
      optionalStrings(addon.incompatibleWith, `[${source.id}] addon ${entryId(source.id, addon)}.incompatibleWith`),
    ]),
  );

  const symmetricConflictMap = new Map(
    addons.map((addon) => [entryId(source.id, addon), new Set(declaredConflictMap.get(entryId(source.id, addon)))]),
  );
  for (const [addonId, conflicts] of declaredConflictMap) {
    for (const conflictId of conflicts) symmetricConflictMap.get(conflictId).add(addonId);
  }

  const normalizedAddons = addons.map((addon, sourceOrder) => {
    const id = entryId(source.id, addon);
    const compatible = compatibleTemplateIds(source, addon, templates);
    const compatibleSet = new Set(compatible);
    return {
      id,
      sourceId: id,
      sourceOrder,
      name: addon.name,
      description: addon.description,
      sourceUrl: addon.url,
      category: categoryForEntry(source, addon),
      labels: labelsForEntry(source, addon),
      typeIds: typesForEntry(source, addon),
      declaredCompatibleTemplateIds:
        source.id === 'v' ? optionalStrings(addon.compatibleWith, `[${source.id}] addon ${id}.compatibleWith`) : [],
      compatibleTemplateIds: compatible,
      incompatibleTemplateIds: allTemplateIds.filter((templateId) => !compatibleSet.has(templateId)),
      declaredIncompatibleAddonIds: [...declaredConflictMap.get(id)].sort(),
      incompatibleAddonIds: [...symmetricConflictMap.get(id)].sort(),
    };
  });

  return {
    id: source.id,
    adapter: source.adapter,
    templates: normalizedTemplates,
    addons: normalizedAddons,
    counts: {
      templates: normalizedTemplates.length,
      addons: normalizedAddons.length,
      compatibilityEdges: normalizedAddons.reduce((total, addon) => total + addon.compatibleTemplateIds.length, 0),
    },
    provenance: {
      repository: lockFamily.repository,
      commit: lockFamily.commit,
      commitDate: lockFamily.commitDate,
      registry: provenanceFile(lockFamily.registry),
      schema: provenanceFile(lockFamily.schema),
      cliReference: {
        repository: lockFamily.cliReference.repository,
        commit: lockFamily.cliReference.commit,
        commitDate: lockFamily.cliReference.commitDate,
      },
      semanticReferences: lockFamily.semanticReferences.map((reference) => ({
        role: reference.role,
        repository: reference.repository,
        commit: reference.commit,
        commitDate: reference.commitDate,
        ...provenanceFile(reference),
      })),
    },
  };
};

export const buildSnapshot = (familyInputs) => ({
  schemaVersion: SNAPSHOT_SCHEMA_VERSION,
  normalizationVersion: NORMALIZATION_VERSION,
  generatedBy: 'pnpm data:create-awesome:refresh',
  notice: 'DO NOT EDIT MANUALLY',
  families: CREATE_AWESOME_SOURCES.map((source) => {
    const input = familyInputs.get(source.id);
    assert(input, `Missing pinned input for ${source.id}`);
    validateRegistrySchema(source, input.registry, input.schema);
    return normalizeFamily(source, input.registry, input.lockFamily);
  }),
});

export const validateSnapshot = (snapshot, snapshotSchema) => {
  const ajv = createSchemaValidator('draft-07');
  const validate = ajv.compile(snapshotSchema);
  if (!validate(snapshot)) {
    throw new Error(`Generated snapshot schema error: ${formatSchemaErrors(validate.errors)}`);
  }

  const familyIds = snapshot.families.map((family) => family.id);
  assert(new Set(familyIds).size === familyIds.length, 'Snapshot contains duplicate family IDs');
  assert(
    CREATE_AWESOME_SOURCES.every((source) => familyIds.includes(source.id)),
    'Snapshot does not contain all configured families',
  );

  for (const family of snapshot.families) {
    assert(family.counts.templates === family.templates.length, `[${family.id}] template count drift`);
    assert(family.counts.addons === family.addons.length, `[${family.id}] addon count drift`);
    assert(
      family.counts.compatibilityEdges ===
        family.addons.reduce((total, addon) => total + addon.compatibleTemplateIds.length, 0),
      `[${family.id}] compatibility edge count drift`,
    );
    const templateIds = new Set(family.templates.map((template) => template.id));
    const addonIds = new Set(family.addons.map((addon) => addon.id));
    assert(templateIds.size === family.templates.length, `[${family.id}] duplicate template IDs`);
    assert(addonIds.size === family.addons.length, `[${family.id}] duplicate addon IDs`);
    for (const addon of family.addons) {
      const partition = new Set([...addon.compatibleTemplateIds, ...addon.incompatibleTemplateIds]);
      assert(partition.size === templateIds.size, `[${family.id}] ${addon.id} template partition drift`);
      for (const templateId of partition) {
        assert(templateIds.has(templateId), `[${family.id}] ${addon.id} references unknown template ${templateId}`);
      }
      for (const conflictId of addon.incompatibleAddonIds) {
        assert(addonIds.has(conflictId), `[${family.id}] ${addon.id} references unknown addon ${conflictId}`);
        const other = family.addons.find((candidate) => candidate.id === conflictId);
        assert(
          other.incompatibleAddonIds.includes(addon.id),
          `[${family.id}] ${addon.id}/${conflictId} conflict is not symmetric`,
        );
      }
    }
  }
};

const githubHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'digital-nest-create-awesome-catalog-refresh',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
};

const githubApi = async (path, fetchImplementation) => {
  const url = new URL(path, GITHUB_API_ORIGIN);
  assert(url.origin === GITHUB_API_ORIGIN, `Rejected non-GitHub API origin: ${url.origin}`);
  const response = await fetchImplementation(url, {
    headers: githubHeaders(),
    redirect: 'error',
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${url.pathname}`);
  }
  return response.json();
};

const resolveCommit = async (repository, fetchImplementation) => {
  const data = await githubApi(`/repos/${repository}/commits/${SOURCE_REF}`, fetchImplementation);
  assert(FULL_SHA.test(data.sha), `GitHub returned an invalid commit for ${repository}`);
  const commitDate = data.commit?.committer?.date ?? data.commit?.author?.date;
  assert(typeof commitDate === 'string' && commitDate.length > 0, `GitHub returned no commit date for ${repository}`);
  return { repository, commit: data.sha, commitDate };
};

const pinnedUrl = (repository, commit, path) => `${GITHUB_RAW_ORIGIN}/${repository}/${commit}/${path}`;

export const fetchSourceFile = async (repository, commit, path, fetchImplementation) => {
  const data = await githubApi(
    `/repos/${repository}/contents/${encodeURIComponent(path).replaceAll('%2F', '/')}?ref=${commit}`,
    fetchImplementation,
  );
  assert(
    data.type === 'file' && data.encoding === 'base64',
    `GitHub returned no file content for ${repository}/${path}`,
  );
  assert(FULL_SHA.test(data.sha), `GitHub returned an invalid blob SHA for ${repository}/${path}`);
  const content = Buffer.from(data.content.replaceAll('\n', ''), 'base64').toString('utf8');
  assert(gitBlobSha(content) === data.sha, `GitHub blob SHA does not match decoded content for ${repository}/${path}`);
  return {
    path,
    url: pinnedUrl(repository, commit, path),
    gitBlobSha: data.sha,
    sha256: sha256(content),
    content,
  };
};

const cachePathFor = (familyId, fileName) => `${familyId}/${fileName}`;

export const fetchCurrentSources = async ({ fetchImplementation = globalThis.fetch } = {}) => {
  assert(typeof fetchImplementation === 'function', 'A fetch implementation is required');
  const commitCache = new Map();
  const getCommit = (repository) => {
    if (!commitCache.has(repository)) {
      commitCache.set(repository, resolveCommit(repository, fetchImplementation));
    }
    return commitCache.get(repository);
  };

  const lock = {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    normalizationVersion: NORMALIZATION_VERSION,
    generatedBy: 'pnpm data:create-awesome:refresh',
    notice: 'DO NOT EDIT MANUALLY',
    families: [],
  };
  const familyInputs = new Map();
  const cacheFiles = new Map();

  for (const source of CREATE_AWESOME_SOURCES) {
    const catalogCommit = await getCommit(source.catalogRepository);
    const cliCommit = await getCommit(source.cliRepository);
    const registry = await fetchSourceFile(
      source.catalogRepository,
      catalogCommit.commit,
      source.registryPath,
      fetchImplementation,
    );
    const schema = await fetchSourceFile(
      source.catalogRepository,
      catalogCommit.commit,
      source.schemaPath,
      fetchImplementation,
    );
    registry.cachePath = cachePathFor(source.id, 'templates.json');
    schema.cachePath = cachePathFor(source.id, 'templates.schema.json');
    cacheFiles.set(registry.cachePath, registry.content);
    cacheFiles.set(schema.cachePath, schema.content);

    const semanticReferences = [];
    for (const reference of source.semanticReferences) {
      const referenceCommit = await getCommit(reference.repository);
      const file = await fetchSourceFile(
        reference.repository,
        referenceCommit.commit,
        reference.path,
        fetchImplementation,
      );
      const lockedReference = {
        role: reference.role,
        repository: reference.repository,
        commit: referenceCommit.commit,
        commitDate: referenceCommit.commitDate,
        ...file,
      };
      semanticReferences.push(lockedReference);
    }

    const lockFamily = {
      id: source.id,
      adapter: source.adapter,
      repository: source.catalogRepository,
      commit: catalogCommit.commit,
      commitDate: catalogCommit.commitDate,
      registry: {
        path: registry.path,
        url: registry.url,
        gitBlobSha: registry.gitBlobSha,
        sha256: registry.sha256,
        cachePath: registry.cachePath,
      },
      schema: {
        path: schema.path,
        url: schema.url,
        gitBlobSha: schema.gitBlobSha,
        sha256: schema.sha256,
        cachePath: schema.cachePath,
      },
      cliReference: cliCommit,
      semanticReferences: semanticReferences.map(
        ({ content: _content, cachePath: _cachePath, ...reference }) => reference,
      ),
    };

    const registryJson = parseJson(registry.content, `${source.id}/${source.registryPath}`);
    const schemaJson = parseJson(schema.content, `${source.id}/${source.schemaPath}`);
    const referencesWithContent = semanticReferences;
    validateRegistrySchema(source, registryJson, schemaJson);
    verifySemanticReferences(source, referencesWithContent);
    validateRegistrySemantics(source, registryJson);

    lock.families.push(lockFamily);
    familyInputs.set(source.id, {
      lockFamily,
      registry: registryJson,
      schema: schemaJson,
    });
  }

  const snapshot = buildSnapshot(familyInputs);
  return { lock, snapshot, cacheFiles };
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const writeDirectory = async (directory, lock, cacheFiles) => {
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'source-lock.json'), stableJson(lock), 'utf8');
  for (const [cachePath, content] of cacheFiles) {
    const target = join(directory, cachePath);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content, 'utf8');
  }
};

export const commitRefresh = async (paths, lock, cacheFiles, snapshotText, { renameImplementation = rename } = {}) => {
  const suffix = `${process.pid}-${Date.now()}`;
  const stagedPinned = `${paths.pinnedDirectory}.refresh-${suffix}`;
  const backupPinned = `${paths.pinnedDirectory}.backup-${suffix}`;
  const stagedSnapshot = `${paths.snapshot}.refresh-${suffix}`;
  const backupSnapshot = `${paths.snapshot}.backup-${suffix}`;
  let pinnedBackedUp = false;
  let snapshotBackedUp = false;
  let pinnedInstalled = false;
  let snapshotInstalled = false;

  try {
    await rm(stagedPinned, { recursive: true, force: true });
    await rm(stagedSnapshot, { force: true });
    await writeDirectory(stagedPinned, lock, cacheFiles);
    await mkdir(dirname(paths.snapshot), { recursive: true });
    await writeFile(stagedSnapshot, snapshotText, 'utf8');

    if (await exists(paths.pinnedDirectory)) {
      await renameImplementation(paths.pinnedDirectory, backupPinned);
      pinnedBackedUp = true;
    }
    if (await exists(paths.snapshot)) {
      await renameImplementation(paths.snapshot, backupSnapshot);
      snapshotBackedUp = true;
    }
    await renameImplementation(stagedPinned, paths.pinnedDirectory);
    pinnedInstalled = true;
    await renameImplementation(stagedSnapshot, paths.snapshot);
    snapshotInstalled = true;
  } catch (error) {
    if (snapshotInstalled) await rm(paths.snapshot, { force: true });
    if (pinnedInstalled) await rm(paths.pinnedDirectory, { recursive: true, force: true });
    if (snapshotBackedUp && (await exists(backupSnapshot))) {
      await renameImplementation(backupSnapshot, paths.snapshot);
    }
    if (pinnedBackedUp && (await exists(backupPinned))) {
      await renameImplementation(backupPinned, paths.pinnedDirectory);
    }
    await rm(stagedPinned, { recursive: true, force: true });
    await rm(stagedSnapshot, { force: true });
    throw error;
  }

  // Cleanup happens only after both replacements are installed. A cleanup
  // failure can leave a recoverable backup, but never a mixed generation.
  await rm(backupPinned, { recursive: true, force: true });
  await rm(backupSnapshot, { force: true });
};

export const refreshCatalogs = async ({ paths = DEFAULT_PATHS, fetchImplementation = globalThis.fetch } = {}) => {
  const snapshotSchema = await readJson(paths.snapshotSchema, 'compatibility snapshot schema');
  const { lock, snapshot, cacheFiles } = await fetchCurrentSources({ fetchImplementation });
  validateSnapshot(snapshot, snapshotSchema);
  const snapshotText = stableJson(snapshot);
  await commitRefresh(paths, lock, cacheFiles, snapshotText);
  return {
    lock,
    snapshot,
    snapshotSha256: sha256(snapshotText),
  };
};

export const validateLockFile = (lock) => {
  assert(lock.schemaVersion === SNAPSHOT_SCHEMA_VERSION, 'Pinned source lock schema version mismatch');
  assert(lock.normalizationVersion === NORMALIZATION_VERSION, 'Pinned source lock normalization version mismatch');
  assert(lock.generatedBy === 'pnpm data:create-awesome:refresh', 'Pinned source lock generator mismatch');
  assert(lock.notice === 'DO NOT EDIT MANUALLY', 'Pinned source lock ownership notice is missing');
  assert(Array.isArray(lock.families), 'Pinned source lock has no families');
  assert(lock.families.length === CREATE_AWESOME_SOURCES.length, 'Pinned source lock family count mismatch');
  assert(
    new Set(lock.families.map((family) => family.id)).size === lock.families.length,
    'Pinned source lock contains duplicate family IDs',
  );

  for (const source of CREATE_AWESOME_SOURCES) {
    const family = lock.families.find((candidate) => candidate.id === source.id);
    assert(family, `Pinned source lock is missing ${source.id}`);
    assert(family.adapter === source.adapter, `[${source.id}] unexpected normalization adapter`);
    assert(family.repository === source.catalogRepository, `[${source.id}] unexpected catalog repository`);
    assert(family.cliReference.repository === source.cliRepository, `[${source.id}] unexpected CLI repository`);
    assert(family.registry.path === source.registryPath, `[${source.id}] unexpected registry path`);
    assert(family.schema.path === source.schemaPath, `[${source.id}] unexpected schema path`);
    assert(FULL_SHA.test(family.commit), `[${source.id}] catalog commit is not immutable`);
    assert(FULL_SHA.test(family.cliReference.commit), `[${source.id}] CLI commit is not immutable`);
    assert(
      family.semanticReferences.length === source.semanticReferences.length,
      `[${source.id}] semantic reference count mismatch`,
    );
    for (const expected of source.semanticReferences) {
      const reference = family.semanticReferences.find(
        (candidate) =>
          candidate.role === expected.role &&
          candidate.repository === expected.repository &&
          candidate.path === expected.path,
      );
      assert(reference, `[${source.id}] missing semantic reference ${expected.repository}/${expected.path}`);
      const resolvedSource =
        reference.repository === family.repository
          ? family
          : reference.repository === family.cliReference.repository
            ? family.cliReference
            : null;
      assert(resolvedSource, `[${source.id}] semantic reference uses an unresolved repository`);
      assert(
        reference.commit === resolvedSource.commit,
        `[${source.id}] semantic reference commit is not source-pinned`,
      );
      assert(
        reference.commitDate === resolvedSource.commitDate,
        `[${source.id}] semantic reference date does not match its source commit`,
      );
    }
    for (const file of [family.registry, family.schema, ...family.semanticReferences]) {
      assert(FULL_SHA.test(file.gitBlobSha), `[${source.id}] invalid Git blob SHA for ${file.path}`);
      assert(SHA256.test(file.sha256), `[${source.id}] invalid SHA-256 for ${file.path}`);
      const repository = file.repository ?? family.repository;
      const commit = file.commit ?? family.commit;
      assert(
        file.url === pinnedUrl(repository, commit, file.path),
        `[${source.id}] mutable or mismatched provenance URL for ${file.path}`,
      );
    }
    for (const file of [family.registry, family.schema]) {
      assert(typeof file.cachePath === 'string' && file.cachePath.length > 0, `[${source.id}] missing cache path`);
      assert(
        file.cachePath.startsWith(`${source.id}/`) && !file.cachePath.includes('..') && !file.cachePath.includes('\\'),
        `[${source.id}] unsafe cache path ${file.cachePath}`,
      );
    }
  }
};

export const loadPinnedInputs = async ({ paths = DEFAULT_PATHS } = {}) => {
  const lockText = await readFile(paths.sourceLock, 'utf8');
  const lock = parseJson(lockText, 'pinned source lock');
  assert(lockText === stableJson(lock), 'Pinned source lock is not deterministically formatted');
  validateLockFile(lock);
  const familyInputs = new Map();

  for (const source of CREATE_AWESOME_SOURCES) {
    const lockFamily = lock.families.find((family) => family.id === source.id);
    const readPinnedFile = async (file) => {
      const path = join(paths.pinnedDirectory, file.cachePath);
      const content = await readFile(path, 'utf8');
      assert(sha256(content) === file.sha256, `[${source.id}] SHA-256 drift for ${file.cachePath}`);
      assert(gitBlobSha(content) === file.gitBlobSha, `[${source.id}] Git blob SHA drift for ${file.cachePath}`);
      return content;
    };
    const registryContent = await readPinnedFile(lockFamily.registry);
    const schemaContent = await readPinnedFile(lockFamily.schema);
    familyInputs.set(source.id, {
      lockFamily,
      registry: parseJson(registryContent, `${source.id}/${source.registryPath}`),
      schema: parseJson(schemaContent, `${source.id}/${source.schemaPath}`),
    });
  }
  return { lock, familyInputs };
};

export const checkCatalogs = async ({ paths = DEFAULT_PATHS } = {}) => {
  const { lock, familyInputs } = await loadPinnedInputs({ paths });
  const snapshotSchema = await readJson(paths.snapshotSchema, 'compatibility snapshot schema');
  const snapshot = buildSnapshot(familyInputs);
  validateSnapshot(snapshot, snapshotSchema);
  const expected = stableJson(snapshot);
  const actual = await readFile(paths.snapshot, 'utf8');
  assert(actual === expected, 'Committed compatibility snapshot differs from deterministic pinned regeneration');
  const committed = parseJson(actual, 'committed compatibility snapshot');
  validateSnapshot(committed, snapshotSchema);
  return {
    lock,
    snapshot,
    snapshotSha256: sha256(actual),
  };
};

export const classifyDrift = ({ pinnedCommit, currentCommit, additionalHeadChanged = false, files }) => {
  const changed = files.filter((file) => file.pinnedGitBlobSha !== file.currentGitBlobSha);
  const registryChanged = changed.some((file) => file.role === 'registry');
  const schemaChanged = changed.some((file) => file.role === 'schema');
  const semanticChanged = changed.some((file) => file.role === 'semantic');
  const headChanged = pinnedCommit !== currentCommit || additionalHeadChanged;
  const driftDetected = registryChanged || schemaChanged || semanticChanged;
  let status = 'current';
  if (!driftDetected && headChanged) status = 'head-only';
  if (driftDetected) {
    const parts = [];
    if (registryChanged) parts.push('catalog');
    if (schemaChanged) parts.push('schema');
    if (semanticChanged) parts.push('semantic');
    status = `${parts.join('+')}-drift`;
  }
  return { headChanged, registryChanged, schemaChanged, semanticChanged, driftDetected, status };
};

export const checkRemoteDrift = async ({ paths = DEFAULT_PATHS, fetchImplementation = globalThis.fetch } = {}) => {
  const lock = await readJson(paths.sourceLock, 'pinned source lock');
  validateLockFile(lock);
  const commitCache = new Map();
  const getCommit = (repository) => {
    if (!commitCache.has(repository)) commitCache.set(repository, resolveCommit(repository, fetchImplementation));
    return commitCache.get(repository);
  };
  const results = [];

  for (const source of CREATE_AWESOME_SOURCES) {
    const pinned = lock.families.find((family) => family.id === source.id);
    const catalogCommit = await getCommit(source.catalogRepository);
    const cliCommit = await getCommit(source.cliRepository);
    const currentRegistry = await fetchSourceFile(
      source.catalogRepository,
      catalogCommit.commit,
      source.registryPath,
      fetchImplementation,
    );
    const currentSchema = await fetchSourceFile(
      source.catalogRepository,
      catalogCommit.commit,
      source.schemaPath,
      fetchImplementation,
    );
    const files = [
      {
        role: 'registry',
        path: source.registryPath,
        pinnedGitBlobSha: pinned.registry.gitBlobSha,
        currentGitBlobSha: currentRegistry.gitBlobSha,
      },
      {
        role: 'schema',
        path: source.schemaPath,
        pinnedGitBlobSha: pinned.schema.gitBlobSha,
        currentGitBlobSha: currentSchema.gitBlobSha,
      },
    ];

    for (const reference of source.semanticReferences) {
      const currentCommit = await getCommit(reference.repository);
      const current = await fetchSourceFile(
        reference.repository,
        currentCommit.commit,
        reference.path,
        fetchImplementation,
      );
      const pinnedReference = pinned.semanticReferences.find(
        (candidate) => candidate.role === reference.role && candidate.path === reference.path,
      );
      assert(pinnedReference, `[${source.id}] pinned semantic reference is missing ${reference.path}`);
      files.push({
        role: 'semantic',
        path: reference.path,
        repository: reference.repository,
        pinnedGitBlobSha: pinnedReference.gitBlobSha,
        currentGitBlobSha: current.gitBlobSha,
      });
    }

    const cliHeadChanged = pinned.cliReference.commit !== cliCommit.commit;
    const classification = classifyDrift({
      pinnedCommit: pinned.commit,
      currentCommit: catalogCommit.commit,
      additionalHeadChanged: cliHeadChanged,
      files,
    });
    results.push({
      family: source.id,
      pinnedCommit: pinned.commit,
      currentCommit: catalogCommit.commit,
      pinnedCliCommit: pinned.cliReference.commit,
      currentCliCommit: cliCommit.commit,
      cliHeadChanged,
      files,
      ...classification,
    });
  }

  return {
    driftDetected: results.some((result) => result.driftDetected),
    results,
  };
};

export const formatDriftReport = (report) => {
  const lines = [
    '# Create Awesome catalog drift',
    '',
    '| Family | Status | Pinned catalog | Current catalog | Pinned CLI | Current CLI |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const result of report.results) {
    lines.push(
      `| ${result.family} | ${result.status} | \`${result.pinnedCommit}\` | \`${result.currentCommit}\` | \`${result.pinnedCliCommit}\` | \`${result.currentCliCommit}\` |`,
    );
  }
  lines.push(
    '',
    report.driftDetected ? 'Catalog maintenance is required.' : 'No catalog/schema/semantic drift detected.',
  );
  return `${lines.join('\n')}\n`;
};

export const relativePaths = (paths = DEFAULT_PATHS) => ({
  sourceLock: relative(paths.root, paths.sourceLock),
  snapshot: relative(paths.root, paths.snapshot),
});
