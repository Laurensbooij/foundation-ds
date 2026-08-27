import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { expectNoAxeViolations } from '../../testing/index.js'
import { Button } from './Button.js'
import { BUTTON_TESTIDS } from './constants.js'

describe('Button', () => {
	it('is a button named by its children', () => {
		render(<Button>Save</Button>)
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
	})

	it('defaults to type=button so it never submits a surrounding form by accident', () => {
		render(<Button>Save</Button>)
		expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
	})

	it('submits when asked to', () => {
		render(<Button type="submit">Save</Button>)
		expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit')
	})

	it('calls onClick when activated by keyboard', async () => {
		const onClick = vi.fn()
		render(<Button onClick={onClick}>Save</Button>)

		await userEvent.tab()
		await userEvent.keyboard('{Enter}')

		expect(onClick).toHaveBeenCalledOnce()
	})

	it('is not reachable or clickable when disabled', async () => {
		const onClick = vi.fn()
		render(
			<Button disabled onClick={onClick}>
				Save
			</Button>,
		)

		const button = screen.getByRole('button', { name: 'Save' })
		await userEvent.click(button)

		expect(onClick).not.toHaveBeenCalled()
		expect(button).toBeDisabled()
	})

	it('keeps its icons out of the accessible name', () => {
		render(
			<Button iconStart="plus" iconEnd="chevron-right">
				Add item
			</Button>,
		)

		expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
		expect(
			screen.getByTestId(`${BUTTON_TESTIDS.BASE}${BUTTON_TESTIDS.ICON_START_SUFFIX}`),
		).toBeInTheDocument()
		expect(
			screen.getByTestId(`${BUTTON_TESTIDS.BASE}${BUTTON_TESTIDS.ICON_END_SUFFIX}`),
		).toBeInTheDocument()
	})

	it('has no axe violations', async () => {
		const { container } = render(<Button iconStart="plus">Add item</Button>)
		await expectNoAxeViolations(container)
	})
})
