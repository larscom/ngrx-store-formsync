import { createReducer, on } from '@ngrx/store';
import * as formActions from './form.actions';

export interface StoreFormSyncState {
  [storeFormSyncId: string]: any;
}

export const storeFormSyncReducer = createReducer(
  {},
  /**
   * Set form value from payload
   */
  on(formActions.setForm, (state, { storeFormSyncId, value }) => ({ ...state, [storeFormSyncId]: value })),
  /**
   * Patch form value from payload
   */
  on(formActions.patchForm, (state, { storeFormSyncId, value }) => ({
    ...{ ...state },
    ...{ [storeFormSyncId]: value }
  })),
  /**
   * Remove form value from state
   */
  on(formActions.deleteForm, (state, { storeFormSyncId }) => ({ ...state, [storeFormSyncId]: undefined }))
);
