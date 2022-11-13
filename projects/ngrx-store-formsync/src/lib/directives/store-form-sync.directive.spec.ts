import { UntypedFormBuilder, Validators } from '@angular/forms';
import { getMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as storeActions from '../store/form.actions';
import { storeFormSyncKey } from '../store/form.constants';
import { StoreFormSyncDirective } from './store-form-sync.directive';

describe('StoreFormSyncDirective', () => {
  const storeFormSyncId = '123';
  const firstNameField = 'firstName';
  const lastNameField = 'lastName';

  const initialState = {
    [storeFormSyncKey]: {
      [storeFormSyncId]: {
        [firstNameField]: 'foo',
        [lastNameField]: 'bar'
      }
    }
  };

  let formBuilder: UntypedFormBuilder;
  let store: MockStore<any>;
  let dispatchSpy: jasmine.Spy;

  let directive: StoreFormSyncDirective;

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder();
    store = getMockStore({ initialState });
    dispatchSpy = spyOn(store, 'dispatch');
  });

  afterEach(() => {
    directive.ngOnDestroy();
  });

  describe('When directive input is changed', () => {
    it('should throw error if storeFormSyncId is undefined', () => {
      directive = new StoreFormSyncDirective(store);
      directive.formGroup = formBuilder.group({});

      expect(() => directive.ngOnChanges()).toThrow(
        Error('[@larscom/ngrx-store-formsync] You must provide a storeFormSyncId')
      );
    });

    it('should throw error if formGroup is undefined', () => {
      directive = new StoreFormSyncDirective(store);

      expect(() => directive.ngOnChanges()).toThrow(
        Error('[@larscom/ngrx-store-formsync] You must provide a FormGroup')
      );
    });
  });

  describe('When FormGroup value changes', () => {
    it('should dispatch with initial value', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      });

      directive.ngOnChanges();

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      );
    });

    it('should NOT dispatch with initial value if syncInitialValue is false', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      });

      directive.syncInitialValue = false;
      directive.ngOnChanges();

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch after directive is destroyed', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      directive.ngOnChanges();

      expect(dispatchSpy).toHaveBeenCalled();
      dispatchSpy.calls.reset();

      directive.ngOnDestroy();
      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if syncDisabled is true', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      directive.syncDisabled = true;
      directive.ngOnChanges();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if syncOnSubmit is true', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      directive.syncOnSubmit = true;

      directive.ngOnChanges();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if syncValidOnly is true', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: ['test', Validators.minLength(3)]
      });

      directive.syncValidOnly = true;

      directive.ngOnChanges();

      expect(dispatchSpy).toHaveBeenCalled();
      dispatchSpy.calls.reset();

      directive.formGroup.get(firstNameField)!.setValue('t');

      expect(directive.formGroup.valid).toBeFalse();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      directive.ngOnChanges();

      expect(dispatchSpy).toHaveBeenCalled();
      dispatchSpy.calls.reset();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      );
    });

    it('should dispatch raw form value if syncRawValue is true', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: [{ value: undefined, disabled: true }],
        [lastNameField]: [{ value: undefined }]
      });

      directive.syncRawValue = true;

      expect(directive.formGroup.get(firstNameField)?.disabled).toBeTrue();
      expect(directive.formGroup.get(lastNameField)?.disabled).toBeFalse();

      directive.ngOnChanges();

      directive.formGroup.get(lastNameField)!.setValue('bar');

      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'foo', [lastNameField]: 'bar' } })
      );
    });
  });

  describe('When the store is updated', () => {
    it('should not dispatch after directive is destroyed', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], {
        valueChanges: of()
      });

      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      directive.ngOnChanges();

      expect(formGroupSpy.patchValue).toHaveBeenCalled();
      formGroupSpy.patchValue.calls.reset();

      directive.ngOnDestroy();
      store.setState(initialState);

      expect(formGroupSpy.patchValue).not.toHaveBeenCalled();
    });

    it('should not dispatch when syncDisabled is true', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], { valueChanges: of() });
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      directive.syncDisabled = true;

      directive.ngOnChanges();

      expect(formGroupSpy.patchValue).not.toHaveBeenCalled();
    });

    it('should patch formGroup', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], { valueChanges: of() });
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      directive.ngOnChanges();

      expect(formGroupSpy.patchValue).toHaveBeenCalledWith(
        { [firstNameField]: 'foo', [lastNameField]: 'bar' },
        { emitEvent: false }
      );
    });
  });

  describe('When Submit action is fired', () => {
    it('should not dispatch if syncDisabled is true', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      });

      directive.syncOnSubmit = true;
      directive.syncDisabled = true;

      directive.onSubmit();

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if syncValidOnly is true', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: ['t', Validators.minLength(3)]
      });

      directive.syncOnSubmit = true;
      directive.syncValidOnly = true;

      directive.onSubmit();

      expect(directive.formGroup.valid).toBeFalse();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      });

      directive.syncOnSubmit = true;

      directive.onSubmit();

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      );
    });

    it('should dispatch raw form value if syncRawValue is true', () => {
      directive = new StoreFormSyncDirective(store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: [{ value: 'foo', disabled: true }],
        [lastNameField]: [{ value: 'bar', disabled: false }]
      });

      directive.syncOnSubmit = true;
      directive.syncRawValue = true;

      expect(directive.formGroup.get(firstNameField)?.disabled).toBeTrue();
      expect(directive.formGroup.get(lastNameField)?.disabled).toBeFalse();

      directive.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'foo', [lastNameField]: 'bar' } })
      );
    });
  });
});
