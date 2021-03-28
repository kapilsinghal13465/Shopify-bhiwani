import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular.material.module';
import { DialogComponent } from './dialog/dialog.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxElectronModule } from 'ngx-electron';
import { AddItemComponent } from '../customer/add-item/add-item.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { KeyTotextPipe } from '../pipes/key-totext.pipe';


@NgModule({
  declarations: [DialogComponent, AddItemComponent, InfoDialogComponent, KeyTotextPipe],
  imports: [
    // Modules
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxElectronModule
  ],
  exports: [
    AngularMaterialModule,
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxElectronModule,
    KeyTotextPipe
  ]
})
export class SharedModule { }
