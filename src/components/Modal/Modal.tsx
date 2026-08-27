'use client'

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { cx } from '../../lib/cx/index.js'
import styles from './Modal.module.css'
import { MODAL_TESTIDS } from './constants.js'

export interface ModalProps extends Omit<ComponentPropsWithoutRef<'dialog'>, 'open' | 'title'> {
	/** Whether the modal is showing. It never opens or closes on its own. */
	open: boolean
	/** Asked to close: Escape, and the scrim when `scrimClose` is on. */
	onClose: () => void
	/** Id of the element that names the modal. */
	labelledBy?: string
	/** Id of the element that describes it. */
	describedBy?: string
	/** Closes when the scrim is clicked. Off by default — a stray click should not discard work. */
	scrimClose?: boolean
	children: ReactNode
	/** Overrides the BASE testid. */
	dataTestId?: string
}

/**
 * The shell every overlay sits in: the top layer, focus landing, the scroll
 * lock and a controlled Escape.
 *
 * A native `<dialog>` opened with `showModal()`, which is the only way to get
 * the real top layer, native focus containment and native Escape handling —
 * reimplementing those in userland is how focus traps end up subtly wrong.
 *
 * Escape is *controlled*: the browser's own cancel is prevented and forwarded
 * to `onClose`, so the modal never closes behind the caller's back and `open`
 * stays the single source of truth.
 *
 * Not drawn in Figma — exported as the one recorded exception in ADR-0001,
 * because a consumer needing a bare modal should not have to reimplement focus
 * management that already ships here.
 */
export const Modal: FC<ModalProps> = ({
	open,
	onClose,
	labelledBy,
	describedBy,
	scrimClose = false,
	className,
	children,
	dataTestId,
	...dialogProps
}) => {
	const ref = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = ref.current
		if (!dialog) return

		if (open && !dialog.open) dialog.showModal()
		if (!open && dialog.open) dialog.close()
	}, [open])

	// showModal() makes the rest of the page inert but does not stop it
	// scrolling behind the scrim.
	useEffect(() => {
		if (!open) return

		const { body } = document
		const previous = body.style.overflow
		body.style.overflow = 'hidden'

		return () => {
			body.style.overflow = previous
		}
	}, [open])

	return (
		/* A <dialog>'s backdrop is not a separate element, so the only way to
		   detect a scrim click is on the dialog itself. There is deliberately no
		   keyboard equivalent: Escape already closes it, and adding a key handler
		   here would give the card two ways to close from the keyboard. */
		/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
		<dialog
			{...dialogProps}
			ref={ref}
			aria-labelledby={labelledBy}
			aria-describedby={describedBy}
			className={cx(styles.modal, className)}
			data-testid={dataTestId ?? MODAL_TESTIDS.BASE}
			onCancel={(event) => {
				// Let `open` stay the single source of truth.
				event.preventDefault()
				onClose()
			}}
			onClick={(event) => {
				// A click on the dialog element itself landed on the scrim: the card's
				// own content stops at its padding box, so anything else has a closer
				// target.
				if (scrimClose && event.target === ref.current) onClose()
			}}
		>
			{children}
		</dialog>
	)
}
