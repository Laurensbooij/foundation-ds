import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// The build that makes ADR-0002 true. Two pieces do the work:
//
// - `preserveModules` keeps one output file per source file, so a consumer's
//   bundler can reach Button without reaching Switch.
// - `libInjectCss` puts the `import './Button.css'` back into each chunk. Vite
//   strips those in library mode; without it the CSS ships as an orphan file
//   nobody imports, and every component renders unstyled.
// Vite 8's Rolldown preserves the 'use client' directive on its own, so no
// directive plugin is needed — adding one emits the banner twice.
//
// `cssCodeSplit` must stay true: library mode defaults it to false, which
// concatenates every stylesheet into one and takes CSS tree-shaking with it.
const { dependencies = {}, peerDependencies = {} } = createRequire(import.meta.url)(
	'./package.json',
) as { dependencies?: Record<string, string>; peerDependencies?: Record<string, string> }

// Anything the package declares, it must not also bundle. Derived from
// package.json rather than hand-listed: a dependency added later would
// otherwise be silently inlined, shipping a second frozen copy alongside the
// one the consumer installs.
const bundledDependencies = [...Object.keys(dependencies), ...Object.keys(peerDependencies)]

const isDeclaredDependency = (id: string) =>
	bundledDependencies.some((name) => id === name || id.startsWith(`${name}/`))

export default defineConfig({
	plugins: [
		react(),
		libInjectCss(),
		dts({
			include: ['src'],
			entryRoot: 'src',
			exclude: ['**/*.spec.*', '**/*.stories.*', 'src/testing/**'],
			tsconfigPath: './tsconfig.lib.json',
		}),
	],
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es'],
		},
		cssCodeSplit: true,
		sourcemap: true,
		rollupOptions: {
			// Never bundle a declared dependency. Two copies of React in one app
			// breaks hooks outright; a second copy of anything else is dead weight
			// the consumer downloads twice and can never dedupe.
			external: isDeclaredDependency,
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				entryFileNames: '[name].js',
				// Keeps each stylesheet beside the module that imports it, and drops
				// the `.module` infix: a consumer's bundler treats a published
				// `*.module.css` as a CSS Module to re-hash, not as a plain sheet to
				// include, and silently ships the component unstyled.
				assetFileNames: (asset) => {
					const source = asset.names?.[0] ?? asset.name ?? '[name][extname]'
					return source.replace(/\.module\.css$/, '.css')
				},
			},
		},
	},
	css: {
		modules: {
			// Prefixed so a class is traceable to Foundation in devtools, hashed so
			// two components can never collide on a name like `.primary`.
			generateScopedName: 'fds-[name]__[local]___[hash:base64:5]',
		},
	},
})
