import * as storeSelectors from '../store/form.selectors';
import { storeFormSyncKey } from './form.constants';
import { StoreFormSyncState } from './form.reducer';

interface RootState {
  [storeFormSyncKey]: StoreFormSyncState;
}

describe('StoreSelectors', () => {
  const root: RootState = {
    [storeFormSyncKey]: {
      '1': {
        field: 'value'
      },
      '2': {
        field: 'value'
      }
    }
  };

  it('should select storeFormSync state from root state', () => {
    const { storeFormSync } = root;
    expect(storeSelectors.selectFormState(root)).toEqual(storeFormSync);
  });

  it('should select form value from storeFormSync', () => {
    const { storeFormSync } = root;

    expect(storeSelectors.selectFormValue({ storeFormSyncId: '1' })(root)).toEqual(storeFormSync['1']);
  });
});
