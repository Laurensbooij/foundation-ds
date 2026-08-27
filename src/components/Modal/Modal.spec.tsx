import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { expectNoAxeViolations } from '../../testing/index.js'
import { Modal } from './Modal.js'

const open = (props: Partial<Parameters<typeof Modal>[0]> = {}) =>
	render(
		<Modal open onClose={vi.fn()} labelledBy="title" {...props}>
			<h2 id="title">Settings</h2>
			<button type="button">Inside</button>
		</Modal>,
	)

describe('Modal', () => {
	it('is a dialog named by the element it points at', () => {
		open()
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
	})

	it('stays shut until asked to open', () => {
		render(
			<Modal open={false} onClose={vi.fn()} labelledBy="title">
				<h2 id="title">Settings</h2>
			</Modal>,
		)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})

	// jsdom implements neither showModal nor the Escape-to-cancel behaviour, so
	// the event the browser would send is fired directly. This asserts our
	// handling of cancel, not the browser's detection of Escape.
	it('forwards cancel to onClose rather than closing itself', () => {
		const onClose = vi.fn()
		open({ onClose })

		const dialog = screen.getByRole('dialog')
		const cancel = new Event('cancel', { bubbles: false, cancelable: true })
		fireEvent(dialog, cancel)

		expect(onClose).toHaveBeenCalledOnce()
		expect(cancel.defaultPrevented).toBe(true)
		// `open` remains the single source of truth, so it is still showing.
		expect(dialog).toBeInTheDocument()
	})

	it('ignores scrim clicks by default', async () => {
		const onClose = vi.fn()
		open({ onClose })

		await userEvent.click(screen.getByRole('dialog'))

		expect(onClose).not.toHaveBeenCalled()
	})

	it('closes on a scrim click when asked to', async () => {
		const onClose = vi.fn()
		open({ onClose, scrimClose: true })

		await userEvent.click(screen.getByRole('dialog'))

		expect(onClose).toHaveBeenCalledOnce()
	})

	it('does not close when the click lands on its content', async () => {
		const onClose = vi.fn()
		open({ onClose, scrimClose: true })

		await userEvent.click(screen.getByRole('button', { name: 'Inside' }))

		expect(onClose).not.toHaveBeenCalled()
	})

	it('locks page scroll while open', () => {
		const { unmount } = open()
		expect(document.body.style.overflow).toBe('hidden')

		unmount()
		expect(document.body.style.overflow).not.toBe('hidden')
	})

	it('has no axe violations', async () => {
		const { container } = open()
		await expectNoAxeViolations(container)
	})
})
