import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
  useTexture,
} from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const MODEL_URL = '/models/you.glb'
const MARBLE_TEXTURE_URL = '/textures/pedestal-marble.png'

const PEDESTAL_GROUP_Y = -0.31
const PEDESTAL_STONE_H = 0.062
const PEDESTAL_GLASS_H = 0.014
/** Верх плоскости стеклянного диска (локально в группе подставки) */
const PEDESTAL_GLASS_TOP_LOCAL =
  PEDESTAL_STONE_H + PEDESTAL_GLASS_H - 0.001
/** Мировая Y, куда опирается модель */
const PEDESTAL_SURFACE_Y = PEDESTAL_GROUP_Y + PEDESTAL_GLASS_TOP_LOCAL

/** Имена/фрагменты имён типичных задников в GLB (Blender/Sketchfab и т.п.) */
const BACKDROP_NAME_RE =
  /background|backdrop|back_?plate|backplate|bg\b|wall\b|studio|stage|подложка|задник|rim|cyclorama|photo_?mat|env_?bg|ground\b|floor\b|plane\b|card\b|picture\b|image_?plane|skybox|skydome|dome\b|curtain|gradient|panel\b|screen\b|room\b|set\b|зал\b/i

const _box = new THREE.Box3()
const _size = new THREE.Vector3()
const _pos = new THREE.Vector3()

/** Тонкие большие «листы» позади сцены — часто фото/студийный фон в GLB */
function hideBackdropSheets(root: THREE.Object3D) {
  root.updateMatrixWorld(true)
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh) || !obj.visible) return
    _box.setFromObject(obj)
    if (_box.isEmpty()) return
    _box.getSize(_size)
    const d = [_size.x, _size.y, _size.z].sort((a, b) => a - b)
    const minE = d[0]
    const midE = d[1]
    const maxE = d[2]
    const thinPlate =
      minE < 0.08 && maxE > 0.85 && maxE / Math.max(midE, 1e-4) > 1.55
    obj.getWorldPosition(_pos)
    const behind = _pos.z < -0.06
    if (thinPlate && behind) obj.visible = false
  })
}

function clearSceneBackdrop(scene: THREE.Object3D) {
  if (scene instanceof THREE.Scene) {
    scene.background = null
    scene.environment = null
    scene.fog = null
  }
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Sprite) {
      const n = (obj.name || '').trim()
      if (n && BACKDROP_NAME_RE.test(n)) {
        obj.visible = false
      }
    }
  })
  hideBackdropSheets(scene)
}

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

/** Плита с вашей текстурой мрамора + стекло + кольца */
function ModelPedestal() {
  const stoneRB = 0.24
  const stoneRT = 0.195
  const glassR = 0.215

  const marbleMap = useTexture(MARBLE_TEXTURE_URL, (tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(1.85, 1.2)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.needsUpdate = true
  })

  return (
    <group position={[0, PEDESTAL_GROUP_Y, 0]}>
      <mesh position={[0, PEDESTAL_STONE_H / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[stoneRT, stoneRB, PEDESTAL_STONE_H, 48]} />
        <meshStandardMaterial
          map={marbleMap}
          bumpMap={marbleMap}
          bumpScale={0.048}
          color="#ffffff"
          roughness={0.86}
          metalness={0.035}
          envMapIntensity={0.85}
        />
      </mesh>

      <mesh
        position={[0, PEDESTAL_STONE_H + PEDESTAL_GLASS_H / 2 - 0.001, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[glassR, glassR, PEDESTAL_GLASS_H, 56]} />
        <meshPhysicalMaterial
          color="#faf8ff"
          transparent
          opacity={0.92}
          transmission={0.72}
          thickness={0.42}
          roughness={0.08}
          metalness={0}
          ior={1.52}
          attenuationDistance={0.55}
          attenuationColor="#1c1814"
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, PEDESTAL_STONE_H + PEDESTAL_GLASS_H - 0.005, 0]}
      >
        <torusGeometry args={[glassR * 0.93, 0.009, 10, 80]} />
        <meshStandardMaterial
          color="#0d0a08"
          emissive="#d4b56a"
          emissiveIntensity={0.5}
          roughness={0.55}
          metalness={0}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, PEDESTAL_STONE_H + PEDESTAL_GLASS_H - 0.003, 0]}
      >
        <torusGeometry args={[glassR * 0.82, 0.005, 8, 56]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#f2e6c8"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

function HeroGltfModel() {
  const { scene } = useGLTF(MODEL_URL)
  const wrapRef = useRef<THREE.Group>(null)
  const scaledRef = useRef<THREE.Group>(null)

  const root = useMemo(() => {
    const g = scene.clone(true)
    clearSceneBackdrop(g)
    return g
  }, [scene])

  useEffect(() => {
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh || !mesh.visible) return
      const mat = mesh.material
      const mats = Array.isArray(mat) ? mat : [mat]
      for (const m of mats) {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.envMapIntensity = 1.05
        }
      }
    })
  }, [root])

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const scaled = scaledRef.current
    if (!wrap || !scaled) return

    wrap.position.set(0, 0, 0)
    wrap.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(scaled)
    if (box.isEmpty()) return

    const minY = box.min.y
    const cx = (box.min.x + box.max.x) / 2
    const cz = (box.min.z + box.max.z) / 2
    wrap.position.set(-cx, PEDESTAL_SURFACE_Y - minY, -cz)
  }, [root])

  return (
    <group ref={wrapRef}>
      <group ref={scaledRef} scale={2.05}>
        <primitive object={root} />
      </group>
    </group>
  )
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight position={[4.5, 6, 5]} intensity={1.35} color="#fff8f0" />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#c4a06a" />
      <pointLight position={[0, 2.5, 2]} intensity={0.55} color="#ffe8cc" distance={8} />
      <pointLight
        position={[0.8, 0.35, 1.2]}
        intensity={0.35}
        color="#e8d4a8"
        distance={3.5}
      />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.32} />
        <ModelPedestal />
      </Suspense>
      <Suspense fallback={null}>
        <HeroGltfModel />
      </Suspense>
      <ContactShadows
        position={[0, -0.41, 0]}
        opacity={0.38}
        scale={12}
        blur={2.2}
        far={3.2}
        color="#000000"
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.55}
        maxPolarAngle={Math.PI / 2 + 0.15}
        minDistance={1.32}
        maxDistance={1.32}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.35}
      />
    </>
  )
}

export function HeroPerfumeCanvas() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="relative h-[min(58vh,520px)] w-full min-h-[280px] md:h-[min(62vh,580px)] lg:h-[min(68vh,620px)] lg:min-h-[360px]">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0.72, 0.28, 1.05], fov: 28, near: 0.08, far: 80 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0)
          scene.background = null
        }}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
useTexture.preload(MARBLE_TEXTURE_URL)
