const laneSelector = '[data-evidence-trace-link]'
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

const motionQuery = window.matchMedia(reducedMotionQuery)
const status = document.querySelector('[data-evidence-trace-status]')
const activeAnimations = []
const activeTimers = []
let traceSequence = 0

function clearTrace () {
  traceSequence += 1
  activeTimers.splice(0).forEach(window.clearTimeout)
  activeAnimations.splice(0).forEach((animation) => animation.cancel())
  document.querySelectorAll('[data-tracing="true"]').forEach((element) => {
    element.removeAttribute('data-tracing')
  })
}

function schedule (callback, delay, sequence) {
  const timer = window.setTimeout(() => {
    if (sequence === traceSequence) callback()
  }, delay)
  activeTimers.push(timer)
}

function animate (element, keyframes, options, sequence) {
  if (sequence !== traceSequence || motionQuery.matches || typeof element.animate !== 'function') return
  activeAnimations.push(element.animate(keyframes, options))
}

function onLaneActivation (event, link) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return
  }

  const targetId = link.hash.slice(1)
  const group = document.getElementById(targetId)
  const lane = link.closest('.constellation__lane')
  if (!group || !lane) return

  const kind = link.dataset.recordKind ?? 'selected'
  const label = link.querySelector('.constellation__lane-label')?.textContent?.trim() ?? kind
  const markers = [...link.querySelectorAll('.constellation__lane-marker')]
  const rows = [...group.querySelectorAll('[data-evidence-trace-row]')]
  const recordCount = rows.length

  if (status) {
    status.textContent = `Tracing ${recordCount} ${label.toLowerCase()} ${recordCount === 1 ? 'record' : 'records'} into the evidence ledger.`
  }

  if (motionQuery.matches || typeof markers[0]?.animate !== 'function') return

  event.preventDefault()
  clearTrace()
  const sequence = traceSequence
  const groupHead = group.querySelector('.oss-ledger__group-head')
  const traceMarkers = () => {
    if (sequence !== traceSequence) return
    link.dataset.tracing = 'true'

    markers.forEach((marker, index) => {
      animate(
        marker,
        [
          { transform: 'scale(1)', filter: 'brightness(1)' },
          { transform: 'scale(1.45)', filter: 'brightness(1.8)', offset: 0.52 },
          { transform: 'scale(1)', filter: 'brightness(1)' }
        ],
        { duration: 300, delay: index * 54, easing: 'cubic-bezier(0.2, 0.72, 0.24, 1)' },
        sequence
      )
    })

    const markerTravel = markers.length ? 300 + (markers.length - 1) * 54 : 0
    schedule(
      () => {
        if (sequence !== traceSequence) return
        group.dataset.tracing = 'true'
        if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash)
        group.scrollIntoView({ behavior: 'smooth', block: 'start' })
        group.focus({ preventScroll: true })

        schedule(
          () => {
            if (groupHead) {
              animate(
                groupHead,
                [
                  { transform: 'translateX(0.5rem)', filter: 'brightness(1.5)' },
                  { transform: 'translateX(0)', filter: 'brightness(1)' }
                ],
                { duration: 460, easing: 'cubic-bezier(0.2, 0.72, 0.24, 1)' },
                sequence
              )
            }

            rows.forEach((row, index) => {
              animate(
                row,
                [
                  {
                    transform: 'translateX(-0.65rem)',
                    backgroundColor: 'color-mix(in srgb, var(--group-color) 18%, transparent)'
                  },
                  { transform: 'translateX(0)', backgroundColor: 'transparent' }
                ],
                { duration: 300, delay: index * 64, easing: 'cubic-bezier(0.2, 0.72, 0.24, 1)' },
                sequence
              )
            })

            const rowTravel = rows.length ? 300 + (rows.length - 1) * 64 : 0
            schedule(clearTrace, rowTravel + 120, sequence)
          },
          680,
          sequence
        )
      },
      markerTravel + 80,
      sequence
    )
  }

  // The markers pulse in view before the page follows them to the exact ledger records.
  schedule(traceMarkers, 0, sequence)
}

function installEvidenceLaneTrace () {
  const links = document.querySelectorAll(laneSelector)
  if (!links.length || !status) return

  links.forEach((link) => {
    link.addEventListener('click', (event) => onLaneActivation(event, link))
  })

  motionQuery.addEventListener('change', (event) => {
    if (event.matches) clearTrace()
  })
}

installEvidenceLaneTrace()
