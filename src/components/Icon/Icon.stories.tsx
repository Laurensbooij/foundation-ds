import type { Meta, StoryObj } from '@storybook/react-vite'

import { VariantGrid } from '../../testing/story-chrome'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { ICON_GLYPHS, ICON_SIZES } from './constants'

const meta = {
	title: 'Components/Icon',
	component: Icon,
	args: { name: 'check' },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

/** Every glyph the Figma set defines, at the default step. */
export const Glyphs: Story = {
	render: () => (
		<VariantGrid
			rows={Object.keys(ICON_GLYPHS) as IconName[]}
			columns={['glyph'] as const}
			renderCell={(name) => <Icon name={name} />}
		/>
	),
}

/** The scale: xs 12 · sm 16 · md 20 · lg 24 · xl 32. */
export const Sizes: Story = {
	render: () => (
		<VariantGrid
			rows={['check', 'settings', 'trash-2'] as IconName[]}
			columns={ICON_SIZES}
			renderCell={(name, size) => <Icon name={name} size={size} />}
		/>
	),
}
