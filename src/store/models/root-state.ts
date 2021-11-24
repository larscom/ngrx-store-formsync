import { storeFormSyncKey, StoreFormSyncConfig } from '@larscom/ngrx-store-formsync';

export interface IRootState {
  [storeFormSyncKey]?: StoreFormSyncConfig;
}
