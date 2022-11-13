import { Directive, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { identity, Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { patchForm } from '../store/form.actions';
import * as formSelectors from '../store/form.selectors';

@Directive({
  selector: '[formGroup][storeFormSyncId]'
})
export class StoreFormSyncDirective implements OnDestroy, OnChanges {
  @Input() formGroup!: UntypedFormGroup;
  @Input() storeFormSyncId!: string | number;

  @Input() syncDisabled: boolean = false;
  @Input() syncOnSubmit: boolean = false;
  @Input() syncRawValue: boolean = false;
  @Input() syncValidOnly: boolean = false;

  @Input() syncInitialValue: boolean = true;

  constructor(private readonly store: Store) {}

  private readonly notifier = new Subject<void>();

  ngOnChanges(): void {
    this.validateInputs();

    this.notifier.next();

    const { storeFormSyncId, syncInitialValue, syncRawValue } = this;

    const startWithFn = syncInitialValue ? startWith(this.formGroup.value) : identity;

    this.formGroup.valueChanges
      .pipe(
        startWithFn,
        takeUntil(this.notifier),
        filter(() => this.dispatchWhenValueChanges())
      )
      .subscribe(() => this.dispatch(syncRawValue));

    this.store
      .pipe(
        takeUntil(this.notifier),
        filter(() => !this.syncDisabled),
        select(formSelectors.selectFormValue({ storeFormSyncId })),
        filter((value) => value != null)
      )
      .subscribe((value) => this.formGroup.patchValue(value, { emitEvent: false }));
  }

  ngOnDestroy(): void {
    this.notifier.next();
    this.notifier.complete();
  }

  @HostListener('submit')
  onSubmit(): void {
    if (this.dispatchOnSubmit()) this.dispatch(this.syncRawValue);
  }

  private validateInputs(): void {
    if (!this.formGroup) throw new Error('[@larscom/ngrx-store-formsync] You must provide a FormGroup');
    if (!this.storeFormSyncId) throw new Error('[@larscom/ngrx-store-formsync] You must provide a storeFormSyncId');
  }

  private dispatch(syncRawValue: boolean): void {
    const { storeFormSyncId, formGroup } = this;
    const value = syncRawValue ? formGroup.getRawValue() : formGroup.value;

    this.store.dispatch(patchForm({ storeFormSyncId, value }));
  }

  private dispatchOnSubmit(): boolean {
    const { syncOnSubmit, syncDisabled, formGroup, syncValidOnly } = this;

    if (!syncOnSubmit) {
      return false;
    }

    if (syncDisabled) {
      return false;
    }

    if (syncValidOnly) {
      return formGroup.valid;
    }

    return true;
  }

  private dispatchWhenValueChanges(): boolean {
    const { syncDisabled, formGroup, syncOnSubmit, syncValidOnly } = this;

    if (syncDisabled) {
      return false;
    }

    if (syncOnSubmit) {
      return false;
    }

    if (syncValidOnly) {
      return formGroup.valid;
    }

    return true;
  }
}
