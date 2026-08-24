/**
 * Shared Personal DX stack components.
 *
 * These render the canonical ecosystem model from `@/data/personal-dx-stack`
 * so Home, Projects, Toolkit, Workstation, and Harness all explain the same
 * architecture the same way.
 */
export {
  ADOPTION_PATHS,
  OWNERSHIP_MATRIX,
  PRECEDENCE_CHAIN,
  STACK_PROJECTS,
  stackByNarrative,
} from '@/data/personal-dx-stack.js';
export type { AdoptionPath, OwnershipMark, OwnershipRow, StackProject, StackRole } from '@/data/personal-dx-stack.js';
