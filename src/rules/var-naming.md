## var-naming

Enforces naming conventions for variables and functions, with specific handling for React functional components.

### 🤔 Why This Rule?

Naming React function components has been a persistent pain point in React development. While React best practices dictate using PascalCase for components and camelCase for regular functions, the technical reality is that React function components are just regular functions that return JSX, making it challenging to automatically detect and enforce naming conventions.

This rule was created to address the limitations described in [typescript-eslint/typescript-eslint#2607](https://github.com/typescript-eslint/typescript-eslint/issues/2607), where developers struggled with the built-in `@typescript-eslint/naming-convention` rule.

### 💡 The Problem with `@typescript-eslint/naming-convention`

The standard TypeScript ESLint naming convention rule cannot distinguish between React components and regular functions because, as the maintainers stated: *"There's nothing special about a react functional component. It's just a function"*.

**Problematic workaround:**
```json
{
  "@typescript-eslint/naming-convention": [
    "warn",
    {
      "selector": "function",
      "format": ["PascalCase", "camelCase"]
    }
  ]
}
```

**Why this doesn't work well:**

<!-- eslint-skip -->
```tsx
// ❌ This allows ALL functions to use PascalCase
const OnClick = () => { /* not a component */ }; // No warning!
function ProcessData() { /* utility function */ }  // No warning!

// ✅ Only React components should use PascalCase
const MyComponent = () => <div />; // This is correct
```

### 🎯 How This Rule Solves It

This rule addresses this challenge through configurable options that allow developers to:
- Enforce camelCase for regular functions
- Enforce PascalCase for React components (identified through return types or type annotations)
- Provide flexible naming rules for variables
- Handle special cases through exclusion patterns

**Smart Detection:**
- Uses TypeScript type information when available
- Recognizes JSX return types (`: JSX.Element`)
- Detects React component type annotations (`: React.FC`)
- Falls back to sensible defaults for untyped components

---

### 📝 Examples

<!-- eslint-skip -->
```tsx
// 👎 Bad Examples

// Function names not in camelCase
function DoSomething() {}
const FetchData = () => {};
const load_config = function () {};

// Constant not in UPPER_CASE
const apiKey = 'abc123';

// Variable not in camelCase
const UserName = 'Alice';

// React component not in PascalCase
const myComponent = () => <div />;
```

<!-- eslint-skip -->
```tsx
// 👍 Good Examples

// Regular functions in camelCase
function doSomething() {}
const fetchData = () => {};
const loadConfig = function () {};

// Constants in UPPER_CASE
const API_KEY = 'abc123';

// Variables in camelCase
const userName = 'Alice';

// React components in PascalCase
// Using return type
const MyComponent = (): JSX.Element => <div />;
// Using type annotation
type Props = { name: string };
function UserProfile(props: Props) {
  return <div>{props.name}</div>;
}
// Simple component without explicit typing
const Button = ({ children }) => <button>{children}</button>;
```

### ⚙️ Configuration Options

```json
{
  "funcFormat": ["camelCase"],
  "varFormat": ["camelCase", "UPPER_CASE"],
  "excludeNames": [],
  "excludeFuncs": [],
  "excludeTypes": []
}
```

#### Option Details

- `funcFormat`: Expected naming formats for non-React functions. Default: `['camelCase']`
- `varFormat`: Expected naming formats for variables. Default: `['camelCase', 'UPPER_CASE']`
- `excludeNames`: Regex patterns to exclude certain variable names from validation. Default: `['^(__dirname|__filename)$', '(.*)Event$']`
- `excludeFuncs`: Regex patterns to exclude function calls from validation. Default: `[]`
- `excludeTypes`: Regex patterns to exclude specific variable type annotations from validation. Default: `['StoryObj', 'StoryFn']`
