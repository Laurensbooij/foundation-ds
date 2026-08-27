import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { expectNoAxeViolations } from '../../testing/index.js'
import { Select } from './Select.js'
import { SELECT_TESTIDS } from './constants.js'

const options = (
	<>
		<option value="one">Option one</option>
		<option value="two">Option two</option>
	</>
)

describe('Select', () => {
	it('is a combobox named by its label', () => {
		render(<Select label="Plan">{options}</Select>)
		expect(screen.getByRole('combobox', { name: 'Plan' })).toBeInTheDocument()
	})

	it('is described by its hint', () => {
		render(
			<Select label="Plan" hint="You can change this later.">
				{options}
			</Select>,
		)
		expect(screen.getByRole('combobox', { name: 'Plan' })).toHaveAccessibleDescription(
			'You can change this later.',
		)
	})

	it('selects an option', async () => {
		render(<Select label="Plan">{options}</Select>)

		const field = screen.getByRole('combobox', { name: 'Plan' })
		await userEvent.selectOptions(field, 'two')

		expect(field).toHaveValue('two')
	})

	it('announces invalidity and describes what is wrong', () => {
		render(
			<Select label="Plan" invalid hint="Pick a plan to continue.">
				{options}
			</Select>,
		)

		const field = screen.getByRole('combobox', { name: 'Plan' })
		expect(field).toHaveAttribute('aria-invalid', 'true')
		expect(field).toHaveAccessibleDescription('Pick a plan to continue.')
	})

	it('keeps its chevron decorative', () => {
		render(<Select label="Plan">{options}</Select>)

		expect(
			screen.getByTestId(`${SELECT_TESTIDS.BASE}${SELECT_TESTIDS.CHEVRON_SUFFIX}`),
		).toHaveAttribute('aria-hidden', 'true')
	})

	it('has no axe violations', async () => {
		const { container } = render(
			<Select label="Plan" invalid hint="Pick a plan to continue.">
				{options}
			</Select>,
		)
		await expectNoAxeViolations(container)
	})
})
