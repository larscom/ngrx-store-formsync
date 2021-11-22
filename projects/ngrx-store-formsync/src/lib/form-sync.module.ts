import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { FormGroupDirective } from './directives/form-group.directive';
import { defaultConfig, IFormSyncConfig } from './models/form-sync-config';
import { formSyncStoreKey } from './store/form.constants';
import { formSyncReducer } from './store/form.reducer';
import { formSyncConfigToken } from './tokens/config';
import { formSyncReducerToken } from './tokens/reducer';

@NgModule({
  declarations: [FormGroupDirective],
  imports: [StoreModule.forFeature(formSyncStoreKey, formSyncReducerToken)],
  exports: [FormGroupDirective]
})
export class FormSyncModule {
  /**
   * Import once inside root module
   */
  static forRoot(config?: Partial<IFormSyncConfig>): ModuleWithProviders<FormSyncModule> {
    const userConfig = config || {};

    return {
      ngModule: FormSyncModule,
      providers: [
        {
          provide: formSyncReducerToken,
          useValue: formSyncReducer
        },
        { provide: formSyncConfigToken, useValue: { ...defaultConfig, ...userConfig } }
      ]
    };
  }

  /**
   * Import in every feature module
   */
  static forFeature(config?: IFormSyncConfig): ModuleWithProviders<FormSyncModule> {
    const userConfig = config || {};

    return {
      ngModule: FormSyncModule,
      providers: [{ provide: formSyncConfigToken, useValue: { ...defaultConfig, ...userConfig } }]
    };
  }
}
