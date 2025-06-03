import * as parserTs from '@typescript-eslint/parser';
import { run } from 'eslint-vitest-rule-tester';

import rule, { RULE_NAME } from './prefer-named-property-access';

const valids = [
  {
    code: `import React from "react";`,
  },
  {
    code: `import React, { FC } from "react";
const App: FC = () => <div />;`,
  },
  {
    code: `import React from "react";
const handleClick = (event: React.MouseEvent) => {};`,
  },
];

const invalids = [
  {
    code: `import React from "react";
const App: React.FC = () => <div />;`,
    errors: [{ messageId: 'illegalReactPropertyAccess' }],
  },
  {
    code: `import React, { ChangeEvent } from "react";`,
    errors: [{ messageId: 'disallowImportReactEvent' }],
  },
];

run({
  name: RULE_NAME,
  rule,
  languageOptions: {
    parser: parserTs,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  valid: valids,
  invalid: invalids,
});
