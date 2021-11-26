require('jest-preset-angular/ngcc-jest-processor');

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/projects/ngrx-store-formsync'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular'
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '@ngrx/store/testing': '<rootDir>/node_modules/@ngrx/store/fesm2015/ngrx-store-testing.mjs'
  },
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-formsync/src/test.ts'],
  coveragePathIgnorePatterns: ['tokens', 'models', 'public_api', 'test', 'module']
};
