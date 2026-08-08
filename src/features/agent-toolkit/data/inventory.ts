/**
 * Single source of truth for Agent Toolkit inventory facts.
 * Numbers come from `inventory.snapshot.json`, generated from
 * ulises-jeremias/agent-toolkit catalogs at HEAD (see scripts/sync-agent-toolkit-inventory.py).
 */

import snapshot from './inventory.snapshot.json';

export type CapabilityFamilyId = 'skills' | 'agents' | 'loops' | 'packs' | 'plugins' | 'mcp';

export interface InventoryExample {
  id: string;
  name: string;
  description: string;
  domain?: string;
  stability?: string;
  tier?: string;
  cadence?: string;
}

export interface InventorySnapshot {
  source: string;
  sourceKind: string;
  catalogs: string[];
  commit: string;
  commitFull: string;
  verifiedAt: string;
  version: string;
  counts: {
    skills: number;
    agents: number;
    loops: number;
    profiles: number;
    packs: number;
    plugins: number;
    mcp: number;
    skillDomains: number;
  };
  skillDomains: Array<{ id: string; count: number }>;
  profiles: string[];
  packs: string[];
  plugins: string[];
  mcp: string[];
  agentIds: string[];
  loopIds: string[];
  examples: Record<CapabilityFamilyId, InventoryExample[]>;
}

export const inventory = snapshot as InventorySnapshot;

export const inventoryCounts = inventory.counts;

/** Display form: v1.8.4 */
export const inventoryVersionLabel = `v${inventory.version}`;

/** Short provenance line for UI */
export const inventoryProvenance = `${inventoryVersionLabel} · ${inventory.commit} · ${inventory.verifiedAt}`;

/** Hero / SEO inventory strip — one place only */
export function inventoryStrip(separator = ' · '): string {
  const c = inventory.counts;
  return [
    `${c.skills} skills`,
    `${c.agents} agents`,
    `${c.loops} loops`,
    `${c.profiles} profiles`,
    `${c.mcp} MCP`,
  ].join(separator);
}

export function countString(key: keyof typeof inventory.counts): string {
  return String(inventory.counts[key]);
}

export function skillDomainDetail(): string {
  return inventory.skillDomains.map((d) => `${d.id} ${d.count}`).join(' · ');
}
