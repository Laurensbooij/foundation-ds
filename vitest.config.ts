import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		// Phase 3 brings the specs; until then CI must not fail on an empty suite.
		passWithNoTests: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		css: true,
		include: ['src/**/*.spec.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/**/*.spec.*', 'src/**/*.stories.*', 'src/testing/**', 'src/**/index.ts'],
		},
	},
})
