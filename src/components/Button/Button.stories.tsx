import type { Meta, StoryObj } from '@storybook/react-vite'

import { VariantGrid } from '../../testing/story-chrome'
import { Button } from './Button'
import { BUTTON_SIZES, BUTTON_VARIANTS } from './constants'

const meta = {
	title: 'Components/Button',
	component: Button,
	args: { children: 'Continue' },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

/** Every variant at every size — the Figma documentation grid. */
export const Variants: Story = {
	render: () => (
		<VariantGrid
			rows={BUTTON_VARIANTS}
			columns={BUTTON_SIZES}
			renderCell={(variant, size) => (
				<Button variant={variant} size={size}>
					Continue
				</Button>
			)}
		/>
	),
}

/** Icons are named, never passed as nodes — the button sizes them. */
export const WithIcons: Story = {
	render: () => (
		<VariantGrid
			rows={['start', 'end', 'both'] as const}
			columns={BUTTON_SIZES}
			renderCell={(placement, size) => (
				<Button
					size={size}
					iconStart={placement === 'start' || placement === 'both' ? 'plus' : undefined}
					iconEnd={placement === 'end' || placement === 'both' ? 'chevron-right' : undefined}
				>
					Continue
				</Button>
			)}
		/>
	),
}

export const Disabled: Story = {
	render: () => (
		<VariantGrid
			rows={BUTTON_VARIANTS}
			columns={['disabled'] as const}
			renderCell={(variant) => (
				<Button variant={variant} disabled>
					Continue
				</Button>
			)}
		/>
	),
}
