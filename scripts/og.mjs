// Generates public/og-image.png (1200x630) for link previews. Run once: node scripts/og.mjs
import sharp from 'sharp'

const portrait = await sharp('raw-assets/profile/portrait.jpg')
  .resize(330, 412, { fit: 'cover', position: 'top' })
  .toBuffer()
const arch = Buffer.from(
  '<svg width="330" height="412"><path d="M0 412V165C0 74 74 0 165 0s165 74 165 165v247z" fill="#fff"/></svg>',
)
const maskedPortrait = await sharp(portrait).composite([{ input: arch, blend: 'dest-in' }]).png().toBuffer()

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="a" cx="15%" cy="10%" r="60%"><stop offset="0" stop-color="#b60f17" stop-opacity=".35"/><stop offset="1" stop-color="#b60f17" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="95%" cy="100%" r="55%"><stop offset="0" stop-color="#e8c9a0" stop-opacity=".3"/><stop offset="1" stop-color="#e8c9a0" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#080808"/>
  <rect width="1200" height="630" fill="url(#a)"/><rect width="1200" height="630" fill="url(#b)"/>
  <text x="80" y="120" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="6" fill="#9a9799">SONDOS LASHEEN</text>
  <text x="80" y="285" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="92" fill="#e6e4e7">I BUILD &amp;</text>
  <text x="80" y="385" font-family="Georgia, serif" font-style="italic" font-size="104" fill="#b60f17">design</text>
  <text x="80" y="480" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="54" fill="#e6e4e7">DIGITAL EXPERIENCES</text>
  <text x="80" y="550" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#9a9799">Full-Stack (React &amp; Laravel) · UI/UX · Brand design</text>
  <circle cx="1130" cy="70" r="12" fill="#e8c9a0"/>
</svg>`

await sharp(Buffer.from(svg))
  .composite([{ input: maskedPortrait, left: 800, top: 110 }])
  .png()
  .toFile('public/og-image.png')
console.log('og-image.png written')
