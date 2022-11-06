import { NgModule } from '@angular/core';
import { StoreFormSyncModule } from 'projects/ngrx-store-formsync/src/public-api';
import { MetaReducer, StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storageSyncReducer } from './storage-sync.reducer';

const strict = true;

const metaReducers: MetaReducer<any>[] = [storageSyncReducer];

@NgModule({
  imports: [
    NgrxStoreModule.forRoot([], {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: strict,
        strictActionSerializability: strict,
        strictStateImmutability: strict,
        strictActionImmutability: strict,
        strictActionWithinNgZone: strict,
        strictActionTypeUniqueness: strict
      }
    }),
    StoreDevtoolsModule.instrument(),
    StoreFormSyncModule.forRoot()
  ],
  exports: [NgrxStoreModule, StoreFormSyncModule]
})
export class StoreModule {}
