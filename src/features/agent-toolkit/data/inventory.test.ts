import { describe, expect, it } from 'vitest';
import {
  capabilityNodes,
  communityCrossLink,
  distributionTargets,
  inventory,
  inventoryCommit,
  inventoryCounts,
  inventoryVersion,
  inventoryVersionLabel,
  queueVsSwarm,
  sharedRunStateFiles,
  skillDomains,
  sourceCatalogLines,
  swarmRecipes,
  swarmStages,
  toolkitStats,
  uiBackends,
} from './index.js';

describe('agent-toolkit inventory truth', () => {
  it('loads catalog snapshot provenance (commit + version + date)', () => {
    expect(inventoryCommit).toMatch(/^[a-f0-9]{7,40}$/);
    expect(inventory.commitFull).toMatch(/^[a-f0-9]{40}$/);
    expect(inventoryVersion).toMatch(/^\d+\.\d+\.\d+/);
    expect(inventoryVersionLabel).toBe(`v${inventoryVersion}`);
    expect(inventory.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(inventory.source).toBe('ulises-jeremias/agent-toolkit');
  });

  it('matches verified HEAD inventory counts from a single snapshot', () => {
    expect(inventoryCounts.skills).toBe(61);
    expect(inventoryCounts.agents).toBe(16);
    expect(inventoryCounts.loops).toBe(10);
    expect(inventoryCounts.profiles).toBe(7);
    expect(inventoryCounts.packs).toBe(3);
    expect(inventoryCounts.plugins).toBe(4);
    expect(inventoryCounts.mcp).toBe(6);
    expect(toolkitStats.find((s) => s.label === 'skills')?.value).toBe(String(inventoryCounts.skills));
    expect(toolkitStats.find((s) => s.label === 'agents')?.value).toBe(String(inventoryCounts.agents));
    expect(toolkitStats.find((s) => s.label === 'loops')?.value).toBe(String(inventoryCounts.loops));
    expect(toolkitStats.find((s) => s.label === 'profiles')?.value).toBe(String(inventoryCounts.profiles));
    expect(toolkitStats.find((s) => s.label === 'MCP')?.value).toBe(String(inventoryCounts.mcp));
  });

  it('keeps core domain at 8 and totals skills across skillDomains', () => {
    expect(skillDomains).toHaveLength(inventoryCounts.skillDomains);
    expect(skillDomains.find((d) => d.id === 'core')?.count).toBe(8);
    expect(skillDomains.reduce((sum, d) => sum + d.count, 0)).toBe(inventoryCounts.skills);
  });

  it('exposes the six anatomy families with real catalog examples', () => {
    expect(capabilityNodes.map((n) => n.id)).toEqual(['skills', 'agents', 'loops', 'packs', 'plugins', 'mcp']);
    for (const node of capabilityNodes) {
      expect(node.examples.length).toBeGreaterThan(0);
      expect(node.count).toBe(String(inventoryCounts[node.id === 'mcp' ? 'mcp' : node.id]));
    }
  });

  it('lists distribution targets from snapshot profiles only', () => {
    expect(distributionTargets).toHaveLength(inventoryCounts.profiles);
    expect(distributionTargets.map((t) => t.id)).toEqual(inventory.profiles);
    expect(sourceCatalogLines.map((l) => l.count)).toEqual([
      inventoryCounts.skills,
      inventoryCounts.agents,
      inventoryCounts.loops,
      inventoryCounts.packs,
      inventoryCounts.plugins,
      inventoryCounts.mcp,
    ]);
  });

  it('separates DevCompanion KEEP queue from Swarm orchestration', () => {
    expect(queueVsSwarm.map((q) => q.id)).toEqual(['devcompanion', 'swarm']);
    expect(queueVsSwarm[0]?.title.toLowerCase()).toContain('devcompanion');
    expect(queueVsSwarm[0]?.title.toLowerCase()).toContain('queue');
    expect(queueVsSwarm[1]?.title.toLowerCase()).toContain('swarm');
  });

  it('documents pair as implementer → reviewer → integrator from recipes.py', () => {
    const pair = swarmRecipes.find((r) => r.id === 'pair');
    expect(pair?.roles.map((r) => r.id)).toEqual(['implementer', 'reviewer', 'integrator']);
    expect(pair?.roles).toHaveLength(3);
    const full = swarmRecipes.find((r) => r.id === 'full');
    expect(full?.roles.find((r) => r.id === 'hardener')?.policy).toBe('reviewer-writer');
  });

  it('keeps the full swarm story stages in order', () => {
    expect(swarmStages.map((s) => s.id)).toEqual([
      'request',
      'recipe',
      'roles',
      'worktrees',
      'handoffs',
      'state',
      'governance',
      'artifact',
    ]);
  });

  it('documents Herdr/tmux as two UI backends with verified commands', () => {
    expect(uiBackends.map((b) => b.id)).toEqual(['herdr', 'tmux']);
    expect(uiBackends[0]?.commands.some((c) => c.includes('--ui herdr'))).toBe(true);
    expect(uiBackends[1]?.commands.some((c) => c.includes('--ui tmux'))).toBe(true);
    expect(sharedRunStateFiles).toContain('state.json');
    expect(sharedRunStateFiles).toContain('run.yaml');
  });

  it('cross-links Community as Digital Nest workshop', () => {
    expect(communityCrossLink.href).toBe('/community');
    expect(communityCrossLink.title.toLowerCase()).toContain('digital nest');
  });

  it('keeps public copy in English without Spanish stubs', () => {
    const blob = JSON.stringify({
      capabilityNodes,
      swarmStages,
      swarmRecipes,
      queueVsSwarm,
      toolkitStats,
      communityCrossLink,
    });
    expect(blob).not.toMatch(/\b(Fuente|Ejemplo|Preferido|Autodetecta|Persistente|Escritos)\b/);
  });
});
