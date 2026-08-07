import { profile } from '@/data/profile.js';
import { atlasWorlds, contactLinks, featuredProjectLedger, heroKeywords, nestStatus } from '../data/index.js';

export function getHomePageData() {
  return {
    profile,
    atlasWorlds,
    featuredProjectLedger,
    nestStatus,
    heroKeywords,
    contactLinks,
  };
}
