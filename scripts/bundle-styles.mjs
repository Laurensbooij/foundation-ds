import { copyFile, readFile, readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

// Two jobs, both after `vite build`:
//
// 1. Copy the generated tokens.css into dist/. It is global :root custom
//    properties — never shakeable, always an explicit consumer import
//    (ADR-0003).
// 2. Concatenate every per-component stylesheet into dist/styles.css, the
//    escape hatch for consumers whose bundler will not follow CSS imports out
//    of node_modules (ADR-0002). tokens.css and fonts.css stay out of it: they
//    are separately importable and opt-in respectively.

const OUT_DIR = 'dist'

const collectCss = async (dir) => {
	const found = []
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name)
		if (entry.isDirectory()) {
			if (entry.name === 'fonts') continue
			found.push(...(await collectCss(path)))
		} else if (entry.name.endsWith('.css')) {
			found.push(path)
		}
	}
	return found
}

await copyFile(join('src', 'styles', 'tokens.css'), join(OUT_DIR, 'tokens.css'))

const skip = new Set(['tokens.css', 'fonts.css', 'styles.css'].map((n) => join(OUT_DIR, n)))
// Sorted so the bundle is byte-stable across builds; CSS Modules hashes every
// class per module, so no two component sheets can collide and order is free.
const sheets = (await collectCss(OUT_DIR)).filter((p) => !skip.has(p)).sort()

const parts = await Promise.all(
	sheets.map(async (path) => {
		const css = await readFile(path, 'utf8')
		return `/* ${relative(OUT_DIR, path)} */\n${css.trim()}`
	}),
)

const header = [
	'/**',
	' * GENERATED FILE — do not edit by hand.',
	' * Built by scripts/bundle-styles.mjs. See ADR-0002.',
	' *',
	' * Every component stylesheet, concatenated. Import this only when your',
	' * bundler cannot follow CSS imports out of node_modules — otherwise import',
	' * components normally and ship just the CSS you use.',
	' */',
].join('\n')

await writeFile(join(OUT_DIR, 'styles.css'), `${header}\n\n${parts.join('\n\n')}\n`, 'utf8')

console.log(`styles: ${sheets.length} sheets -> ${OUT_DIR}/styles.css`)
