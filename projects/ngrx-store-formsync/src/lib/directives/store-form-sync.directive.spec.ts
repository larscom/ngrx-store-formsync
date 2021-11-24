import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { MockStore, provideMockStore, getMockStore } from '@ngrx/store/testing';
import { StoreFormSyncDirective, StoreFormSyncConfig } from '../../public_api';
import { defaultConfig } from '../models/store-form-sync-config';

describe('StoreFormSyncDirective', () => {
  let store: MockStore<any>;
  let dispatchSpy: jest.SpyInstance;

  let subject: StoreFormSyncDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore()]
    }).compileComponents();

    store = getMockStore({ initialState: {} });

    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    subject.ngOnDestroy();
  });

  it('should create StoreFormSyncDirective', () => {
    subject = createSubject(store);
    expect(subject).toBeTruthy();
  });

  // it('should dispatch with default configuration', () => {
  //   createDirective(defaultConfig);

  //   const { formGroupId, formGroup } = directive;

  //   field1.setValue('test');

  //   const expected = formActions.patchForm({ id: formGroupId, value: formGroup.value });

  //   expect(dispatchSpy).toHaveBeenCalledWith(expected);
  // });

  // it('should not dispatch with invalid form status', () => {
  //   createDirective({ syncValidOnly: true });

  //   field1.setValue('test');

  //   expect(dispatchSpy).not.toHaveBeenCalled();
  // });

  // it('should not dispatch on value change', () => {
  //   createDirective({ syncOnSubmit: true });

  //   field1.setValue('test');

  //   expect(dispatchSpy).not.toHaveBeenCalled();
  // });

  // it('should dispatch on submit', () => {
  //   createDirective({ syncOnSubmit: true });

  //   const { formGroupId, formGroup } = directive;

  //   directive.onSubmit();

  //   const expected = formActions.patchForm({ id: formGroupId, value: formGroup.value });

  //   expect(dispatchSpy).toHaveBeenCalledWith(expected);
  // });

  // it('should dispatch on submit and valid form only', () => {
  //   createDirective({ syncOnSubmit: true, syncValidOnly: true });

  //   const { formGroupId, formGroup } = directive;

  //   field1.setValue('test');
  //   field2.setValue('test');

  //   directive.onSubmit();

  //   const expected = formActions.patchForm({ id: formGroupId, value: formGroup.value });

  //   expect(dispatchSpy).toHaveBeenCalledWith(expected);
  // });

  // it('should not dispatch on submit with invalid form', () => {
  //   createDirective({ syncOnSubmit: true, syncValidOnly: true });

  //   field1.setValue('test');

  //   directive.onSubmit();

  //   expect(dispatchSpy).not.toHaveBeenCalled();
  // });

  // it('should dispatch raw value on submit and valid form only', () => {
  //   createDirective({ syncRawValue: true, syncOnSubmit: true, syncValidOnly: true });

  //   const { formGroupId, formGroup } = directive;

  //   field1.setValue('test');
  //   field1.disable();

  //   field2.setValue('test');

  //   directive.onSubmit();

  //   const expected = formActions.patchForm({ id: formGroupId, value: formGroup.getRawValue() });

  //   expect(dispatchSpy).toHaveBeenCalledWith(expected);
  // });

  // it('should sync disabled controls', () => {
  //   createDirective({ syncRawValue: true });

  //   const { formGroupId, formGroup } = directive;

  //   field1.setValue('test');
  //   field1.disable();

  //   field2.setValue('test');

  //   const expected = formActions.patchForm({ id: formGroupId, value: formGroup.getRawValue() });

  //   expect(dispatchSpy).toHaveBeenCalledWith(expected);
  // });

  // it('should patch form', () => {
  //   const state = { 1: { field1: 'test', field2: 'test' } };

  //   createDirective(defaultConfig, state);

  //   const { formGroup } = directive;

  //   const patchValueSpy = spyOn(formGroup, 'patchValue');

  //   directive.ngOnInit();

  //   expect(patchValueSpy).toHaveBeenCalledWith({ field1: 'test', field2: 'test' }, { emitEvent: false });
  // });
});

function createSubject(store: MockStore, config?: Partial<StoreFormSyncConfig>): StoreFormSyncDirective {
  const finalConfig: StoreFormSyncConfig = { ...defaultConfig, ...(config || {}) };

  const directive = new StoreFormSyncDirective(finalConfig, store);

  const field1 = new FormControl(null, Validators.required);
  const field2 = new FormControl(null, Validators.required);

  directive.formGroup = new FormGroup({ field1, field2 });
  directive.storeFormSyncId = '1';

  directive.ngOnInit();

  return directive;
}
