import { z } from 'zod';

const verifiedDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }, 'Expected a valid calendar date');

/**
 * Source-backed project relationships. Presentation taxonomy, coordinates, and
 * ordering intentionally do not belong in this registry.
 */
export const personalDxRelationshipSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  verb: z.string().min(1),
  optional: z.boolean(),
  sources: z
    .array(
      z.object({
        url: z
          .string()
          .url()
          .refine((url) => !url.includes('/blob/main/') && !url.includes('/tree/main/')),
        commit: z.string().regex(/^[a-f0-9]{7,40}$/),
      }),
    )
    .min(1),
  verifiedAt: verifiedDateSchema,
});

export type PersonalDxRelationship = z.infer<typeof personalDxRelationshipSchema>;

export const personalDxRelationships: PersonalDxRelationship[] = [
  {
    source: 'agentic-workstation',
    target: 'agent-toolkit',
    verb: 'can provision host dependencies for',
    optional: true,
    sources: [
      {
        url: 'https://github.com/ulises-jeremias/agentic-workstation/blob/f83ebfd2d724c5bb059517d4a5170ff1eb3649a8/docs/AGENT_TOOLKIT.md',
        commit: 'f83ebfd2d724c5bb059517d4a5170ff1eb3649a8',
      },
      {
        url: 'https://github.com/ulises-jeremias/agentic-workstation/blob/f83ebfd2d724c5bb059517d4a5170ff1eb3649a8/docs/SWARM_SETUP.md',
        commit: 'f83ebfd2d724c5bb059517d4a5170ff1eb3649a8',
      },
    ],
    verifiedAt: '2026-08-10',
  },
  {
    source: 'agent-toolkit',
    target: 'agentic-harness',
    verb: 'provides capabilities and workspace commands to',
    optional: true,
    sources: [
      {
        url: 'https://github.com/ulises-jeremias/agent-toolkit/blob/5a6e12f53f0ca0a54b469d081220053b0d1401c8/docs/CONCEPTS.md',
        commit: '5a6e12f53f0ca0a54b469d081220053b0d1401c8',
      },
      {
        url: 'https://github.com/ulises-jeremias/agentic-harness/blob/929dcf0cd428ffb91c3fd4b7fabfe60f5d5fb33b/README.md',
        commit: '929dcf0cd428ffb91c3fd4b7fabfe60f5d5fb33b',
      },
    ],
    verifiedAt: '2026-08-10',
  },
  {
    source: 'hornero-config',
    target: 'agentic-workstation',
    verb: 'optionally coexists with',
    optional: true,
    sources: [
      {
        url: 'https://github.com/ulises-jeremias/dotfiles/tree/677daaba8619e2ddfd49e31b4869ddb724dfa388',
        commit: '677daaba8619e2ddfd49e31b4869ddb724dfa388',
      },
      {
        url: 'https://github.com/ulises-jeremias/agentic-workstation/tree/f83ebfd2d724c5bb059517d4a5170ff1eb3649a8',
        commit: 'f83ebfd2d724c5bb059517d4a5170ff1eb3649a8',
      },
    ],
    verifiedAt: '2026-08-10',
  },
];

export function validatePersonalDxRelationships(
  relationships: PersonalDxRelationship[] = personalDxRelationships,
): PersonalDxRelationship[] {
  return relationships.map((relationship) => personalDxRelationshipSchema.parse(relationship));
}
