import { InjectionToken } from '@angular/core';
import { ActionReducer } from '@ngrx/store';
import { IFormSyncState } from '../store/form.reducer';

export const formSyncReducerToken = new InjectionToken<ActionReducer<IFormSyncState>>('formSyncReducer');
