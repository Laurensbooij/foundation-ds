import type { IconSize } from '../Icon/index.js'

export const ICON_BUTTON_TESTIDS = {
	BASE: 'icon-button',
	ICON_SUFFIX: '-icon',
} as const

/** Steps of the control scale, smallest first: sm 32 · md 40 · lg 48. */
export const ICON_BUTTON_SIZES = ['sm', 'md', 'lg'] as const

/** Variants of the design set, in the order the Figma grid lists them. */
export const ICON_BUTTON_VARIANTS = ['solid', 'outline', 'ghost'] as const

/**
 * Figma draws the glyph at 16 · 18 · 22. Only 16 is a step on the icon scale,
 * so md and lg round to the nearest: 20 and 24.
 */
export const ICON_BUTTON_ICON_SIZES = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
} as const satisfies Record<(typeof ICON_BUTTON_SIZES)[number], IconSize>
