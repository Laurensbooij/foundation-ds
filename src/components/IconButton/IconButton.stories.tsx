import type { Meta, StoryObj } from '@storybook/react-vite'

import { VariantGrid } from '../../testing/story-chrome/index.js'
import { IconButton } from './IconButton.js'
import { ICON_BUTTON_SIZES, ICON_BUTTON_VARIANTS } from './constants.js'

const meta = {
	title: 'Components/IconButton',
	component: IconButton,
	args: { icon: 'settings', label: 'Settings' },
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = {
	render: () => (
		<VariantGrid
			rows={ICON_BUTTON_VARIANTS}
			columns={ICON_BUTTON_SIZES}
			renderCell={(variant, size) => (
				<IconButton icon="settings" label="Settings" variant={variant} size={size} />
			)}
		/>
	),
}

export const Disabled: Story = {
	render: () => (
		<VariantGrid
			rows={ICON_BUTTON_VARIANTS}
			columns={['disabled'] as const}
			renderCell={(variant) => (
				<IconButton icon="settings" label="Settings" variant={variant} disabled />
			)}
		/>
	),
}
