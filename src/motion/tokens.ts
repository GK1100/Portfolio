/**
 * Motion tokens. These mirror the CSS custom properties in styles/tokens.css —
 * change both together. Curves come from the emil-design-eng set; never hand-roll.
 */
export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const

/** Decorative pointer-tracking springs (tilt cards). Subtle, no bounce. */
export const tiltSpring = { stiffness: 180, damping: 22, mass: 0.6 } as const

/** Easing for programmatic scrolling (nav clicks): ease-in-out quart. */
export const scrollEase = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
