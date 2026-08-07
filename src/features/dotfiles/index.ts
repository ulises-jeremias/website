export { default as DotfilesNarrative } from './components/DotfilesNarrative.astro';
export { default as LayersDiagram } from './components/LayersDiagram.astro';
export { default as SmartColorsAnimation } from './components/SmartColorsAnimation.astro';
export { default as ScreenshotGallery } from './components/ScreenshotGallery.astro';

export {
  dotfilesLayers,
  narrativeSections,
  smartColorSteps,
  screenshotItems,
  licenseEntries,
  dotfilesMeta,
} from './data/index.js';

export type { DotfilesLayer, NarrativeSection, SmartColorStep, ScreenshotItem, LicenseEntry } from './types/index.js';
