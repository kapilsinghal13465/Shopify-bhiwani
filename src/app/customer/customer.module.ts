import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent
  }
];

@NgModule({
  declarations: [CustomerListComponent],
  imports: [
    CommonModule, SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: []
})
export class CustomerModule { }
