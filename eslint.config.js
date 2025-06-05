// @ts-check
import antfu from '@antfu/eslint-config';
import { tsImport } from 'tsx/esm/api';

export default antfu({
  stylistic: {
    semi: true,
    overrides: {
      'style/brace-style': ['error', '1tbs'],
    },
  },
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
}, {
  files: ['**/*.{ts,tsx,js}'],
  rules: {
    'style/max-len': ['error', {
      code: 120,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreUrls: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: true,
      ignoreStrings: true,
    }],
  },
}).onResolved(async (configs) => {
  const reactEdge = await tsImport('./src/index.ts', import.meta.url)
    .then(r => r.default)
    .catch(() => null);
  if (!reactEdge) {
    return;
  }

  configs.push({
    files: ['playground/**/*.{ts,tsx}'],
    ...reactEdge.configs.recommended,
  });
});
