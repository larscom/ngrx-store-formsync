import { storeFormSyncKey, StoreFormSyncState, storeSelectors } from '../../public-api';

interface RootState {
  [storeFormSyncKey]: StoreFormSyncState;
}

describe('StoreSelectors', () => {
  const root: RootState = {
    [storeFormSyncKey]: {
      '1': {
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
