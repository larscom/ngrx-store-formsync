import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IRootState } from './models/root-state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private readonly store: Store<IRootState>, private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // this.form = this.builder.group({
    //   lessoncode: 'TMM',
    //   countrycode: 'CA',
    //   languagecode: 'en',
    //   tasks: this.builder.array(this.getTasks())
    // });
    // this.initialFormValue = this.form.value;
  }
}
