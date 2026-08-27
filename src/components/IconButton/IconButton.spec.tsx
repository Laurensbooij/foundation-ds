import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { expectNoAxeViolations } from '../../testing/index.js'
import { IconButton } from './IconButton.js'

describe('IconButton', () => {
	it('is named by its label, not by its glyph', () => {
		render(<IconButton icon="trash-2" label="Delete item" />)
		expect(screen.getByRole('button', { name: 'Delete item' })).toBeInTheDocument()
	})

	it('defaults to type=button', () => {
		render(<IconButton icon="plus" label="Add" />)
		expect(screen.getByRole('button', { name: 'Add' })).toHaveAttribute('type', 'button')
	})

	it('activates from the keyboard', async () => {
		const onClick = vi.fn()
		render(<IconButton icon="plus" label="Add" onClick={onClick} />)

		await userEvent.tab()
		await userEvent.keyboard(' ')

		expect(onClick).toHaveBeenCalledOnce()
	})

	it('does not fire when disabled', async () => {
		const onClick = vi.fn()
		render(<IconButton icon="plus" label="Add" disabled onClick={onClick} />)

		await userEvent.click(screen.getByRole('button', { name: 'Add' }))

		expect(onClick).not.toHaveBeenCalled()
	})

	it('has no axe violations', async () => {
		const { container } = render(<IconButton icon="settings" label="Settings" />)
		await expectNoAxeViolations(container)
	})
})
