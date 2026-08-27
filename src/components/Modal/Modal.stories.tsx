import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button/index.js'
import { Modal } from './Modal.js'

const meta = {
	title: 'Components/Modal',
	component: Modal,
	args: { open: false, onClose: () => {}, children: null },
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

/** The bare shell: top layer, focus landing, scroll lock, controlled Escape. */
export const Shell: Story = {
	render: () => {
		const [open, setOpen] = useState(false)

		return (
			<>
				<Button onClick={() => setOpen(true)}>Open modal</Button>
				<Modal open={open} onClose={() => setOpen(false)} labelledBy="modal-story-title">
					<div style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
						<h2 id="modal-story-title" style={{ margin: 0, font: 'var(--heading)' }}>
							A bare shell
						</h2>
						<p style={{ margin: 0, font: 'var(--body-sm)', color: 'var(--text-muted)' }}>
							Dialog adds the tone badge, the copy and the action row on top of this.
						</p>
						<Button variant="secondary" onClick={() => setOpen(false)}>
							Close
						</Button>
					</div>
				</Modal>
			</>
		)
	},
}
