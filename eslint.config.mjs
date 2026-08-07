import astro from 'eslint-plugin-astro';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from 'typescript-eslint';

const eslintIgnore = [
  '.git/',
  '.astro/',
  'node_modules/',
  'dist/',
  'build/',
  'coverage/',
  '.next/',
  'tools/',
  'storybook-static/',
  '*.min.js',
  '*.config.js',
  '*.d.ts',
  'dangerfile.ts',
];

export default typescriptEslint.config(
  {
    ignores: eslintIgnore,
  },
  // Astro recommended — handles .astro files with correct parser
  ...astro.configs['flat/recommended'],
  // TypeScript recommended only for TS/JS files (not Astro)
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    extends: [typescriptEslint.configs.recommended],
  },
  // Import plugin for JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    extends: [eslintPluginImport.flatConfigs.recommended],
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^astro:', '^@/', '\\.astro$'],
        },
      ],
    },
  },
  // JSX a11y for JS/TSX (useful if React islands added)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'jsx-a11y': eslintPluginJsxA11y,
    },
    rules: {
      ...eslintPluginJsxA11y.configs.recommended.rules,
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
    },
  },
  // General style rules for TS/JS
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      'import/order': [
        'warn',
        {
          groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
            {
              pattern: 'astro:*',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // Astro files: relax rules that conflict with Astro frontmatter imports
  {
    files: ['**/*.astro'],
    rules: {
      'import/no-unresolved': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
