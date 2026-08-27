import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import checkFile from 'eslint-plugin-check-file'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{ ignores: ['dist', 'dist-types', 'coverage', 'storybook-static', 'src/styles/tokens.css'] },

	js.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	jsxA11y.flatConfigs.recommended,

	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			globals: globals.browser,
			parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
		},
		plugins: {
			'react-hooks': reactHooks,
			'prefer-arrow-functions': preferArrowFunctions,
			'check-file': checkFile,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'prefer-arrow-functions/prefer-arrow-functions': 'error',

			// Foundation ships no copy (ADR-0006). An i18n import here would put a
			// translation runtime in every consumer's bundle.
			'import-x/no-restricted-paths': 'off',
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react-intl',
							message:
								'Foundation ships no copy (ADR-0006). Take the string as a required prop instead.',
						},
					],
					patterns: [
						{
							group: ['@formatjs/*', 'i18next', 'react-i18next'],
							message:
								'Foundation ships no copy (ADR-0006). Take the string as a required prop instead.',
						},
					],
				},
			],

			// The public API is the barrel. A deep import into a component folder
			// from outside it is how the surface area leaks.
			'check-file/folder-naming-convention': [
				'error',
				{ 'src/components/*/': 'PASCAL_CASE', 'src/lib/*/': 'KEBAB_CASE' },
			],
			'check-file/filename-naming-convention': [
				'error',
				{
					'src/components/**/*.tsx': 'PASCAL_CASE',
					'src/lib/**/*.ts': 'KEBAB_CASE',
				},
				{ ignoreMiddleExtensions: true },
			],

			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports', fixStyle: 'separate-type-imports' },
			],
			'@typescript-eslint/no-unnecessary-condition': 'error',
		},
	},

	{
		files: ['**/*.spec.{ts,tsx}'],
		...testingLibrary.configs['flat/react'],
	},

	...storybook.configs['flat/recommended'],

	{
		files: ['scripts/**/*.mjs', '*.config.{ts,mjs}', '.storybook/**/*.ts'],
		...tseslint.configs.disableTypeChecked,
		// After the spread: disableTypeChecked replaces languageOptions wholesale.
		languageOptions: { globals: globals.node },
		rules: {
			...tseslint.configs.disableTypeChecked.rules,
			// Flat configs import plugin defaults that also carry named exports;
			// the warning fires on every one and means nothing here.
			'import-x/no-named-as-default': 'off',
			'import-x/no-named-as-default-member': 'off',
		},
	},

	prettier,
)
