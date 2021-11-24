module.exports = {
  reporters: ['default'],
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/projects/ngrx-store-formsync'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '@ngrx/store/testing': '<rootDir>/node_modules/@ngrx/store/fesm2015/ngrx-store-testing.mjs'
  },
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-formsync/src/test.ts'],
  coveragePathIgnorePatterns: ['tokens', 'models', 'public_api', 'test']
};
