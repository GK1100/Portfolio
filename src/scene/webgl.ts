export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Phones and low-core machines get a lighter field and a lower pixel-ratio ceiling. */
export function isLowPower(): boolean {
  return navigator.hardwareConcurrency <= 4 || window.matchMedia('(max-width: 768px)').matches
}
