import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { viewportCursor } from './ViewportCursorProvider'

const CAM_Z = 24
const CAM_Z_WOBBLE = 2.2

const SPIRAL_A = 1.2
const SPIRAL_B = 0.105
const TURNS = 4.25
const SPIRAL_STEPS = 480

const GALAXY_STAR_COUNT = 3400
const FLOW_STAR_COUNT = 420

/** Отталкивание точек в экранном пространстве: радиус в NDC и сила в мировых единицах */
const POINT_REPEL_NDC = 0.3
const POINT_REPEL_WORLD = 0.5

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildSpiralPoints(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const maxTheta = TURNS * Math.PI * 2
  for (let i = 0; i <= SPIRAL_STEPS; i++) {
    const theta = (i / SPIRAL_STEPS) * maxTheta
    const r = SPIRAL_A * Math.exp(SPIRAL_B * theta)
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    const z = Math.sin(theta * 0.42) * 3.12 + Math.cos(theta * 0.18) * 1.02
    pts.push(new THREE.Vector3(x, y, z))
  }
  return pts
}

function buildGalaxyStarData(spiralPts: THREE.Vector3[]) {
  const rnd = mulberry32(0xcafebabe)
  const nSeg = spiralPts.length - 1
  let rMax = 0
  for (const p of spiralPts) {
    rMax = Math.max(rMax, Math.hypot(p.x, p.y))
  }

  const sampleSpiral = (u: number) => {
    const idx = u * nSeg
    const i0 = Math.floor(idx)
    const i1 = Math.min(i0 + 1, nSeg)
    const f = idx - i0
    const p0 = spiralPts[i0]
    const p1 = spiralPts[i1]
    return new THREE.Vector3(
      p0.x + (p1.x - p0.x) * f,
      p0.y + (p1.y - p0.y) * f,
      p0.z + (p1.z - p0.z) * f,
    )
  }

  const positions = new Float32Array(GALAXY_STAR_COUNT * 3)
  const colors = new Float32Array(GALAXY_STAR_COUNT * 3)

  for (let i = 0; i < GALAXY_STAR_COUNT; i++) {
    const roll = rnd()
    let x: number
    let y: number
    let z: number
    let distN: number

    if (roll < 0.64) {
      const p = sampleSpiral(rnd())
      const r = Math.hypot(p.x, p.y)
      const jitter =
        (0.06 + rnd() * 0.55) * (0.2 + 0.8 * Math.min(1, r / rMax))
      const ja = rnd() * Math.PI * 2
      x = p.x + Math.cos(ja) * jitter
      y = p.y + Math.sin(ja) * jitter
      z = p.z + (rnd() - 0.5) * 0.42
      distN = Math.hypot(x, y) / rMax
    } else {
      const rr = Math.sqrt(rnd()) * rMax * 0.94
      const ang = rnd() * Math.PI * 2
      x = Math.cos(ang) * rr
      y = Math.sin(ang) * rr
      z = (rnd() - 0.5) * 0.62 * (1 - rr / rMax) * 0.85
      distN = rr / rMax
    }

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    const core = Math.max(0, 1 - distN * 1.25)
    const warm = rnd() > 0.91
    const dim = 0.28 + core * 0.55 + rnd() * 0.35
    if (warm) {
      colors[i * 3] = 1 * dim
      colors[i * 3 + 1] = 0.88 * dim
      colors[i * 3 + 2] = 0.72 * dim
    } else {
      colors[i * 3] = (0.72 + rnd() * 0.28) * dim
      colors[i * 3 + 1] = (0.78 + rnd() * 0.2) * dim
      colors[i * 3 + 2] = (0.95 + rnd() * 0.05) * dim
    }
  }

  return { positions, colors }
}

function softParticleTexture(): THREE.CanvasTexture {
  const size = 64
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  g.addColorStop(0, 'rgba(255, 255, 255, 1)')
  g.addColorStop(0.2, 'rgba(220, 235, 255, 0.5)')
  g.addColorStop(0.55, 'rgba(160, 200, 255, 0.12)')
  g.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduced
}

function GalaxyScene({ spiralPts }: { spiralPts: THREE.Vector3[] }) {
  const galaxyGroupRef = useRef<THREE.Group>(null)
  const particleMap = useMemo(() => softParticleTexture(), [])
  const invWorldMat = useMemo(() => new THREE.Matrix4(), [])
  const repelScratch = useMemo(
    () => ({
      world: new THREE.Vector3(),
      proj: new THREE.Vector3(),
      offset: new THREE.Vector3(),
      final: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      outLocal: new THREE.Vector3(),
    }),
    [],
  )
  useEffect(() => {
    return () => {
      particleMap.dispose()
    }
  }, [particleMap])

  const { galaxyGeo, flowGeo, phases, galaxyBase } = useMemo(() => {
    const { positions, colors } = buildGalaxyStarData(spiralPts)
    const galaxyBase = new Float32Array(positions)
    const gGeo = new THREE.BufferGeometry()
    gGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    gGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const pb = new Float32Array(FLOW_STAR_COUNT * 3)
    const fGeo = new THREE.BufferGeometry()
    fGeo.setAttribute('position', new THREE.BufferAttribute(pb, 3))

    const ph = Float32Array.from({ length: FLOW_STAR_COUNT }, () =>
      Math.random(),
    )
    return { galaxyGeo: gGeo, flowGeo: fGeo, phases: ph, galaxyBase }
  }, [spiralPts])

  const nSeg = spiralPts.length - 1

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const grp = galaxyGroupRef.current
    const cam = state.camera
    const vc = viewportCursor
    const rect = state.gl.domElement.getBoundingClientRect()

    cam.position.x = Math.sin(t * 0.055) * 1.15
    cam.position.y = Math.cos(t * 0.042) * 0.82
    cam.position.z = CAM_Z + Math.sin(t * 0.032) * CAM_Z_WOBBLE
    cam.lookAt(0, 0, 0)

    if (grp) {
      grp.position.set(0, 0, 0)
      grp.rotation.z = t * 0.021
      grp.rotation.x = Math.sin(t * 0.016) * 0.06
      grp.rotation.y = Math.sin(t * 0.0095) * 0.04
      const s = 1 + Math.sin(t * 0.08) * 0.015
      grp.scale.setScalar(s)
      grp.updateMatrixWorld(true)
    }

    cam.updateMatrixWorld(true)

    const mxNdc =
      rect.width > 2 ? (vc.x - rect.left) / (rect.width * 0.5) - 1 : 0
    const myNdc =
      rect.height > 2 ? -((vc.y - rect.top) / (rect.height * 0.5) - 1) : 0
    const cursorOk = vc.active && rect.width > 2 && rect.height > 2

    const { world, proj, offset, final, right, up, outLocal } = repelScratch
    if (grp && cursorOk) {
      invWorldMat.copy(grp.matrixWorld).invert()
      right.setFromMatrixColumn(cam.matrixWorld, 0).normalize()
      up.setFromMatrixColumn(cam.matrixWorld, 1).normalize()
    }

    const applyPointRepel = (lx: number, ly: number, lz: number) => {
      if (!grp || !cursorOk) {
        outLocal.set(lx, ly, lz)
        return outLocal
      }
      world.set(lx, ly, lz).applyMatrix4(grp.matrixWorld)
      proj.copy(world).project(cam)
      if (Math.abs(proj.z) > 1) {
        outLocal.set(lx, ly, lz)
        return outLocal
      }
      const ddx = proj.x - mxNdc
      const ddy = proj.y - myNdc
      const dist = Math.hypot(ddx, ddy)
      const R = POINT_REPEL_NDC
      if (dist < 1e-6 || dist >= R) {
        outLocal.set(lx, ly, lz)
        return outLocal
      }
      const smooth = (1 - dist / R) ** 2
      const mag = smooth * POINT_REPEL_WORLD
      const ux = ddx / dist
      const uy = ddy / dist
      offset.copy(right).multiplyScalar(ux * mag)
      offset.addScaledVector(up, uy * mag)
      final.copy(world).add(offset)
      outLocal.copy(final).applyMatrix4(invWorldMat)
      return outLocal
    }

    const gAttr = galaxyGeo.getAttribute('position') as THREE.BufferAttribute
    const gArr = gAttr.array as Float32Array

    if (!cursorOk) {
      gArr.set(galaxyBase)
    } else {
      for (let i = 0; i < GALAXY_STAR_COUNT; i++) {
        const ix = i * 3
        const lx = galaxyBase[ix]!
        const ly = galaxyBase[ix + 1]!
        const lz = galaxyBase[ix + 2]!
        const o = applyPointRepel(lx, ly, lz)
        gArr[ix] = o.x
        gArr[ix + 1] = o.y
        gArr[ix + 2] = o.z
      }
    }
    gAttr.needsUpdate = true

    const attr = flowGeo.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const speedBase = 0.012
    for (let i = 0; i < FLOW_STAR_COUNT; i++) {
      const shift = phases[i] * 0.37 + i * 0.0021
      const u = (shift + t * speedBase * (0.62 + (i % 5) * 0.055)) % 1
      const idx = u * nSeg
      const i0 = Math.floor(idx)
      const i1 = Math.min(i0 + 1, nSeg)
      const f = idx - i0
      const p0 = spiralPts[i0]
      const p1 = spiralPts[i1]
      const lx = p0.x + (p1.x - p0.x) * f
      const ly = p0.y + (p1.y - p0.y) * f
      const lz = p0.z + (p1.z - p0.z) * f
      const j = i * 3
      if (!cursorOk) {
        arr[j] = lx
        arr[j + 1] = ly
        arr[j + 2] = lz
      } else {
        const o = applyPointRepel(lx, ly, lz)
        arr[j] = o.x
        arr[j + 1] = o.y
        arr[j + 2] = o.z
      }
    }
    attr.needsUpdate = true
  })

  return (
    <>
      <group ref={galaxyGroupRef}>
        <points geometry={galaxyGeo} frustumCulled={false}>
          <pointsMaterial
            map={particleMap}
            vertexColors
            size={0.11}
            sizeAttenuation
            transparent
            opacity={0.92}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>

        <points geometry={flowGeo} frustumCulled={false}>
          <pointsMaterial
            map={particleMap}
            color="#f0f6ff"
            size={0.2}
            sizeAttenuation
            transparent
            opacity={0.65}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </points>
      </group>

      <ambientLight intensity={0.06} />
      <pointLight position={[20, 28, 36]} intensity={0.42} color="#c4d4ff" />
    </>
  )
}

function PostFX() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.32}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.48}
      />
    </EffectComposer>
  )
}

export function HeroSpiralBackground() {
  const reduced = usePrefersReducedMotion()
  const spiralPts = useMemo(() => buildSpiralPoints(), [])

  if (reduced) {
    return (
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 85% 65% at 50% 15%, rgba(100, 140, 220, 0.2), transparent 55%), radial-gradient(ellipse 70% 50% at 50% 40%, rgba(40, 60, 120, 0.15), transparent 50%), #0a0514',
        }}
      />
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas
        className="h-full w-full"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        camera={{ fov: 72, position: [0, 0, CAM_Z], near: 0.1, far: 420 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <Suspense fallback={null}>
          <GalaxyScene spiralPts={spiralPts} />
          <PostFX />
        </Suspense>
      </Canvas>
    </div>
  )
}
