# @larscom/ngrx-store-formsync

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-store-formsync.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-store-formsync)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-store-formsync)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-store-formsync.svg)](https://github.com/larscom/ngrx-store-formsync/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/larscom/ngrx-store-formsync/branch/master/graph/badge.svg?token=KDMA88UI7L)](https://codecov.io/gh/larscom/ngrx-store-formsync)

[![CodeQL](https://github.com/larscom/ngrx-store-formsync/actions/workflows/codeql-analysis.yml/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-formsync/actions/workflows/codeql-analysis.yml)
[![firebase-hosting](https://github.com/larscom/ngrx-store-formsync/actions/workflows/firebase-hosting-merge.yml/badge.svg?branch=master)](https://github.com/larscom/ngrx-store-formsync/actions/workflows/firebase-hosting-merge.yml)


> Synchronize any **reactive form** to **@ngrx/store** (Angular)

### ✨ [Live Demo](https://ngrx-store-formsync.web.app)

## Features

- &#10003; Sync Reactive Forms only
- &#10003; [Persist State](#Persisting-State) (needs additional library)

## Dependencies

`@larscom/ngrx-store-formsync` depends on [@ngrx/store](https://github.com/ngrx/store) and [Angular](https://github.com/angular/angular).

## Installation

```bash
npm install @larscom/ngrx-store-formsync
```

## Usage

1. Import `StoreFormSyncModule.forRoot()` only once. For additional modules import `StoreFormSyncModule`

```ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreFormSyncModule } from '@larscom/ngrx-store-formsync';

@NgModule({
  imports: [
    StoreModule.forRoot(),
    StoreFormSyncModule.forRoot() // import StoreFormSyncModule.forRoot()
  ]
})
export class AppModule {}
```

2. Add the `storeFormSyncId` attribute to the same element as `formGroup`

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

## StoreFormSync Directive API

| Attribute          | Type             | Default   | Required | Description                                                                                                                                  |
| ------------------ | ---------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `formGroup`        | UntypedFormGroup | undefined | yes      | The form group which needs to get synced to the store.                                                                                       |
| `storeFormSyncId`  | string \| number | undefined | yes      | The unique ID for the form group.                                                                                                            |
| `syncDisabled`     | boolean          | false     | no       | Whether the form group value should sync to the store.                                                                                       |
| `syncOnSubmit`     | boolean          | false     | no       | Only sync to the store when submitting the form.                                                                                             |
| `syncRawValue`     | boolean          | false     | no       | Sync the raw form value to the store (this will include disabled form controls)                                                              |
| `syncValidOnly`    | boolean          | false     | no       | Only sync to the store when the form status is valid.                                                                                        |
| `syncInitialValue` | boolean          | true      | no       | Whether the form group value should sync to store when the directive is alive. When disabled, syncing will start when the form value changes |

## Managing form with actions and selectors

### Get form value

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

### Set form value

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

### Patch form value

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

### Delete form value

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

### Delete all form values

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

  deleteAll(): void {
    this.store.dispatch(storeActions.deleteAll());
  }
}
```

## Persisting State

This library works well with [@larscom/ngrx-store-storagesync](https://github.com/larscom/ngrx-store-storagesync)

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
