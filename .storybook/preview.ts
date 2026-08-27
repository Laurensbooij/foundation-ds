import '@fontsource-variable/outfit'
import '@fontsource-variable/public-sans'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/ibm-plex-mono/latin-600.css'
import type { Preview } from '@storybook/react-vite'

import '../src/styles/tokens.css'
import './preview.css'

const preview: Preview = {
	parameters: {
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
		a11y: { test: 'error' },
	},
}

export default preview
