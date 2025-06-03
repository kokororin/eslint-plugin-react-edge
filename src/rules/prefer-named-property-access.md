# prefer-named-property-access

Enforce importing each member of the React namespace separately instead of accessing them through the React namespace, and disallow importing React event types to avoid conflicts with global event types.

## Rule Details

This rule has two main purposes:

1. **Named Imports**: Encourages cleaner and more tree-shakeable imports by requiring developers to use named imports from React (or Preact) instead of accessing properties from the React object.

2. **Event Type Conflicts**: Prevents importing React event types (like `MouseEvent`, `KeyboardEvent`) that would conflict with global DOM event types of the same name.

### Named Import Enforcement

<!-- eslint-skip -->
```tsx
// 👎 bad
const MyComponent = () => {
  const ref = React.useRef();
  return <React.Fragment>Text</React.Fragment>;
};

type Props = React.FC<{ id: string }>;
```

<!-- eslint-skip -->
```tsx
// 👍 good
import { useRef, Fragment } from 'react';

const MyComponent = () => {
  const ref = useRef();
  return <Fragment>Text</Fragment>;
};

type Props = FC<{ id: string }>;
```

### Event Type Conflict Prevention

<!-- eslint-skip -->
```tsx
// 👎 bad - conflicts with global MouseEvent
import { MouseEvent, KeyboardEvent } from 'react';

function handleClick(e: MouseEvent) {
  // This creates ambiguity: React.MouseEvent vs global MouseEvent
}
```

<!-- eslint-skip -->
```tsx
// 👍 good - use global types or be explicit
function handleClick(e: React.MouseEvent) {
  // Clear which MouseEvent type you mean
}

// Or use global types for DOM events
function handleNativeClick(e: MouseEvent) {
  // Uses global MouseEvent type
}
```
