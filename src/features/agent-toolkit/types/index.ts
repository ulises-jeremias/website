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
export interface CapabilityItem {
  id: 'skills' | 'loops' | 'knowledge' | 'devcompanion';
  title: string;
  description: string;
  icon: string;
  color: string;
  stats: ToolkitStat[];
  highlights: string[];
  details: string[];
  href?: string;
}
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
