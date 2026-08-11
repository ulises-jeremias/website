export { default as Hero } from './components/Hero.astro';
export { default as Variants } from './components/Variants.astro';
export { default as Details } from './components/Details.astro';
export { default as Composer } from './components/Composer.astro';
export { default as CreateAwesomeWorld } from './components/CreateAwesomeWorld.astro';

export {
  buildCreateAwesomeCommand,
  createAwesomeCompatibilitySnapshot,
  familyCatalogs,
  catalogTotals,
  getCompatibilityFamily,
  getCompatibleAddons,
  isTemplateAddonCompatible,
  validateComposition,
  variants,
} from './data/index.js';
