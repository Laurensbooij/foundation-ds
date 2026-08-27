import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { expectNoAxeViolations } from '../../testing/index.js'
import { TextInput } from './TextInput.js'

describe('TextInput', () => {
	it('is a textbox named by its label', () => {
		render(<TextInput label="Email" />)
		expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
	})

	it('is described by its hint', () => {
		render(<TextInput label="Email" hint="We only use this to sign you in." />)
		expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(
			'We only use this to sign you in.',
		)
	})

	it('accepts typing', async () => {
		render(<TextInput label="Email" />)

		const field = screen.getByRole('textbox', { name: 'Email' })
		await userEvent.type(field, 'hi@example.com')

		expect(field).toHaveValue('hi@example.com')
	})

	it('says nothing about validity until asked to', () => {
		render(<TextInput label="Email" />)
		expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid')
	})

	it('announces invalidity and describes what is wrong', () => {
		render(<TextInput label="Email" invalid hint="Enter an address like name@example.com." />)

		const field = screen.getByRole('textbox', { name: 'Email' })
		expect(field).toHaveAttribute('aria-invalid', 'true')
		expect(field).toHaveAccessibleDescription('Enter an address like name@example.com.')
	})

	it('renders bare when given neither label nor hint', () => {
		render(<TextInput aria-label="Search" />)
		expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument()
	})

	it('does not accept typing when disabled', async () => {
		render(<TextInput label="Email" disabled />)

		const field = screen.getByRole('textbox', { name: 'Email' })
		await userEvent.type(field, 'nope')

		expect(field).toHaveValue('')
	})

	it('has no axe violations', async () => {
		const { container } = render(
			<TextInput label="Email" invalid hint="Enter an address like name@example.com." />,
		)
		await expectNoAxeViolations(container)
	})
})
