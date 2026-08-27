import {
	ArrowRight,
	Calendar,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	CircleAlert,
	CircleCheck,
	Copy,
	Download,
	Ellipsis,
	ExternalLink,
	Eye,
	EyeOff,
	Info,
	Lock,
	Pause,
	Pencil,
	Play,
	Plus,
	RotateCcw,
	Search,
	Settings,
	Trash2,
	TriangleAlert,
	Upload,
	User,
	X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const ICON_TESTIDS = {
	BASE: 'icon',
} as const

/** Steps of the icon scale, smallest first. */
export const ICON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

/**
 * The designed set: the 29 Lucide glyphs the Figma file draws (ADR-0005).
 * Naming them one by one keeps the bundle to the designed set — a wildcard
 * re-export would pull in all ~1,600.
 *
 * A runtime lookup by name keeps every entry reachable, so importing `Icon`
 * carries all 29 (~11 kB raw). That is the price of the `IconName` union, and
 * ADR-0005 pays it deliberately.
 *
 * Keys are Figma's names and are the public API. Several of them are Lucide's
 * older aliases, so the values use Lucide's current exports instead: the
 * aliases still resolve today but are not guaranteed to survive a major.
 *
 * Adding a glyph means drawing it in Figma first.
 */
export const ICON_GLYPHS = {
	'alert-circle': CircleAlert,
	'alert-triangle': TriangleAlert,
	'arrow-right': ArrowRight,
	calendar: Calendar,
	check: Check,
	'check-circle': CircleCheck,
	'chevron-down': ChevronDown,
	'chevron-left': ChevronLeft,
	'chevron-right': ChevronRight,
	'chevron-up': ChevronUp,
	copy: Copy,
	download: Download,
	'external-link': ExternalLink,
	eye: Eye,
	'eye-off': EyeOff,
	info: Info,
	lock: Lock,
	'more-horizontal': Ellipsis,
	pause: Pause,
	pencil: Pencil,
	play: Play,
	plus: Plus,
	'rotate-ccw': RotateCcw,
	search: Search,
	settings: Settings,
	'trash-2': Trash2,
	upload: Upload,
	user: User,
	x: X,
} as const satisfies Record<string, LucideIcon>
