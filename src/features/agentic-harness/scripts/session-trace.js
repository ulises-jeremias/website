const init = scene => {
  const session = scene.querySelector('[data-pc-session-visual]')
  const link = scene.querySelector('[data-pc-session-link]')
  const controls = scene.querySelector('[data-pc-controls]')
  const toggleButton = scene.querySelector('[data-pc-toggle]')
  const status = scene.querySelector('[data-pc-status]')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let transitioning = false

  if (!session || !link || !controls || !toggleButton || !status) return

  const animate = async (element, frames, duration) => {
    if (reducedMotion.matches) return
    const animation = element.animate(frames, {
      duration,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      fill: 'forwards'
    })
    await animation.finished.catch(() => undefined)
    animation.cancel()
  }

  const setState = async nextState => {
    const currentState = scene.dataset.pcState
    if (currentState === nextState || transitioning) return

    transitioning = true
    status.textContent =
      nextState === 'ended'
        ? 'Ending the demo session. Knowledge, context and project files remain.'
        : 'Starting a new demo session from the same persistent workspace state.'

    if (nextState === 'ended') {
      await Promise.all([
        animate(
          session,
          [
            { opacity: 1, transform: 'translateY(0px) scale(1)' },
            { opacity: 0, transform: 'translateY(8px) scale(0.96)' }
          ],
          360
        ),
        animate(link, [{ opacity: 0.68 }, { opacity: 0.12 }], 360)
      ])
    }

    scene.dataset.pcState = nextState

    if (nextState === 'active') {
      await Promise.all([
        animate(
          session,
          [
            { opacity: 0, transform: 'translateY(8px) scale(0.96)' },
            { opacity: 1, transform: 'translateY(0px) scale(1)' }
          ],
          420
        ),
        animate(link, [{ opacity: 0.12 }, { opacity: 0.68 }], 420)
      ])
    }

    toggleButton.textContent = nextState === 'ended' ? 'Start a new demo session' : 'End the demo session'
    transitioning = false
    status.textContent =
      nextState === 'ended'
        ? 'Demo session ended. Knowledge, personas and projects remain in the workspace.'
        : 'New demo session started. It reconnects to the same persistent workspace state.'
  }

  toggleButton.addEventListener('click', () => setState(scene.dataset.pcState === 'active' ? 'ended' : 'active'))
  toggleButton.textContent = scene.dataset.pcState === 'active' ? 'End the demo session' : 'Start a new demo session'
  controls.hidden = false
}

document.querySelectorAll('[data-persistence-core]').forEach(init)
