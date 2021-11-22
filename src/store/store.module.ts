import { NgModule } from '@angular/core';
import { FormSyncModule } from '@larscom/ngrx-store-formsync';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

const strict = true;

@NgModule({
  imports: [
    NgrxStoreModule.forRoot([], {
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
    FormSyncModule.forRoot()
  ],
  exports: [NgrxStoreModule, FormSyncModule]
})
export class StoreModule {}
