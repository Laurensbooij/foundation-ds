import type { Meta, StoryObj } from '@storybook/react-vite'

import { FIELD_SIZES } from '../../lib/field-shell/index.js'
import { VariantGrid } from '../../testing/story-chrome/index.js'
import { TextInput } from './TextInput.js'

const meta = {
	title: 'Components/TextInput',
	component: TextInput,
	args: { label: 'Label', hint: 'Helper text goes here', defaultValue: 'Value' },
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const StatesAndSizes: Story = {
	render: () => (
		<VariantGrid
			rows={['default', 'invalid', 'disabled'] as const}
			columns={FIELD_SIZES}
			renderCell={(state, size) => (
				<TextInput
					label="Label"
					hint={
						state === 'invalid'
							? 'Enter an address like name@example.com.'
							: 'Helper text goes here'
					}
					defaultValue="Value"
					size={size}
					invalid={state === 'invalid'}
					disabled={state === 'disabled'}
				/>
			)}
		/>
	),
}

/** Label and hint are optional — omit either for a bare field. */
export const Bare: Story = {
	render: () => (
		<VariantGrid
			rows={['label only', 'hint only', 'neither'] as const}
			columns={['md'] as const}
			renderCell={(row) => (
				<TextInput
					aria-label={row === 'neither' || row === 'hint only' ? 'Search' : undefined}
					label={row === 'label only' ? 'Label' : undefined}
					hint={row === 'hint only' ? 'Helper text goes here' : undefined}
					defaultValue="Value"
				/>
			)}
		/>
	),
}
