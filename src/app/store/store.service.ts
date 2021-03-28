import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }

  getAddItemFields() {
    return [
      {
        type: 'autoIncrement',
        accept: 'increment',
        placeholder: 'Please Enter Item ID',
        label: 'Item ID',
        col: '',
        colsm: '',
        key: 'item_id',
        required: false
      },
      {
        type: 'text',
        accept: 'input',
        placeholder: 'Please Enter Item Location',
        label: 'Item Location',
        col: '6',
        colsm: '12',
        key: 'item_location',
        required: true
      },
      {
        type: 'text',
        accept: 'input',
        placeholder: 'Please Enter product name',
        label: 'Product Name',
        col: '6',
        colsm: '12',
        key: 'name',
        required: true
      },
      {
        type: 'number',
        accept: 'input',
        placeholder: 'Please Enter purchase rate',
        label: 'Purchase Rate (in Rs)',
        col: '6',
        colsm: '12',
        key: 'purchage_rate',
        required: true
      },
      {
        type: 'number',
        accept: 'input',
        placeholder: 'Please Enter selling rate',
        label: 'Selling Rate (in Rs)',
        col: '6',
        colsm: '12',
        key: 'selling_rate',
        required: true
      },
      {
        type: 'number',
        accept: 'input',
        placeholder: 'Please Enter product weight',
        label: 'Product weight',
        col: '6',
        colsm: '12',
        key: 'product_weight',
        required: true
      },
      {
        type: 'select',
        accept: 'select',
        placeholder: 'Unit',
        options: ['Kg', 'g', 'l', 'tonn'],
        label: 'Product Unit',
        col: '4',
        colsm: '8',
        key: 'product_unit_type',
        required: true
      },
      {
        type: 'none',
        accept: 'time',
        placeholder: 'none',
        label: 'Time',
        col: 'none',
        colsm: '12',
        key: 'add_time',
        required: false
      },
      {
        type: 'none',
        accept: 'submit',
        placeholder: 'Submit',
        label: 'Submit',
        col: '12',
        colsm: '12',
        key: '',
        required: false
      }
    ];
  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === '' || obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }


}
