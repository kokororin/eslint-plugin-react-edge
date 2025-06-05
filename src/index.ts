import type { TSESLint } from '@typescript-eslint/utils';
import { name, version } from '../package.json';
import { rules } from './rules';

const reactEdge: TSESLint.FlatConfig.Plugin = {
  meta: {
    name,
    version,
  },
  rules,
};

const allRules: Record<string, TSESLint.FlatConfig.RuleEntry> = Object.fromEntries(
  Object.keys(rules).map(name => [
    `react-edge/${name}`,
    'error',
  ]),
);

const configs = {
  recommended: createConfig(allRules, 'react-edge/recommended'),
};

function createConfig(rules: TSESLint.FlatConfig.Rules, configName: string) {
  return {
    name: configName,
    plugins: {
      'react-edge': reactEdge,
    },
    rules,
  };
}

const allConfigs = {
  ...reactEdge,
  configs,
};

export default allConfigs;
