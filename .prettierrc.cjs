module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: 'src/features/v/scripts/*.js',
      options: {
        semi: false,
        trailingComma: 'none',
      },
    },
    {
      files: 'public/assets/v/*.js',
      options: {
        semi: false,
        trailingComma: 'none',
      },
    },
    {
      files: 'src/features/agentic-harness/scripts/*.js',
      options: {
        semi: false,
        trailingComma: 'none',
        arrowParens: 'avoid',
      },
    },
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
