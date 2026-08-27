import { Fragment } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../../lib/cx'
import styles from './VariantGrid.module.css'

export interface VariantGridProps<Row extends string, Column extends string> {
	/** Row axis values, top to bottom — usually the variant or tone. */
	rows: readonly Row[]
	/** Column axis values, left to right — usually size or state. */
	columns: readonly Column[]
	/** Renders one cell. */
	renderCell: (row: Row, column: Column) => ReactNode
	/** Hides the column axis labels, for a single-column list. */
	hideColumnLabels?: boolean
	className?: string
}

/**
 * The one grid every component story uses, so Storybook mirrors the Figma
 * documentation frames 1:1 — labelled axes, one cell per combination.
 *
 * Story chrome only: it never ships. One grid story per component beats one
 * story per variant, which is unreadable past a dozen combinations.
 */
export const VariantGrid = <Row extends string, Column extends string>({
	rows,
	columns,
	renderCell,
	hideColumnLabels = columns.length === 1,
	className,
}: VariantGridProps<Row, Column>) => (
	<div
		className={cx(styles.grid, className)}
		style={{ gridTemplateColumns: `auto repeat(${columns.length}, max-content)` }}
	>
		{!hideColumnLabels && (
			<>
				<span />
				{columns.map((column) => (
					<span key={column} className={styles.axisLabel}>
						{column}
					</span>
				))}
			</>
		)}

		{rows.map((row) => (
			<Fragment key={row}>
				<span className={styles.rowLabel}>{row}</span>
				{columns.map((column) => (
					<div key={`${row}-${column}`} className={styles.cell}>
						{renderCell(row, column)}
					</div>
				))}
			</Fragment>
		))}
	</div>
)
