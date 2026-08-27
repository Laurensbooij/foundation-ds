'use client'

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import { useId } from 'react'

import { cx } from '../../lib/cx/index.js'
import { FieldShell } from '../../lib/field-shell/index.js'
import type { FieldSize } from '../../lib/field-shell/index.js'
import styles from './TextInput.module.css'
import { TEXT_INPUT_TESTIDS } from './constants.js'

export interface TextInputProps extends Omit<
	ComponentPropsWithoutRef<'input'>,
	'size' | 'children'
> {
	/** The micro-label above the field. Omit for a bare field. */
	label?: ReactNode
	/** The supporting line under the field. Omit for a bare field. */
	hint?: ReactNode
	/**
	 * Marks the value as failing validation: a 2px danger border, and the hint
	 * tinted danger. Say **what is wrong** in the hint, not that something is.
	 */
	invalid?: boolean
	/** Step on the control scale. Defaults to `md` (40px). */
	size?: FieldSize
	/** Class for the outer field, not the input. */
	className?: string
	/** Overrides the BASE testid. */
	dataTestId?: string
}

/**
 * A single-line text field in the shared field shell.
 *
 * `invalid` sets `aria-invalid` and wires the hint up as the field's
 * description, which is what makes the error reach a screen reader — WCAG 2.2
 * 3.3.1 asks for the error to be described in text, not just drawn in red.
 *
 * Set `invalid` only after validation has run. An input that announces itself
 * as invalid before anyone has typed is noise.
 */
export const TextInput: FC<TextInputProps> = ({
	label,
	hint,
	invalid = false,
	size = 'md',
	id,
	disabled,
	className,
	dataTestId,
	...inputProps
}) => {
	const generatedId = useId()
	const controlId = id ?? `text-input-${generatedId}`
	const hintId = hint !== undefined ? `text-input-hint-${generatedId}` : undefined

	return (
		<FieldShell
			controlId={controlId}
			label={label}
			hint={hint}
			hintId={hintId}
			invalid={invalid}
			disabled={disabled}
			size={size}
			className={className}
			dataTestId={dataTestId ?? TEXT_INPUT_TESTIDS.BASE}
		>
			<input
				{...inputProps}
				id={controlId}
				disabled={disabled}
				aria-invalid={invalid || undefined}
				aria-describedby={hintId}
				className={cx(styles.input)}
			/>
		</FieldShell>
	)
}
