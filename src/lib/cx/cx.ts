/** Joins truthy class names. Internal — never part of the public API. */
export const cx = (...values: (string | false | null | undefined)[]): string =>
	values.filter(Boolean).join(' ')
