export { default as DotfilesWorld } from './components/DotfilesWorld.astro';
export { default as DotfilesNarrative } from './components/DotfilesNarrative.astro';
export { default as LayersDiagram } from './components/LayersDiagram.astro';
export { default as ScreenshotGallery } from './components/ScreenshotGallery.astro';

export {
  dotfilesLayers,
  narrativeSections,
  screenshotItems,
  attributionEntries,
  licenseEntries,
  verifiedFacts,
  dotfilesMeta,
} from './data/index.js';

export type { DotfilesLayer, NarrativeSection, ScreenshotItem, AttributionEntry, LicenseEntry } from './types/index.js';
