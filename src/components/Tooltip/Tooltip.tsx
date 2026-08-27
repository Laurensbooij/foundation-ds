'use client'

import type { FC, ReactElement, ReactNode } from 'react'
import { cloneElement, useId } from 'react'

import { cx } from '../../lib/cx/index.js'
import styles from './Tooltip.module.css'
import type { TOOLTIP_PLACEMENTS } from './constants.js'
import { TOOLTIP_TESTIDS } from './constants.js'

/** Which side of the control the chip sits on. */
export type TooltipPlacement = (typeof TOOLTIP_PLACEMENTS)[number]

/**
 * The props the tooltip reads off its child to decide how to announce itself.
 * `label` is Foundation's own convention for a control that names itself —
 * `IconButton` and `Switch` both take one and apply `aria-label` internally,
 * where a plain `aria-label` check would never see it.
 */
interface TooltipChildProps {
	'aria-label'?: string
	'aria-describedby'?: string
	label?: ReactNode
}

export interface TooltipProps {
	/** The chip's text. Short — a tooltip never holds anything a user must read to proceed. */
	content: ReactNode
	/** Which side of the control the chip sits on. Defaults to `top`. */
	placement?: TooltipPlacement
	/** Exactly one interactive element. */
	children: ReactElement<TooltipChildProps>
	className?: string
	/** Overrides the BASE testid, suffixes included. */
	dataTestId?: string
}

/**
 * A small chip that names or annotates one interactive element.
 *
 * Shown on hover **and on keyboard focus**, and the chip itself takes pointer
 * events so the pointer can cross the gap onto it without it closing — WCAG
 * 2.2 1.4.13.
 *
 * How it is announced depends on the child, because saying the same thing
 * twice is worse than saying it once:
 *
 * - A child that already names itself — an `aria-label`, or Foundation's own
 *   `label` prop — keeps that name, and the chip is hidden from assistive
 *   technology. An `IconButton` labelled "Delete" does not need a description
 *   that also reads "Delete".
 * - A child without one gets the chip as its `aria-describedby`.
 *
 * A third-party child that derives its own name from some other prop cannot be
 * detected; pass it an explicit `aria-label` if the chip would duplicate it.
 *
 * Never put help copy, error text, or anything a user must read to proceed in
 * here. That belongs on the page.
 */
export const Tooltip: FC<TooltipProps> = ({
	content,
	placement = 'top',
	children,
	className,
	dataTestId,
}) => {
	const generatedId = useId()
	const base = dataTestId ?? TOOLTIP_TESTIDS.BASE
	const chipId = `tooltip-${generatedId}`

	const { 'aria-label': childAriaLabel, label: childLabel } = children.props
	const childIsAlreadyNamed = childAriaLabel !== undefined || childLabel !== undefined

	return (
		<span className={cx(styles.tooltip, className)} data-testid={base}>
			{cloneElement(children, {
				'aria-describedby': childIsAlreadyNamed ? children.props['aria-describedby'] : chipId,
			})}
			<span
				id={chipId}
				role="tooltip"
				aria-hidden={childIsAlreadyNamed || undefined}
				className={cx(styles.chip, styles[placement])}
				data-testid={`${base}${TOOLTIP_TESTIDS.CHIP_SUFFIX}`}
			>
				{content}
			</span>
		</span>
	)
}
