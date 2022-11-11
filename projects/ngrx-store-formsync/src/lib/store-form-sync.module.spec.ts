import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { StoreFormSyncConfig } from './store-form-sync-config';
import { StoreFormSyncModule } from './store-form-sync.module';
import { storeFormSyncReducer } from './store/form.reducer';
import { STORE_FORM_SYNC_CONFIG } from './tokens/config';
import { storeFormSyncReducerToken } from './tokens/reducer';

describe('StoreFormSyncModule', () => {
  it('should provide storeFormSyncReducer', () => {
    TestBed.configureTestingModule({
      imports: [StoreFormSyncModule.forRoot(), StoreModule.forRoot({})]
    });

    const reducer = TestBed.inject(storeFormSyncReducerToken);
    expect(reducer).toEqual(storeFormSyncReducer);
  });

  it('should use user provided config', () => {
    const myConfig: Partial<StoreFormSyncConfig> = {
      syncOnSubmit: true
    };

    TestBed.configureTestingModule({
      imports: [StoreFormSyncModule.forRoot(myConfig), StoreModule.forRoot({})]
    });

    const config = TestBed.inject(STORE_FORM_SYNC_CONFIG);
    expect(config).toEqual(myConfig);
  });
});
