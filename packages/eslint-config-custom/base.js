const getFilePath = require('./utils').getFilePath
const perfRules = require('./perfRules')

let currentProject

const isProduction = process.env.NODE_ENV === 'production'
const ignoreInProduction = ['*.stories.ts', '*.stories.tsx']

try {
  currentProject = [getFilePath(process.cwd(), 'tsconfig.json')]
} catch (e) {
  currentProject = []
}

const project = [`${__dirname}/../*/tsconfig.json`, ...currentProject]

module.exports = {
  env: {
    amd: true,
    browser: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:perfectionist/recommended-natural',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'turbo',
  ],
  globals: {
    JSX: true,
    React: true,
  },
  ignorePatterns: [
    'node_modules',
    'dist',
    'turbo/generators',
    '.eslintrc.js',
    '__tests__/*',
    'prettier.config.js',
    'jest.config.js',
    ...(isProduction ? ignoreInProduction : []),
  ],
  overrides: [
    {
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
      files: ['**/*.mjs', '**/.eslintrc.js'],
      parser: null,
      plugins: ['prettier'],
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'prettier',
    'perfectionist',
    '@typescript-eslint',
    'jest',
    'eslint-plugin-import',
  ],
  rules: {
    ...perfRules,
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unresolved': 'error', // @todo Miu: delete this line
    'prettier/prettier': ['error', {}],
    'react/prop-types': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        project,
      },
      typescript: {
        project,
      },
    },
  },
}
