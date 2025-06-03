import { ESLintUtils } from '@typescript-eslint/utils';

const docBaseUrl
  = 'https://github.com/kokororin/eslint-plugin-react-edge/blob/master/src/rules/';

export const createRule = ESLintUtils.RuleCreator(name =>
  `${docBaseUrl}${name}.md`,
);

/**
 * check if a value is a valid camel case string
 * @param value - value to check
 */
export function isCamelCase(value: string) {
  return /^[a-z][a-zA-Z0-9]*$/.test(value);
}

/**
 * check if a value is a valid pascal case string
 * @param value - value to check
 */
export function isPascalCase(value: string) {
  return /^[A-Z][A-Za-z0-9]*$/.test(value);
}

/**
 * check if a value is a valid upper case string
 * @param value - value to check
 */
export function isUpperCase(value: string) {
  return /^[A-Z0-9_]+$/.test(value);
}
