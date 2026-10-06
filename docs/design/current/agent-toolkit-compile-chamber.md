# Agent Toolkit profile compiler

The Agent Toolkit hero now pairs its capability overview with a user-started,
illustrative distribution trace. It uses the canonical capability families and
native targets already represented by the route data. The trace animates six
source packets to a selected assistant profile; it does not install or execute
anything. Reduced-motion users get the same selectable paths without movement,
and the surrounding capability map remains available without JavaScript.

## Delivery cost

Measured on the production build with the route-budget harness:

| `/agent-toolkit/`            |  Before |   After | Change |
| ---------------------------- | ------: | ------: | -----: |
| Total compressed route bytes | 124,587 | 128,074 | +3,487 |
| CSS bytes                    |  16,331 |  17,886 | +1,555 |
| JavaScript bytes             |   2,861 |   2,861 |      0 |
| Requests                     |      12 |      12 |      0 |

The CSS budget increases from 17,408 to 18,432 bytes to accommodate this
route-specific instrument. The total route budget stays at 133,173 bytes; the
measured result retains 5,099 bytes of headroom. The instrument adds a visual
explanation of the route's existing source-to-profile model and no runtime
dependency or autonomous animation.
