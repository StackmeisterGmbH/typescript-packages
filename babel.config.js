module.exports = api => {
  api.cache(true)
  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: '> 0.25%, not dead',
            node: '8.9',
          },
        },
      ],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    ignore: ['node_modules', '**/*.test.tsx', '**/*.test.ts', '**/*.story.tsx'],
  }
}
