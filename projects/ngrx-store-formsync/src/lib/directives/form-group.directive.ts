import { Directive, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IFormSyncConfig } from '../models/form-sync-config';
import { patchForm } from '../store/form.actions';
import * as formSelectors from '../store/form.selectors';
import { formSyncConfigToken } from '../tokens/config';

@Directive({
  selector: '[formGroup]'
})
export class FormGroupDirective implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Input() formGroupId: string;
  @Input() formGroupSync = true;

  constructor(
    @Inject(formSyncConfigToken) private readonly config: IFormSyncConfig,
    private readonly store: Store<any>
  ) {}

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (!this.formGroupId) {
      return;
    }

    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formGroupSync),
        filter(() => !(this.config.syncValidOnly && !this.formGroup.valid)),
        filter(() => !this.config.syncOnSubmit)
      )
      .subscribe(() => this.dispatch(this.config.syncRawValue));

    this.store
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.formGroupSync),
        select(formSelectors.selectFormValue({ id: this.formGroupId })),
        filter((value) => value != null)
      )
      .subscribe((value) => this.formGroup.patchValue(value, { emitEvent: false }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  @HostListener('submit')
  onSubmit(): void {
    if (!this.formGroupId || !this.formGroupSync) {
      return;
    }

    if (!this.config.syncOnSubmit) {
      return;
    }

    if (this.config.syncValidOnly && !this.formGroup.valid) {
      return;
    }

    this.dispatch(this.config.syncRawValue);
  }

  private dispatch(syncRawValue: boolean): void {
    const value = syncRawValue ? this.formGroup.getRawValue() : this.formGroup.value;
    this.store.dispatch(patchForm({ id: this.formGroupId, value }));
  }
}
