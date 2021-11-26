import { storeFormSyncKey, StoreFormSyncState } from '@larscom/ngrx-store-formsync';

export interface IRootState {
  [storeFormSyncKey]?: StoreFormSyncState;
}
