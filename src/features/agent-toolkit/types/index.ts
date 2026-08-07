export interface ToolkitStat {
  label: string;
  value: string;
  hint?: string;
}

export interface ToolkitOverviewSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface SkillDomain {
  id: string;
  count: number;
}

export interface CapabilityNode {
  id: 'skills' | 'agents' | 'loops' | 'packs' | 'plugins' | 'mcp';
  title: string;
  count: string;
  summary: string;
  detail: string;
  href: string;
  color: string;
}

export interface DistributionTarget {
  id: string;
  label: string;
  path: string;
}

export interface SwarmStage {
  id: string;
  index: number;
  title: string;
  summary: string;
  detail: string;
}

export interface SwarmRecipe {
  id: 'pair' | 'team' | 'full';
  label: string;
  useWhen: string;
  roles: Array<{ id: string; policy: string }>;
}

export interface QueueVsSwarmItem {
  id: 'devcompanion' | 'swarm';
  title: string;
  summary: string;
  bullets: string[];
  command: string;
}

export interface UiBackend {
  id: 'herdr' | 'tmux';
  title: string;
  summary: string;
}

export interface InstallSnippet {
  label: string;
  command: string;
  note: string;
}

export interface BudgetItem {
  label: string;
  value: string;
  description: string;
}

/** @deprecated Prefer CapabilityNode — kept for transitional imports */
export interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  stats: ToolkitStat[];
  highlights: string[];
  details: string[];
  href?: string;
}

/** @deprecated Prefer SwarmStage */
export interface SwarmScene {
  id: string;
  index: number;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  icon: string;
  color: string;
  bullets: string[];
}
