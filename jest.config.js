module.exports = {
  reporters: ['default'],
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/projects/ngrx-store-formsync'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '@ngrx/store/testing': '<rootDir>/node_modules/@ngrx/store/fesm2015/ngrx-store-testing.mjs',
    '@angular/core/testing': '<rootDir>/node_modules/@angular/core/fesm2015/testing.mjs',
    '@angular/platform-browser-dynamic/testing':
      '<rootDir>/node_modules/@angular/platform-browser-dynamic/fesm2015/testing.mjs'
  },
  setupFilesAfterEnv: ['<rootDir>/projects/ngrx-store-formsync/src/test.ts'],
  coveragePathIgnorePatterns: ['tokens', 'models', 'public_api', 'test']
};
