import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { createRule, isCamelCase, isPascalCase, isUpperCase } from '../utils';

export const RULE_NAME = 'var-naming';

export type MessageIds = 'invalidFuncNaming' | 'invalidReactFCNaming' | 'invalidVarNaming';
export type NamingFormat = 'camelCase' | 'PascalCase' | 'UPPER_CASE';

export interface RuleOptions {
  funcFormat: NamingFormat[];
  varFormat: NamingFormat[];
  excludeNames: string[];
  excludeFuncs: string[];
  excludeTypes: string[];
}

export type Options = [RuleOptions];

interface ValidateParams {
  node: TSESTree.Node;
  name: string;
}

type ValidateType = 'func' | 'var';

const reactGlobalFuncs = new Set([
  'createContext',
  'forwardRef',
  'lazy',
  'memo',
]);

const reactFCTypes = new Set([
  'FC',
  'FunctionComponent',
  'VFC',
  'VoidFunctionComponent',
]);

const defaultExcludeTypes = ['StoryObj', 'StoryFn'];
const defaultExcludeNames = ['^(__dirname|__filename)$', '(.*)Event$'];

const defaultOptions: Options = [
  {
    funcFormat: ['camelCase'],
    varFormat: ['camelCase', 'UPPER_CASE'],
    excludeNames: [],
    excludeFuncs: [],
    excludeTypes: [],
  },
];

export default createRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce variable and function naming convention',
    },
    schema: [
      {
        type: 'object',
        properties: {
          funcFormat: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            },
          },
          varFormat: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            },
          },
          excludeNames: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          excludeFuncs: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          excludeTypes: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
    messages: {
      invalidFuncNaming:
        'Invalid function naming for non-React component, expected {{formats}}',
      invalidReactFCNaming:
        'Invalid naming convention for React functional component, expected PascalCase',
      invalidVarNaming: 'Invalid variable naming, expected {{formats}}',
    },
  },
  defaultOptions,

  create(context) {
    const options = {
      ...defaultOptions[0],
      ...context.options[0],
    };

    const funcFormat = options.funcFormat;
    const varFormat = options.varFormat;
    const excludeNames = [...defaultExcludeNames, ...(options.excludeNames ?? [])];
    const excludeFuncs = options.excludeFuncs;
    const excludeTypes = [...defaultExcludeTypes, ...(options.excludeTypes ?? [])];

    function validate(type: ValidateType, { node, name }: ValidateParams): void {
      let isPass = false;
      let formats: NamingFormat[];
      let messageId: MessageIds;

      switch (type) {
        case 'func':
          formats = funcFormat;
          messageId = 'invalidFuncNaming';
          break;
        case 'var':
          formats = varFormat;
          messageId = 'invalidVarNaming';
          break;
      }

      for (const format of formats) {
        switch (format) {
          case 'camelCase':
            if (isCamelCase(name)) {
              isPass = true;
            }
            break;
          case 'PascalCase':
            if (isPascalCase(name)) {
              isPass = true;
            }
            break;
          case 'UPPER_CASE':
            if (isUpperCase(name)) {
              isPass = true;
            }
            break;
        }
      }

      if (!isPass) {
        context.report({
          node,
          messageId,
          data: {
            formats: formats.join(', '),
          },
        });
      }
    }

    function checkJSXElement(node: TSESTree.Node | null | undefined): boolean {
      if (!node) {
        return false;
      }

      if (node.type === AST_NODE_TYPES.JSXElement || node.type === AST_NODE_TYPES.JSXFragment) {
        return true;
      }

      if (node.type === AST_NODE_TYPES.BlockStatement) {
        for (const statement of node.body) {
          if (statement.type === AST_NODE_TYPES.ReturnStatement) {
            if (checkJSXElement(statement.argument)) {
              return true;
            }
          } else if (checkJSXElement(statement)) {
            return true;
          }
        }
      }

      if (
        node.type === AST_NODE_TYPES.ArrowFunctionExpression
        || node.type === AST_NODE_TYPES.FunctionExpression
      ) {
        return checkJSXElement(node.body);
      }

      return false;
    }

    function getTypeReference(node: TSESTree.VariableDeclarator): string | undefined {
      if (
        node.id.typeAnnotation?.typeAnnotation
        && node.id.typeAnnotation.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference
        && node.id.typeAnnotation.typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier
      ) {
        const typeName = node.id.typeAnnotation.typeAnnotation.typeName.name;
        return typeName.split('.').pop();
      }
      return undefined;
    }

    return {
      FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
        if (node.id) {
          const fnName = node.id.name;
          const isReactComponent = checkJSXElement(node.body);
          if (!isReactComponent) {
            validate('func', { node, name: fnName });
          }
        }
      },

      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        if (
          node.id != null
          && node.init
          && (node.init.type === AST_NODE_TYPES.FunctionExpression
            || node.init.type === AST_NODE_TYPES.ArrowFunctionExpression)
        ) {
          const fnName = ('name' in node.id) ? node.id.name : '';
          if (!fnName) {
            return;
          }

          let isReactComponent = checkJSXElement(node.init.body);

          const typeName = getTypeReference(node);
          if (typeName != null && reactFCTypes.has(typeName)) {
            isReactComponent = true;
          }
          if (!isReactComponent) {
            validate('func', { node, name: fnName });
          }
        } else if (
          node.id != null
          && node.init
          && node.init.type === AST_NODE_TYPES.LogicalExpression
        ) {
          const varName = ('name' in node.id) ? node.id.name : '';
          if (!varName) {
            return;
          }

          const parts = [node.init.left, node.init.right];
          let partIsReactComponent = false;
          for (const part of parts) {
            if (
              part.type === AST_NODE_TYPES.FunctionExpression || part.type === AST_NODE_TYPES.ArrowFunctionExpression
            ) {
              const isReactComponent = checkJSXElement(part.body);
              if (isReactComponent) {
                partIsReactComponent = true;
              }
            }
          }

          if (!partIsReactComponent) {
            validate('var', { node, name: varName });
          }
        } else if (node.id != null && 'name' in node.id) {
          const varName = node.id.name;

          for (const excludeRegex of excludeNames) {
            if (new RegExp(excludeRegex).test(varName)) {
              return;
            }
          }

          const typeName = getTypeReference(node);
          if (typeName != null) {
            for (const excludeRegex of excludeTypes) {
              if (new RegExp(excludeRegex).test(typeName)) {
                return;
              }
            }
          }

          if (node.init) {
            let calleeName: string | undefined;
            let shouldCheckReact = false;

            let initNode: TSESTree.CallExpression | undefined;
            if (node.init.type === AST_NODE_TYPES.CallExpression) {
              initNode = node.init;
            } else if (
              node.init.type === AST_NODE_TYPES.TSAsExpression
              && node.init.expression != null
              && node.init.expression.type === AST_NODE_TYPES.CallExpression
            ) {
              initNode = node.init.expression;
            }

            if (initNode) {
              shouldCheckReact = true;
              if (initNode.callee.type === AST_NODE_TYPES.Identifier) {
                calleeName = initNode.callee.name;
              } else if (
                initNode.callee.type === AST_NODE_TYPES.MemberExpression
                && initNode.callee.property.type === AST_NODE_TYPES.Identifier
              ) {
                calleeName = initNode.callee.property.name;
              }
            }

            if (calleeName != null) {
              for (const excludeRegex of excludeFuncs) {
                if (new RegExp(excludeRegex).test(calleeName)) {
                  return;
                }
              }
            }

            if (shouldCheckReact) {
              if (calleeName == null) {
                return;
              }

              if (
                reactGlobalFuncs.has(calleeName)
                || reactGlobalFuncs.has(calleeName.split('.').pop() ?? '')
              ) {
                return;
              }
            }
          }
          validate('var', { node, name: varName });
        }
      },
    };
  },
});
