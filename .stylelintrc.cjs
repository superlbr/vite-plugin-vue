module.exports = {
  plugins: ['stylelint-prettier'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-recommended-scss'
  ],
  rules: {
    'at-rule-no-unknown': null,
    'font-family-no-missing-generic-family-keyword': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local']
      }
    ],
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/[a-zA-Z-]+/']
      }
    ],
    'selector-class-pattern': ['[0-9a-zA-Z-_]+'],
    'scss/function-no-unknown': null,
    'prettier/prettier': true,
    'at-rule-empty-line-before': null,
    'keyframes-name-pattern': null
  },
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ]
};
