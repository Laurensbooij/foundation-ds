import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { basename, dirname, join } from 'node:path'

// Copies the woff2 files into dist/ and generates dist/fonts.css beside them
// (ADR-0004). Self-contained on purpose: a bare specifier in a CSS @import is
// not resolvable by a browser, so re-exporting @fontsource's own stylesheets
// would leave fonts.css working only inside a bundler.
//
// `font-family` is the name tokens.css uses (`--family-display: Outfit`), not
// @fontsource's "Outfit Variable" — the "Variable" suffix must not leak into
// the token layer.

const require = createRequire(import.meta.url)
const OUT_DIR = 'dist'
const FILES_DIR = join(OUT_DIR, 'fonts')

// IBM Plex Mono has no variable cut, so it ships the three static weights the
// type ramp actually uses. The other two are one file each for 100–900.
const FACES = [
	{
		family: 'Outfit',
		pkg: '@fontsource-variable/outfit',
		file: 'outfit-latin-wght-normal.woff2',
		weight: '100 900',
		style: 'normal',
		variable: true,
	},
	{
		family: 'Public Sans',
		pkg: '@fontsource-variable/public-sans',
		file: 'public-sans-latin-wght-normal.woff2',
		weight: '100 900',
		style: 'normal',
		variable: true,
	},
	{
		family: 'Public Sans',
		pkg: '@fontsource-variable/public-sans',
		file: 'public-sans-latin-wght-italic.woff2',
		weight: '100 900',
		style: 'italic',
		variable: true,
	},
	...[400, 500, 600].map((weight) => ({
		family: 'IBM Plex Mono',
		pkg: '@fontsource/ibm-plex-mono',
		file: `ibm-plex-mono-latin-${weight}-normal.woff2`,
		weight: String(weight),
		style: 'normal',
		variable: false,
	})),
]

// The latin subset only — the same range @fontsource declares for it.
const LATIN =
	'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'

const packageDir = (pkg) => dirname(require.resolve(`${pkg}/package.json`))

await mkdir(FILES_DIR, { recursive: true })

const blocks = []
for (const face of FACES) {
	const from = join(packageDir(face.pkg), 'files', face.file)
	await copyFile(from, join(FILES_DIR, basename(face.file)))

	// woff2-variations tells older engines the file carries axes; woff2 alone is
	// what every current engine reads. woff is deliberately not shipped.
	const format = face.variable ? "format('woff2-variations')" : "format('woff2')"
	blocks.push(
		[
			`/* ${face.file} */`,
			'@font-face {',
			`\tfont-family: '${face.family}';`,
			`\tfont-style: ${face.style};`,
			'\tfont-display: swap;',
			`\tfont-weight: ${face.weight};`,
			`\tsrc: url(./fonts/${basename(face.file)}) ${format};`,
			`\tunicode-range: ${LATIN};`,
			'}',
		].join('\n'),
	)
}

const header = [
	'/**',
	' * GENERATED FILE — do not edit by hand.',
	' * Built by scripts/build-fonts.mjs (`pnpm fonts`). See ADR-0004.',
	' *',
	' * Optional: import this only if you want Foundation to load its typefaces.',
	' * tokens.css names the families; this file loads them.',
	' */',
].join('\n')

await writeFile(join(OUT_DIR, 'fonts.css'), `${header}\n\n${blocks.join('\n\n')}\n`, 'utf8')

console.log(`fonts: ${FACES.length} faces -> ${FILES_DIR}/`)
