# eslint-plugin-react-edge

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

> ESLint plugin with niche rules for React projects

## Why "react-edge"?

The name `react-edge` reflects that these rules are niche or uncommon—ones not typically found in existing React ESLint plugins. They were created to fill gaps encountered in real-world projects.

## Rules Overview

- **var-naming**: Enforces naming conventions for variables and functions, with intelligent handling of React component naming. Solves the [typescript-eslint#2607](https://github.com/typescript-eslint/typescript-eslint/issues/2607) problem where `@typescript-eslint/naming-convention` cannot distinguish React components from regular functions, leading to overly permissive rules.

- **prefer-named-property-access**: Enforces importing React members separately instead of accessing them through the React namespace, and prevents importing React event types that conflict with global DOM event types.

See the complete [Rules Documentation](./src/rules) for detailed explanation and examples of each rule.

## Installation

```bash
# npm
npm install eslint-plugin-react-edge --save-dev

# yarn
yarn add -D eslint-plugin-react-edge

# pnpm
pnpm add -D eslint-plugin-react-edge
```

## Usage

### ESLint Flat Config (eslint.config.js)

```js
import eslintReactEdge from 'eslint-plugin-react-edge';

export default [
  // configuration included in plugin
  ...reactEdge.configs.recommended,
  // other configuration objects...
  {
    plugins: {
      'react-edge': eslintReactEdge,
    },
    rules: {
      'react-edge/var-naming': ['error', {
        funcFormat: ['camelCase'],
        varFormat: ['camelCase', 'UPPER_CASE'],
        excludeNames: [],
        excludeFuncs: [],
        excludeTypes: [],
      }],
      'react-edge/prefer-named-property-access': 'error',
    },
  },
];
```

## Requirements

- ESLint ^9.6.0
- Node.js ^18.18.0

## License

[MIT](./LICENSE) License © 2021-PRESENT [kokororin](https://github.com/kokororin)

[npm-version-src]: https://img.shields.io/npm/v/eslint-plugin-react-edge?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/eslint-plugin-react-edge
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-plugin-react-edge?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/eslint-plugin-react-edge
