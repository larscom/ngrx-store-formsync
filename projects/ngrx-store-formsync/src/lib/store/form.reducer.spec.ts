import { storeFormSyncReducer, initialState } from './form.reducer';
import { storeFormSyncActions, StoreFormSyncState } from '../../public_api';

describe('StoreFormSyncReducer', () => {
  it('should return the initial state', () => {
    expect(storeFormSyncReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should SET form value for storeFormSyncId', () => {
    const storeFormSyncId = '1';
    const state: StoreFormSyncState = {
      extra: {
        field: 'value'
      },
      [storeFormSyncId]: {
        field: 'value'
      }
    };

    const updatedState = storeFormSyncReducer(
      state,
      storeFormSyncActions.setForm({ storeFormSyncId, value: { newField: 'value' } })
    );

    const expected: StoreFormSyncState = {
      extra: {
        field: 'value'
      },
      [storeFormSyncId]: {
        newField: 'value'
      }
    };

    expect(updatedState).toEqual(expected);
  });

  it('should PATCH form value for storeFormSyncId', () => {
    const storeFormSyncId = '1';
    const state: StoreFormSyncState = {
      extra: {
        field: 'value'
      },
      [storeFormSyncId]: {
        field1: 'value',
        field2: 'value',
        array: ['1', '2', '3']
      }
    };

    const updatedState = storeFormSyncReducer(
      state,
      storeFormSyncActions.patchForm({ storeFormSyncId, value: { field1: 'newValue', array: ['1'] } })
    );

    const expected: StoreFormSyncState = {
      extra: {
        field: 'value'
      },
      [storeFormSyncId]: {
        field1: 'newValue',
        field2: 'value',
        array: ['1']
      }
    };

    expect(updatedState).toEqual(expected);
  });

  it('should PATCH form value for storeFormSyncId with initialState', () => {
    const storeFormSyncId = '1';

    const updatedState = storeFormSyncReducer(
      initialState,
      storeFormSyncActions.patchForm({ storeFormSyncId, value: { field1: 'newValue' } })
    );

    const expected: StoreFormSyncState = {
      [storeFormSyncId]: {
        field1: 'newValue'
      }
    };

    expect(updatedState).toEqual(expected);
  });

  it('should DELETE form value for storeFormSyncId', () => {
    const storeFormSyncId = '1';
    const state: StoreFormSyncState = {
      extra: {
        field: 'value'
      },
      [storeFormSyncId]: {
        field1: 'value',
        field2: 'value',
        array: ['1', '2', '3']
      }
    };

    const updatedState = storeFormSyncReducer(state, storeFormSyncActions.deleteForm({ storeFormSyncId }));

    const expected: StoreFormSyncState = {
      extra: {
        field: 'value'
      }
    };

    expect(updatedState).toEqual(expected);
  });
});
