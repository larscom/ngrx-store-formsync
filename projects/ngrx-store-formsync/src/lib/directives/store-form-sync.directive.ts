import { Directive, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { StoreFormSyncConfig } from '../store-form-sync-config';
import { patchForm } from '../store/form.actions';
import * as formSelectors from '../store/form.selectors';
import { STORE_FORM_SYNC_CONFIG } from '../tokens/config';

const dateRegExp = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
const defaultConfig: StoreFormSyncConfig = {
  syncOnSubmit: false,
  syncRawValue: false,
  syncValidOnly: false,
  serialize: (formValue: any): string => JSON.stringify(formValue),
  deserialize: (formValue: string): any => {
    return JSON.parse(formValue, (_: string, value: string) =>
      dateRegExp.test(String(value)) ? new Date(value) : value
    );
  }
};

@Directive({
  selector: '[storeFormSync]'
})
export class StoreFormSyncDirective implements OnInit, OnDestroy {
  @Input() formGroup!: UntypedFormGroup;

  @Input() storeFormSyncId!: string;
  @Input() storeFormSyncDisabled!: boolean;

  private readonly config = { ...defaultConfig, ...this.userConfig };
  private readonly onDestroy = new Subject<void>();

  constructor(
    @Inject(STORE_FORM_SYNC_CONFIG) private readonly userConfig: Partial<StoreFormSyncConfig>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.validateInputs();

    const { config, storeFormSyncId, formGroup, store } = this;

    formGroup.valueChanges
      .pipe(
        takeUntil(this.onDestroy),
        filter(() => this.dispatchWhenValueChanges())
      )
      .subscribe(() => this.dispatch(config.syncRawValue));

    store
      .pipe(
        takeUntil(this.onDestroy),
        filter(() => !this.storeFormSyncDisabled),
        select(formSelectors.selectFormValue({ storeFormSyncId })),
        filter((value) => value != null),
        map((value) => config.deserialize(JSON.stringify(value)))
      )
      .subscribe((value) => formGroup.patchValue(value, { emitEvent: false }));
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
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

  private validateInputs(): void {
    if (!this.formGroup) throw new Error('[@larscom/ngrx-store-formsync] FormGroup is undefined');
    if (!this.storeFormSyncId) throw new Error('[@larscom/ngrx-store-formsync] You must provide a storeFormSyncId');
  }
}
