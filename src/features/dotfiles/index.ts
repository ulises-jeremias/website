export { default as Hero } from './components/Hero.astro';
export { default as DotfilesNarrative } from './components/DotfilesNarrative.astro';
export { default as LayersDiagram } from './components/LayersDiagram.astro';
export { default as SmartColorsAnimation } from './components/SmartColorsAnimation.astro';
export { default as ScreenshotGallery } from './components/ScreenshotGallery.astro';

export {
  dotfilesLayers,
  narrativeSections,
  smartColorSteps,
  screenshotItems,
  attributionEntries,
  licenseEntries,
  verifiedFacts,
  dotfilesMeta,
} from './data/index.js';

export type {
  DotfilesLayer,
  NarrativeSection,
  SmartColorStep,
  ScreenshotItem,
  AttributionEntry,
  LicenseEntry,
} from './types/index.js';
