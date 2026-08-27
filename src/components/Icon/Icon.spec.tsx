import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { expectNoAxeViolations } from '../../testing'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { ICON_GLYPHS, ICON_SIZES, ICON_TESTIDS } from './constants'

// A decorative icon has no accessible identity on purpose, so its testid is the
// only handle for it — the case ADR-0007 reserves `getByTestId` for.
describe('Icon', () => {
	it('is hidden from assistive technology when no label is given', () => {
		render(<Icon name="check" />)

		expect(screen.getByTestId(ICON_TESTIDS.BASE)).toHaveAttribute('aria-hidden', 'true')
		expect(screen.queryByRole('img')).not.toBeInTheDocument()
	})

	it('becomes an image with an accessible name when labelled', () => {
		render(<Icon name="check" label="Done" />)

		const glyph = screen.getByRole('img', { name: 'Done' })
		expect(glyph).not.toHaveAttribute('aria-hidden')
	})

	it('draws every glyph the design system defines', () => {
		for (const name of Object.keys(ICON_GLYPHS) as IconName[]) {
			const { unmount } = render(<Icon name={name} />)
			expect(screen.getByTestId(ICON_TESTIDS.BASE)).toBeInTheDocument()
			unmount()
		}
	})

	it('applies a distinct class for each step of the scale', () => {
		const classNames = ICON_SIZES.map((size) => {
			const { unmount } = render(<Icon name="check" size={size} />)
			const className = screen.getByTestId(ICON_TESTIDS.BASE).getAttribute('class') ?? ''
			unmount()
			return className
		})

		expect(new Set(classNames).size).toBe(ICON_SIZES.length)
	})

	it('has no axe violations', async () => {
		const { container } = render(<Icon name="check" label="Done" />)
		await expectNoAxeViolations(container)
	})
})
