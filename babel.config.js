const presets = [
  [
    '@babel/env',
    {
      corejs: '2',
      useBuiltIns: 'usage',
    },
  ],
]

const env = {
  debug: {
    sourceMaps: 'inline',
    retainLines: true,
  },
}

module.exports = { presets, env }
