/**
 * Point-field shaders. All motion (drift, cursor attraction) is computed on the GPU,
 * so the CPU cost per frame is a handful of uniform writes, however many points there are.
 */
export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMotion;
  uniform vec2 uMouse;
  uniform vec2 uViewScale;

  attribute float aSeed;
  attribute float aHue;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime;
    p += vec3(
      sin(t * 0.40 + aSeed * 6.2831),
      cos(t * 0.33 + aSeed * 12.566),
      sin(t * 0.27 + aSeed * 9.4247)
    ) * 0.14 * uMotion;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;

    // Pull points gently toward the cursor (screen-space falloff).
    vec2 d = ndc - uMouse;
    float aspect = uViewScale.x / uViewScale.y;
    float dist = length(d * vec2(aspect, 1.0));
    float pull = smoothstep(0.38, 0.0, dist) * uMotion;
    mv.xy -= d * pull * 0.45 * (-mv.z) * uViewScale;

    gl_Position = projectionMatrix * mv;

    float depth = -mv.z;
    gl_PointSize = clamp(
      uSize * uPixelRatio * (34.0 / depth) * (0.6 + aSeed * 0.9),
      1.0,
      7.0 * uPixelRatio
    );

    vec3 cool = vec3(0.42, 0.66, 1.00);
    vec3 mid  = vec3(0.71, 0.55, 1.00);
    vec3 warm = vec3(1.00, 0.62, 0.48);
    vColor = aHue < 0.5 ? mix(cool, mid, aHue * 2.0) : mix(mid, warm, (aHue - 0.5) * 2.0);

    vAlpha = smoothstep(95.0, 25.0, depth)
           * smoothstep(0.6, 2.5, depth)
           * (0.30 + 0.70 * aSeed)
           * (1.0 + pull * 1.2);
  }
`

export const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`
