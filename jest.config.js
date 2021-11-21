module.exports = {
  reporters: ['default'],
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/projects/ngrx-store-formsync'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-formsync/src/test.ts'],
};
