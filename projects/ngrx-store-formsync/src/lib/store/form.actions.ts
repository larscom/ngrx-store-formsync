import { createAction, props } from '@ngrx/store'

export const setForm = createAction(
  '@larscom/ngrx-form-sync/set',
  props<{ storeFormSyncId: string | number; value: any }>()
)
export const patchForm = createAction(
  '@larscom/ngrx-form-sync/patch',
  props<{ storeFormSyncId: string | number; value: any }>()
)
export const deleteForm = createAction('@larscom/ngrx-form-sync/delete', props<{ storeFormSyncId: string | number }>())
export const deleteAll = createAction('@larscom/ngrx-form-sync/deleteAll')
