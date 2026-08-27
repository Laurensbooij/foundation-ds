import type { Meta, StoryObj } from '@storybook/react-vite'

import { VariantGrid } from '../../testing/story-chrome/index.js'
import { Badge } from './Badge.js'
import { BADGE_TONES } from './constants.js'

const meta = {
	title: 'Components/Badge',
	component: Badge,
	args: { children: 'Active' },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Tones: Story = {
	render: () => (
		<VariantGrid
			rows={BADGE_TONES}
			columns={['plain', 'with icon'] as const}
			renderCell={(tone, column) => (
				<Badge tone={tone} icon={column === 'with icon' ? 'check' : undefined}>
					Active
				</Badge>
			)}
		/>
	),
}
