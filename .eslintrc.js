module.exports = {
  env: {
    browser: true,
    jest: true,
    es6: true,
    es2021: true,
  },
  settings: {
    'import/extensions': ['.js', '.jsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  extends: ['airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['node', 'prettier'],
  rules: {
    quotes: ['error', 'single'],
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    semi: ['error', 'never'],
  },
}
