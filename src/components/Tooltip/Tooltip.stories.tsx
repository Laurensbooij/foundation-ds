import type { Meta, StoryObj } from '@storybook/react-vite'

import { VariantGrid } from '../../testing/story-chrome/index.js'
import { IconButton } from '../IconButton/index.js'
import { Tooltip } from './Tooltip.js'
import { TOOLTIP_PLACEMENTS } from './constants.js'

const meta = {
	title: 'Components/Tooltip',
	component: Tooltip,
	args: { content: 'Delete item', children: <IconButton icon="trash-2" label="Delete item" /> },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

/** Hover or focus any control to show its chip. */
export const Placements: Story = {
	render: () => (
		<div style={{ padding: 'var(--space-12)' }}>
			<VariantGrid
				rows={TOOLTIP_PLACEMENTS}
				columns={['control'] as const}
				renderCell={(placement) => (
					<Tooltip content="Delete item" placement={placement}>
						<IconButton icon="trash-2" label="Delete item" />
					</Tooltip>
				)}
			/>
		</div>
	),
}
