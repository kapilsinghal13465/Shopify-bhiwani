import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {
  itemList = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<InfoDialogComponent>,
  ) { }

  ngOnInit(): void {
    console.log("data=========", this.data)
    // for(let i in this.data) {
    //   this.itemList.push([i, this.data[i]]);
    // }
    this.itemList = Object.keys(this.data).map((k) => { return {key : k, value : this.data[k]} });
    console.log( this.itemList)
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
