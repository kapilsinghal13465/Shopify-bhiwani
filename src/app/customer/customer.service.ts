import { IfStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private _electronService: ElectronService,
  ) { }

  getCustomerList(): Observable<any>{
    this._electronService.ipcRenderer.sendSync('read_customer_list');
    return (new Observable(subscriber=>{
       this._electronService.ipcRenderer.on('customer_chanel', (event, customerData) => {
         subscriber.next(customerData);
      })
    }))
  }

  getStoreList(): Observable<any>{
    this._electronService.ipcRenderer.sendSync('read');
    return (new Observable(subscriber=>{
       this._electronService.ipcRenderer.on('store_chanel', (event, storeData) => {
         subscriber.next(storeData);
      })
    }))
  }

  getCustomerBillFields(storeList) {
    return [
      {
        type: 'text',
        accept: 'input',
        placeholder: 'Please Enter customer name',
        label: 'Customer Name',
        col: '4',
        colsm: '4',
        key: 'customer_name',
        required: true
      },
      {
        type: 'number',
        accept: 'input',
        placeholder: 'Please Enter mobile number',
        label: 'Mobile Number',
        col: '4',
        colsm: '4',
        key: 'mobile_num',
        required: false
      },
      {
        type: 'autoIncrement',
        accept: 'increment',
        placeholder: 'Please Enter Bill ID',
        label: 'Bill ID',
        col: '',
        colsm: '',
        key: 'bill_id',
        required: false
      },
      {
        type: 'text',
        accept: 'autocomplete',
        placeholder: 'Search by Item Name',
        label: 'Item Name',
        options: storeList,
        col: '12',
        colsm: '12',
        key: 'item_name',
        required: false
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

  getItemList() {
    return [
      {
        type: 'index',
        accept: 'static',
        placeholder: 'Item Index',
        label: 'Item Index',
        col: '1',
        colsm: '1',
        key: 'name',
        required: true
      },
      {
        type: 'item_name',
        accept: 'static',
        placeholder: 'Search by Item Name',
        label: 'Item Name',
        col: '2',
        colsm: '2',
        key: 'item_name',
        required: false
      },
      {
        type: 'number',
        accept: 'input',
        placeholder: 'Please Enter selling rate',
        label: 'Selling Rate (in Rs)',
        col: '2',
        colsm: '2',
        key: 'selling_rate',
        required: true
      },
      {
        type: 'number',
        accept: 'input',
        placeholder: 'Please Enter product weight',
        label: 'Product weight',
        col: '2',
        colsm: '2',
        key: 'product_weight',
        required: true
      },
      {
        type: 'select',
        accept: 'select',
        placeholder: 'Unit',
        options: ['Kg', 'g', 'l', 'tonn'],
        label: 'Product Unit',
        col: '2',
        colsm: '2',
        key: 'product_unit_type',
        required: true
      },
      {
        type: 'none',
        accept: 'time',
        placeholder: 'none',
        label: 'Time',
        col: 'none',
        colsm: 'none',
        key: 'add_time',
        required: false
      },
      {
        type: 'none',
        accept: 'close',
        placeholder: 'Close',
        label: 'Close',
        col: '1',
        colsm: '1',
        key: '',
        required: false
      },
      {
        type: 'none',
        accept: 'info',
        placeholder: 'Info',
        label: 'Info',
        col: '1',
        colsm: '1',
        key: '',
        required: false
      }
    ];
  }

  clean(obj) {
    if (Array.isArray(obj.item_list)) {
      obj.item_list = obj.item_list.map(item => {
        console.log(item)
        for (var propName in item) {
          if (item[propName] === '' || item[propName] === null || item[propName] === undefined) {
            delete item[propName];
          }
        }
        return item;
      })
    }

    for (var propName in obj) {
      if (obj[propName] === '' || obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
}
