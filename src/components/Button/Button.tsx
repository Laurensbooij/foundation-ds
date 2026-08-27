'use client'

import type { ComponentPropsWithoutRef, FC } from 'react'

import { cx } from '../../lib/cx/index.js'
import { Icon } from '../Icon/index.js'
import type { IconName } from '../Icon/index.js'
import styles from './Button.module.css'
import type { BUTTON_SIZES, BUTTON_VARIANTS } from './constants.js'
import { BUTTON_ICON_SIZES, BUTTON_TESTIDS } from './constants.js'

/** Colour treatment. Primary is the one main action per view; danger is destructive only. */
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]

/** A step on the control scale: sm 32 · md 40 · lg 48. */
export type ButtonSize = (typeof BUTTON_SIZES)[number]

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
	/** Colour treatment. Defaults to `primary`. */
	variant?: ButtonVariant
	/** Step on the control scale. Defaults to `md` (40px). */
	size?: ButtonSize
	/** Leading glyph, named rather than passed as a node — the button sizes it. */
	iconStart?: IconName
	/** Trailing glyph, named rather than passed as a node — the button sizes it. */
	iconEnd?: IconName
	/** Fills the inline axis, for stacked mobile actions. */
	fullWidth?: boolean
	/** Overrides the BASE testid for instances rendered in a collection. */
	dataTestId?: string
}

/**
 * The pill action button — the default control for every non-icon action.
 *
 * A native `<button>`, so the browser supplies the whole keyboard model — Enter
 * and Space activate, `disabled` drops it from the tab order — and announces
 * the role itself. Its children are its accessible name, which is why there is
 * no icon-only shape here; that is `IconButton`.
 *
 * `type` defaults to `button`: the native default is `submit`, and a button
 * that silently submits the form it happens to sit in is the wrong default for
 * a design-system control.
 */
export const Button: FC<ButtonProps> = ({
	variant = 'primary',
	size = 'md',
	iconStart,
	iconEnd,
	fullWidth = false,
	type = 'button',
	dataTestId,
	className,
	children,
	...buttonProps
}) => {
	const base = dataTestId ?? BUTTON_TESTIDS.BASE
	const iconSize = BUTTON_ICON_SIZES[size]

	return (
		<button
			type={type}
			className={cx(
				styles.button,
				styles[variant],
				styles[size],
				fullWidth && styles.fullWidth,
				className,
			)}
			data-testid={base}
			{...buttonProps}
		>
			{iconStart && (
				<Icon
					name={iconStart}
					size={iconSize}
					dataTestId={`${base}${BUTTON_TESTIDS.ICON_START_SUFFIX}`}
				/>
			)}
			{children}
			{iconEnd && (
				<Icon
					name={iconEnd}
					size={iconSize}
					dataTestId={`${base}${BUTTON_TESTIDS.ICON_END_SUFFIX}`}
				/>
			)}
		</button>
	)
}
