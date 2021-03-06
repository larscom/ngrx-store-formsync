import { Directive, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { StoreFormSyncConfig } from '../store-form-sync-config';
import { patchForm } from '../store/form.actions';
import * as formSelectors from '../store/form.selectors';
import { storeFormSyncConfigToken } from '../tokens/config';

const requireInputs = (formGroup?: UntypedFormGroup, storeFormSyncId?: string): void => {
  if (!formGroup) {
    throw new Error('StoreFormSync: formGroup is missing!');
  }

  if (!storeFormSyncId) {
    throw new Error('StoreFormSync: storeFormSyncId is missing!');
  }
};

@Directive({
  selector: '[storeFormSync]'
})
export class StoreFormSyncDirective implements OnInit, OnDestroy {
  @Input() formGroup: UntypedFormGroup;

  @Input() storeFormSyncId: string;
  @Input() storeFormSyncDisabled: boolean;

  constructor(
    @Inject(storeFormSyncConfigToken) private readonly config: StoreFormSyncConfig,
    private readonly store: Store
  ) {}

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const { storeFormSyncId, formGroup, store } = this;

    requireInputs(formGroup, storeFormSyncId);

    formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.dispatchWhenValueChanges())
      )
      .subscribe(() => this.dispatch(this.config.syncRawValue));

    store
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !this.storeFormSyncDisabled),
        select(formSelectors.selectFormValue({ storeFormSyncId })),
        map((value) => (value ? this.config.deserialize(JSON.stringify(value)) : value))
      )
      .subscribe((value) => formGroup.patchValue(value, { emitEvent: false }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  @HostListener('submit')
  onSubmit(): void {
    if (this.skipDispatchOnSubmit()) {
      return;
    }
    this.dispatch(this.config.syncRawValue);
  }

  private dispatch(syncRawValue: boolean): void {
    const { storeFormSyncId, formGroup } = this;
    const formValue = syncRawValue ? formGroup.getRawValue() : formGroup.value;
    const value = JSON.parse(this.config.serialize(formValue));

    this.store.dispatch(patchForm({ storeFormSyncId, value }));
  }

  private skipDispatchOnSubmit(): boolean {
    const { storeFormSyncDisabled, formGroup, config } = this;

    if (storeFormSyncDisabled) {
      return true;
    }

    if (config.syncValidOnly) {
      return !formGroup.valid;
    }

    return false;
  }

  private dispatchWhenValueChanges(): boolean {
    const { storeFormSyncDisabled, formGroup, config } = this;

    if (storeFormSyncDisabled) {
      return false;
    }

    if (config.syncOnSubmit) {
      return false;
    }

    if (config.syncValidOnly) {
      return formGroup.valid;
    }

    return true;
  }
}
