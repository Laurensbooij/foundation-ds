import type { IconName } from '../Icon/index.js'

export const DIALOG_TESTIDS = {
	BASE: 'dialog',
	BADGE_SUFFIX: '-badge',
	CLOSE_SUFFIX: '-close',
} as const

/** Tones of the design set, in the order the Figma grid lists them. */
export const DIALOG_TONES = ['accent', 'warning', 'danger'] as const

/**
 * The glyph each tone wears. Triangle is caution and circle is error, which is
 * the mapping the Figma file settled on.
 */
export const DIALOG_TONE_GLYPHS = {
	accent: 'info',
	warning: 'alert-triangle',
	danger: 'alert-circle',
} as const satisfies Record<(typeof DIALOG_TONES)[number], IconName>
