import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
    this.data.msg=this.data.msg.replace(new RegExp('\n', 'g'), "<br />");
    this.data = this.data;
  }

  onCloseConfirm() {
    this.dialogRef.close(true);
 }

 onCancelClick() {
    this.dialogRef.close();
 }

}
