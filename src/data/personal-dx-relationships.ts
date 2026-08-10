import { z } from 'zod';

/**
 * Source-backed project relationships. Presentation taxonomy, coordinates, and
 * ordering intentionally do not belong in this registry.
 */
export const personalDxRelationshipSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  verb: z.string().min(1),
  optional: z.boolean(),
  sourceUrls: z.array(z.string().url()).min(1),
  sourceCommits: z.array(z.string().regex(/^[a-f0-9]{7,40}$/)).min(1),
  verifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type PersonalDxRelationship = z.infer<typeof personalDxRelationshipSchema>;

export const personalDxRelationships: PersonalDxRelationship[] = [
  {
    source: 'agentic-workstation',
    target: 'agent-toolkit',
    verb: 'can provision host dependencies for',
    optional: true,
    sourceUrls: [
      'https://github.com/ulises-jeremias/agentic-workstation/blob/main/docs/AGENT_TOOLKIT.md',
      'https://github.com/ulises-jeremias/agentic-workstation/blob/main/docs/SWARM_SETUP.md',
    ],
    sourceCommits: ['f83ebfd2d724c5bb059517d4a5170ff1eb3649a8'],
    verifiedAt: '2026-08-10',
  },
  {
    source: 'agent-toolkit',
    target: 'agentic-harness',
    verb: 'provides capabilities and workspace commands to',
    optional: true,
    sourceUrls: [
      'https://github.com/ulises-jeremias/agent-toolkit/blob/main/docs/CONCEPTS.md',
      'https://github.com/ulises-jeremias/agentic-harness/blob/main/README.md',
    ],
    sourceCommits: ['5a6e12f53f0ca0a54b469d081220053b0d1401c8', '929dcf0cd428ffb91c3fd4b7fabfe60f5d5fb33b'],
    verifiedAt: '2026-08-10',
  },
  {
    source: 'hornero-config',
    target: 'agentic-workstation',
    verb: 'optionally coexists with',
    optional: true,
    sourceUrls: [
      'https://github.com/ulises-jeremias/dotfiles',
      'https://github.com/ulises-jeremias/agentic-workstation',
    ],
    sourceCommits: ['677daaba8619e2ddfd49e31b4869ddb724dfa388', 'f83ebfd2d724c5bb059517d4a5170ff1eb3649a8'],
    verifiedAt: '2026-08-10',
  },
];

export function validatePersonalDxRelationships(
  relationships: PersonalDxRelationship[] = personalDxRelationships,
): PersonalDxRelationship[] {
  return relationships.map((relationship) => personalDxRelationshipSchema.parse(relationship));
}
