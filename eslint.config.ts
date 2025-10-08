import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// Workaround for typescript-eslint parser tsconfigRootDir resolution in paths with spaces on Windows
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const tsconfigRootDir = __dirname
const projectTsConfig = resolve(tsconfigRootDir, 'tsconfig.eslint.json')

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    languageOptions: {
      parserOptions: {
        // important: supply explicit absolute root dir & project for typescript-eslint
        project: projectTsConfig,
        tsconfigRootDir,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'postcss.config.cjs']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
)
