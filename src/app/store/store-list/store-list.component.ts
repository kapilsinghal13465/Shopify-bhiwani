import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

import  *  as  storeData1  from  '../../../assets/store.json';
import { ElectronService } from 'ngx-electron';
import * as XLSX from 'xlsx';
import { StoreService } from '../store.service';
import { Sort } from '@angular/material/sort';

export interface PeriodicElement {
  item_id: number;
  name: string;
  item_location: number;
  purchage_rate: number;
  selling_rate: number;
  product_weight: string;
}

// let ELEMENT_DATA: PeriodicElement[] = (storeData  as  any).default;
let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  displayedColumns: string[] = ['item_id', 'item_location', 'name', 'purchage_rate', 'selling_rate', 'product_weight', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  sortedData: PeriodicElement[];

  constructor(
    public dialog: MatDialog,
    private _electronService: ElectronService,
    private storeService: StoreService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('inside constructor')
  }

  ngOnInit(): void {
    if (this._electronService && this._electronService.ipcRenderer) {
      this._electronService.ipcRenderer.sendSync('read');
      this._electronService.ipcRenderer.on('store_chanel', (event, storeData) => {
        console.log('event', event);
        this.dataSource.filteredData.push(...storeData);
        this.dataSource.data = [...this.dataSource.data];
        this.sortedData = this.dataSource.data;
        this.cdr.detectChanges();
        console.log('On inti', storeData);
      })
    } else {
      const storeData = (storeData1  as  any).default;
      this.dataSource.filteredData.push(...storeData);
      this.dataSource.data = [...this.dataSource.data];
      this.sortedData = this.dataSource.data;
      console.log('On inti', storeData);
    }
   
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
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
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'purchage_rate': return this.compare(a.purchage_rate, b.purchage_rate, isAsc);
        case 'selling_rate': return this.compare(a.selling_rate, b.selling_rate, isAsc);
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
  

  addItemModel() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '',
      data: {
        fields: this.storeService.getAddItemFields(),
        item: '',
        isEdit: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.finalData) {
        result.finalData.item_id = 'I' + Date.now();
        result.finalData.add_time = Date.now();
        const addItem = this.storeService.clean(result.finalData);
        if (addItem) {
          this.dataSource.filteredData.push(addItem);
          this.dataSource.data = [...this.dataSource.data];
          this.sortedData = this.dataSource.data;
          if (this._electronService && this._electronService.ipcRenderer) {
            this._electronService.ipcRenderer.send('write_store_channel', this.dataSource.filteredData);
            this._electronService.ipcRenderer.on('write_store_channel', (event, error) => {
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
        fields: this.storeService.getAddItemFields(),
        item: item,
        isEdit: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.finalData) {
        const addItem = this.storeService.clean(result.finalData);
        if (addItem) {
          const itemIndex = this.dataSource.filteredData.findIndex(row => row.item_id === addItem.item_id);
          if(itemIndex !== -1) {
            this.dataSource.filteredData[itemIndex] = addItem;
          }
          this.dataSource.data = [...this.dataSource.data];
          this.sortedData = this.dataSource.data;
          if (this._electronService && this._electronService.ipcRenderer) {
            this._electronService.ipcRenderer.send('write_store_channel', this.dataSource.filteredData);
            this._electronService.ipcRenderer.on('write_store_channel', (event, error) => {
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
        this._electronService.ipcRenderer.send('write_store_channel', this.dataSource.filteredData);
        this._electronService.ipcRenderer.on('write_store_channel', (event, error) => {
          console.log('errr', error);
        });
      }
    }
    this.cdr.detectChanges();
  }


}
