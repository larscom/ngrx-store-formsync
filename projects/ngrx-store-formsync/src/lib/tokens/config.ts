import { InjectionToken } from '@angular/core';
import { StoreFormSyncConfig } from '../store-form-sync-config';

export const STORE_FORM_SYNC_CONFIG = new InjectionToken<Partial<StoreFormSyncConfig>>('storeFormSyncConfigToken');
