import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreFormSyncDirective } from './directives/store-form-sync.directive';
import { StoreFormSyncConfig } from './store-form-sync-config';
import { storeFormSyncKey } from './store/form.constants';
import { storeFormSyncReducer } from './store/form.reducer';
import { STORE_FORM_SYNC_CONFIG } from './tokens/config';
import { storeFormSyncReducerToken } from './tokens/reducer';

@NgModule({
  declarations: [StoreFormSyncDirective],
  imports: [StoreModule.forFeature(storeFormSyncKey, storeFormSyncReducerToken)],
  exports: [StoreFormSyncDirective]
})
export class StoreFormSyncModule {
  static forRoot(config?: Partial<StoreFormSyncConfig>): ModuleWithProviders<StoreFormSyncModule> {
    return {
      ngModule: StoreFormSyncModule,
      providers: [
        {
          provide: storeFormSyncReducerToken,
          useValue: storeFormSyncReducer
        },
        { provide: STORE_FORM_SYNC_CONFIG, useValue: config || {} }
      ]
    };
  }
}
