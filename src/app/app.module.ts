import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { StoreFormSyncModule } from '@larscom/ngrx-store-formsync';
import { RuntimeChecks, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

const runtimeChecks: RuntimeChecks = {
  strictStateSerializability: true,
  strictActionSerializability: true,
  strictStateImmutability: true,
  strictActionImmutability: true,
  strictActionWithinNgZone: true,
  strictActionTypeUniqueness: true
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    StoreFormSyncModule.forRoot(),
    StoreModule.forRoot([], { runtimeChecks }),
    StoreDevtoolsModule.instrument()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
