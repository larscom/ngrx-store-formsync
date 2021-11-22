import { createReducer, on } from '@ngrx/store';

import { deleteForm, patchForm, resetForm, setForm } from './form.actions';

export interface IFormSyncState {
  [formGroupId: string]: any;
}

export const formSyncReducer = createReducer(
  {},
  /**
   * Set form value from payload
   */
  on(setForm, (state, { id, value }) => ({ ...state, [id]: value })),
  /**
   * Patch form value from payload
   */
  on(patchForm, (state, { id, value }) => merge({}, { ...state }, { [id]: value })),
  // on(resetForm, (state, { id }) => {
  //   const reset = (slice: Partial<IFormSyncState>) => {
  //     for (const property in slice) {
  //       if (!slice.hasOwnProperty(property)) {
  //         continue;
  //       }

  //       if (isPlainObject(slice[property])) {
  //         reset(slice[property]);
  //       } else if (isArray(slice[property])) {
  //         Array(slice[property]).forEach((p) => reset(p));
  //       } else {
  //         slice[property] = null;
  //       }
  //     }
  //     return slice;
  //   };

  //   const value = reset(cloneDeep(state[id]));

  //   return { ...state, [id]: value };
  // }),
  /**
   * Remove form value from state
   */
  on(deleteForm, (state, { id }) => ({ ...state, [id]: undefined }))
);
