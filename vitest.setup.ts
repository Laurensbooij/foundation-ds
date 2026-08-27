import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom 30 ships <dialog> but not showModal/close. Modal uses the native
// element on purpose — it is the only way to get the real top layer, native
// focus containment and native Escape — so the gap is shimmed for tests rather
// than worked around in the component. Behaviour beyond open/close state
// (inertness, focus containment) is a browser concern and is covered by
// Storybook's a11y addon, not here.
// lib.dom insists these always exist, which is exactly the assumption jsdom
// breaks — so the runtime shape is read through an unknown-typed view.
const dialogPrototype = (
	globalThis as { HTMLDialogElement?: { prototype: Partial<HTMLDialogElement> } }
).HTMLDialogElement?.prototype

if (dialogPrototype !== undefined && dialogPrototype.showModal === undefined) {
	dialogPrototype.showModal = function showModal(this: HTMLDialogElement) {
		this.open = true
	}
	dialogPrototype.show = function show(this: HTMLDialogElement) {
		this.open = true
	}
	dialogPrototype.close = function close(this: HTMLDialogElement, returnValue?: string) {
		this.open = false
		if (returnValue !== undefined) this.returnValue = returnValue
		this.dispatchEvent(new Event('close'))
	}
}

afterEach(cleanup)
