/**
 * Generate every shipped logo asset from `assets/images/logo.svg`.
 *
 * Run after changing the canonical vector:
 *
 *   node scripts/generate-logo-assets.mjs
 */
import { Resvg } from '@resvg/resvg-js'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = join(projectDir, 'assets', 'images')
const source = readFileSync(join(imagesDir, 'logo.svg'), 'utf8')

const LIGHT_BLUE = '#EAF4FF'
const NAVY = '#16345C'
const COBALT = '#2563EB'
const PAPER = '#F8FBFF'
const DARK_GROUND = '#090F16'
const DARK_BODY = '#B8D1FF'
const DARK_ACCENT = '#6E9EFF'

function setFill(svg, id, fill) {
	const pattern = new RegExp(`(<(?:rect|circle|path)[^>]*id="${id}"[^>]*fill=")[^"]+("[^>]*>)`)
	if (!pattern.test(svg)) throw new Error(`logo.svg is missing a fill for #${id}`)
	return svg.replace(pattern, `$1${fill}$2`)
}

function composeSvg({ background, scale, stem, page, accent }) {
	let svg = source
	if (background) svg = setFill(svg, 'ground', background)
	else svg = svg.replace(/\s*<rect id="ground"[^>]*\/>/, '')
	svg = setFill(svg, 'stem', stem)
	svg = setFill(svg, 'page', page)
	svg = setFill(svg, 'page-accent', accent)
	svg = setFill(svg, 'dot', accent)
	if (scale !== 1) {
		svg = svg
			.replace(
				'<g id="mark">',
				`<g transform="translate(512 512) scale(${scale}) translate(-512 -512)"><g id="mark">`,
			)
			.replace('</svg>', '</g></svg>')
	}
	return svg
}

function monochromeSvg(scale) {
	return `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<mask id="page-cutout">
				<rect width="1024" height="1024" fill="black"/>
				<rect x="380" y="380" width="264" height="460" rx="88" fill="white"/>
				<path fill="black" d="M644 430C644 473 618 500 566 535L517 568C492 585 480 606 480 636V679C480 712 495 736 527 757L644 834V430Z"/>
			</mask>
		</defs>
		<g transform="translate(512 512) scale(${scale}) translate(-512 -512)" fill="white">
			<circle cx="512" cy="260" r="84"/>
			<rect width="1024" height="1024" mask="url(#page-cutout)"/>
		</g>
	</svg>`
}

function render(svg, size) {
	return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng()
}

const variants = [
	{
		file: 'icon.png',
		size: 1024,
		svg: composeSvg({ background: LIGHT_BLUE, scale: 1, stem: NAVY, page: PAPER, accent: COBALT }),
	},
	{
		file: 'favicon.png',
		size: 64,
		svg: composeSvg({ background: LIGHT_BLUE, scale: 1, stem: NAVY, page: PAPER, accent: COBALT }),
	},
	{
		file: 'adaptive-icon.png',
		size: 1024,
		svg: composeSvg({ background: null, scale: 0.9, stem: NAVY, page: PAPER, accent: COBALT }),
	},
	{ file: 'monochrome-icon.png', size: 1024, svg: monochromeSvg(0.9) },
	{
		file: 'splash-icon.png',
		size: 1024,
		svg: composeSvg({ background: null, scale: 0.64, stem: NAVY, page: PAPER, accent: COBALT }),
	},
	{
		file: 'splash-icon-dark.png',
		size: 1024,
		svg: composeSvg({
			background: null,
			scale: 0.64,
			stem: DARK_BODY,
			page: DARK_GROUND,
			accent: DARK_ACCENT,
		}),
	},
]

const output = new Map()
for (const variant of variants) {
	const png = render(variant.svg, variant.size)
	output.set(variant.file, png)
	writeFileSync(join(imagesDir, variant.file), png)
	console.log(`wrote assets/images/${variant.file} (${variant.size}px)`)
}

// The public support/privacy site is built separately from Expo web.
const publicSiteAssets = join(projectDir, 'docs', 'assets')
mkdirSync(publicSiteAssets, { recursive: true })
for (const file of ['icon.png', 'favicon.png']) {
	writeFileSync(join(publicSiteAssets, file), output.get(file))
}

// Keep generated native projects visually current for local simulator builds.
// These directories are ignored because Expo can recreate them at any time.
const nativeProjects = [
	join(projectDir, 'ios', 'Immifile'),
	join(projectDir, 'apps', 'mobile', 'ios', 'expoimmigrationapp'),
]

for (const nativeProject of nativeProjects) {
	const catalog = join(nativeProject, 'Images.xcassets')
	if (!existsSync(catalog)) continue

	const appIcon = join(catalog, 'AppIcon.appiconset', 'App-Icon-1024x1024@1x.png')
	if (existsSync(dirname(appIcon))) writeFileSync(appIcon, output.get('icon.png'))

	for (const [file, size] of [
		['image.png', 100],
		['image@2x.png', 200],
		['image@3x.png', 300],
	]) {
		const destination = join(catalog, 'SplashScreenLogo.imageset', file)
		if (existsSync(dirname(destination))) writeFileSync(destination, render(variants[4].svg, size))
	}

	for (const [file, size] of [
		['dark_image.png', 100],
		['dark_image@2x.png', 200],
		['dark_image@3x.png', 300],
	]) {
		const destination = join(catalog, 'SplashScreenLogo.imageset', file)
		if (existsSync(destination)) writeFileSync(destination, render(variants[5].svg, size))
	}

	const splashGround = join(catalog, 'SplashScreenBackground.colorset', 'Contents.json')
	if (existsSync(splashGround)) {
		writeFileSync(
			splashGround,
			`${JSON.stringify(
				{
					colors: [
						{
							color: {
								components: {
									alpha: '1.000',
									blue: '1.000000',
									green: '0.956863',
									red: '0.917647',
								},
								'color-space': 'srgb',
							},
							idiom: 'universal',
						},
						{
							color: {
								components: {
									alpha: '1.000',
									blue: '0.086275',
									green: '0.058824',
									red: '0.035294',
								},
								'color-space': 'srgb',
							},
							idiom: 'universal',
							appearances: [{ appearance: 'luminosity', value: 'dark' }],
						},
					],
					info: { version: 1, author: 'expo' },
				},
				null,
				2,
			)}\n`,
		)
	}

	console.log(`synced ${catalog}`)
}
