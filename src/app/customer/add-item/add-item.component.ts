import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoDialogComponent } from 'src/app/shared/info-dialog/info-dialog.component';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  @Input() public storeSlotData;
  @Output() removeItemIndex = new EventEmitter<any>();
  @Output() changeItemIndex = new EventEmitter<any>();
  myForm;
  getToatalData;
  baseData;
  constructor(
    // @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddItemComponent>,
    private fb: FormBuilder,
    private customerService: CustomerService) {
    // this.getToatalData = data;
    this.baseData = this.customerService.getItemList();
    console.log('this.baseData', this.baseData);
     this.myForm = this.toFormGroup();
 }

  ngOnInit(): void {
    console.log(this.storeSlotData);
    this.baseData.forEach(fitem => {
      this.myForm.controls[fitem.key].setValue(this.storeSlotData.data.selectedItem[fitem.key]);
    });

    this.myForm.valueChanges.subscribe(x => {
      console.log('form value changed')
      console.log(x);
      const data = {
       index: this.storeSlotData.index,
       rowData: x
      }
      this.changeItemIndex.emit(data);
    })
  }

  toFormGroup() {
    const group: any = {};
    this.baseData.forEach(item => {
      group[item.key] = item.required ? new FormControl(item.value || '', Validators.required)
                                              : new FormControl(item.value || '');
    });
    return new FormGroup(group);
  }

  onRemoveClick(index) {
    const obj = {
      removeItemIndex: index
    }
    this.removeItemIndex.emit(obj);
  }

  showInfoDialog(item) {
    this.dialog.open(InfoDialogComponent, {
      width: '',
      data: this.storeSlotData.data.selectedItem
    });
  }
}
