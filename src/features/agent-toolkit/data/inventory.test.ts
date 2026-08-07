import { describe, expect, it } from 'vitest';
import {
  capabilityNodes,
  distributionTargets,
  inventoryCommit,
  queueVsSwarm,
  skillDomains,
  swarmRecipes,
  swarmStages,
  toolkitStats,
} from './index.js';

describe('agent-toolkit inventory truth', () => {
  it('matches verified HEAD inventory counts', () => {
    expect(inventoryCommit).toMatch(/^[a-f0-9]{7,40}$/);
    expect(toolkitStats.find((s) => s.label === 'skills')?.value).toBe('61');
    expect(toolkitStats.find((s) => s.label === 'agents')?.value).toBe('16');
    expect(toolkitStats.find((s) => s.label === 'loops')?.value).toBe('10');
    expect(toolkitStats.find((s) => s.label === 'profiles')?.value).toBe('7');
    expect(toolkitStats.find((s) => s.label === 'MCP')?.value).toBe('6');
  });

  it('keeps core domain at 8 and totals 61 skills across 9 domains', () => {
    expect(skillDomains).toHaveLength(9);
    expect(skillDomains.find((d) => d.id === 'core')?.count).toBe(8);
    expect(skillDomains.reduce((sum, d) => sum + d.count, 0)).toBe(61);
  });

  it('exposes the six anatomy families including packs/plugins/MCP', () => {
    expect(capabilityNodes.map((n) => n.id)).toEqual(['skills', 'agents', 'loops', 'packs', 'plugins', 'mcp']);
  });

  it('lists seven distribution targets', () => {
    expect(distributionTargets).toHaveLength(7);
  });

  it('separates DevCompanion queue from Swarm orchestration', () => {
    expect(queueVsSwarm.map((q) => q.id)).toEqual(['devcompanion', 'swarm']);
    expect(queueVsSwarm[0]?.title.toLowerCase()).toContain('devcompanion');
    expect(queueVsSwarm[1]?.title.toLowerCase()).toContain('swarm');
  });

  it('documents pair as implementer → reviewer → integrator', () => {
    const pair = swarmRecipes.find((r) => r.id === 'pair');
    expect(pair?.roles.map((r) => r.id)).toEqual(['implementer', 'reviewer', 'integrator']);
    expect(pair?.roles).toHaveLength(3);
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

  it('keeps public copy in English without Spanish stubs', () => {
    const blob = JSON.stringify({
      capabilityNodes,
      swarmStages,
      swarmRecipes,
      queueVsSwarm,
      toolkitStats,
    });
    expect(blob).not.toMatch(/\b(Fuente|Ejemplo|Preferido|Autodetecta|Persistente|Escritos)\b/);
  });
});
