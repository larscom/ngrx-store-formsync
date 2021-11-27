# @larscom/ngrx-store-formsync

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-store-formsync.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-store-formsync)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-store-formsync)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-formsync.svg)](https://github.com/larscom/ngrx-store-formsync/blob/master/LICENSE)
[![@larscom/ngrx-store-formsync](https://github.com/larscom/ngrx-store-formsync/workflows/@larscom/ngrx-store-formsync/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-formsync)

Easily synchronize any **reactive form** to the `@ngrx/store` in just a few steps.

## Dependencies

`@larscom/ngrx-store-formsync` depends on [@ngrx/store 8+](https://github.com/ngrx/store) and [Angular 8+](https://github.com/angular/angular).

## Installation

```bash
npm i --save @larscom/ngrx-store-formsync
```

## Usage

1. Import `StoreFormSyncModule.forRoot()` once inside a root module. For every other module, use `StoreFormSyncModule.forFeature()`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreFormSyncModule } from '@larscom/ngrx-store-formsync';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot(),
    // import StoreFormSyncModule.forRoot() only once
    StoreFormSyncModule.forRoot()
  ]
})
export class AppModule {}
```

2. Add the `storeFormSync` directive on the same element as `formGroup` and provide a `storeFormSyncId`

```html
<form [formGroup]="myFormGroup" storeFormSync storeFormSyncId="1">
  <div>
    <input formControlName="firstName" />
    <input formControlName="lastName" />
  </div>
  <button type="submit">Submit</button>
</form>
```

## Persisting State

This library works really well with [@larscom/ngrx-store-storagesync](https://github.com/larscom/ngrx-store-storagesync)

In 2 seconds you can persist the state of your forms to `localStorage` or `sessionStorage`

```ts
import { storeFormSyncKey } from '@larscom/ngrx-store-formsync'; // import storeFormSyncKey

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  const metaReducer = storageSync<IRootState>({
    features: [{ stateKey: storeFormSyncKey }], // add storeFormSyncKey as feature
    storage: window.localStorage // persist to localStorage
  });

  return metaReducer(reducer);
}
```

Head over to [@larscom/ngrx-store-storagesync](https://github.com/larscom/ngrx-store-storagesync) on how to configure that library.

## StoreFormSync Directive API

| Attribute               | Type    | Default | Required | Description                                                  |
| ----------------------- | ------- | ------- | -------- | ------------------------------------------------------------ |
| `storeFormSyncId`       | string  | null    | yes      | The unique ID for the form group.                            |
| `storeFormSyncDisabled` | boolean | false   | no       | Whether the form group value should sync to the @ngrx/store. |
