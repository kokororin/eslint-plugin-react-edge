import type { TSESTree } from '@typescript-eslint/typescript-estree';
import type { RuleContext, RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { createRule } from '../utils';

export const RULE_NAME = 'prefer-named-property-access';
export type MessageIds = 'illegalReactPropertyAccess' | 'disallowImportReactEvent';
export type Options = [];

/**
 * Ensures that passed key is imported from 'react' package.
 * @param  context - The rule context
 * @param  fixer - The rule fixer
 * @param  key - The key to import
 * @yields The fix to apply
 */
function* updateImportStatement(context: RuleContext<MessageIds, Options>, fixer: RuleFixer, key: string) {
  const sourceCode = context.sourceCode;
  const importNode = sourceCode.ast.body.find(
    (node): node is TSESTree.ImportDeclaration =>
      node.type === AST_NODE_TYPES.ImportDeclaration && node.source.value === 'react',
  );

  // No import from 'react' - create import statement
  if (!importNode) {
    yield fixer.insertTextBefore(
      sourceCode.ast.body[0],
      `import { ${key} } from 'react';\n`,
    );

    return;
  }

  // Only default import from 'react' - add named imports section
  if (
    importNode.specifiers.length === 1
    && importNode.specifiers[0].type === AST_NODE_TYPES.ImportDefaultSpecifier
  ) {
    yield fixer.insertTextAfter(importNode.specifiers[0], `, { ${key} }`);

    return;
  }

  const alreadyImportedKeys = importNode.specifiers
    .filter((specifier): specifier is TSESTree.ImportSpecifier => (
      specifier.type === AST_NODE_TYPES.ImportSpecifier
    ))
    .map((specifier) => {
      if (specifier.imported.type === AST_NODE_TYPES.Identifier) {
        return specifier.imported.name;
      }
      return undefined;
    })
    .filter((name): name is string => name !== undefined);

  // Named imports section is present and current key is already imported - do nothing
  if (alreadyImportedKeys.includes(key)) {
    return;
  }

  // Named imports section is present and current key is not imported yet - add it to named imports section
  const lastSpecifier = importNode.specifiers[importNode.specifiers.length - 1];
  if (!lastSpecifier) {
    // No last specifier - insert at the beginning
    yield fixer.insertTextBefore(
      sourceCode.ast.body[0],
      `import { ${key} } from 'react';\n`,
    );
    return;
  }

  yield fixer.insertTextAfter(lastSpecifier, `, ${key}`);
}

export default createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Enforce importing each member of React namespace separately instead of accessing them through React namespace',
    },
    messages: {
      illegalReactPropertyAccess:
        'Illegal React property access: {{name}}. Use named import instead.',
      disallowImportReactEvent:
        'Disallow importing React event types to avoid conflicts with global event types.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    return {
      // Analyze TS types declarations
      TSQualifiedName(node: TSESTree.TSQualifiedName) {
        // Do nothing to types that are ending with 'Event' as they will overlap with global event types otherwise
        if (
          !('name' in node.left)
          || node.left.name !== 'React'
          || !('name' in node.right)
          || node.right.name.endsWith('Event')
        ) {
          return;
        }

        context.report({
          node,
          messageId: 'illegalReactPropertyAccess',
          data: {
            name: node.right.name,
          },
          * fix(fixer) {
            yield fixer.replaceText(node, node.right.name);
            yield* updateImportStatement(context, fixer, node.right.name);
          },
        });
      },

      // Analyze expressions for React.* access
      MemberExpression(node: TSESTree.MemberExpression) {
        if (
          node.object.type !== AST_NODE_TYPES.Identifier
          || node.object.name !== 'React'
          || node.property.type !== AST_NODE_TYPES.Identifier
        ) {
          return;
        }

        const propertyName = node.property.name;

        context.report({
          node,
          messageId: 'illegalReactPropertyAccess',
          data: {
            name: propertyName,
          },
          * fix(fixer) {
            yield fixer.replaceText(node, propertyName);
            yield* updateImportStatement(context, fixer, propertyName);
          },
        });
      },

      // Analyze import statements for React.Event imports
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value !== 'react' && node.source.value !== 'preact') {
          return;
        }

        node.specifiers.forEach((specifier) => {
          if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier
            && specifier.imported.type === AST_NODE_TYPES.Identifier
            && specifier.imported.name.endsWith('Event')
          ) {
            context.report({
              node: specifier,
              messageId: 'disallowImportReactEvent',
            });
          }
        });
      },
    };
  },
});
