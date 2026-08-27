import { expect } from 'vitest'
import { axe } from 'vitest-axe'

/**
 * Ends every component spec (ADR-0007). Foundation ships the accessibility
 * contract its consumers inherit, so a violation here is a violation in every
 * product downstream.
 *
 * Asserts on the violations directly rather than through a custom matcher: the
 * failure names the rule, the impact and the offending markup, which a boolean
 * matcher cannot.
 */
export const expectNoAxeViolations = async (container: Element): Promise<void> => {
	const { violations } = await axe(container)

	const described = violations.map(
		(violation) =>
			`${violation.id} (${violation.impact ?? 'unknown'}): ${violation.help}\n` +
			violation.nodes.map((node) => `    ${node.html}`).join('\n'),
	)

	expect(described, `${described.length} accessibility violation(s)`).toEqual([])
}
