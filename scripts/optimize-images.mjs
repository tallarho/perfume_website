import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'src')
const PUBLIC_DIR = path.join(ROOT, 'public')
const MAX_BYTES = 500 * 1024
const START_QUALITY = 82
const MIN_QUALITY = 42
const QUALITY_STEP = 6
const MAX_WIDTH = 1600

async function readAllFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await readAllFiles(full)))
    else out.push(full)
  }
  return out
}

function isCodeFile(file) {
  return /\.(tsx|ts|jsx|js|css)$/i.test(file)
}

function collectImageRefs(content) {
  const re = /\/[A-Za-z0-9 _\-./']+\.(png|jpg|jpeg)/gi
  const set = new Set()
  let m
  while ((m = re.exec(content))) set.add(m[0])
  return [...set]
}

async function ensureWebpFor(absInputPath) {
  const outputPath = absInputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  let quality = START_QUALITY
  let best = null

  while (quality >= MIN_QUALITY) {
    let pipeline = sharp(absInputPath, { animated: false }).rotate()
    const meta = await pipeline.metadata()
    if ((meta.width ?? 0) > MAX_WIDTH) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    }
    const buf = await pipeline.webp({ quality, effort: 4 }).toBuffer()
    best = buf
    if (buf.byteLength <= MAX_BYTES) break
    quality -= QUALITY_STEP
  }

  if (!best) throw new Error(`Failed to encode: ${absInputPath}`)
  await fs.writeFile(outputPath, best)
  return outputPath
}

async function main() {
  const files = (await readAllFiles(SRC_DIR)).filter(isCodeFile)
  const updates = []
  const refs = new Set()

  for (const file of files) {
    const original = await fs.readFile(file, 'utf8')
    const localRefs = collectImageRefs(original)
    for (const r of localRefs) refs.add(r)
  }

  for (const relRef of refs) {
    const inputAbs = path.join(PUBLIC_DIR, relRef.slice(1))
    try {
      await fs.access(inputAbs)
    } catch {
      continue
    }
    await ensureWebpFor(inputAbs)
  }

  for (const file of files) {
    const original = await fs.readFile(file, 'utf8')
    const replaced = original.replace(/\.(png|jpg|jpeg)(?=['")\s])/gi, '.webp')
    if (replaced !== original) {
      updates.push(file)
      await fs.writeFile(file, replaced, 'utf8')
    }
  }

  console.log(`Optimized refs: ${refs.size}`)
  console.log(`Updated source files: ${updates.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

