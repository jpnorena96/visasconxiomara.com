import globals from 'globals'
import pluginJs from '@eslint/js'
export default [
  { ignores:['dist'] },
  { files:['**/*.{js,jsx}'], languageOptions:{ globals: globals.browser }, rules:{ 'no-unused-vars':['warn',{ 'argsIgnorePattern':'^_' }]} },
  pluginJs.configs.recommended,
]
