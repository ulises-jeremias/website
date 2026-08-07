export type ProjectStatus = 'active' | 'maintained' | 'experimental' | 'archived';
export type ProjectKind = 'library' | 'tool' | 'template' | 'resource' | 'app';

export interface ProjectLink {
  label: string;
  href: string;
  kind: 'repo' | 'site' | 'docs';
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  featured?: boolean;
  tags: string[];
  kind: ProjectKind;
  role: string;
  links: ProjectLink[];
  lastVerified: string;
  stars?: number;
  archivedNote?: string;
}

export const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  maintained: 'Maintained',
  experimental: 'Experimental',
  archived: 'Archived',
};

export const statusDescriptions: Record<ProjectStatus, string> = {
  active: 'Actively developed, issues welcome',
  maintained: 'Stable, maintenance mode',
  experimental: 'Early, API may change',
  archived: 'Preserved, no longer maintained',
};
