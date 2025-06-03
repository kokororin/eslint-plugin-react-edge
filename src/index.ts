import type { Linter } from 'eslint';
import { version } from '../package.json';
import * as preferNamedPropertyAccess from './rules/prefer-named-property-access';
import * as varNaming from './rules/var-naming';

const plugin = {
  meta: {
    name: 'react-edge',
    version,
  },
  rules: {
    [preferNamedPropertyAccess.RULE_NAME]: preferNamedPropertyAccess.default,
    [varNaming.RULE_NAME]: varNaming.default,
  },
};

type RuleDefinitions = typeof plugin['rules'];

export type RuleOptions = {
  [K in keyof RuleDefinitions]: RuleDefinitions[K]['defaultOptions']
};

export type Rules = {
  [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>
};

export default plugin;
