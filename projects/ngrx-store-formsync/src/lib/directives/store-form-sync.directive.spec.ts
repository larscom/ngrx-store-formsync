import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getMockStore, MockStore } from '@ngrx/store/testing';
import { storeFormSyncActions, StoreFormSyncConfig, StoreFormSyncDirective, storeFormSyncKey } from '../../public_api';
import { defaultConfig } from '../models/store-form-sync-config';

function createDirective(store: MockStore, config?: Partial<StoreFormSyncConfig>, init = true): StoreFormSyncDirective {
  const directive = new StoreFormSyncDirective({ ...defaultConfig, ...(config || {}) }, store);

  const field1 = new FormControl(null, Validators.required);
  const field2 = new FormControl(null, Validators.required);

  directive.formGroup = new FormGroup({ field1, field2 });
  directive.storeFormSyncId = '1';

  if (init) {
    directive.ngOnInit();
  }

  return directive;
}

describe('StoreFormSyncDirective', () => {
  let store: MockStore<any>;
  let dispatchSpy: jest.SpyInstance;
  let directive: StoreFormSyncDirective;

  beforeEach(() => {
    store = getMockStore({
      initialState: {
        [storeFormSyncKey]: {
          ['1']: {
            field: 'value'
          }
        }
      }
    });
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    directive.ngOnDestroy();
  });

  it('should create subject', () => {
    directive = createDirective(store);
    expect(directive).toBeTruthy();
  });

  it('should dispatch with default configuration', () => {
    directive = createDirective(store);

    const { formGroup, storeFormSyncId } = directive;

    formGroup.get('field1')!.setValue('test');

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.value });

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should throw error if storeFormSyncId is undefined', () => {
    directive = createDirective(store, defaultConfig, false);
    (directive as any).storeFormSyncId = undefined;

    try {
      directive.ngOnInit();
    } catch (e) {
      expect((e as Error).message).toContain('storeFormSyncId is missing!');
    }
  });

  it('should throw error if formGroup is undefined', () => {
    directive = createDirective(store, defaultConfig, false);
    (directive as any).formGroup = undefined;

    try {
      directive.ngOnInit();
    } catch (e) {
      expect((e as Error).message).toContain('formGroup is missing!');
    }
  });

  it('should patch form if store contains state', () => {
    directive = createDirective(store, defaultConfig, false);

    const { formGroup } = directive;

    const formGroupPatchSpy = jest.spyOn(formGroup, 'patchValue');

    directive.ngOnInit();

    expect(formGroupPatchSpy).toHaveBeenCalledWith({ field: 'value' }, { emitEvent: false });
  });

  it('should NOT patch form if store is updated and storeFormSyncDisabled is true', () => {
    directive = createDirective(store, defaultConfig, false);
    directive.storeFormSyncDisabled = true;

    const { formGroup } = directive;

    const formGroupPatchSpy = jest.spyOn(formGroup, 'patchValue');

    directive.ngOnInit();

    expect(formGroupPatchSpy).not.toHaveBeenCalled();
  });

  it('should NOT dispatch if form value changed and storeFormSyncDisabled is true', () => {
    directive = createDirective(store);
    directive.storeFormSyncDisabled = true;

    const { formGroup } = directive;

    formGroup.get('field1')!.setValue('test');

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch with invalid form status', () => {
    directive = createDirective(store, { syncValidOnly: true });

    const { formGroup } = directive;

    formGroup.get('field1')!.setValue('test');

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch on value change when syncOnSubmit is enabled', () => {
    directive = createDirective(store, { syncOnSubmit: true });

    const { formGroup } = directive;

    formGroup.get('field1')!.setValue('test');

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch on submit if storeFormSyncDisabled is true and syncOnSubmit is enabled', () => {
    directive = createDirective(store, { syncOnSubmit: true });
    directive.storeFormSyncDisabled = true;

    directive.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch on submit when syncOnSubmit is enabled', () => {
    directive = createDirective(store, { syncOnSubmit: true });

    const { formGroup, storeFormSyncId } = directive;

    directive.onSubmit();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.value });

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should dispatch on submit and valid form only', () => {
    directive = createDirective(store, { syncOnSubmit: true, syncValidOnly: true });

    const { formGroup, storeFormSyncId } = directive;

    formGroup.get('field1')!.setValue('test');
    formGroup.get('field2')!.setValue('test');

    directive.onSubmit();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.value });

    expect(formGroup.valid).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should not dispatch on submit with invalid form', () => {
    directive = createDirective(store, { syncOnSubmit: true, syncValidOnly: true });

    const { formGroup } = directive;

    formGroup.get('field1')!.setValue('test');

    directive.onSubmit();

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch raw value on submit and valid form only', () => {
    directive = createDirective(store, { syncRawValue: true, syncOnSubmit: true, syncValidOnly: true });

    const { formGroup, storeFormSyncId } = directive;

    formGroup.get('field1')!.setValue('test');
    formGroup.get('field1')!.disable();

    formGroup.get('field2')!.setValue('test');

    directive.onSubmit();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.getRawValue() });

    expect(formGroup.valid).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should sync disabled controls', () => {
    directive = createDirective(store, { syncRawValue: true });

    const { formGroup, storeFormSyncId } = directive;

    formGroup.get('field1')!.setValue('test');
    formGroup.get('field1')!.disable();

    formGroup.get('field2')!.setValue('test');
    formGroup.get('field2')!.disable();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.getRawValue() });

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });
});
