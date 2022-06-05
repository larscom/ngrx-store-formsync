module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  roots: ['<rootDir>/projects/ngrx-store-formsync'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '@ngrx/store/testing': '<rootDir>/node_modules/@ngrx/store/fesm2015/ngrx-store-testing.mjs'
  },
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-formsync/src/test.ts'],
  coveragePathIgnorePatterns: ['tokens', 'public_api', 'test', 'module']
};
