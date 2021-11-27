import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { getMockStore, MockStore, provideMockStore } from '@ngrx/store/testing';
import { storeFormSyncActions, StoreFormSyncConfig, StoreFormSyncDirective, storeFormSyncKey } from '../../public_api';
import { defaultConfig } from '../models/store-form-sync-config';

function createSubject(store: MockStore, config?: Partial<StoreFormSyncConfig>, init = true): StoreFormSyncDirective {
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

  let subject: StoreFormSyncDirective;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [BrowserTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore()]
    });
  });

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
    subject.ngOnDestroy();
  });

  it('should create subject', () => {
    subject = createSubject(store);
    expect(subject).toBeTruthy();
  });

  it('should dispatch with default configuration', () => {
    subject = createSubject(store);

    const { formGroup, storeFormSyncId } = subject;

    formGroup.get('field1')!.setValue('test');

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.value });

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should throw error if storeFormSyncId is undefined', () => {
    subject = createSubject(store, defaultConfig, false);
    (subject as any).storeFormSyncId = undefined;

    try {
      subject.ngOnInit();
    } catch (e) {
      expect((e as Error).message).toContain('storeFormSyncId is missing!');
    }
  });

  it('should throw error if formGroup is undefined', () => {
    subject = createSubject(store, defaultConfig, false);
    (subject as any).formGroup = undefined;

    try {
      subject.ngOnInit();
    } catch (e) {
      expect((e as Error).message).toContain('formGroup is missing!');
    }
  });

  it('should patch form if store contains state', () => {
    subject = createSubject(store, defaultConfig, false);

    const { formGroup } = subject;

    const formGroupPatchSpy = jest.spyOn(formGroup, 'patchValue');

    subject.ngOnInit();

    expect(formGroupPatchSpy).toHaveBeenCalledWith({ field: 'value' }, { emitEvent: false });
  });

  it('should NOT patch form if store is updated and storeFormSyncDisabled is true', () => {
    subject = createSubject(store, defaultConfig, false);
    subject.storeFormSyncDisabled = true;

    const { formGroup } = subject;

    const formGroupPatchSpy = jest.spyOn(formGroup, 'patchValue');

    subject.ngOnInit();

    expect(formGroupPatchSpy).not.toHaveBeenCalled();
  });

  it('should NOT dispatch if form value changed and storeFormSyncDisabled is true', () => {
    subject = createSubject(store);
    subject.storeFormSyncDisabled = true;

    const { formGroup } = subject;

    formGroup.get('field1')!.setValue('test');

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch with invalid form status', () => {
    subject = createSubject(store, { syncValidOnly: true });

    const { formGroup } = subject;

    formGroup.get('field1')!.setValue('test');

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch on value change when syncOnSubmit is enabled', () => {
    subject = createSubject(store, { syncOnSubmit: true });

    const { formGroup } = subject;

    formGroup.get('field1')!.setValue('test');

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch on submit if storeFormSyncDisabled is true and syncOnSubmit is enabled', () => {
    subject = createSubject(store, { syncOnSubmit: true });
    subject.storeFormSyncDisabled = true;

    subject.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch on submit when syncOnSubmit is enabled', () => {
    subject = createSubject(store, { syncOnSubmit: true });

    const { formGroup, storeFormSyncId } = subject;

    subject.onSubmit();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.value });

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should dispatch on submit and valid form only', () => {
    subject = createSubject(store, { syncOnSubmit: true, syncValidOnly: true });

    const { formGroup, storeFormSyncId } = subject;

    formGroup.get('field1')!.setValue('test');
    formGroup.get('field2')!.setValue('test');

    subject.onSubmit();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.value });

    expect(formGroup.valid).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should not dispatch on submit with invalid form', () => {
    subject = createSubject(store, { syncOnSubmit: true, syncValidOnly: true });

    const { formGroup } = subject;

    formGroup.get('field1')!.setValue('test');

    subject.onSubmit();

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch raw value on submit and valid form only', () => {
    subject = createSubject(store, { syncRawValue: true, syncOnSubmit: true, syncValidOnly: true });

    const { formGroup, storeFormSyncId } = subject;

    formGroup.get('field1')!.setValue('test');
    formGroup.get('field1')!.disable();

    formGroup.get('field2')!.setValue('test');

    subject.onSubmit();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.getRawValue() });

    expect(formGroup.valid).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });

  it('should sync disabled controls', () => {
    subject = createSubject(store, { syncRawValue: true });

    const { formGroup, storeFormSyncId } = subject;

    formGroup.get('field1')!.setValue('test');
    formGroup.get('field1')!.disable();

    formGroup.get('field2')!.setValue('test');
    formGroup.get('field2')!.disable();

    const expected = storeFormSyncActions.patchForm({ storeFormSyncId, value: formGroup.getRawValue() });

    expect(formGroup.valid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalledWith(expected);
  });
});
