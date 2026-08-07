const { danger, fail, message, warn } = require('danger');

const SMALL_PR_FILES = 10;
const SMALL_PR_LINES = 200;

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
const hasSection = (section) => danger.github.pr.body.includes(section);
const isChecklistItemChecked = (item) => danger.github.pr.body.includes(`- [x] ${item}`);
templateSections.forEach((section) => {
  if (!hasSection(section)) {
    fail(`:clipboard: Missing Section - Please include the section: <i>${section}</i> in your PR description.`);
  }
});
checklistItems.forEach((item) => {
  if (!isChecklistItemChecked(item)) {
    warn(`:clipboard: Unchecked Checklist Item - Please check the item: <i>${item}</i> in your PR description.`);
  }
});
const touchedFiles = danger.git.created_files.concat(danger.git.modified_files);
const allFiles = touchedFiles.concat(danger.git.deleted_files);
const diffsList = Promise.all(allFiles.map((p) => danger.git.diffForFile(p)));
diffsList
  .then((diffs) => diffs.filter(Boolean))
  .then((diffs) => ({
    removed: diffs.reduce((lines, diff) => lines + diff.removed.split('\n').length, 0),
    added: diffs.reduce((lines, diff) => lines + diff.added.split('\n').length, 0),
    lines: diffs.reduce((lines, diff) => lines + diff.added.split('\n').length + diff.removed.split('\n').length, 0),
    files: diffs.length,
  }))
  .then((diff) => {
    if (diff.added < diff.removed) {
      message('Thanks! We :heart: removing more lines than added!');
    }
    if (diff.lines <= SMALL_PR_LINES && diff.files <= SMALL_PR_FILES) {
      message('Thanks! We :heart: small PRs!');
    }
    if (diff.lines > SMALL_PR_LINES) {
      warn(`This PR is changing more than ${SMALL_PR_LINES} lines.`);
    }
  });
