import manifest from '../data/assets.generated.json'

export interface ImageAsset {
  width: number
  height: number
  src: string
  srcset: string
}

type Manifest = Record<string, Record<string, ImageAsset>>
const assets = manifest as Manifest

/** Returns an optimized image from raw-assets/<folder>/<name>.*, or undefined if it was not added yet. */
export const getImage = (folder: string, name: string): ImageAsset | undefined => assets[folder]?.[name]

/** All images in a folder except the cover, in file-name order (used as the project gallery). */
export const getGallery = (folder: string): ImageAsset[] =>
  Object.entries(assets[folder] ?? {})
    .filter(([name]) => name !== 'cover')
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, img]) => img)
