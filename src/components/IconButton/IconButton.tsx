'use client'

import type { ComponentPropsWithoutRef, FC } from 'react'

import { cx } from '../../lib/cx/index.js'
import { Icon } from '../Icon/index.js'
import type { IconName } from '../Icon/index.js'
import styles from './IconButton.module.css'
import type { ICON_BUTTON_SIZES, ICON_BUTTON_VARIANTS } from './constants.js'
import { ICON_BUTTON_ICON_SIZES, ICON_BUTTON_TESTIDS } from './constants.js'

/** Colour treatment, in the order the Figma grid lists them. */
export type IconButtonVariant = (typeof ICON_BUTTON_VARIANTS)[number]

/** A step on the control scale: sm 32 · md 40 · lg 48. */
export type IconButtonSize = (typeof ICON_BUTTON_SIZES)[number]

export interface IconButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
	/** Which glyph to draw. */
	icon: IconName
	/**
	 * The accessible name. **Required** — an icon-only control has no visible
	 * text to name it, and Foundation never defaults copy to English (ADR-0006).
	 */
	label: string
	/** Colour treatment. Defaults to `outline`. */
	variant?: IconButtonVariant
	/** Step on the control scale. Defaults to `md` (40px). */
	size?: IconButtonSize
	/** Overrides the BASE testid for instances rendered in a collection. */
	dataTestId?: string
}

/**
 * A square icon-only control — the tool, not the action.
 *
 * `radius/md` rather than a pill is deliberate: Foundations uses the shape to
 * separate tools from actions, and `Button` owns the pill.
 *
 * The glyph is always decorative; `label` names the button itself, so a screen
 * reader announces one name rather than an icon and a button.
 */
export const IconButton: FC<IconButtonProps> = ({
	icon,
	label,
	variant = 'outline',
	size = 'md',
	type = 'button',
	dataTestId,
	className,
	...buttonProps
}) => {
	const base = dataTestId ?? ICON_BUTTON_TESTIDS.BASE

	return (
		<button
			type={type}
			aria-label={label}
			className={cx(styles.iconButton, styles[variant], styles[size], className)}
			data-testid={base}
			{...buttonProps}
		>
			<Icon
				name={icon}
				size={ICON_BUTTON_ICON_SIZES[size]}
				dataTestId={`${base}${ICON_BUTTON_TESTIDS.ICON_SUFFIX}`}
			/>
		</button>
	)
}
