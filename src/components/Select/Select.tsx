'use client'

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import { useId } from 'react'

import { FieldShell } from '../../lib/field-shell/index.js'
import type { FieldSize } from '../../lib/field-shell/index.js'
import { Icon } from '../Icon/index.js'
import styles from './Select.module.css'
import { SELECT_TESTIDS } from './constants.js'

export interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size' | 'multiple'> {
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
	/** `<option>` elements. */
	children: ReactNode
	/** Class for the outer field, not the select. */
	className?: string
	/** Overrides the BASE testid, suffixes included. */
	dataTestId?: string
}

/**
 * A native `<select>` in the shared field shell — the same 40px box as
 * `TextInput`.
 *
 * Native on purpose: the platform's own picker is the one every user already
 * knows, works on touch, and needs no keyboard model of our own. Use it for
 * four or more options; below that, show them side by side.
 *
 * `multiple` is not supported. A multi-select is a different control with a
 * different keyboard model, and Figma does not draw one.
 */
export const Select: FC<SelectProps> = ({
	label,
	hint,
	invalid = false,
	size = 'md',
	id,
	disabled,
	className,
	dataTestId,
	children,
	...selectProps
}) => {
	const generatedId = useId()
	const base = dataTestId ?? SELECT_TESTIDS.BASE
	const controlId = id ?? `select-${generatedId}`
	const hintId = hint !== undefined ? `select-hint-${generatedId}` : undefined

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
			dataTestId={base}
		>
			<select
				{...selectProps}
				id={controlId}
				disabled={disabled}
				aria-invalid={invalid || undefined}
				aria-describedby={hintId}
				className={styles.select}
			>
				{children}
			</select>
			<Icon
				name="chevron-down"
				size="sm"
				className={styles.chevron}
				dataTestId={`${base}${SELECT_TESTIDS.CHEVRON_SUFFIX}`}
			/>
		</FieldShell>
	)
}
