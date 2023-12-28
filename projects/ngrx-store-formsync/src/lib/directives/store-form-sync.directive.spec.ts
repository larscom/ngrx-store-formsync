import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { MockStore, createMockStore } from '@ngrx/store/testing'
import * as storeActions from '../store/form.actions'
import { storeFormSyncKey } from '../store/form.constants'
import { StoreFormSyncDirective } from './store-form-sync.directive'

describe('StoreFormSyncDirective', () => {
  const storeFormSyncId = '123'
  const firstNameField = 'firstName'
  const lastNameField = 'lastName'

  const initialState = {
    [storeFormSyncKey]: {
      [storeFormSyncId]: {
        [firstNameField]: 'foo',
        [lastNameField]: 'bar'
      }
    }
  }

  let formBuilder: UntypedFormBuilder
  let store: MockStore<any>
  let dispatchSpy: jest.SpyInstance

  let directive: StoreFormSyncDirective

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder()
    store = createMockStore({ initialState })
    dispatchSpy = jest.spyOn(store, 'dispatch')
  })

  afterEach(() => {
    directive.ngOnDestroy()
  })

  describe('When directive input is changed', () => {
    it('should throw error if storeFormSyncId is undefined', () => {
      directive = new StoreFormSyncDirective(store)
      directive.formGroup = formBuilder.group({})

      expect(() => directive.ngOnChanges()).toThrow(
        Error('[@larscom/ngrx-store-formsync] You must provide a storeFormSyncId')
      )
    })

    it('should throw error if formGroup is undefined', () => {
      directive = new StoreFormSyncDirective(store)

      expect(() => directive.ngOnChanges()).toThrow(
        Error('[@larscom/ngrx-store-formsync] You must provide a FormGroup')
      )
    })
  })

  describe('When FormGroup value changes', () => {
    it('should dispatch with initial value', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      })

      directive.ngOnChanges()

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      )
    })

    it('should NOT dispatch with initial value if syncInitialValue is false', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      })

      directive.syncInitialValue = false
      directive.ngOnChanges()

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should not dispatch after directive is destroyed', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      })

      directive.ngOnChanges()

      expect(dispatchSpy).toHaveBeenCalled()
      dispatchSpy.mockReset()

      directive.ngOnDestroy()
      directive.formGroup.get(firstNameField)!.setValue('test')

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should not dispatch if syncDisabled is true', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      })

      directive.syncDisabled = true
      directive.ngOnChanges()

      directive.formGroup.get(firstNameField)!.setValue('test')

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should not dispatch if syncOnSubmit is true', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      })

      directive.syncOnSubmit = true

      directive.ngOnChanges()

      directive.formGroup.get(firstNameField)!.setValue('test')

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should not dispatch if syncValidOnly is true', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: ['test', Validators.minLength(3)]
      })

      directive.syncValidOnly = true

      directive.ngOnChanges()

      expect(dispatchSpy).toHaveBeenCalled()
      dispatchSpy.mockReset()

      directive.formGroup.get(firstNameField)!.setValue('t')

      expect(directive.formGroup.valid).toBeFalsy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should dispatch', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: undefined
      })

      directive.ngOnChanges()

      expect(dispatchSpy).toHaveBeenCalled()
      dispatchSpy.mockReset()

      directive.formGroup.get(firstNameField)!.setValue('test')

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      )
    })

    it('should dispatch raw form value if syncRawValue is true', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: [{ value: undefined, disabled: true }],
        [lastNameField]: [{ value: undefined }]
      })

      directive.syncRawValue = true

      expect(directive.formGroup.get(firstNameField)?.disabled).toBeTruthy()
      expect(directive.formGroup.get(lastNameField)?.disabled).toBeFalsy()

      directive.ngOnChanges()

      directive.formGroup.get(lastNameField)!.setValue('bar')

      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'foo', [lastNameField]: 'bar' } })
      )
    })
  })

  describe('When the store is updated', () => {
    it('should not dispatch after directive is destroyed', () => {
      const formGroup = new UntypedFormGroup({})

      const patchSpy = jest.spyOn(formGroup, 'patchValue')

      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formGroup

      directive.ngOnChanges()

      expect(patchSpy).toHaveBeenCalled()
      patchSpy.mockReset()

      directive.ngOnDestroy()
      store.setState(initialState)

      expect(patchSpy).not.toHaveBeenCalled()
    })

    it('should not dispatch when syncDisabled is true', () => {
      const formGroup = new UntypedFormGroup({})

      const patchSpy = jest.spyOn(formGroup, 'patchValue')

      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formGroup

      directive.syncDisabled = true

      directive.ngOnChanges()

      expect(patchSpy).not.toHaveBeenCalled()
    })

    it('should patch formGroup', () => {
      const formGroup = new UntypedFormGroup({})

      const patchSpy = jest.spyOn(formGroup, 'patchValue')

      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formGroup

      directive.ngOnChanges()

      expect(patchSpy).toHaveBeenCalledWith({ [firstNameField]: 'foo', [lastNameField]: 'bar' }, { emitEvent: false })
    })
  })

  describe('When Submit action is fired', () => {
    it('should not dispatch if syncDisabled is true', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      })

      directive.syncOnSubmit = true
      directive.syncDisabled = true

      directive.onSubmit()

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should not dispatch if syncValidOnly is true', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: ['t', Validators.minLength(3)]
      })

      directive.syncOnSubmit = true
      directive.syncValidOnly = true

      directive.onSubmit()

      expect(directive.formGroup.valid).toBeFalsy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should dispatch', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      })

      directive.syncOnSubmit = true

      directive.onSubmit()

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'test' } })
      )
    })

    it('should not dispatch if syncOnSubmit is false', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: 'test'
      })

      directive.syncOnSubmit = false

      directive.onSubmit()

      expect(directive.formGroup.valid).toBeTruthy()
      expect(dispatchSpy).not.toHaveBeenCalled()
    })

    it('should dispatch raw form value if syncRawValue is true', () => {
      directive = new StoreFormSyncDirective(store)
      directive.storeFormSyncId = storeFormSyncId
      directive.formGroup = formBuilder.group({
        [firstNameField]: [{ value: 'foo', disabled: true }],
        [lastNameField]: [{ value: 'bar', disabled: false }]
      })

      directive.syncOnSubmit = true
      directive.syncRawValue = true

      expect(directive.formGroup.get(firstNameField)?.disabled).toBeTruthy()
      expect(directive.formGroup.get(lastNameField)?.disabled).toBeFalsy()

      directive.onSubmit()

      expect(dispatchSpy).toHaveBeenCalledWith(
        storeActions.patchForm({ storeFormSyncId, value: { [firstNameField]: 'foo', [lastNameField]: 'bar' } })
      )
    })
  })
})
