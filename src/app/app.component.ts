import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <form formGroupId="test" [formGroup]="formGroup">
      <div>
        <input id="firstName" matInput formControlName="firstName" placeholder="First name" />

        <input id="lastName" matInput formControlName="lastName" placeholder="Last name" />
      </div>

      <button>Submit</button>
    </form>
  `
})
export class AppComponent {
  readonly formGroup = this.builder.group({
    firstName: [String(), Validators.compose([Validators.required])],
    lastName: [String(), Validators.compose([Validators.required])]
  });

  constructor(private readonly builder: FormBuilder) {}
}
