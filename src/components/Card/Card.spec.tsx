import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { expectNoAxeViolations } from '../../testing'
import { Card } from './Card'
import { CARD_TESTIDS } from './constants'

describe('Card', () => {
	it('renders its children', () => {
		render(
			<Card>
				<h2>Billing</h2>
			</Card>,
		)
		expect(screen.getByRole('heading', { name: 'Billing' })).toBeInTheDocument()
	})

	it('adds no role of its own', () => {
		render(<Card>content</Card>)
		expect(screen.getByTestId(CARD_TESTIDS.BASE)).not.toHaveAttribute('role')
	})

	it('has no axe violations', async () => {
		const { container } = render(
			<Card raised padding="lg">
				<h2>Billing</h2>
			</Card>,
		)
		await expectNoAxeViolations(container)
	})
})
