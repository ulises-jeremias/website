module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [1, 'always', 200],
    'body-max-length': [1, 'always', 1000],
    'footer-leading-blank': [2, 'always'],
    'footer-max-line-length': [1, 'always', 200],
    'footer-max-length': [1, 'always', 500],
  },
};
