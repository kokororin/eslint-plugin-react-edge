import antfu from '@antfu/eslint-config';
import { tsImport } from 'tsx/esm/api';

export default antfu({
  stylistic: {
    semi: true,
  },
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
}).onResolved(async (configs) => {
  const reactEdge = await tsImport('./src/index.ts', import.meta.url).then(r => r.default).catch(() => null);
  if (!reactEdge) {
    return;
  }

  configs.push({
    files: ['playground/**/*.{ts,tsx}'],
    plugins: {
      'react-edge': reactEdge,
    },
    rules: {
      'react-edge/var-naming': 'error',
      'react-edge/prefer-named-property-access': 'error',
    },
  });
});
