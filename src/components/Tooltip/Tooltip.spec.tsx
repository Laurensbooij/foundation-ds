import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { expectNoAxeViolations } from '../../testing/index.js'
import { IconButton } from '../IconButton/index.js'
import { Tooltip } from './Tooltip.js'
import { TOOLTIP_TESTIDS } from './constants.js'

describe('Tooltip', () => {
	it('describes a child that has no accessible name of its own', () => {
		render(
			<Tooltip content="Delete item">
				<button type="button">Trash</button>
			</Tooltip>,
		)

		expect(screen.getByRole('button', { name: 'Trash' })).toHaveAccessibleDescription('Delete item')
	})

	it('stays silent when the child is already named, rather than saying it twice', () => {
		render(
			<Tooltip content="Delete item">
				<IconButton icon="trash-2" label="Delete item" />
			</Tooltip>,
		)

		const button = screen.getByRole('button', { name: 'Delete item' })
		expect(button).not.toHaveAccessibleDescription()
		expect(
			screen.getByTestId(`${TOOLTIP_TESTIDS.BASE}${TOOLTIP_TESTIDS.CHIP_SUFFIX}`),
		).toHaveAttribute('aria-hidden', 'true')
	})

	it('renders its content', () => {
		render(
			<Tooltip content="Delete item">
				<button type="button">Trash</button>
			</Tooltip>,
		)

		expect(
			screen.getByTestId(`${TOOLTIP_TESTIDS.BASE}${TOOLTIP_TESTIDS.CHIP_SUFFIX}`),
		).toHaveTextContent('Delete item')
	})

	it('has no axe violations', async () => {
		const { container } = render(
			<Tooltip content="Delete item" placement="right">
				<button type="button">Trash</button>
			</Tooltip>,
		)
		await expectNoAxeViolations(container)
	})
})
