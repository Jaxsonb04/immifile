/**
 * Generates every shipped logo PNG from the canonical vector source
 * `assets/images/logo.svg` (M6-T2). Run after any change to the mark:
 *
 *   node scripts/generate-logo-assets.mjs
 *
 * Requires the dev dependency `@resvg/resvg-js`. Each variant reuses the same
 * stem path and dot geometry, scaled about the mark's optical center
 * (514, 511) — the scales and colors below were measured from the original
 * hand-exported PNGs so the regenerated assets are drop-in replacements.
 */
import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const imagesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'images')
const source = readFileSync(join(imagesDir, 'logo.svg'), 'utf8')

const stemMatch = source.match(/<path[^>]*id="stem"[^>]*d="([^"]+)"/s)
const stemTransform = source.match(/<path[^>]*id="stem"[^>]*transform="([^"]+)"/s)
const dotMatch = source.match(/<circle[^>]*id="dot"[^>]*cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/s)
if (!stemMatch || !stemTransform || !dotMatch) {
	throw new Error('logo.svg no longer matches the expected ids/attributes (stem, dot)')
}
const [, stemPath] = stemMatch
const [, transform] = stemTransform
const [, cx, cy, r] = dotMatch

const PAPER = '#F3F7F9'
const STEM_LIGHT = '#1E4CA6' // light accent token
const STEM_DARK = '#80A7F0' // dark accent token
const INK_LIGHT = '#141D2B' // oklch(23% 0.03 258) — light --foreground
const INK_DARK = '#E2E7EB' // oklch(92.5% 0.008 250) — dark --foreground

function markSvg({ background, scale, stem, dot }) {
	const ground = background ? `<rect width="1024" height="1024" fill="${background}"/>` : ''
	return `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">${ground}<g transform="translate(514 511) scale(${scale}) translate(-514 -511)"><path fill="${stem}" transform="${transform}" d="${stemPath}"/><circle fill="${dot}" cx="${cx}" cy="${cy}" r="${r}"/></g></svg>`
}

const VARIANTS = [
	// App icon: full-size mark on the paper ground.
	{ file: 'icon.png', size: 1024, svg: { background: PAPER, scale: 1, stem: STEM_LIGHT, dot: INK_LIGHT } },
	// Web favicon: the same composition, tiny.
	{ file: 'favicon.png', size: 48, svg: { background: PAPER, scale: 1, stem: STEM_LIGHT, dot: INK_LIGHT } },
	// Android adaptive foreground: transparent, mark pulled in for the safe zone.
	{ file: 'adaptive-icon.png', size: 1024, svg: { background: null, scale: 0.713, stem: STEM_LIGHT, dot: INK_LIGHT } },
	// Splash marks: transparent, smaller still; the dark variant flips to the
	// dark theme's accent + foreground so the mark reads on the dark ground.
	{ file: 'splash-icon.png', size: 1024, svg: { background: null, scale: 0.629, stem: STEM_LIGHT, dot: INK_LIGHT } },
	{ file: 'splash-icon-dark.png', size: 1024, svg: { background: null, scale: 0.629, stem: STEM_DARK, dot: INK_DARK } },
]

for (const { file, size, svg } of VARIANTS) {
	const rendered = new Resvg(markSvg(svg), { fitTo: { mode: 'width', value: size } }).render()
	writeFileSync(join(imagesDir, file), rendered.asPng())
	console.log(`wrote ${file} (${size}px)`)
}
