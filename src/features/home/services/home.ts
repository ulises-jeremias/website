import { profile } from '@/data/profile.js';
import { atlasWorlds, contactLinks, heroKeywords, nestStatus } from '../data/index.js';

export function getHomePageData() {
  return {
    profile,
    atlasWorlds,
    nestStatus,
    heroKeywords,
    contactLinks,
  };
}
