module.exports = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['src/styles/custom-media.css'],
    },
    'postcss-preset-env': {
      autoprefixer: {},
      features: {
        'custom-media-queries': true,
        // CSS variables aren't compiled because it's not safe.
        'custom-properties': false,
        'nesting-rules': true,
      },
    },
  },
}
