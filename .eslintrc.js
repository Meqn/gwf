// https://eslint.org/docs/user-guide/configuring
// http://eslint.cn/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: "eslint:recommended",
  // add your custom rules here
  rules: {
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow async-await
    'generator-star-spacing': 'off',
    'no-unexpected-multiline': 0,
    'no-multiple-empty-lines': 0,
    'space-before-function-paren': 0,
    'no-trailing-spaces': 0,  // 行尾空白
    'object-property-newline': 0,
    'handle-callback-err': 0,
    'camelcase': 0,
    'no-unused-vars': 0,
    'no-console': 0,
  },
  globals: {
    document: true,
    location: true,
    window: true,
  }
}