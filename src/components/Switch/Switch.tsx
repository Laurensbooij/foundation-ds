'use client'

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import { useId } from 'react'

import { cx } from '../../lib/cx/index.js'
import styles from './Switch.module.css'
import { SWITCH_TESTIDS } from './constants.js'

export interface SwitchProps extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'type' | 'children' | 'size'
> {
	/** The visible label, and the switch's accessible name. */
	label: ReactNode
	/** The supporting line under the label. Optional — the Figma set draws both. */
	description?: ReactNode
	/** Overrides the BASE testid for instances rendered in a collection. */
	dataTestId?: string
	/** Class for the outer element. */
	className?: string
}

/**
 * An on/off control that applies the moment it flips — there is no Save beside
 * it. If a change needs confirming, use a checkbox and a button.
 *
 * A native `<input type="checkbox">` with `role="switch"`, visually replaced
 * but never hidden: the browser keeps the whole keyboard model, the disabled
 * semantics and the checked state, and screen readers announce "switch, on".
 *
 * The description sits **outside** the `<label>` and is wired up with
 * `aria-describedby` instead. Inside it, the description folds into the
 * accessible name and the switch announces as
 * "Enabled Applies the moment it flips" — a name that reads like a sentence.
 */
export const Switch: FC<SwitchProps> = ({
	label,
	description,
	dataTestId,
	className,
	disabled,
	id,
	...inputProps
}) => {
	const generatedId = useId()
	const base = dataTestId ?? SWITCH_TESTIDS.BASE
	const inputId = id ?? `switch-${generatedId}`
	const descriptionId = description ? `switch-description-${generatedId}` : undefined

	return (
		<div className={cx(styles.switch, className)}>
			<input
				{...inputProps}
				id={inputId}
				type="checkbox"
				role="switch"
				disabled={disabled}
				aria-describedby={descriptionId}
				className={styles.input}
				data-testid={base}
			/>
			<label htmlFor={inputId} className={styles.control}>
				<span className={styles.track} data-testid={`${base}${SWITCH_TESTIDS.TRACK_SUFFIX}`}>
					<span className={styles.knob} data-testid={`${base}${SWITCH_TESTIDS.KNOB_SUFFIX}`} />
				</span>
				<span className={styles.label}>{label}</span>
			</label>
			{description && (
				<span id={descriptionId} className={styles.description}>
					{description}
				</span>
			)}
		</div>
	)
}
