module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'esnext',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    'import/no-unresolved': {
      caseSensitive: true
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      },
      alias: {
        map: [
          ['@', './src/'],
          ['~@', './src/']
        ],
        extensions: ['.js', '.ts', '.tsx', '.less', '.json', '.vue']
      }
    }
  },
  plugins: ['import', 'prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'warn',
    'vue/script-setup-uses-vars': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/no-undef-components': [
      'error',
      {
        ignorePatterns: []
      }
    ],
    'import/no-unresolved': 'error',
    'no-empty': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false
        }
      }
    ],
    '@typescript-eslint/no-empty-interface': 'off',
    'no-useless-escape': 'off'
  },
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      // parser: '@babel/eslint-parser',
      plugins: ['import', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'prettier'
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
