# @larscom/ngrx-store-formsync

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-store-formsync.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-store-formsync)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-store-formsync)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-formsync.svg)](https://github.com/larscom/ngrx-store-formsync/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/larscom/ngrx-store-formsync/branch/master/graph/badge.svg?token=KDMA88UI7L)](https://codecov.io/gh/larscom/ngrx-store-formsync)

[![master](https://github.com/larscom/ngrx-store-formsync/actions/workflows/master-build.yml/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-formsync/actions/workflows/master-build.yml)
[![codeQL](https://github.com/larscom/ngrx-store-formsync/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-formsync/actions/workflows/codeql-analysis.yml)

> Synchronize any **reactive form** to **@ngrx/store** (Angular)

## Supports

- &#10003; Reactive Forms only
- &#10003; [Persisting State](#Persisting-State) (needs additional library)

## Dependencies

`@larscom/ngrx-store-formsync` depends on [@ngrx/store](https://github.com/ngrx/store) and [Angular](https://github.com/angular/angular).

## Installation

```bash
npm i --save @larscom/ngrx-store-formsync
```

## Usage

1. Import `StoreFormSyncModule.forRoot()` once inside a root module. For every other module, just use `StoreFormSyncModule`

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreFormSyncModule, StoreFormSyncConfig } from '@larscom/ngrx-store-formsync';

const config: Partial<StoreFormSyncConfig> = {
  syncValidOnly: true
};

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.forRoot(),
    // import StoreFormSyncModule.forRoot() only once
    StoreFormSyncModule.forRoot(config)
  ]
})
export class AppModule {}
```

2. Add a `storeFormSyncId` on the same element as `formGroup`

```html
<form [formGroup]="myFormGroup" storeFormSyncId="1">
  <div>
    <input formControlName="firstName" />
    <input formControlName="lastName" />
  </div>
  <button type="submit">Submit</button>
</form>
```

Your formGroup will now get synced to the `@ngrx/store`

## Configuration

```ts
export interface StoreFormSyncConfig {
  /**
   * Only sync to the store when submitting the form.
   * @default false
   */
  syncOnSubmit: boolean;
  /**
   * Only sync to the store when the form status is valid.
   * @default false
   */
  syncValidOnly: boolean;
  /**
   * Sync the raw form value to the store (this will include disabled form controls)
   * @default false
   */
  syncRawValue: boolean;
  /**
   * Deserialize function that gets called before patching the form.
   *
   * ISO Date objects which are stored as a string gets revived as Date object by default.
   */
  deserialize: (formValue: string) => any;
}
```

## StoreFormSync Directive API

| Attribute               | Type             | Default   | Required | Description                                                  |
| ----------------------- | ---------------- | --------- | -------- | ------------------------------------------------------------ |
| `storeFormSyncId`       | string \| number | undefined | yes      | The unique ID for the form group.                            |
| `storeFormSyncDisabled` | boolean          | false     | no       | Whether the form group value should sync to the @ngrx/store. |

## Override global config

Config can be overriden at component level by adding a provider to the providers array.

```ts
import { STORE_FORM_SYNC_CONFIG } from '@larscom/ngrx-store-formsync';

@Component({
  selector: 'app-component',
  template: `<div>Hello!</div>`,
  providers: [{ provide: STORE_FORM_SYNC_CONFIG, useValue: { syncValidOnly: true } }]
})
export class AppComponent {}
```

## Managing form with actions and selectors

### Get Form Value

```ts
import { Component } from '@angular/core';
import { storeSelectors } from '@larscom/ngrx-store-formsync'; // import selectors
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-component',
  template: `
    <div>
      <h1>My Form Value</h1>
      {{ myFormValue$ | async | json }}
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  myFormValue$ = this.store.pipe(select(storeSelectors.selectFormValue({ storeFormSyncId: 'myId' })));

  constructor(private readonly store: Store) {}
}
```

### Set Form Value

```ts
import { Component } from '@angular/core';
import { storeActions } from '@larscom/ngrx-store-formsync'; // import actions
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private readonly store: Store) {}

  setForm(): void {
    const value = {
      firstName: 'Jan',
      lastName: 'Jansen'
    };
    this.store.dispatch(storeActions.setForm({ storeFormSyncId: 'myId', value }));
  }
}
```

### Patch Form Value

```ts
import { Component } from '@angular/core';
import { storeActions } from '@larscom/ngrx-store-formsync'; // import actions
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private readonly store: Store) {}

  patchForm(): void {
    const value = {
      firstName: 'Jan' // lastName can be omitted
      //lastName: 'Jansen'
    };

   this.store.dispatch(storeActions.patchForm({ storeFormSyncId: 'myId', value }));
  }
}
```

### Delete Form Value

```ts
import { Component } from '@angular/core';
import { storeActions } from '@larscom/ngrx-store-formsync'; // import actions
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private readonly store: Store) {}

  deleteForm(): void {
    this.store.dispatch(storeActions.deleteForm({ storeFormSyncId: 'myId'}));
  }
}
```

## Persisting State

This library works with [@larscom/ngrx-store-storagesync](https://github.com/larscom/ngrx-store-storagesync)

You can persist the state of your forms to `localStorage/sessionStorage` in a few seconds.

```ts
import { storeFormSyncKey } from '@larscom/ngrx-store-formsync'; // import storeFormSyncKey

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  const metaReducer = storageSync<IRootState>({
    features: [
      {
        stateKey: storeFormSyncKey // add storeFormSync as feature
      }
    ],
    storage: window.localStorage
  });

  return metaReducer(reducer);
}
```

Head over to [@larscom/ngrx-store-storagesync](https://github.com/larscom/ngrx-store-storagesync) on how to configure that library.
