import type { ComponentPropsWithoutRef, FC } from 'react'

import { cx } from '../../lib/cx'
import styles from './Card.module.css'
import type { CARD_PADDINGS } from './constants'
import { CARD_TESTIDS } from './constants'

/** Inset step: none 0 · sm 16 · md 20 · lg 24. */
export type CardPadding = (typeof CARD_PADDINGS)[number]

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
	/** Inset step. Defaults to `md` (20px). */
	padding?: CardPadding
	/** Lifts the card onto `shadow/2`. Defaults to flat. */
	raised?: boolean
	/** Overrides the BASE testid for instances rendered in a collection. */
	dataTestId?: string
}

/**
 * The surface every grouped block sits on: white, a hairline border, one of
 * four insets.
 *
 * A plain `<div>` with no role — a card is a visual grouping, and giving it a
 * landmark or region role would add noise to the accessibility tree. Callers
 * that need one pass their own element semantics through `role` and the
 * heading inside it.
 *
 * No coloured left borders and no tinted bodies: tone belongs to `Badge` and
 * `Dialog`, not to the surface.
 */
export const Card: FC<CardProps> = ({
	padding = 'md',
	raised = false,
	dataTestId,
	className,
	children,
	...divProps
}) => (
	<div
		className={cx(styles.card, styles[padding], raised && styles.raised, className)}
		data-testid={dataTestId ?? CARD_TESTIDS.BASE}
		{...divProps}
	>
		{children}
	</div>
)
