import type { ComponentPropsWithoutRef, FC } from 'react'

import { cx } from '../../lib/cx/index.js'
import { Icon } from '../Icon/index.js'
import type { IconName } from '../Icon/index.js'
import styles from './Badge.module.css'
import type { BADGE_TONES } from './constants.js'
import { BADGE_TESTIDS } from './constants.js'

/** What the badge means. Amber is caution; danger is errors and destruction only. */
export type BadgeTone = (typeof BADGE_TONES)[number]

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
	/** What the badge means. Defaults to `neutral`. */
	tone?: BadgeTone
	/** Optional leading glyph, drawn at 12px. Decorative — the text carries the meaning. */
	icon?: IconName
	/** Overrides the BASE testid for instances rendered in a collection. */
	dataTestId?: string
}

/**
 * A small uppercase chip for status.
 *
 * A badge is a label, not a control: it has no role of its own, so its text is
 * simply read in place. If a badge needs to be clicked, it is the wrong
 * component.
 */
export const Badge: FC<BadgeProps> = ({
	tone = 'neutral',
	icon,
	dataTestId,
	className,
	children,
	...spanProps
}) => {
	const base = dataTestId ?? BADGE_TESTIDS.BASE

	return (
		<span className={cx(styles.badge, styles[tone], className)} data-testid={base} {...spanProps}>
			{icon && <Icon name={icon} size="xs" dataTestId={`${base}${BADGE_TESTIDS.ICON_SUFFIX}`} />}
			{children}
		</span>
	)
}
