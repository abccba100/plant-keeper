// One-shot helper to slice the decor sprite sheets in src/assets/calendar-decor
// into individual element PNGs in src/assets/calendar-decor/elements/<season>/.
//
// Run with: node scripts/crop-decor.mjs

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'src/assets/calendar-decor')
const outDir = path.join(srcDir, 'elements')

const seasons = ['spring', 'summer', 'autumn', 'winter']
const kinds = ['branch', 'decor']

// 2D connected-component labeller for alpha > threshold pixels.
function findClusters({ data, width, height, alphaThreshold = 24, padding = 2, minPixels = 60 }) {
  const labels = new Int32Array(width * height)
  const clusters = []
  let nextLabel = 0
  const stack = []

  const idx = (x, y) => y * width + x
  const alphaAt = (x, y) => data[idx(x, y) * 4 + 3]

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const flatIndex = idx(x, y)
      if (labels[flatIndex] !== 0) continue
      if (alphaAt(x, y) < alphaThreshold) continue

      nextLabel += 1
      labels[flatIndex] = nextLabel
      let minX = x
      let maxX = x
      let minY = y
      let maxY = y
      let count = 0

      stack.length = 0
      stack.push(flatIndex)

      while (stack.length > 0) {
        const current = stack.pop()
        const cy = (current / width) | 0
        const cx = current - cy * width
        count += 1
        if (cx < minX) minX = cx
        if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy
        if (cy > maxY) maxY = cy

        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue
            const nx = cx + dx
            const ny = cy + dy
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
            const ni = ny * width + nx
            if (labels[ni] !== 0) continue
            if (alphaAt(nx, ny) < alphaThreshold) continue
            labels[ni] = nextLabel
            stack.push(ni)
          }
        }
      }

      if (count >= minPixels) {
        clusters.push({
          label: nextLabel,
          minX,
          minY,
          maxX,
          maxY,
          count,
        })
      }
    }
  }

  // Group clusters into horizontal rows based on vertical centroid, then merge clusters
  // that are very close within the SAME row (e.g. a flower + its loose petal).
  // This avoids accidentally fusing top-row and bottom-row elements that share an X column.
  const withCentroid = clusters.map((cluster) => ({
    ...cluster,
    cx: (cluster.minX + cluster.maxX) / 2,
    cy: (cluster.minY + cluster.maxY) / 2,
  }))

  withCentroid.sort((a, b) => a.cy - b.cy)
  const rows = []
  const rowGap = Math.max(18, height * 0.16)
  for (const cluster of withCentroid) {
    const row = rows.find((entry) => Math.abs(entry.cy - cluster.cy) <= rowGap)
    if (row) {
      row.items.push(cluster)
      row.cy = (row.cy * (row.items.length - 1) + cluster.cy) / row.items.length
    } else {
      rows.push({ cy: cluster.cy, items: [cluster] })
    }
  }

  // Within each row, only merge a small cluster INTO its larger neighbour if it is essentially
  // dwarfed by it (eg. a loose petal floating beside a flower). This protects against fusing two
  // large elements (like two side-by-side branches) that happen to touch in the source sheet.
  const merged = []
  for (const row of rows.sort((a, b) => a.cy - b.cy)) {
    const sortedItems = row.items.sort((a, b) => a.minX - b.minX)
    const localMerged = []
    for (const cluster of sortedItems) {
      const last = localMerged[localMerged.length - 1]
      if (last) {
        const gap = cluster.minX - last.maxX
        const smallerArea = Math.min(last.count, cluster.count)
        const largerArea = Math.max(last.count, cluster.count)
        if (gap <= 2 && smallerArea * 5 <= largerArea) {
          last.minX = Math.min(last.minX, cluster.minX)
          last.maxX = Math.max(last.maxX, cluster.maxX)
          last.minY = Math.min(last.minY, cluster.minY)
          last.maxY = Math.max(last.maxY, cluster.maxY)
          last.count += cluster.count
          continue
        }
      }
      localMerged.push({ ...cluster })
    }
    merged.push(...localMerged)
  }

  return merged
    .map((cluster) => ({
      x: Math.max(0, cluster.minX - padding),
      y: Math.max(0, cluster.minY - padding),
      w: Math.min(width, cluster.maxX + padding + 1) - Math.max(0, cluster.minX - padding),
      h: Math.min(height, cluster.maxY + padding + 1) - Math.max(0, cluster.minY - padding),
    }))
    .sort((a, b) => {
      const bandA = a.y < height * 0.45 ? 0 : 1
      const bandB = b.y < height * 0.45 ? 0 : 1
      if (bandA !== bandB) return bandA - bandB
      return a.x - b.x
    })
}

async function cropSheet(season, kind) {
  const inputPath = path.join(srcDir, `${season}-${kind}.png`)
  const buffer = await readFile(inputPath)
  const image = sharp(buffer).ensureAlpha()
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
  const clusters = findClusters({
    data,
    width: info.width,
    height: info.height,
    alphaThreshold: 18,
    padding: 3,
    minPixels: kind === 'branch' ? 240 : 90,
  })

  const seasonDir = path.join(outDir, season)
  await mkdir(seasonDir, { recursive: true })

  const written = []
  for (let i = 0; i < clusters.length; i += 1) {
    const region = clusters[i]
    const name = `${kind}-${String(i + 1).padStart(2, '0')}.png`
    const outPath = path.join(seasonDir, name)
    await sharp(inputPath)
      .extract({ left: region.x, top: region.y, width: region.w, height: region.h })
      .png()
      .toFile(outPath)
    written.push({ name, ...region })
  }

  return { season, kind, count: written.length, written }
}

async function main() {
  await mkdir(outDir, { recursive: true })
  const summary = []
  for (const season of seasons) {
    for (const kind of kinds) {
      const result = await cropSheet(season, kind)
      summary.push(result)
      console.log(`[${result.season}/${result.kind}] ${result.count} elements`)
      for (const item of result.written) {
        console.log(`  ${item.name}: ${item.w}x${item.h} @ (${item.x},${item.y})`)
      }
    }
  }
  const manifestPath = path.join(outDir, 'manifest.json')
  await writeFile(manifestPath, JSON.stringify(summary, null, 2))
  console.log(`Wrote manifest to ${manifestPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
