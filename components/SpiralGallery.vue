<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 3D spiral screenshot gallery inspired by pacomepertant.com.
// Cards sit on a vertical helix (cylinder + vertical offset per card); mouse
// wheel / touch drag feeds an inertial scroll offset that rotates the helix
// in an endless loop. Implemented with CSS 3D transforms driven by rAF —
// no WebGL dependency.
const props = defineProps<{
  images: string[]
  alt: string
}>()

// Enough duplicated cards that the modulo wrap point stays far offscreen.
const CARD_COUNT = 16
const ANGLE_GAP = 0.85 // radians between neighbouring cards (reference value)
const EASE = 0.1 // wheel speed smoothing (matches reference easing)
const DECAY = 0.9 // per-frame decay of the wheel impulse
const IDLE_SPEED = 0.0028 // perpetual slow rotation when idle, in cards/frame
const MAX_SPEED = 0.16

// Cylindrical bend: each card is split into vertical slices arranged on an
// arc (reference shader: newPosition.z = sin(uv.x * PI) * 0.2). The bend is
// static, so slice transforms are computed once per resize, not per frame.
const SLICE_COUNT = 16
const BEND_ANGLE = 0.75 // total arc angle covered by one card, in radians

const cards = Array.from({ length: CARD_COUNT }, (_, index) => props.images[index % props.images.length])
const centerIndex = Math.floor(CARD_COUNT / 2)

const stageRef = ref<HTMLElement | null>(null)
const cardEls = ref<HTMLElement[]>([])
const sliceTransforms = ref<string[]>([])

function sliceStyle(image: string, index: number) {
  // Sub-pixel overlap: enough to close antialiasing gaps between rasterized
  // slice layers, small enough that the double-composited strip inside the
  // stage's translucent mask fade stays invisible.
  const overlap = index === SLICE_COUNT - 1 ? 0 : 0.0022
  const sliceFrac = 1 / SLICE_COUNT + overlap

  return {
    left: `${(index * 100) / SLICE_COUNT}%`,
    width: `${sliceFrac * 100}%`,
    backgroundImage: `url(${image})`,
    backgroundSize: `${100 / sliceFrac}% 100%`,
    backgroundPosition: `${((index / SLICE_COUNT) / (1 - sliceFrac)) * 100}% 0`,
    transform: sliceTransforms.value[index],
  }
}

function setCardEl(index: number) {
  return (el: unknown) => {
    if (el instanceof HTMLElement) {
      cardEls.value[index] = el
    }
  }
}

let rafId = 0
let running = false
let reducedMotion = false

// Inertial scroll state (reference: Controls.scrollOffset / wheelDeltaY).
let offset = 0
let speed = 0
let target = 0
let direction = 1

// Layout metrics, refreshed on resize.
let radius = 420
let verticalGap = 130
let stageHeight = 560
let cardHeight = 240

function measure() {
  const stage = stageRef.value
  const card = cardEls.value[0]
  if (!stage || !card) {
    return
  }

  const cardWidth = card.offsetWidth
  cardHeight = card.offsetHeight
  stageHeight = stage.offsetHeight
  radius = cardWidth * 1.3
  verticalGap = cardHeight * 0.52

  // Chord tessellation of an arc with radius r = W / A: each slice center
  // sits ON the arc and is rotated to the arc tangent, so neighbouring slice
  // edges coincide in 3D and the projected silhouette stays continuous.
  const bendRadius = cardWidth / BEND_ANGLE
  const edgeCos = Math.cos(BEND_ANGLE / 2)
  sliceTransforms.value = Array.from({ length: SLICE_COUNT }, (_, index) => {
    const t = (index + 0.5) / SLICE_COUNT - 0.5
    const phi = BEND_ANGLE * t
    const dx = bendRadius * Math.sin(phi) - t * cardWidth
    const bulge = bendRadius * (Math.cos(phi) - edgeCos)
    return `translateX(${dx.toFixed(2)}px) translateZ(${bulge.toFixed(2)}px) rotateY(${phi.toFixed(4)}rad)`
  })
}

function layout() {
  const count = CARD_COUNT
  const skew = Math.max(-8, Math.min(8, speed * 90))

  for (let index = 0; index < count; index += 1) {
    const el = cardEls.value[index]
    if (!el) {
      continue
    }

    let wrapped = (index - offset) % count
    wrapped = (wrapped + count) % count
    const relative = wrapped - centerIndex

    const angle = -relative * ANGLE_GAP
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius - radius
    const y = relative * verticalGap

    // Cards far outside the stage never contribute pixels: skip compositing.
    if (Math.abs(y) > stageHeight / 2 + cardHeight) {
      el.style.visibility = 'hidden'
      continue
    }

    el.style.visibility = 'visible'
    // Depth cue: cards deeper in the cylinder darken via the slice overlay.
    const depth = (z + radius * 2) / (radius * 2)
    el.style.setProperty('--spiral-shade', ((1 - depth) * 0.55).toFixed(3))
    el.style.transform =
      `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)` +
      ` skewX(${skew.toFixed(2)}deg) rotateY(${angle.toFixed(4)}rad)`
  }
}

function frame() {
  speed += (target - speed) * EASE
  offset = (offset + speed + CARD_COUNT) % CARD_COUNT
  target *= DECAY

  if (Math.abs(target) < IDLE_SPEED) {
    target = direction * IDLE_SPEED
  }

  layout()

  if (running) {
    rafId = requestAnimationFrame(frame)
  }
}

function start() {
  if (running || reducedMotion) {
    return
  }

  running = true
  rafId = requestAnimationFrame(frame)
}

function stop() {
  running = false
  cancelAnimationFrame(rafId)
}

function handleWheel(event: WheelEvent) {
  if (reducedMotion) {
    return
  }

  const delta = Math.max(-140, Math.min(140, event.deltaY))
  target += delta * 0.00045

  if (Math.abs(delta) > 2) {
    direction = delta > 0 ? 1 : -1
  }

  target = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, target))
}

let lastTouchY = 0

function handleTouchStart(event: TouchEvent) {
  lastTouchY = event.touches[0]?.clientY ?? 0
}

function handleTouchMove(event: TouchEvent) {
  if (reducedMotion) {
    return
  }

  const touchY = event.touches[0]?.clientY ?? lastTouchY
  const delta = lastTouchY - touchY
  lastTouchY = touchY
  target += delta * 0.0011

  if (Math.abs(delta) > 1) {
    direction = delta > 0 ? 1 : -1
  }

  target = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, target))
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  measure()
  layout()

  if (reducedMotion) {
    return
  }

  if (stageRef.value) {
    stageRef.value.addEventListener('touchstart', handleTouchStart, { passive: true })
    stageRef.value.addEventListener('touchmove', handleTouchMove, { passive: true })
  }

  window.addEventListener('wheel', handleWheel, { passive: true })
  window.addEventListener('resize', measure)

  // rAF is throttled by the browser when the page is hidden, and the per-frame
  // work (16 transform strings) is negligible, so the loop simply stays on.
  start()
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('resize', measure)
  stageRef.value?.removeEventListener('touchstart', handleTouchStart)
  stageRef.value?.removeEventListener('touchmove', handleTouchMove)
})
</script>

<template>
  <div ref="stageRef" class="spiral-stage" role="img" :aria-label="alt">
    <div class="spiral-world" aria-hidden="true">
      <div
        v-for="(image, index) in cards"
        :key="index"
        :ref="setCardEl(index)"
        class="spiral-card"
      >
        <div
          v-for="slice in SLICE_COUNT"
          :key="slice"
          class="spiral-slice"
          :style="sliceStyle(image, slice - 1)"
        />
      </div>
    </div>
  </div>
</template>
