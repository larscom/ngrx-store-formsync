import { InjectionToken, NgModule } from '@angular/core';
import { StoreFormSyncModule } from '@larscom/ngrx-store-formsync';
import { ActionReducerMap, StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IRootState } from './models/root-state';
import { storageSyncReducer } from './storage-sync.reducer';

const rootReducer = new InjectionToken<ActionReducerMap<IRootState>>('rootReducer');

const strict = true;
@NgModule({
  imports: [
    NgrxStoreModule.forRoot(rootReducer, {
      metaReducers: [storageSyncReducer],
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
  providers: [{ provide: rootReducer, useValue: {} }],
  exports: [NgrxStoreModule, StoreFormSyncModule]
})
export class StoreModule {}
