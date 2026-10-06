const init = (root) => {
  const live = root.querySelector('[data-v-scene-live]')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const svg = root.querySelector('.vtl-trace__svg')
  const buttons = [...root.querySelectorAll('[data-vtl-dir]')]
  const edges = [...root.querySelectorAll('[data-vtl-edge]')]
  const nodes = [...root.querySelectorAll('[data-vtl-node]')]
  let runId = 0
  let animations = []
  root.setAttribute('data-vtl-enhanced', 'true')

  const stop = () => {
    runId += 1
    animations.forEach((animation) => animation.cancel())
    animations = []
    edges.forEach((edge) => {
      edge.style.removeProperty('stroke-dasharray')
      edge.style.removeProperty('stroke-dashoffset')
      edge.classList.remove('is-current')
    })
    nodes.forEach((node) => node.classList.remove('is-current'))
    root.querySelectorAll('[data-vtl-mobile-stage]').forEach((stage) => stage.classList.remove('is-current'))
  }

  const setDirection = (direction) => {
    const dir = direction === 'reverse' ? 'reverse' : 'forward'
    stop()
    root.dataset.vtlPass = dir
    buttons.forEach((button) => button.setAttribute('aria-pressed', button.dataset.vtlDir === dir ? 'true' : 'false'))
    if (live) {
      live.textContent =
        dir === 'reverse'
          ? 'Backward pass ready. Start at the output to return gradients to each input.'
          : 'Forward pass ready. Start at the inputs to compute the output.'
    }
  }

  const pulse = (edge, currentRun) => {
    edge.classList.add('is-current')
    if (reduceMotion.matches) return Promise.resolve()
    if (!svg || svg.getBoundingClientRect().height === 0) {
      return new Promise((resolve) => window.setTimeout(resolve, 420))
    }

    const length = edge.getTotalLength()
    edge.style.strokeDasharray = `${length}`
    edge.style.strokeDashoffset = `${length}`
    const animation = edge.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
      duration: 520,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      fill: 'forwards'
    })
    animations.push(animation)
    return animation.finished
      .catch(() => undefined)
      .then(() => {
        animations = animations.filter((candidate) => candidate !== animation)
        if (currentRun !== runId) return
        edge.style.strokeDashoffset = '0'
        edge.style.removeProperty('stroke-dasharray')
        edge.style.removeProperty('stroke-dashoffset')
        edge.classList.remove('is-current')
      })
  }

  const run = async (direction) => {
    setDirection(direction)
    const dir = direction === 'reverse' ? 'reverse' : 'forward'
    const currentRun = runId
    root.dataset.vtlRunning = dir
    if (live) {
      live.textContent =
        dir === 'reverse'
          ? 'Backward pass running: returning gradients through the graph.'
          : 'Forward pass running: composing tensor values through the graph.'
    }

    const stages = dir === 'forward' ? ['inputs', 'gate', 'output'] : ['output', 'gate', 'inputs']
    for (const stage of stages) {
      if (currentRun !== runId) return
      const edgeStages = stage === 'inputs' ? ['x', 'w'] : stage === 'output' ? ['y'] : []
      const matchingEdges = edges.filter(
        (edge) => edge.dataset.pass === dir && edgeStages.includes(edge.dataset.stage || '')
      )
      const activeNodes = stage === 'inputs' ? ['x', 'w'] : stage === 'gate' ? ['multiply'] : ['y']
      nodes.forEach((node) => node.classList.toggle('is-current', activeNodes.includes(node.dataset.vtlNode || '')))
      root.querySelectorAll('[data-vtl-mobile-stage]').forEach((mobileStage) => {
        mobileStage.classList.toggle('is-current', mobileStage.dataset.vtlMobileStage === stage)
      })
      if (matchingEdges.length) {
        await Promise.all(matchingEdges.map((edge) => pulse(edge, currentRun)))
      } else if (!reduceMotion.matches) {
        await new Promise((resolve) => window.setTimeout(resolve, 420))
      }
    }

    if (currentRun !== runId) return
    root.removeAttribute('data-vtl-running')
    if (!reduceMotion.matches) {
      nodes.forEach((node) => node.classList.remove('is-current'))
      root.querySelectorAll('[data-vtl-mobile-stage]').forEach((stage) => stage.classList.remove('is-current'))
    }
    if (live) {
      live.textContent =
        dir === 'reverse'
          ? 'Backward pass complete. The graph returned ∂L/∂x = w and ∂L/∂w = x.'
          : 'Forward pass complete. The gate combined x and w into y = x × w.'
    }
  }

  buttons.forEach((button) => {
    button.disabled = false
    button.addEventListener('click', () => {
      run(button.dataset.vtlDir || 'forward')
    })
  })
  reduceMotion.addEventListener('change', () => {
    if (!reduceMotion.matches) return
    stop()
    root.removeAttribute('data-vtl-running')
    if (live) {
      live.textContent =
        root.dataset.vtlPass === 'reverse'
          ? 'Backward pass selected. The gradient path is shown without movement.'
          : 'Forward pass selected. The value path is shown without movement.'
    }
  })
}

document.querySelectorAll('[data-v-scene="vtl"]').forEach(init)
