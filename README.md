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

Import `StoreFormSyncModule.forRoot()` once inside the root module.

For every other module, use `StoreFormSyncModule.forFeature()`

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
    // for every other module, use StoreFormSyncModule.forFeature()
    StoreFormSyncModule.forRoot()
  ]
})
export class AppModule {}
```
