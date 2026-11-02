// Build plugin: tells the browser about the most important files in index.html itself, so they start
// downloading immediately instead of waiting for the JavaScript to discover them:
//  - the hero portrait (it is the largest visible element: the LCP), with the same srcset/sizes as the <img>
//  - the two fonts used on first paint (latin subsets only)
import { readFileSync } from 'node:fs'
import type { HtmlTagDescriptor, Plugin } from 'vite'

interface Manifest {
  profile?: { portrait?: { srcset: string } }
}

export function preloadCritical(): Plugin {
  return {
    name: 'preload-critical',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const tags: HtmlTagDescriptor[] = []

        try {
          const manifest = JSON.parse(readFileSync('src/data/assets.generated.json', 'utf8')) as Manifest
          const portrait = manifest.profile?.portrait
          if (portrait) {
            // Added by a tiny inline script, and only on the home page: on other pages the portrait is not
            // used, and the browser would warn about an unused preload.
            const link = {
              rel: 'preload',
              as: 'image',
              imagesrcset: portrait.srcset,
              // must match the sizes attribute of the hero <img>
              imagesizes: '(max-width: 860px) 62vw, 360px',
              fetchpriority: 'high',
            }
            tags.push({
              tag: 'script',
              children: `if(location.pathname==='/'){var l=document.createElement('link');var a=${JSON.stringify(link)};for(var k in a)l.setAttribute(k,a[k]);document.head.appendChild(l)}`,
              injectTo: 'head-prepend',
            })
          }
        } catch {
          /* no manifest yet: skip */
        }

        // Only in the production build, where the real (hashed) file names are known.
        if (ctx.bundle) {
          for (const name of Object.keys(ctx.bundle)) {
            if (/(alexandria-latin-wght-normal|instrument-serif-latin-400-italic).*\.woff2$/.test(name)) {
              tags.push({
                tag: 'link',
                attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: `/${name}` },
                injectTo: 'head-prepend',
              })
            }
          }
        }
        return { html, tags }
      },
    },
  }
}
