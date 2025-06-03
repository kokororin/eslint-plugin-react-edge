import eslintPluginReactEdge from 'eslint-plugin-react-edge';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  tseslint.configs.recommended,
  {
    files: ['src/**/*.tsx', 'src/**/*.ts'],
    plugins: {
      'react-edge': eslintPluginReactEdge,
    },
    rules: {
      'react-edge/var-naming': 'error',
      'react-edge/prefer-named-property-access': 'error',
    },
  },
);
