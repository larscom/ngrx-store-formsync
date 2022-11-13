import { UntypedFormBuilder, Validators } from '@angular/forms';
import { getMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { StoreFormSyncConfig } from '../store-form-sync-config';
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

  describe('When directive is initializing', () => {
    it('should throw error if storeFormSyncId is undefined', () => {
      directive = new StoreFormSyncDirective({}, store);
      directive.formGroup = formBuilder.group({});

      expect(() => directive.ngOnInit()).toThrow(
        Error('[@larscom/ngrx-store-formsync] You must provide a storeFormSyncId')
      );
    });

    it('should throw error if formGroup is undefined', () => {
      directive = new StoreFormSyncDirective({}, store);

      expect(() => directive.ngOnInit()).toThrow(Error('[@larscom/ngrx-store-formsync] You must provide a FormGroup'));
    });
  });

  describe('When FormGroup value changes', () => {
    it('should not dispatch after directive is destroyed', () => {
      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      // initialize
      directive.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalled();

      dispatchSpy.calls.reset();

      // destroy
      directive.ngOnDestroy();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if storeFormSyncDisabled is true', () => {
      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      // set storeFormSyncDisabled
      directive.storeFormSyncDisabled = true;

      // initialize
      directive.ngOnInit();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if syncOnSubmit is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        syncOnSubmit: true
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      // initialize
      directive.ngOnInit();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if syncValidOnly is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        syncValidOnly: true
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: ['test', Validators.minLength(3)]
      });

      // initialize
      directive.ngOnInit();

      expect(dispatchSpy).toHaveBeenCalled();

      dispatchSpy.calls.reset();

      directive.formGroup.get(firstNameField)!.setValue('t');

      expect(directive.formGroup.valid).toBeFalse();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch', () => {
      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      // initialize
      directive.ngOnInit();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      );
    });

    it('should dispatch raw form value', () => {
      const config: Partial<StoreFormSyncConfig> = {
        syncRawValue: true
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: [{ value: undefined, disabled: true }],
        [lastNameField]: [{ value: undefined }]
      });

      expect(directive.formGroup.get(firstNameField)?.disabled).toBeTrue();
      expect(directive.formGroup.get(lastNameField)?.disabled).toBeFalse();

      // initialize
      directive.ngOnInit();

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

      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      // initialize
      directive.ngOnInit();

      expect(formGroupSpy.patchValue).toHaveBeenCalled();

      formGroupSpy.patchValue.calls.reset();

      // destroy
      directive.ngOnDestroy();

      store.setState(initialState);

      expect(formGroupSpy.patchValue).not.toHaveBeenCalled();
    });

    it('should not dispatch when storeFormSyncDisabled is true', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], { valueChanges: of() });
      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      // set storeFormSyncDisabled
      directive.storeFormSyncDisabled = true;

      // initialize
      directive.ngOnInit();

      expect(formGroupSpy.patchValue).not.toHaveBeenCalled();
    });

    it('should patch formGroup', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], { valueChanges: of() });
      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      // initialize
      directive.ngOnInit();

      expect(formGroupSpy.patchValue).toHaveBeenCalledWith(
        { [firstNameField]: 'foo', [lastNameField]: 'bar' },
        { emitEvent: false }
      );
    });
  });

  describe('When Submit action is fired', () => {
    it('should not dispatch if storeFormSyncDisabled is true', () => {
      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      });

      // set storeFormSyncDisabled
      directive.storeFormSyncDisabled = true;

      // submit
      directive.onSubmit();

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should not dispatch if syncValidOnly is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        syncValidOnly: true
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: ['t', Validators.minLength(3)]
      });

      // submit
      directive.onSubmit();

      expect(directive.formGroup.valid).toBeFalse();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch', () => {
      directive = new StoreFormSyncDirective({}, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      });

      // submit
      directive.onSubmit();

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      );
    });

    it('should dispatch raw form value', () => {
      const config: Partial<StoreFormSyncConfig> = {
        syncRawValue: true
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: [{ value: 'foo', disabled: true }],
        [lastNameField]: [{ value: 'bar', disabled: false }]
      });

      expect(directive.formGroup.get(firstNameField)?.disabled).toBeTrue();
      expect(directive.formGroup.get(lastNameField)?.disabled).toBeFalse();

      // submit
      directive.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'foo', [lastNameField]: 'bar' } })
      );
    });
  });
});
