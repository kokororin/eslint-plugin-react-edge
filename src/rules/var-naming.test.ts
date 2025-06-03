import type { RuleOptions } from './var-naming';
import * as parserTs from '@typescript-eslint/parser';

import { run } from 'eslint-vitest-rule-tester';
import rule, { RULE_NAME } from './var-naming';

const defaultOptions: Partial<RuleOptions> = {
  funcFormat: ['camelCase'],
  varFormat: ['camelCase'],
};

const valids = [
  {
    code: `const normal = () => {
  return '123';
};`,
    options: [defaultOptions],
  },
  {
    code: `const Dummy = () => {
  return <div>123</div>;
};`,
    options: [defaultOptions],
  },
  {
    code: `const Dummy: FC<DummyProps> = () => {
    return <div>123</div>;
  };`,
    options: [defaultOptions],
  },
  {
    code: `function Dummy() {
  return <div>123</div>;
};`,
    options: [defaultOptions],
  },
  {
    code: `const myVar = 123;`,
    options: [defaultOptions],
  },
  {
    code: `const MyContext = createContext({});`,
    options: [defaultOptions],
  },
  {
    code: `const MyContext = React.createContext({});`,
    options: [defaultOptions],
  },
  {
    code: 'const MyComponent = forwardRef<MyHandles, MyProps>() as CompoundedMy;',
    options: [defaultOptions],
  },
  {
    code: `const MyComponent: FC<{}> = () => {
    const helperRef = useRef();
    return <div>123</div>;
  }`,
    options: [defaultOptions],
  },
  {
    code: `const MyEvent = new Event('click');`,
    options: [defaultOptions],
  },
  {
    code: `const Default: StoryObj<typeof LoadingWrapper> = {};`,
    options: [defaultOptions],
  },
  {
    code: `const Component = () => <div />`,
    options: [defaultOptions],
  },
  {
    code: `const ComponentToRender = componentMapping[row.params[0]] || (() => <div />)`,
    options: [defaultOptions],
  },
  {
    code: `const MyVar = createVar()`,
    options: [{
      ...defaultOptions,
      excludeNames: ['MyVar'],
    }],
  },
  {
    code: `const MyVar = stringEnum('MY')`,
    options: [{
      ...defaultOptions,
      excludeFuncs: ['stringEnum'],
    }],
  },
  {
    code: `const MyVar: MyType = 'MY'`,
    options: [{
      ...defaultOptions,
      excludeTypes: ['MyType'],
    }],
  },
  {
    code: `const SHGetPathFromIDList = lib.func(
    'bool SHGetPathFromIDList(void* pidl, char* pszPath)'
  );`,
    options: [{
      ...defaultOptions,
      excludeFuncs: ['func'],
    }],
  },
  {
    code: `const SHGetPathFromIDList = lib.func(
    'bool SHGetPathFromIDList(void* pidl, char* pszPath)'
  ) as KoffiFunction;`,
    options: [{
      ...defaultOptions,
      excludeFuncs: ['func'],
    }],
  },
];
const invalids = [
  {
    code: `const Normal = () => {
  return '123';
};`,
    errors: [{ messageId: 'invalidFuncNaming' }],
    options: [defaultOptions],
  },
  {
    code: `const MyVar = 123;`,
    errors: [{ messageId: 'invalidVarNaming' }],
    options: [defaultOptions],
  },
  {
    code: `const MyVar: MyType;`,
    errors: [{ messageId: 'invalidVarNaming' }],
    options: [defaultOptions],
  },
  {
    code: `const MyComponent: FC<{}> = () => {
    const HelperRef = useRef();
    return <div>123</div>;
  }`,
    errors: [{ messageId: 'invalidVarNaming' }],
    options: [defaultOptions],
  },
  {
    code: `const SHGetPathFromIDList = lib.func(
    'bool SHGetPathFromIDList(void* pidl, char* pszPath)'
  );`,
    errors: [{ messageId: 'invalidVarNaming' }],
    options: [defaultOptions],
  },
  {
    code: `const SHGetPathFromIDList = lib.func(
    'bool SHGetPathFromIDList(void* pidl, char* pszPath)'
  ) as KoffiFunction;`,
    errors: [{ messageId: 'invalidVarNaming' }],
    options: [defaultOptions],
  },
];

await run({
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
