import { BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Vector3 } from 'three'

/**
 * One cluster of points per section, laid out along a gentle zig-zag down -z.
 * The camera flies a second curve that passes just in front of each cluster.
 */
export const CENTERS = [
  [0, 0, 0], // hero
  [11, 3, -16], // about
  [-10, -2, -34], // skills
  [9, -4, -52], // projects
  [-9, 4, -70], // experience
  [0, 0, -88], // contact
].map(([x, y, z]) => new Vector3(x, y, z))

const camPoints = CENTERS.map((c) => new Vector3(c.x * 0.3, c.y * 0.3 + 0.3, c.z + 10))

export const camCurve = new CatmullRomCurve3(camPoints, false, 'centripetal')
export const lookCurve = new CatmullRomCurve3(
  CENTERS.map((c) => c.clone()),
  false,
  'centripetal',
)

/** Deterministic RNG so the field is identical across renders (and StrictMode double-invokes). */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeGauss(rng: () => number) {
  return () => {
    const u = rng() || 1e-6
    const v = rng()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
}

type Shape = (rng: () => number, g: () => number, out: Vector3) => void

/** Each section's cluster has its own silhouette, so the field visibly "regroups" as you scroll. */
const SHAPES: Shape[] = [
  // 0 · hero — a loose shell around the orb
  (rng, g, out) => {
    const r = 4.8 + g() * 0.7
    const th = rng() * Math.PI * 2
    const ph = Math.acos(2 * rng() - 1)
    out.set(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph))
  },
  // 1 · about — a spiral disc
  (rng, g, out) => {
    const r = 6.5 * Math.sqrt(rng())
    const a = rng() * Math.PI * 2 + r * 0.45
    out.set(Math.cos(a) * r, g() * 0.4, Math.sin(a) * r)
  },
  // 2 · skills — four tight sub-clusters
  (rng, g, out) => {
    const k = Math.floor(rng() * 4)
    const a = (k / 4) * Math.PI * 2 + 0.6
    out.set(Math.cos(a) * 4.2 + g() * 1.1, Math.sin(a) * 3 + g() * 1.1, g() * 1.1)
  },
  // 3 · projects — five blobs in an arc
  (rng, g, out) => {
    const k = Math.floor(rng() * 5)
    const a = (k / 4 - 0.5) * 2.2
    out.set(Math.sin(a) * 6 + g() * 0.8, g() * 0.8, -Math.cos(a) * 3 + g() * 0.8)
  },
  // 4 · experience — a helix, the timeline
  (rng, g, out) => {
    const t = rng() * 2 - 1
    const a = t * 11
    out.set(Math.cos(a) * 3 + g() * 0.25, Math.sin(a) * 3 + g() * 0.25, t * 9)
  },
  // 5 · contact — everything converges
  (_rng, g, out) => {
    out.set(g() * 2.2, g() * 2.2, g() * 2.2)
  },
]

export function buildField(count: number): BufferGeometry {
  const rng = mulberry32(1100)
  const g = makeGauss(rng)
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const hues = new Float32Array(count)
  const tmp = new Vector3()
  const centerWeights = [0.7, 1, 1.1, 1.1, 1, 0.8]
  const totalW = centerWeights.reduce((a, b) => a + b, 0)
  const clusterCount = Math.floor(count * 0.78)

  let i = 0
  for (let c = 0; c < SHAPES.length; c++) {
    const n = Math.floor((clusterCount * centerWeights[c]) / totalW)
    for (let k = 0; k < n && i < count; k++, i++) {
      SHAPES[c](rng, g, tmp)
      tmp.add(CENTERS[c])
      positions.set([tmp.x, tmp.y, tmp.z], i * 3)
      seeds[i] = rng()
      hues[i] = Math.min(Math.max(c / 5 + (rng() - 0.5) * 0.12, 0), 1)
    }
  }
  // Ambient dust along the whole path, so the space between sections isn't empty.
  for (; i < count; i++) {
    const t = rng()
    lookCurve.getPoint(t, tmp)
    positions.set([tmp.x + g() * 14, tmp.y + g() * 9, tmp.z + g() * 8], i * 3)
    seeds[i] = rng()
    hues[i] = t
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geo.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1))
  geo.setAttribute('aHue', new Float32BufferAttribute(hues, 1))
  return geo
}
