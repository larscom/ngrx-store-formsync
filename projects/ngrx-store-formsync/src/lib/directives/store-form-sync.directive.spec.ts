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
    it('should not serialize/dispatch after directive is destroyed', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize')
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      });

      // initialize
      directive.ngOnInit();

      // destroy
      directive.ngOnDestroy();

      directive.formGroup.get(firstNameField)!.setValue('test');

      expect(directive.formGroup.valid).toBeTrue();
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(config.serialize).not.toHaveBeenCalled();
    });

    it('should not serialize/dispatch if storeFormSyncDisabled is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize')
      };
      directive = new StoreFormSyncDirective(config, store);
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
      expect(config.serialize).not.toHaveBeenCalled();
    });

    it('should not serialize/dispatch if syncOnSubmit is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize'),
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
      expect(config.serialize).not.toHaveBeenCalled();
    });

    it('should not serialize/dispatch if syncValidOnly is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize'),
        syncValidOnly: true
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formBuilder.group({
        [firstNameField]: ['test', Validators.minLength(3)]
      });

      // initialize
      directive.ngOnInit();

      directive.formGroup.get(firstNameField)!.setValue('t');

      expect(directive.formGroup.valid).toBeFalse();
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(config.serialize).not.toHaveBeenCalled();
    });

    it('should serialize and dispatch', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize').and.returnValue(JSON.stringify({ [firstNameField]: 'test' }))
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
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      );
      expect(config.serialize).toHaveBeenCalledWith({ [firstNameField]: 'test' });
    });

    it('should serialize and dispatch raw form value', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine
          .createSpy('serialize')
          .and.returnValue(JSON.stringify({ [firstNameField]: 'foo', [lastNameField]: 'bar' })),
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
      expect(config.serialize).toHaveBeenCalledWith({ [firstNameField]: 'foo', [lastNameField]: 'bar' });
    });
  });

  describe('When the store is updated', () => {
    it('should not deserialize/dispatch after directive is destroyed', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], {
        valueChanges: of()
      });
      const deserializeSpy = jasmine.createSpy('deserialize');
      const config: Partial<StoreFormSyncConfig> = {
        deserialize: deserializeSpy
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      // initialize
      directive.ngOnInit();

      expect(deserializeSpy).toHaveBeenCalled();
      expect(formGroupSpy.patchValue).toHaveBeenCalled();

      formGroupSpy.patchValue.calls.reset();
      deserializeSpy.calls.reset();

      // destroy
      directive.ngOnDestroy();

      store.setState(initialState);

      expect(formGroupSpy.patchValue).not.toHaveBeenCalled();
      expect(deserializeSpy).not.toHaveBeenCalled();
    });

    it('should not deserialize/dispatch when storeFormSyncDisabled is true', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], { valueChanges: of() });
      const config: Partial<StoreFormSyncConfig> = {
        deserialize: jasmine.createSpy('deserialize')
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      // set storeFormSyncDisabled
      directive.storeFormSyncDisabled = true;

      // initialize
      directive.ngOnInit();

      expect(formGroupSpy.patchValue).not.toHaveBeenCalled();
      expect(config.deserialize).not.toHaveBeenCalled();
    });

    it('should deserialize and patch formGroup', () => {
      const formGroupSpy = jasmine.createSpyObj('FormGroup', ['patchValue'], { valueChanges: of() });
      const config: Partial<StoreFormSyncConfig> = {
        deserialize: jasmine.createSpy('deserialize').and.returnValue({ [firstNameField]: 'test' })
      };
      directive = new StoreFormSyncDirective(config, store);
      directive.storeFormSyncId = storeFormSyncId;
      directive.formGroup = formGroupSpy;

      // initialize
      directive.ngOnInit();

      expect(formGroupSpy.patchValue).toHaveBeenCalledWith({ [firstNameField]: 'test' }, { emitEvent: false });
      expect(config.deserialize).toHaveBeenCalledWith('{"firstName":"foo","lastName":"bar"}');
    });
  });

  describe('When Submit action is fired', () => {
    it('should not serialize/dispatch if storeFormSyncDisabled is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize')
      };
      directive = new StoreFormSyncDirective(config, store);
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
      expect(config.serialize).not.toHaveBeenCalled();
    });

    it('should not serialize/dispatch if syncValidOnly is true', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize'),
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
      expect(config.serialize).not.toHaveBeenCalled();
    });

    it('should serialize and dispatch', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine.createSpy('serialize').and.returnValue(JSON.stringify({ [firstNameField]: 'test' }))
      };
      directive = new StoreFormSyncDirective(config, store);
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
      expect(config.serialize).toHaveBeenCalledWith({ [firstNameField]: 'test' });
    });

    it('should serialize and dispatch raw form value', () => {
      const config: Partial<StoreFormSyncConfig> = {
        serialize: jasmine
          .createSpy('serialize')
          .and.returnValue(JSON.stringify({ [firstNameField]: 'foo', [lastNameField]: 'bar' })),
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
      expect(config.serialize).toHaveBeenCalledWith({ [firstNameField]: 'foo', [lastNameField]: 'bar' });
    });
  });
});
