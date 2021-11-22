import { InjectionToken } from '@angular/core';
import { IFormSyncConfig } from '../models/form-sync-config';

export const formSyncConfigToken = new InjectionToken<IFormSyncConfig>('formSyncConfigToken');
