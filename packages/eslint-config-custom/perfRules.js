/* eslint-disable perfectionist/sort-objects */
const getFile = require('./utils').getFile

let packageJson, internalPaths
const packages = [
  '@edw/base',
  '@edw/drupal',
  'tsconfig',
  'eslint-config-custom',
]

try {
  packageJson = getFile(process.cwd(), 'package.json')
  internalPaths = packageJson.internalPaths || []
} catch (e) {
  internalPaths = []
}

const perfRules = {
  'perfectionist/sort-array-includes': 'error',
  'perfectionist/sort-enums': 'error',
  'perfectionist/sort-exports': 'error',
  'perfectionist/sort-imports': [
    'error',
    {
      groups: [
        'server',
        ['type', 'parent-type', 'sibling-type', 'index-type', 'internal-type'],
        'react',
        ['builtin', 'external'],
        'config',
        'packages',
        'internal',
        ['parent', 'sibling', 'index'],
        'side-effect',
        'files',
        'icons',
        'object',
        'unknown',
      ],
      'custom-groups': {
        type: {
          react: ['react react-* next'],
        },
        value: {
          'internal-type': internalPaths.reduce((acc, app) => {
            acc.push(`${app}/**/@types`)
            acc.push(`${app}/**/@types/**`)
            return acc
          }, []),
          react: ['react', 'react-*'],
          config: ['**/config', '*/config/**'],
          packages: packages.reduce((acc, pkg) => {
            acc.push(`${pkg}`)
            acc.push(`${pkg}/**`)
            return acc
          }, []),
          files: ['*.css', '*.png', '*.jpg', '*.jpeg', '*.json'],
          icons: ['@react-icons/**'],
          server: ['server-only'],
        },
      },
      'internal-pattern': internalPaths.reduce(
        (acc, app) => {
          acc.push(app)
          acc.push(`${app}/**`)
          return acc
        },
        ['~/**'],
      ),
      'newlines-between': 'always',
    },
  ],
  'perfectionist/sort-interfaces': 'error',
  'perfectionist/sort-jsx-props': [
    'error',
    {
      type: 'natural',
      order: 'asc',
      groups: [
        'id',
        'initial',
        'exit',
        'animate',
        'transition',
        'className',
        'unknown',
        'multiline',
        'callback',
        'shorthand',
      ],
      'custom-groups': {
        id: ['key', 'id', 'name'],
        animate: 'animate',
        callback: 'on*',
        className: 'className',
        exit: 'exit',
        initial: 'initial',
        transition: 'transition',
      },
    },
  ],
  'perfectionist/sort-named-exports': 'error',
  'perfectionist/sort-named-imports': 'error',
  'perfectionist/sort-object-types': 'error',
  'perfectionist/sort-objects': [
    'error',
    {
      'custom-groups': {
        id: 'id',
        key: 'key',
      },
      groups: ['id', 'key', 'unknown'],
      order: 'asc',
      'partition-by-comment': false,
      type: 'natural',
    },
  ],
  'perfectionist/sort-union-types': 'error',
  'jsx-a11y/alt-text': 'off',
}

module.exports = perfRules
