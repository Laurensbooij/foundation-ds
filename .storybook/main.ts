import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(ts|tsx)'],
	addons: [
		'@storybook/addon-docs',
		// Runs axe in a real browser, so it covers the colour-contrast rule that
		// cannot run in jsdom (ADR-0007).
		'@storybook/addon-a11y',
		// Renders hover/pressed/focus without interaction, which is how the
		// variant grids mirror the Figma documentation frames.
		'storybook-addon-pseudo-states',
	],
	framework: { name: '@storybook/react-vite', options: {} },
	core: { disableTelemetry: true },
}

export default config
