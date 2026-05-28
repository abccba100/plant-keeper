// Upscale every per-element decor PNG under src/assets/calendar-decor/elements/
// by SCALE using Lanczos resampling + a gentle sharpen pass.
//
// The CalendarExperience CSS already declares each element's aspect-ratio,
// so increasing the raw PNG resolution does not require any code changes.
// We simply give the browser more pixels to work with on high-DPI displays.
//
// Run with: node scripts/upscale-decor.mjs

import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const elementsRoot = path.join(root, 'src/assets/calendar-decor/elements')
const backupRoot = path.join(root, 'src/assets/calendar-decor/elements-1x-backup')

const SCALE = 3

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else if (entry.isFile() && full.toLowerCase().endsWith('.png')) {
      files.push(full)
    }
  }
  return files
}

async function pathExists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  const files = await walk(elementsRoot)
  console.log(`found ${files.length} PNG element(s) under ${elementsRoot}`)

  let processed = 0
  let totalInBytes = 0
  let totalOutBytes = 0
  for (const file of files) {
    const relative = path.relative(elementsRoot, file)
    const backupPath = path.join(backupRoot, relative)
    await mkdir(path.dirname(backupPath), { recursive: true })

    // First run only: copy the original to the 1x backup folder so we can
    // roll back or re-run with a different scale later. Skip if a backup
    // already exists from a previous run.
    if (!(await pathExists(backupPath))) {
      const original = await sharp(file).png().toBuffer()
      await sharp(original).png().toFile(backupPath)
    }

    const meta = await sharp(backupPath).metadata()
    const targetW = meta.width * SCALE
    const targetH = meta.height * SCALE

    const inStat = await stat(backupPath)
    totalInBytes += inStat.size

    await sharp(backupPath)
      .resize({ width: targetW, height: targetH, kernel: 'lanczos3', fit: 'fill' })
      .sharpen({ sigma: 0.55, m1: 0.35, m2: 1.6 })
      .png({ compressionLevel: 9 })
      .toFile(file)

    const outStat = await stat(file)
    totalOutBytes += outStat.size
    processed += 1
    console.log(
      `[${processed}/${files.length}] ${relative}: ${meta.width}x${meta.height} -> ${targetW}x${targetH} (${(inStat.size / 1024).toFixed(1)}KB -> ${(outStat.size / 1024).toFixed(1)}KB)`,
    )
  }

  console.log(
    `\nDone. ${processed} files. Total size ${(totalInBytes / 1024).toFixed(1)}KB -> ${(totalOutBytes / 1024).toFixed(1)}KB`,
  )
  console.log(`1x backup of originals saved to: ${path.relative(root, backupRoot)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
