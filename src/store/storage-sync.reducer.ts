import { storeFormSyncKey } from '@larscom/ngrx-store-formsync';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { ActionReducer } from '@ngrx/store';
import { IRootState } from './models/root-state';

export function storageSyncReducer(reducer: ActionReducer<IRootState>): ActionReducer<IRootState> {
  const metaReducer = storageSync<IRootState>({
    features: [{ stateKey: storeFormSyncKey, deserialize: (featureState) => JSON.parse(featureState) }],
    storage: window.localStorage
  });

  return metaReducer(reducer);
}
