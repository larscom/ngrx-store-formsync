import { createReducer, on } from '@ngrx/store';
import * as formActions from './form.actions';

export interface IFormSyncState {
  [formGroupId: string]: any;
}

export const formSyncReducer = createReducer(
  {},
  /**
   * Set form value from payload
   */
  on(formActions.setForm, (state, { id, value }) => ({ ...state, [id]: value })),
  /**
   * Patch form value from payload
   */
  on(formActions.patchForm, (state, { id, value }) => ({ ...{ ...state }, ...{ [id]: value } })),
  /**
   * Remove form value from state
   */
  on(formActions.deleteForm, (state, { id }) => ({ ...state, [id]: undefined }))
);
