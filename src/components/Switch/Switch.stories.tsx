import type { Meta, StoryObj } from '@storybook/react-vite'

import { VariantGrid } from '../../testing/story-chrome'
import { Switch } from './Switch'

const meta = {
	title: 'Components/Switch',
	component: Switch,
	args: { label: 'Enabled' },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const States: Story = {
	render: () => (
		<VariantGrid
			rows={['off', 'on', 'disabled off', 'disabled on'] as const}
			columns={['plain', 'with description'] as const}
			renderCell={(row, column) => (
				<Switch
					label="Enabled"
					description={column === 'with description' ? 'Applies the moment it flips' : undefined}
					checked={row === 'on' || row === 'disabled on'}
					disabled={row.startsWith('disabled')}
					readOnly
				/>
			)}
		/>
	),
}
