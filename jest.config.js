/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 * @see https://jestjs.io/docs/configuration
 */
export default {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/types/**/*.ts'],
  transform: {
    '^.+.ts$': ['ts-jest', {}],
  },
};
