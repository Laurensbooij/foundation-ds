import type { Meta, StoryObj } from '@storybook/react-vite'

import { FIELD_SIZES } from '../../lib/field-shell/index.js'
import { VariantGrid } from '../../testing/story-chrome/index.js'
import { Select } from './Select.js'

const meta = {
	title: 'Components/Select',
	component: Select,
	args: { label: 'Label', hint: 'Helper text goes here', children: null },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

const options = (
	<>
		<option value="one">Option one</option>
		<option value="two">Option two</option>
	</>
)

export const StatesAndSizes: Story = {
	render: () => (
		<VariantGrid
			rows={['default', 'invalid', 'disabled'] as const}
			columns={FIELD_SIZES}
			renderCell={(state, size) => (
				<Select
					label="Label"
					hint={state === 'invalid' ? 'Pick a plan to continue.' : 'Helper text goes here'}
					size={size}
					invalid={state === 'invalid'}
					disabled={state === 'disabled'}
				>
					{options}
				</Select>
			)}
		/>
	),
}
