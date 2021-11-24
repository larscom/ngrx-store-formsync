import { InjectionToken } from '@angular/core';
import { ActionReducer } from '@ngrx/store';
import { StoreFormSyncState } from '../store/form.reducer';

export const storeFormSyncReducerToken = new InjectionToken<ActionReducer<StoreFormSyncState>>('storeFormSyncReducerToken');
