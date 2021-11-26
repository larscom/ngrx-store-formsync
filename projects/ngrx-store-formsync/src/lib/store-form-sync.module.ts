import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreFormSyncDirective } from './directives/store-form-sync.directive';
import { defaultConfig, StoreFormSyncConfig } from './models/store-form-sync-config';
import { storeFormSyncKey } from './store/form.constants';
import { storeFormSyncReducer } from './store/form.reducer';
import { storeFormSyncConfigToken } from './tokens/config';
import { storeFormSyncReducerToken } from './tokens/reducer';

@NgModule({
  declarations: [StoreFormSyncDirective],
  imports: [StoreModule.forFeature(storeFormSyncKey, storeFormSyncReducerToken)],
  exports: [StoreFormSyncDirective]
})
export class StoreFormSyncModule {
  /**
   * Import once inside root module
   */
  static forRoot(config?: Partial<StoreFormSyncConfig>): ModuleWithProviders<StoreFormSyncModule> {
    const userConfig = config || {};

    return {
      ngModule: StoreFormSyncModule,
      providers: [
        {
          provide: storeFormSyncReducerToken,
          useValue: storeFormSyncReducer
        },
        { provide: storeFormSyncConfigToken, useValue: { ...defaultConfig, ...userConfig } }
      ]
    };
  }

  /**
   * Import in every feature module
   */
  static forFeature(config?: Partial<StoreFormSyncConfig>): ModuleWithProviders<StoreFormSyncModule> {
    const userConfig = config || {};

    return {
      ngModule: StoreFormSyncModule,
      providers: [{ provide: storeFormSyncConfigToken, useValue: { ...defaultConfig, ...userConfig } }]
    };
  }
}
