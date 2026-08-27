import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { expectNoAxeViolations } from '../../testing/index.js'
import { Button } from '../Button/index.js'
import { Dialog } from './Dialog.js'
import type { DialogTone } from './Dialog.js'
import { DIALOG_TESTIDS } from './constants.js'

// Explicit params rather than a Partial props bag: `dismissible` and
// `closeLabel` are a union, and Partial<> collapses it.
const renderDialog = ({
	onClose = vi.fn(),
	tone,
	closeLabel,
}: { onClose?: () => void; tone?: DialogTone; closeLabel?: string } = {}) => {
	const shared = {
		open: true as const,
		onClose,
		tone,
		title: 'Discard changes?',
		description: 'Anything you have not saved will be lost.',
		actions: <Button variant="danger">Discard</Button>,
	}

	return closeLabel === undefined
		? render(<Dialog {...shared} />)
		: render(<Dialog {...shared} dismissible closeLabel={closeLabel} />)
}

describe('Dialog', () => {
	it('is named by its title and described by its description', () => {
		renderDialog()

		const dialog = screen.getByRole('dialog', { name: 'Discard changes?' })
		expect(dialog).toHaveAccessibleDescription('Anything you have not saved will be lost.')
	})

	it('renders its actions', () => {
		renderDialog()
		expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
	})

	it('keeps its tone badge decorative — the title carries the meaning', () => {
		renderDialog({ tone: 'danger' })

		expect(
			screen.getByTestId(`${DIALOG_TESTIDS.BASE}${DIALOG_TESTIDS.BADGE_SUFFIX}`),
		).toBeInTheDocument()
		expect(screen.queryByRole('img')).not.toBeInTheDocument()
	})

	it('draws no close control by default', () => {
		renderDialog()
		expect(
			screen.queryByTestId(`${DIALOG_TESTIDS.BASE}${DIALOG_TESTIDS.CLOSE_SUFFIX}`),
		).not.toBeInTheDocument()
	})

	it('closes from the opt-in close control', async () => {
		const onClose = vi.fn()
		renderDialog({ onClose, closeLabel: 'Close' })

		await userEvent.click(screen.getByRole('button', { name: 'Close' }))

		expect(onClose).toHaveBeenCalledOnce()
	})

	it('has no axe violations', async () => {
		const { container } = renderDialog({ closeLabel: 'Close' })
		await expectNoAxeViolations(container)
	})
})
