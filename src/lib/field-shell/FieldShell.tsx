import type { FC, ReactNode } from 'react'

import { cx } from '../cx/index.js'
import styles from './FieldShell.module.css'

/** Steps of the control scale, smallest first: sm 32 · md 40 · lg 48. */
export const FIELD_SIZES = ['sm', 'md', 'lg'] as const

export type FieldSize = (typeof FIELD_SIZES)[number]

export interface FieldShellProps {
	/** The control's id, so the label points at it. */
	controlId: string
	/** The visible label. Omit for a bare field. */
	label?: ReactNode
	/** The supporting line under the field. Omit for a bare field. */
	hint?: ReactNode
	/** Id for the hint, so the control can be described by it. */
	hintId?: string
	/** Swaps the hairline for a 2px danger border and tints the hint. */
	invalid?: boolean
	/** Dims the whole field. The control still owns the real disabled state. */
	disabled?: boolean
	/** Step on the control scale. */
	size?: FieldSize
	/** The control itself, plus any adornments. */
	children: ReactNode
	className?: string
	dataTestId?: string
}

/**
 * The shell `TextInput` and `Select` share: a micro-label, the bordered box,
 * and a hint line.
 *
 * Internal — never exported from the package. The two field components are
 * structurally identical in Figma, and duplicating this in both is how their
 * borders, heights and focus rings would drift apart.
 *
 * The box takes its focus ring from `:has(:focus-visible)` on the control
 * inside it, so the ring follows real keyboard focus rather than being
 * simulated by the wrapper.
 */
export const FieldShell: FC<FieldShellProps> = ({
	controlId,
	label,
	hint,
	hintId,
	invalid = false,
	disabled = false,
	size = 'md',
	children,
	className,
	dataTestId,
}) => (
	<div
		className={cx(
			styles.field,
			styles[size],
			invalid && styles.invalid,
			disabled && styles.disabled,
			className,
		)}
		data-testid={dataTestId}
	>
		{label !== undefined && (
			<label htmlFor={controlId} className={styles.label}>
				{label}
			</label>
		)}
		<div className={styles.box}>{children}</div>
		{hint !== undefined && (
			<span id={hintId} className={styles.hint}>
				{hint}
			</span>
		)}
	</div>
)
