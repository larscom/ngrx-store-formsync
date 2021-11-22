import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StoreModule } from 'src/store/store.module';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, StoreModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
