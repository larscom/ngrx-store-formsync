import { createFeatureSelector, createSelector } from '@ngrx/store';
import { formSyncStoreKey } from './form.constants';
import { IFormSyncState } from './form.reducer';

export const selectFormState = createFeatureSelector<IFormSyncState>(formSyncStoreKey);
export const selectFormValue = ({ id }: { id: string }) => createSelector(selectFormState, (state) => state[id]);
