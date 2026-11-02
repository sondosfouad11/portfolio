// Optimizes everything in raw-assets/<slug>/ into public/projects/<slug>/ (WebP, several widths)
// and writes src/data/assets.generated.json so the data files can look images up by slug + name.
// Usage: npm run assets
import { readdir, mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const RAW = 'raw-assets'
const OUT = 'public/projects'
const MANIFEST = 'src/data/assets.generated.json'
const WIDTHS = [360, 640, 960, 1440]
const IMAGE = /\.(png|jpe?g|webp|avif)$/i

const manifest = {}

if (existsSync(RAW)) {
  for (const entry of await readdir(RAW, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    const files = (await readdir(path.join(RAW, slug))).filter((f) => IMAGE.test(f))
    if (!files.length) continue
    await mkdir(path.join(OUT, slug), { recursive: true })
    manifest[slug] = {}

    // Portraits ship as jpg + webp pairs of the same picture: keep one entry per base name.
    const seen = new Set()
    for (const file of files) {
      const name = path.parse(file).name
      if (seen.has(name)) continue
      seen.add(name)

      const input = sharp(path.join(RAW, slug, file))
      const { width, height } = await input.metadata()
      const sizes = [...new Set(WIDTHS.filter((w) => w < width).concat(width))].sort((a, b) => a - b)
      const variants = []
      for (const w of sizes) {
        const outFile = `${name}-${w}.webp`
        await sharp(path.join(RAW, slug, file))
          .resize({ width: w })
          .webp({ quality: 76, effort: 5 })
          .toFile(path.join(OUT, slug, outFile))
        variants.push({ w, url: `/projects/${slug}/${outFile}` })
      }
      manifest[slug][name] = {
        width,
        height,
        src: variants.at(-1).url,
        srcset: variants.map((v) => `${v.url} ${v.w}w`).join(', '),
      }
      console.log(`${slug}/${file} -> ${variants.length} sizes`)
    }
  }
}

await mkdir(path.dirname(MANIFEST), { recursive: true })
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2))
console.log(`Manifest written: ${MANIFEST}`)
