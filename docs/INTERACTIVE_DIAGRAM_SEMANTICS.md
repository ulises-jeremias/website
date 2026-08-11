# Interactive Diagram Grammar

Interactive technical diagrams use one semantic contract even when their visual
composition and route-specific code differ.

## Contract

### 1. Visual diagram

- The diagram is visual reinforcement, never the primary control surface.
- If native controls and inspector content contain all meaningful information,
  hide the SVG from assistive technology with `aria-hidden="true"` and
  `focusable="false"`.
- If unique spatial information cannot be represented equivalently in HTML,
  expose one concise, non-interactive figure description. Document the unique
  information before using this exception.
- SVG nodes never use button/radio roles, `tabindex`, or custom keyboard
  activation for the same choice exposed by the native selector.

### 2. Native selector

- A mutually exclusive state uses native radio inputs grouped by a visible
  `fieldset`/`legend`.
- Radio state is the authoritative state. Use normal browser keyboard behavior;
  do not reproduce the radio keyboard model in JavaScript.
- Visible labels provide at least a 44 by 44 CSS-pixel effective target where the
  route uses button-like labels.
- A selector that needs JavaScript to update its inspector remains disabled until
  its listeners and initial state are ready. The no-JavaScript document supplies
  a complete static description.

### 3. Inspector

- The inspector is ordinary readable document content.
- Radio changes update the inspector without moving focus.
- Use `aria-controls` when a radio controls a stable inspector element.
- Do not make the entire inspector a live region.

### 4. Status summary

- A separate `role="status"` element with `aria-atomic="true"` provides one
  concise confirmation after a selection changes.
- Do not add redundant or assertive live-region behavior.
- The summary names the new choice and a short source-backed result; it does not
  repeat the complete inspector.

### 5. Pointer shortcut

- A visual node may remain clickable for mouse/touch convenience.
- The shortcut invokes the corresponding native radio's normal click/change
  flow; it does not update parallel state.
- The visual node remains absent from the keyboard order and accessibility tree.

## Route decisions

### Dotfiles

The ordered radio labels, visible “Layer stack” context, complete no-JavaScript
list, and inspector expose the layer names, order, purpose, and details. The SVG
adds no unique factual relationship, so it is hidden from assistive technology.

### Agentic Workstation

The visible route introduction, four responsibility radios, complete
no-JavaScript list, and inspector expose each project responsibility and its
optionality. The responsibility topology elsewhere provides the canonical
cross-project edge semantics. The system-map SVG adds no unique fact, so it is
hidden from assistive technology.

## Validation

For every adoption:

- assert that the SVG has no focusable or control-role descendants;
- exercise native keyboard selection and pointer delegation;
- verify radio, visual, inspector, and status state remain synchronized;
- verify focus stays on the radio after keyboard selection;
- inspect source order, 320/390 reflow, touch targets, forced colors, reduced
  motion, and no-JavaScript content;
- run focused axe checks;
- complete the named human screen-reader pilot before claiming screen-reader
  acceptance.
