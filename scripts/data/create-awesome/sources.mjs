export const SNAPSHOT_SCHEMA_VERSION = 1;
export const NORMALIZATION_VERSION = 1;

export const CREATE_AWESOME_SOURCES = [
  {
    id: 'node',
    catalogRepository: 'Create-Node-App/cna-templates',
    registryPath: 'templates.json',
    schemaPath: 'templates.schema.json',
    schemaDraft: 'draft-04',
    adapter: 'typed-intersection',
    cliRepository: 'Create-Node-App/create-node-app',
    semanticReferences: [
      {
        role: 'cli-compatibility-reference',
        repository: 'Create-Node-App/create-node-app',
        path: 'packages/create-awesome-node-app/src/templates.ts',
      },
    ],
  },
  {
    id: 'python',
    catalogRepository: 'Create-Python-App/cpa-templates',
    registryPath: 'templates.json',
    schemaPath: 'templates.schema.json',
    schemaDraft: 'draft-04',
    adapter: 'typed-intersection-with-all',
    cliRepository: 'Create-Python-App/create-python-app',
    semanticReferences: [
      {
        role: 'cli-compatibility-reference',
        repository: 'Create-Python-App/create-python-app',
        path: 'packages/create-awesome-python-app/src/create_awesome_python_app/catalog.py',
      },
    ],
  },
  {
    id: 'v',
    catalogRepository: 'Create-Vlang-App/cva-templates',
    registryPath: 'templates.json',
    schemaPath: 'templates.schema.json',
    schemaDraft: 'draft-07',
    adapter: 'explicit-compatible-with-or-all',
    cliRepository: 'Create-Vlang-App/create-vlang-app',
    semanticReferences: [
      {
        role: 'cli-catalog-reference',
        repository: 'Create-Vlang-App/create-vlang-app',
        path: 'modules/create_vlang_app_core/catalog.v',
      },
      {
        role: 'catalog-compatibility-reference',
        repository: 'Create-Vlang-App/cva-templates',
        path: 'scripts/ci/registry.py',
      },
    ],
  },
];

export const SOURCE_REF = 'main';
