import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from "@angular/router/testing";

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './root.component';
import { AppComponent } from './app.component';
import { CesiumDirective } from './cesium.directive';
import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    CesiumDirective
  ],
  imports: [
    BrowserModule,
    RouterTestingModule,
    AppRoutingModule
  ],
  providers: [DataService, CesiumDirective],
  bootstrap: [RootComponent]
})
export class AppModule { }
