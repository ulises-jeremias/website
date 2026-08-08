import type { VariantId } from '../types/index.js';

export interface BuildCommandInput {
  family: VariantId;
  projectName?: string;
  template?: string;
  addons?: string[];
}

/** Default project directory placeholder shown in the composer. */
export const DEFAULT_PROJECT_NAME = 'my-app';

/**
 * Build a family-accurate Create Awesome CLI command.
 *
 * Shapes verified against upstream docs (2026-08-07):
 * - Node: `npm create … -- --template <slug> --addons a b c`
 * - Python: `uvx … --template <slug> --addons a --addons b`
 * - V: `create-vlang-app … --template <slug> --addons a,b` (comma-separated)
 */
export function buildCreateAwesomeCommand({
  family,
  projectName = DEFAULT_PROJECT_NAME,
  template,
  addons = [],
}: BuildCommandInput): string {
  const name = (projectName.trim() || DEFAULT_PROJECT_NAME).replace(/\s+/g, '-');
  const cleanedAddons = addons.map((a) => a.trim()).filter(Boolean);

  if (family === 'node') {
    const parts = ['npm', 'create', 'awesome-node-app@latest', name, '--'];
    if (template) parts.push('--template', template);
    if (cleanedAddons.length) parts.push('--addons', ...cleanedAddons);
    return parts.join(' ');
  }

  if (family === 'python') {
    const parts = ['uvx', 'create-awesome-python-app@latest', name];
    if (template) parts.push('--template', template);
    for (const addon of cleanedAddons) {
      parts.push('--addons', addon);
    }
    return parts.join(' ');
  }

  // V — release binary / alias after install.sh
  const parts = ['create-vlang-app', name];
  if (template) parts.push('--template', template);
  if (cleanedAddons.length) parts.push('--addons', cleanedAddons.join(','));
  return parts.join(' ');
}
