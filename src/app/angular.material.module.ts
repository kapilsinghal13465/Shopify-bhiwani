import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
    imports: [
        MatButtonModule,
        MatTableModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatAutocompleteModule,
        MatToolbarModule
    ],
    exports: [
        MatButtonModule,
        MatTableModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatAutocompleteModule,
        MatToolbarModule
    ]
})

export class AngularMaterialModule { }