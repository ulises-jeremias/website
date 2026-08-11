#!/usr/bin/env node

import { appendFile } from 'node:fs/promises';
import {
  checkCatalogs,
  checkRemoteDrift,
  formatDriftReport,
  refreshCatalogs,
  relativePaths,
} from './data/create-awesome/catalogs.mjs';

const mode = process.argv[2];

const printSnapshotSummary = (label, result) => {
  const paths = relativePaths();
  console.log(`${label}: ${paths.snapshot}`);
  console.log(`SHA-256: ${result.snapshotSha256}`);
  for (const family of result.snapshot.families) {
    console.log(
      `${family.id}: ${family.counts.templates} templates, ${family.counts.addons} addons, ${family.counts.compatibilityEdges} compatible edges @ ${family.provenance.commit}`,
    );
  }
};

try {
  if (mode === 'refresh') {
    const result = await refreshCatalogs();
    printSnapshotSummary('Refreshed pinned Create Awesome snapshot', result);
  } else if (mode === 'check') {
    const result = await checkCatalogs();
    printSnapshotSummary('Validated pinned Create Awesome snapshot', result);
  } else if (mode === 'drift') {
    const report = await checkRemoteDrift();
    const formatted = formatDriftReport(report);
    process.stdout.write(formatted);
    if (process.env.GITHUB_STEP_SUMMARY) {
      await appendFile(process.env.GITHUB_STEP_SUMMARY, formatted, 'utf8');
    }
    if (report.driftDetected) process.exitCode = 1;
  } else {
    console.error('Usage: node scripts/create-awesome-catalogs.mjs <refresh|check|drift>');
    process.exitCode = 2;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
