import { profile } from '@/data/profile';
import type { Profile } from '@/data/profile';
import { contactLinks, currentlyBuilding, featuredWorlds, openSourceProofs, strengths } from '../data/index.js';
import type { BuildingItem, ContactLink, Proof, Strength, World } from '../types/index.js';

export function getHomeProfile(): Profile {
  return profile;
}

export function getCurrentlyBuilding(): BuildingItem[] {
  return currentlyBuilding;
}

export function getFeaturedWorlds(): World[] {
  return featuredWorlds;
}

export function getStrengths(): Strength[] {
  return strengths;
}

export function getOpenSourceProofs(): Proof[] {
  return openSourceProofs;
}

export function getContactLinks(): ContactLink[] {
  return contactLinks;
}
