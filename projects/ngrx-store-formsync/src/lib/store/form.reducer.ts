import { createReducer, on } from '@ngrx/store';
import * as formActions from './form.actions';

export const initialState: StoreFormSyncState = {};
export interface StoreFormSyncState {
  [storeFormSyncId: string]: any;
}

export const storeFormSyncReducer = createReducer(
  initialState,
  on(formActions.setForm, (state, { storeFormSyncId, value }) => ({ ...state, [storeFormSyncId]: value })),
  on(formActions.patchForm, (state, { storeFormSyncId, value }) => {
    return {
      ...state,
      ...{
        [storeFormSyncId]: {
          ...state[storeFormSyncId],
          ...value
        }
      }
    };
  }),
  on(formActions.deleteForm, (state, { storeFormSyncId }) => ({ ...state, [storeFormSyncId]: undefined }))
);
