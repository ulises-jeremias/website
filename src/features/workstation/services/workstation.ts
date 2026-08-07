import { workstationLayers } from '../data/index.js';
import type { LayerId, LayerMeta } from '../types/index.js';

export function getLayers(): LayerMeta[] {
  return workstationLayers;
}

export function getLayerById(id: LayerId): LayerMeta | undefined {
  return workstationLayers.find((l) => l.id === id);
}

export function getLayerMappingLabel(id: LayerId): string | undefined {
  return getLayerById(id)?.mapping;
}

export function isThinWorkstationCompliant(layer: LayerMeta): boolean {
  if (layer.id !== 'workstation') return true;
  return layer.description.toLowerCase().includes('thin');
}

export function getEcosystemFlow(): string {
  return workstationLayers.map((l) => l.mapping).join(' → ');
}
