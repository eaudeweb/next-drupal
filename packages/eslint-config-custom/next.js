const config = require('./base')

module.exports = {
  ...config,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:perfectionist/recommended-natural',
    'next/core-web-vitals',
    'next',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
}
