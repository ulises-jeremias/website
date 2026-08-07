export interface HomeLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface BuildingItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  tag?: string;
}

export interface World {
  title: string;
  description: string;
  href: string;
  icon: string;
  eyebrow: string;
  tags: string[];
}

export interface Strength {
  title: string;
  description: string;
  icon: string;
  points: string[];
}

export interface Proof {
  title: string;
  description: string;
  links: HomeLink[];
  note?: string;
}

export interface ContactLink {
  label: string;
  href: string;
  hint: string;
  icon: string;
}
