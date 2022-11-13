import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { StoreFormSyncModule } from './store-form-sync.module';
import { storeFormSyncReducer } from './store/form.reducer';
import { storeFormSyncReducerToken } from './tokens/reducer';

describe('StoreFormSyncModule', () => {
  it('should provide storeFormSyncReducer', () => {
    TestBed.configureTestingModule({
      imports: [StoreFormSyncModule.forRoot(), StoreModule.forRoot({})]
    });

    const reducer = TestBed.inject(storeFormSyncReducerToken);
    expect(reducer).toEqual(storeFormSyncReducer);
  });
});
