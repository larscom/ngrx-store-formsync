import { createFeatureSelector, createSelector } from '@ngrx/store'
import { storeFormSyncKey } from './form.constants'
import { StoreFormSyncState } from './form.reducer'

export const selectFormState = createFeatureSelector<StoreFormSyncState>(storeFormSyncKey)
export const selectFormValue = ({ storeFormSyncId }: { storeFormSyncId: string | number }) =>
  createSelector(selectFormState, (state) => ({ ...state[storeFormSyncId] }))
