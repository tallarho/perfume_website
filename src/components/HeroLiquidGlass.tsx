import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return reduced
}

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uReduced;
uniform float uMobile;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  int maxOct = uMobile > 0.5 ? 4 : 6;
  for (int i = 0; i < 6; i++) {
    if (i >= maxOct) break;
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  float t = uTime * 0.38 * mix(1.0, 0.12, uReduced);
  vec2 uv = vUv;

  vec2 flow = vec2(sin(t * 0.07 + uv.y * 1.4) * 0.008, t * 0.016);
  vec2 q = uv * vec2(1.05, 1.55) + flow;

  float n1 = fbm(q);
  float n2 = fbm(q * 1.65 + vec2(4.1, -t * 0.02));
  float n3 = fbm(q * 0.52 + n1 * 0.55);
  float drip = fbm(vec2(uv.x * 6.2 + sin(t * 0.12 + uv.y * 1.8) * 0.25, uv.y * 8.5 - t * 0.1));

  float ch = (n1 * 0.45 + n2 * 0.35 + n3 * 0.25) * 0.0035 * (1.0 - uReduced);
  float lr = fbm(q + vec2(ch, 0.0));
  float lg = fbm(q);
  float lb = fbm(q - vec2(ch, 0.0));
  float liquidRaw = lr * 0.42 + lg * 0.36 + lb * 0.28;
  liquidRaw = liquidRaw * 0.7 + drip * 0.34;
  liquidRaw = pow(clamp(liquidRaw, 0.0, 1.0), 0.9);

  float liquid = smoothstep(0.36, 0.8, liquidRaw);

  vec3 base = mix(vec3(0.003, 0.003, 0.003), vec3(0.012, 0.012, 0.012), length(uv - 0.5) * 0.45);

  vec3 ambLo = vec3(0.035, 0.016, 0.008);
  vec3 ambMid = vec3(0.14, 0.065, 0.022);
  vec3 ambHi = vec3(0.26, 0.19, 0.08);
  vec3 liq = mix(ambLo, ambMid, liquid);
  liq = mix(liq, ambHi, liquid * liquid * 0.36);

  vec3 col = mix(base, liq, liquid * 0.58);

  vec2 g = vec2(dFdx(liquidRaw), dFdy(liquidRaw)) * uResolution * 0.0004;
  float gradMag = length(g);
  float edge = smoothstep(0.1, 0.55, liquid) * (1.0 - smoothstep(0.68, 0.95, liquid));
  float spec = edge * pow(max(0.0, 1.0 - gradMag * 1.8), 2.2);

  vec2 hlUv = vec2(uv.x * 1.1 - 0.05, uv.y - t * 0.014);
  float sweep = sin(hlUv.x * 6.0 + sin(hlUv.y * 3.0 + t * 0.2) * 0.4);
  float streak = exp(-pow((uv.x - 0.32 - sin(t * 0.065) * 0.07) * 3.8, 2.0))
    * exp(-pow((fract(uv.y * 1.4 - t * 0.018) - 0.5) * 2.4, 2.0));
  spec += max(0.0, sweep) * 0.038 * liquid + streak * 0.18 * liquid;

  col += spec * vec3(1.0, 0.94, 0.82) * 0.18;

  float corner = exp(-length(uv - vec2(0.06, 0.94)) * 2.6) * 0.05;
  col += corner * vec3(0.22, 0.16, 0.08);

  vec2 gpix = uv * uResolution;
  float grain = fract(sin(dot(gpix + t * 50.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.02 * (1.0 - uReduced * 0.5);

  col *= 0.82;
  gl_FragColor = vec4(col, 1.0);
}
`

function LiquidScene({ mobile }: { mobile: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uReduced: { value: 0 },
      uMobile: { value: mobile ? 1 : 0 },
    }),
    [mobile],
  )

  useEffect(() => {
    const mat = materialRef.current
    if (mat) mat.uniforms.uMobile.value = mobile ? 1 : 0
  }, [mobile])

  useFrame((state) => {
    const mat = materialRef.current
    if (!mat) return
    mat.uniforms.uTime.value = state.clock.elapsedTime
    mat.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

function FallbackBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 45% 18%, rgba(50, 32, 14, 0.07), transparent 58%), radial-gradient(ellipse 70% 55% at 70% 75%, rgba(18, 12, 8, 0.16), transparent 52%), linear-gradient(168deg, #030303 0%, #080808 45%, #050505 100%)',
      }}
    />
  )
}

export function HeroLiquidGlassBackground() {
  const reduced = usePrefersReducedMotion()
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const apply = () => setMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (reduced) {
    return <FallbackBackground />
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        className="h-full w-full touch-none"
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
        gl={{
          alpha: false,
          antialias: !mobile,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        dpr={mobile ? [1, 1.25] : [1, 2]}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x050505, 1)
        }}
      >
        <Suspense fallback={null}>
          <LiquidScene mobile={mobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
