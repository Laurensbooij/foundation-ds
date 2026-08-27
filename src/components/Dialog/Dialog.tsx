'use client'

import type { FC, ReactNode } from 'react'
import { useId } from 'react'

import { cx } from '../../lib/cx/index.js'
import { Icon } from '../Icon/index.js'
import { IconButton } from '../IconButton/index.js'
import { Modal } from '../Modal/index.js'
import type { ModalProps } from '../Modal/index.js'
import styles from './Dialog.module.css'
import type { DIALOG_TONES } from './constants.js'
import { DIALOG_TESTIDS, DIALOG_TONE_GLYPHS } from './constants.js'

/** What the dialog means: a neutral confirm, a caution, or destruction. */
export type DialogTone = (typeof DIALOG_TONES)[number]

export interface DialogProps extends Omit<
	ModalProps,
	// The card names itself and keeps the scrim shut — see the docblock.
	'children' | 'describedBy' | 'labelledBy' | 'scrimClose'
> {
	/** Which designed card this is. Defaults to `accent`. */
	tone?: DialogTone
	/** The heading, and the card's accessible name. */
	title: ReactNode
	/**
	 * The supporting line under the title, and the card's accessible
	 * description. Required: every designed card carries one.
	 */
	description: ReactNode
	/**
	 * The action row: `Button`s in the designed order, primary first. A card
	 * always offers a way out here, since the close control is opt-in.
	 */
	actions: ReactNode
	/** Overrides the BASE testid, suffixes included. */
	dataTestId?: string
}

/**
 * A close control needs an accessible name, and Foundation ships no copy
 * (ADR-0006). Pairing the two in a union makes `dismissible` without
 * `closeLabel` a compile error rather than a control that silently goes
 * missing.
 */
export type DialogDismissProps =
	| {
			/**
			 * Adds a close control in the top-right corner. Off by default — the
			 * Figma set draws no close affordance.
			 */
			dismissible?: false
			closeLabel?: never
	  }
	| {
			dismissible: true
			/** The close control's accessible name. */
			closeLabel: string
	  }

/**
 * The designed card: a tone badge, a title, a supporting line and a row of
 * actions, over a scrim.
 *
 * `Modal` is the shell underneath — the top layer, focus landing, the scroll
 * lock and the controlled Escape. This component contributes the tone, the
 * copy and the ids that name and describe the shell.
 *
 * The scrim is inert by design: a stray click should not discard work, so
 * `scrimClose` is not forwarded. Every card must therefore offer a way out in
 * its own action row.
 */
export const Dialog: FC<DialogProps & DialogDismissProps> = ({
	tone = 'accent',
	title,
	description,
	actions,
	onClose,
	dismissible = false,
	closeLabel,
	dataTestId,
	className,
	...modalProps
}) => {
	const generatedId = useId()
	const base = dataTestId ?? DIALOG_TESTIDS.BASE
	const titleId = `dialog-title-${generatedId}`
	const descriptionId = `dialog-description-${generatedId}`

	return (
		<Modal
			{...modalProps}
			onClose={onClose}
			labelledBy={titleId}
			describedBy={descriptionId}
			scrimClose={false}
			className={cx(styles.dialog, className)}
			dataTestId={base}
		>
			{/* The union above already makes closeLabel present whenever dismissible
			    is; this narrows it for the compiler after destructuring. */}
			{dismissible && closeLabel !== undefined && (
				<div className={styles.dismiss}>
					<IconButton
						icon="x"
						label={closeLabel}
						variant="ghost"
						size="sm"
						onClick={onClose}
						dataTestId={`${base}${DIALOG_TESTIDS.CLOSE_SUFFIX}`}
					/>
				</div>
			)}
			<div className={styles.head}>
				{/* Decorative — the title already carries the tone. */}
				<span
					className={cx(styles.badge, styles[tone])}
					data-testid={`${base}${DIALOG_TESTIDS.BADGE_SUFFIX}`}
				>
					<Icon name={DIALOG_TONE_GLYPHS[tone]} size="lg" />
				</span>
				<div className={styles.text}>
					<h2 id={titleId} className={styles.title}>
						{title}
					</h2>
					<p id={descriptionId} className={styles.description}>
						{description}
					</p>
				</div>
			</div>
			<div className={styles.actions}>{actions}</div>
		</Modal>
	)
}
