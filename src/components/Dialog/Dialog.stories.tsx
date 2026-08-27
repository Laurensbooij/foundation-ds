import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button/index.js'
import { Dialog } from './Dialog.js'
import { DIALOG_TONES } from './constants.js'

const meta = {
	title: 'Components/Dialog',
	component: Dialog,
	args: {
		open: false,
		onClose: () => {},
		title: 'Discard changes?',
		description: 'Anything you have not saved will be lost.',
		actions: null,
	},
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

const COPY = {
	accent: {
		title: 'Publish these changes?',
		description: 'Everyone with access sees them right away.',
		confirm: 'Publish',
	},
	warning: {
		title: 'Storage is almost full',
		description: 'Free up space to keep saving new files.',
		confirm: 'Manage storage',
	},
	danger: {
		title: 'Discard changes?',
		description: 'Anything you have not saved will be lost.',
		confirm: 'Discard',
	},
} as const

/** One card per tone. The scrim is inert, so each offers a way out. */
export const Tones: Story = {
	render: () => {
		const [openTone, setOpenTone] = useState<(typeof DIALOG_TONES)[number] | null>(null)

		return (
			<div style={{ display: 'flex', gap: 'var(--space-3)' }}>
				{DIALOG_TONES.map((tone) => (
					<Button key={tone} variant="secondary" onClick={() => setOpenTone(tone)}>
						{tone}
					</Button>
				))}
				{openTone && (
					<Dialog
						open
						tone={openTone}
						onClose={() => setOpenTone(null)}
						title={COPY[openTone].title}
						description={COPY[openTone].description}
						actions={
							<>
								<Button
									variant={openTone === 'danger' ? 'danger' : 'primary'}
									onClick={() => setOpenTone(null)}
								>
									{COPY[openTone].confirm}
								</Button>
								<Button variant="ghost" onClick={() => setOpenTone(null)}>
									Cancel
								</Button>
							</>
						}
					/>
				)}
			</div>
		)
	},
}
