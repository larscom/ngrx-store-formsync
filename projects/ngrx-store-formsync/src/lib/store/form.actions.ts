import { createAction, props } from '@ngrx/store';

export const setForm = createAction('@larscom/ngrx-form-sync/set', props<{ storeFormSyncId: string; value: any }>());
export const patchForm = createAction(
  '@larscom/ngrx-form-sync/patch',
  props<{ storeFormSyncId: string; value: any }>()
);
export const deleteForm = createAction('@larscom/ngrx-form-sync/delete', props<{ storeFormSyncId: string }>());
