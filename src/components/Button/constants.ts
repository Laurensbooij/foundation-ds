import type { IconSize } from '../Icon'

export const BUTTON_TESTIDS = {
	BASE: 'button',
	ICON_START_SUFFIX: '-icon-start',
	ICON_END_SUFFIX: '-icon-end',
} as const

/** Steps of the size scale, smallest first. */
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const

/** Variants of the design set, in the order the Figma grid lists them. */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost', 'soft', 'danger'] as const

/**
 * The button owns its glyph size — a caller passes a name, not a node, so it
 * never has to know which step goes with which control height.
 *
 * Foundations specifies 18px in a button, which is not a step on the icon scale
 * (12 · 16 · 20 · 24 · 32). `md` (20) is the nearer step for md and lg; sm takes
 * `sm` (16) so the three heights stay visibly distinct.
 */
export const BUTTON_ICON_SIZES = {
	sm: 'sm',
	md: 'md',
	lg: 'md',
} as const satisfies Record<(typeof BUTTON_SIZES)[number], IconSize>
