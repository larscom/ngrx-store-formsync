import { storeFormSyncKey, StoreFormSyncState } from 'projects/ngrx-store-formsync/src/public-api';

export interface IRootState {
  [storeFormSyncKey]?: StoreFormSyncState;
}
