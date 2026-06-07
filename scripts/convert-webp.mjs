/**
 * PNG → WebP batch conversion script
 * Converts all PNG assets in src/assets to WebP equivalents.
 * Original PNGs are kept as fallback.
 *
 * Usage: node scripts/convert-webp.mjs
 */

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ASSETS_DIR = join(ROOT, 'src', 'assets')

// Quality settings: higher-res hero images get slightly lower quality for bigger savings
const HIGH_RES_QUALITY = 82
const ELEMENT_QUALITY = 88

let converted = 0
let skipped = 0
let totalSavedKB = 0

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      // skip backup directory — no need to convert originals
      if (entry.name.includes('1x-backup')) continue
      await walk(fullPath)
    } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.png') {
      await convertFile(fullPath)
    }
  }
}

async function convertFile(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp')

  // Skip if WebP already exists and is newer than PNG
  try {
    const [pngStat, webpStat] = await Promise.all([stat(pngPath), stat(webpPath)])
    if (webpStat.mtimeMs >= pngStat.mtimeMs) {
      skipped++
      return
    }
  } catch {
    // WebP doesn't exist yet — proceed
  }

  const isHighRes = pngPath.includes('high-res') || pngPath.includes('canopy-overlays')
  const quality = isHighRes ? HIGH_RES_QUALITY : ELEMENT_QUALITY

  try {
    const [pngStat] = await Promise.all([stat(pngPath)])
    await sharp(pngPath)
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(webpPath)
    const webpStat = await stat(webpPath)

    const savedKB = (pngStat.size - webpStat.size) / 1024
    totalSavedKB += savedKB
    converted++

    const pngKB = (pngStat.size / 1024).toFixed(0)
    const webpKB = (webpStat.size / 1024).toFixed(0)
    const savings = ((savedKB / (pngStat.size / 1024)) * 100).toFixed(0)
    console.log(`  ✓ ${basename(pngPath).padEnd(40)} ${pngKB}KB → ${webpKB}KB  (${savings}% saved)`)
  } catch (err) {
    console.error(`  ✗ ${pngPath}: ${err.message}`)
  }
}

console.log('🔄 Converting PNG → WebP...\n')
await walk(ASSETS_DIR)
console.log(`\n✅ Done: ${converted} converted, ${skipped} up-to-date`)
console.log(`💾 Total saved: ${(totalSavedKB / 1024).toFixed(1)} MB`)
