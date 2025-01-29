import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  eslintPluginUnicorn.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-empty-pattern': 'warn',
      'no-empty': 'warn',
      'no-param-reassign': 'warn',
      'no-unreachable': 'warn',
      'no-var': 'warn',
      'no-warning-comments': 'warn',
      'prefer-const': 'warn',
      eqeqeq: 'warn',

      'prettier/prettier': 'warn',

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-optional-catch-binding': 'warn',
      'unicorn/no-empty-file': 'warn',
      'unicorn/prefer-set-has': 'warn',
      /**
       * There are situations where you might prefer to use `null` because
       * `undefined` doesn't fit. For example, when merging one object into another
       * with lodash's merge function, it completely ignores properties with
       * `undefined` values and you may want to keep those properties.
       */
      'unicorn/no-null': 'off',

      '@typescript-eslint/no-magic-numbers': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-floating-promises': ['warn', { ignoreIIFE: true }],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
          allowFunctionsWithoutTypeParameters: false,
          allowedNames: [],
          allowIIFEs: false,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/typedef': [
        'warn',
        {
          arrayDestructuring: true,
          objectDestructuring: true,
          arrowParameter: true,
          memberVariableDeclaration: true,
          parameter: true,
          propertyDeclaration: true,
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: true,
        },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-for-in-array': 'warn',
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      /**
       * It's better to explicitly define the type. The implementation may change in the future,
       * and you can forget to add the type if it's not there. Also, you may need to create a variable
       * that could have several types and in this case it's better to explicitly define what are those types.
       */
      '@typescript-eslint/no-inferrable-types': 'off',
      // /**
      //  * The nullish coalescing operator only coalesces when the checked value is null or
      //  * undefined, but what if you want to coalesce on any falsy value like an empty string?
      //  * In that case you would need "||". This requires {"strictNullChecks": true}
      //  */
      // '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
  {
    files: ['**/*.js'],
    // TS rules are applied by default so we have to disable the
    // type-checking rules for JS files.
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
);
