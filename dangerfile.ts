import { danger, fail, warn } from 'danger';

const SMALL_PR_FILES = 15;
const SMALL_PR_LINES = 400;

const templateSections = ['## Description', '## Type of Change', '## How Has This Been Tested?', '## Checklist'];

const checklistItems = [
  'My code follows the style guidelines of this project',
  'I have performed a self-review of my code',
  'I have commented my code, particularly in hard-to-understand areas',
  'I have made corresponding changes to the documentation',
  'My changes generate no new warnings',
  'Any dependent changes have been merged and published in downstream modules',
  'I have checked my code and corrected any misspellings',
];

if (!danger.github.pr.body) {
  fail(':clipboard: Missing Summary - Please add a `## Description` section to your PR description.');
}

if (!danger.github.pr.title) {
  fail(':id: Missing PR Title - Please add a title.');
}

// Bot-authored PRs (Dependabot, ImgBot, …) don't fill in the human PR
// template. Lint their content by all means, but skip template policing.
const isBotAuthored = /(\[bot\]|^app\/)/.test(danger.github.pr.user.login ?? '');
const hasSection = (section: string) => Boolean(danger.github.pr.body?.includes(section));

if (!isBotAuthored) {
  templateSections.forEach((section) => {
    if (!hasSection(section)) {
      fail(`:clipboard: Missing Section - Please include \`${section}\` in your PR description.`);
    }
  });

  checklistItems.forEach((item) => {
    if (!danger.github.pr.body?.includes(`- [x] ${item}`)) {
      warn(`:clipboard: Unchecked Checklist Item - Please check \`${item}\` in your PR description.`);
    }
  });
}
