import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

import  *  as  storeData1  from  '../../../assets/store.json';
import  *  as  customerData1  from  '../../../assets/customer.json';
import { ElectronService } from 'ngx-electron';

import { Sort } from '@angular/material/sort';
import { CustomerService } from '../customer.service';

export interface CunsumerListTable {
  item_id: number;
  customer_name: string;
  add_time: number;
}


// let ELEMENT_DATA: CunsumerListTable[] = (storeData  as  any).default;
let ELEMENT_DATA: CunsumerListTable[] = [];

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  displayedColumns: string[] = ['item_id', 'customer_name', 'add_time', 'actions'];
  dataSource = new MatTableDataSource<CunsumerListTable>(ELEMENT_DATA);
  sortedData: CunsumerListTable[];
  storeList;

  constructor(
    public dialog: MatDialog,
    private _electronService: ElectronService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('inside constructor')
  }

  ngOnInit(): void {
    if (this._electronService && this._electronService.ipcRenderer) {
      this.customerService.getCustomerList().subscribe(customerData => {
        this.dataSource.filteredData.push(...customerData);
        this.dataSource.data = [...this.dataSource.data];
        this.sortedData = this.dataSource.data;
        this.cdr.detectChanges();
        console.log('On customerData', customerData);
      })
      this.customerService.getStoreList().subscribe(storeData => {
        this.storeList = storeData;
        console.log('On storeData', storeData);
      })
    } else {
      const customerData = (customerData1  as  any).default;
      this.dataSource.filteredData.push(...customerData);
      this.dataSource.data = [...this.dataSource.data];
      this.sortedData = this.dataSource.data;
      const storeData = (storeData1  as  any).default;
      this.storeList = storeData;
      console.log('On inti', storeData);
    }
   
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  sortData(sort: Sort) {
    console.log(sort)
    const data =  this.sortedData.slice();
    console.log(data)
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'customer_name': return this.compare(a.customer_name, b.customer_name, isAsc);
        case 'add_time': return this.compare(a.add_time, b.add_time, isAsc);
        default: return 0;
      }
    });
    this.cdr.detectChanges();
  }

 compare(a: number | string, b: number | string, isAsc: boolean) {
   console.log(a)
   console.log(b)
   console.log(isAsc)
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  

  createNewBillModel() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'dialog',
      data: {
        fields: this.customerService.getCustomerBillFields(this.storeList),
        item: '',
        isEdit: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result===', result);
      if(result && result.finalData && result.finalData.item_list.length > 0) {
        result.finalData.item_id = 'B' + Date.now();
        result.finalData.add_time = Date.now();
        result.finalData.customer_name = result.finalData.item_list[0].customer_name;
        result.finalData.mobile_num = result.finalData.item_list[0].mobile_num;
        const addItem = this.customerService.clean(result.finalData);
        console.log("addItem====", addItem);
        if (addItem) {
          this.dataSource.filteredData.push(addItem);
          this.dataSource.data = [...this.dataSource.data];
          this.sortedData = this.dataSource.data;
          if (this._electronService && this._electronService.ipcRenderer) {
            this._electronService.ipcRenderer.send('write_customer_list', this.dataSource.filteredData);
            this._electronService.ipcRenderer.on('write_customer_list', (event, error) => {
              console.log('errr', error);
            });
          }
          this.cdr.detectChanges();
        }
      }
    });
  }

  editTableDetails(item) {
    console.log(item);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '',
      data: {
        fields: this.customerService.getCustomerBillFields(this.storeList),
        item: item,
        isEdit: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.finalData && result.finalData.item_list.length > 0) {
        console.log("result", result);
        result.finalData.item_id = result.item_id;
        result.finalData.add_time = Date.now();
        result.finalData.customer_name = result.finalData.item_list[0].customer_name;
        result.finalData.mobile_num = result.finalData.item_list[0].mobile_num;
        const addItem = this.customerService.clean(result.finalData);
        console.log("result.finalData", result.finalData)
        if (addItem) {
          const itemIndex = this.dataSource.filteredData.findIndex(row => row.item_id === result.item_id);
          console.log("itemIndex", itemIndex)
          if(itemIndex !== -1) {
            this.dataSource.filteredData[itemIndex] = addItem;
          }
          this.dataSource.data = [...this.dataSource.data];
          console.log("this.dataSource.data", this.dataSource.data)
          this.sortedData = this.dataSource.data;
          if (this._electronService && this._electronService.ipcRenderer) {
            this._electronService.ipcRenderer.send('write_customer_list', this.dataSource.filteredData);
            this._electronService.ipcRenderer.on('write_customer_list', (event, error) => {
              console.log('errr', error);
            });
          }
          this.cdr.detectChanges();
        }
      }
    });
  }

  deleteTableDetails(item) {
    console.log(item);
    const itemIndex = this.dataSource.filteredData.findIndex(row => row.item_id === item.item_id);
    if (itemIndex !== -1) {
      this.dataSource.filteredData.splice(itemIndex, 1);
      this.dataSource.data = [...this.dataSource.data];
      this.sortedData = this.dataSource.data;
      if (this._electronService && this._electronService.ipcRenderer) {
        this._electronService.ipcRenderer.send('write_customer_list', this.dataSource.filteredData);
        this._electronService.ipcRenderer.on('write_customer_list', (event, error) => {
          console.log('errr', error);
        });
      }
    }
    this.cdr.detectChanges();
  }
}
