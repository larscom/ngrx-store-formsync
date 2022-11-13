import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { storeActions } from '@larscom/ngrx-store-formsync';
import { select, Store } from '@ngrx/store';
import { IRootState } from './models/root-state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  readonly store$ = this.store.pipe(select(({ storeFormSync }) => storeFormSync));

  readonly formGroup = this.formBuilder.group({
    firstName: [undefined, [Validators.minLength(4)]],
    lastName: [undefined, [Validators.minLength(4)]],

    syncDisabled: false,
    syncOnSubmit: false,
    syncRawValue: false,
    syncValidOnly: false,
    syncInitialValue: true
  });
  readonly initialValue = this.formGroup.value;
  readonly storeFormSyncId = 'cb0f1727-29cb-44f8-b870-a804a9796ce8';

  constructor(private readonly store: Store<IRootState>, private readonly formBuilder: FormBuilder) {}

  onReset(): void {
    const { storeFormSyncId, initialValue: value } = this;
    this.store.dispatch(storeActions.setForm({ storeFormSyncId, value }));
  }

  onSubmit(): void {
    if (!this.formGroup.get('syncOnSubmit')?.value) this.onReset();
  }
}
