import { ModuleWithProviders, NgModule } from '@angular/core'
import { StoreModule } from '@ngrx/store'
import { StoreFormSyncDirective } from './directives/store-form-sync.directive'
import { storeFormSyncKey } from './store/form.constants'
import { storeFormSyncReducer } from './store/form.reducer'
import { storeFormSyncReducerToken } from './tokens/reducer'

@NgModule({
  declarations: [StoreFormSyncDirective],
  imports: [StoreModule.forFeature(storeFormSyncKey, storeFormSyncReducerToken)],
  exports: [StoreFormSyncDirective]
})
export class StoreFormSyncModule {
  static forRoot(): ModuleWithProviders<StoreFormSyncModule> {
    return {
      ngModule: StoreFormSyncModule,
      providers: [
        {
          provide: storeFormSyncReducerToken,
          useValue: storeFormSyncReducer
        }
      ]
    }
  }
}
