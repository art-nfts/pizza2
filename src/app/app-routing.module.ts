import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '', component: AppComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
