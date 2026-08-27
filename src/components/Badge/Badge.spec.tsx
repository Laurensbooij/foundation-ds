import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { expectNoAxeViolations } from '../../testing'
import { Badge } from './Badge'
import { BADGE_TESTIDS } from './constants'

describe('Badge', () => {
	it('reads out its text', () => {
		render(<Badge>Active</Badge>)
		expect(screen.getByText('Active')).toBeInTheDocument()
	})

	it('keeps its optional glyph decorative', () => {
		render(<Badge icon="check">Active</Badge>)

		const glyph = screen.getByTestId(`${BADGE_TESTIDS.BASE}${BADGE_TESTIDS.ICON_SUFFIX}`)
		expect(glyph).toHaveAttribute('aria-hidden', 'true')
	})

	it('has no axe violations', async () => {
		const { container } = render(
			<Badge tone="danger" icon="alert-circle">
				Failed
			</Badge>,
		)
		await expectNoAxeViolations(container)
	})
})
