import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { expectNoAxeViolations } from '../../testing'
import { Switch } from './Switch'

describe('Switch', () => {
	it('is a switch named by its label', () => {
		render(<Switch label="Enabled" />)
		expect(screen.getByRole('switch', { name: 'Enabled' })).toBeInTheDocument()
	})

	it('is described by its description when one is given', () => {
		render(<Switch label="Enabled" description="Applies the moment it flips" />)
		expect(screen.getByRole('switch', { name: 'Enabled' })).toHaveAccessibleDescription(
			'Applies the moment it flips',
		)
	})

	it('toggles from the keyboard', async () => {
		const onChange = vi.fn()
		render(<Switch label="Enabled" onChange={onChange} />)

		await userEvent.tab()
		await userEvent.keyboard(' ')

		expect(onChange).toHaveBeenCalledOnce()
	})

	it('toggles when its label text is clicked', async () => {
		const onChange = vi.fn()
		render(<Switch label="Enabled" onChange={onChange} />)

		await userEvent.click(screen.getByText('Enabled'))

		expect(onChange).toHaveBeenCalledOnce()
	})

	it('reports its checked state', () => {
		render(<Switch label="Enabled" checked readOnly />)
		expect(screen.getByRole('switch', { name: 'Enabled' })).toBeChecked()
	})

	it('does not toggle when disabled', async () => {
		const onChange = vi.fn()
		render(<Switch label="Enabled" disabled onChange={onChange} />)

		await userEvent.click(screen.getByText('Enabled'))

		expect(onChange).not.toHaveBeenCalled()
	})

	it('has no axe violations', async () => {
		const { container } = render(
			<Switch label="Enabled" description="Applies the moment it flips" />,
		)
		await expectNoAxeViolations(container)
	})
})
