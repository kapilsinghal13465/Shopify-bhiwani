import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AddItemComponent } from 'src/app/customer/add-item/add-item.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, AfterViewInit {
  baseData;
  inputsElem = [];
  myForm;
  getToatalData;

  // For mat auto complate
  filteredOptions;
  storeSlotData = [];

  @ViewChild(AddItemComponent ) child: AddItemComponent ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<DialogComponent>,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    this.getToatalData = data;
    this.baseData = data.fields;
    console.log('this.baseData', this.baseData);
     this.myForm = this.toFormGroup();
   }

  ngOnInit(): void {
    if (this.getToatalData.isEdit) {
      this.baseData.forEach(fitem => {
        this.myForm.controls[fitem.key].setValue(this.getToatalData.item[fitem.key]);
      });
      console.log(this.getToatalData);
      const data = this.getToatalData.item.item_list.map((item, index) => {
       return {
          index: index + 1,
          data: {
            selectedItem: item
          }
        };
      })
       
      this.storeSlotData.push(...data);
    }
    const findAutoCompleteKey = this.data.fields.find(field => field.accept === 'autocomplete');
    this.myForm.get(findAutoCompleteKey.key).valueChanges.subscribe((val) => {
      console.log(val)
      this.filteredOptions = this._filter(val, findAutoCompleteKey.options)
    })
  }

  ngAfterViewInit() {

  }

  // for auto complete
  private _filter(value: string, options): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  toFormGroup() {
    const group: any = {};
    this.baseData.forEach(item => {
      group[item.key] = item.required ? new FormControl(item.value || '', Validators.required)
                                              : new FormControl(item.value || '');
    });
    return new FormGroup(group);
  }

  changeItemIndex(event) {
    const isFindIndex = this.storeSlotData.findIndex(item => item.index === event.index)
    if(isFindIndex !== -1) {
      const finalStoreData = {
        add_time: this.storeSlotData[isFindIndex].data.selectedItem.add_time,
        item_id: this.storeSlotData[isFindIndex].data.selectedItem.item_id,
        item_location: this.storeSlotData[isFindIndex].data.selectedItem.item_location,
        name: this.storeSlotData[isFindIndex].data.selectedItem.name,
        product_unit_type: event.rowData.product_unit_type,
        product_weight: event.rowData.product_weight,
        purchage_rate: this.storeSlotData[isFindIndex].data.selectedItem.add_time,
        selling_rate: event.rowData.selling_rate,
      }
      this.storeSlotData[isFindIndex].finalStoreData = finalStoreData;
    }

  }

  onSubmit() {
    if (this.storeSlotData === []) {
      this.dialogRef.close({
        finalData: this.myForm.value,
        isEdit: this.getToatalData.isEdit
      });
    } else {
      let isErrorFound = false;
      // Add Item in Cunsumer
      this.storeSlotData.map(item => {
        if(!item.finalStoreData) {
          return item.finalStoreData = item.data.selectedItem
        }
        if(item.finalStoreData.selling_rate === '' || item.finalStoreData.product_weight === '' || 
        item.finalStoreData.selling_rate.includes('e') || item.finalStoreData.product_weight.includes('e')) {
          this.toastr.error('Invalid Form Data');
          isErrorFound = true;
        }
      });
    
      if (!isErrorFound) {
        const finalData = {};
        finalData['item_list'] = this.storeSlotData.map(item => {
          item = item.finalStoreData;
          item.customer_name = this.myForm.value.customer_name;
          item.mobile_num = this.myForm.value.mobile_num;
          return item;
        });
        this.dialogRef.close({
          finalData: finalData,
          isEdit: this.getToatalData.isEdit,
          item_id: this.getToatalData.item.item_id,
          customer_name: this.myForm.value.customer_name,
          mobile_num: this.myForm.value.mobile_num,
        });
      }
    } 
  }

  onNoClick() {
    this.dialogRef.close();
  }

  fillOptionDetails(option) {
    console.log("this.storeSlotData", this.storeSlotData);
    console.log("option", option);
    if(this.storeSlotData.length > 0) {
      const isItemAlreadyExist = this.storeSlotData.find(item => item.data.selectedItem.name === option.name);
      if(isItemAlreadyExist) {
        this.toastr.error('Item Alreay Exists');
        return;
      }
    }

    const item = {
      index: this.storeSlotData.length + 1,
      data: {
        selectedItem: option
      }
    };
    this.storeSlotData.push(item);
    console.log(option);
  }

  // Delete index of add-item
  removeItemIndex(obj) {
    console.log(obj);
    const isFindIndex = this.storeSlotData.findIndex(item => item.index === obj.removeItemIndex)
    if(isFindIndex !== -1)this.storeSlotData.splice(isFindIndex, 1);
  }

}
