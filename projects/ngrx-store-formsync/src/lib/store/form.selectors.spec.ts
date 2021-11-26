import { storeFormSyncKey, storeFormSyncSelectors, StoreFormSyncState } from '../../public_api';

interface RootState {
  [storeFormSyncKey]: StoreFormSyncState;
}

describe('StoreFormSyncSelectors', () => {
  const root: RootState = {
    [storeFormSyncKey]: {
      '1': {
        field: 'value'
      }
    }
  };

  it('should select storeFormSync state from root state', () => {
    const { storeFormSync } = root;
    expect(storeFormSyncSelectors.selectFormState(root)).toEqual(storeFormSync);
  });

  it('should select form value from storeFormSync', () => {
    const { storeFormSync } = root;

    expect(storeFormSyncSelectors.selectFormValue({ storeFormSyncId: '1' })(root)).toEqual(storeFormSync['1']);
  });
});
