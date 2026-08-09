/**
 * Visual persona archetypes for REAL agent-toolkit roles / catalog agents.
 * Illustrations are synthwave operators — not real people. No invented agents.
 */

import { inventory } from './inventory.js';

export type PersonaArchetype =
  'planner' | 'implementer' | 'reviewer' | 'architect' | 'hardener' | 'qa' | 'refactorer' | 'assistant' | 'specialist';

export interface RoleVisual {
  id: string;
  label: string;
  archetype: PersonaArchetype;
  prop: string;
  color: string;
}

/** Swarm recipe role → visual vocabulary (mission §56) */
export const swarmRoleVisuals: Record<string, RoleVisual> = {
  planner: {
    id: 'planner',
    label: 'Planner',
    archetype: 'planner',
    prop: 'blueprint',
    color: '#55b9ff',
  },
  implementer: {
    id: 'implementer',
    label: 'Implementer',
    archetype: 'implementer',
    prop: 'terminal',
    color: '#1cefff',
  },
  reviewer: {
    id: 'reviewer',
    label: 'Reviewer',
    archetype: 'reviewer',
    prop: 'magnifier',
    color: '#ff84f1',
  },
  integrator: {
    id: 'integrator',
    label: 'Integrator',
    archetype: 'architect',
    prop: 'junction',
    color: '#a05cff',
  },
  architect: {
    id: 'architect',
    label: 'Architect',
    archetype: 'architect',
    prop: 'topology',
    color: '#a05cff',
  },
  refactorer: {
    id: 'refactorer',
    label: 'Refactorer',
    archetype: 'refactorer',
    prop: 'restructure',
    color: '#ff9a4d',
  },
  hardener: {
    id: 'hardener',
    label: 'Hardener',
    archetype: 'hardener',
    prop: 'shield',
    color: '#ff5c7a',
  },
  qa: {
    id: 'qa',
    label: 'QA',
    archetype: 'qa',
    prop: 'checkpoints',
    color: '#7dffb3',
  },
};

/** Map catalog agent ids → archetype (for Agents family inspector / strip) */
const AGENT_ARCHETYPE: Record<string, PersonaArchetype> = {
  planner: 'planner',
  architect: 'architect',
  'code-reviewer': 'reviewer',
  'security-reviewer': 'hardener',
  'e2e-runner': 'qa',
  'tdd-guide': 'implementer',
  'refactor-cleaner': 'refactorer',
  assistant: 'assistant',
  'tech-assistant': 'assistant',
  'build-error-resolver': 'implementer',
  'typescript-reviewer': 'reviewer',
  'database-reviewer': 'reviewer',
  'performance-optimizer': 'specialist',
  'docs-lookup': 'specialist',
  'reference-lookup': 'specialist',
  'client-workflow-bootstrap': 'planner',
};

const ARCHETYPE_PROP: Record<PersonaArchetype, string> = {
  planner: 'blueprint',
  implementer: 'terminal',
  reviewer: 'magnifier',
  architect: 'topology',
  hardener: 'shield',
  qa: 'checkpoints',
  refactorer: 'restructure',
  assistant: 'console',
  specialist: 'probe',
};

const ARCHETYPE_COLOR: Record<PersonaArchetype, string> = {
  planner: '#55b9ff',
  implementer: '#1cefff',
  reviewer: '#ff84f1',
  architect: '#a05cff',
  hardener: '#ff5c7a',
  qa: '#7dffb3',
  refactorer: '#ff9a4d',
  assistant: '#8f88b4',
  specialist: '#7358ff',
};

/** Catalog agents as visual personas — ids only from inventory.agentIds */
export const catalogAgentPersonas: RoleVisual[] = inventory.agentIds.map((id) => {
  const archetype = AGENT_ARCHETYPE[id] ?? 'specialist';
  return {
    id,
    label: id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    archetype,
    prop: ARCHETYPE_PROP[archetype],
    color: ARCHETYPE_COLOR[archetype],
  };
});

/** Featured swarm-facing personas for the strip (subset of real catalog) */
export const featuredPersonas: RoleVisual[] = [
  'planner',
  'tdd-guide',
  'code-reviewer',
  'architect',
  'security-reviewer',
  'e2e-runner',
  'refactor-cleaner',
]
  .map((id) => catalogAgentPersonas.find((p) => p.id === id))
  .filter((p): p is RoleVisual => Boolean(p));
