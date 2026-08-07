export interface WorkshopSection {
  id: string;
  title: string;
  paragraphs: string[];
}
export interface ProjectFamily {
  id: 'node' | 'python' | 'v';
  label: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  languages: string[];
  installHint: string;
}
export interface PathwayStep {
  title: string;
  description: string;
  href?: string;
  label?: string;
}
export interface ContributionPathway {
  id: 'beginner' | 'experienced';
  title: string;
  description: string;
  audience: string;
  steps: PathwayStep[];
  ctaLabel: string;
  ctaHref: string;
}
export interface WeeklyOpportunity {
  id: string;
  title: string;
  description: string;
  labels: string[];
  href: string;
}
export interface SupportChannel {
  label: string;
  href: string;
  description: string;
  external: boolean;
}
export interface ModerationItem {
  title: string;
  description: string;
}
export interface CommunityMeta {
  discordInviteUrl: string;
  discordBlurple: string;
  discordBlurpleHover: string;
  codeOfConductUrl: string;
  supportUrl: string;
}
