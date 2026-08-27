import type { Meta, StoryObj } from '@storybook/react-vite'

import { VariantGrid } from '../../testing/story-chrome/index.js'
import { Card } from './Card.js'
import { CARD_PADDINGS } from './constants.js'

const meta = {
	title: 'Components/Card',
	component: Card,
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const PaddingAndElevation: Story = {
	render: () => (
		<VariantGrid
			rows={CARD_PADDINGS}
			columns={['flat', 'raised'] as const}
			renderCell={(padding, column) => (
				<Card padding={padding} raised={column === 'raised'} style={{ inlineSize: '16rem' }}>
					Card content
				</Card>
			)}
		/>
	),
}
