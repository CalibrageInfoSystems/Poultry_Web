import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-payment-conditions',
  templateUrl: './payment-conditions.component.html',
  styleUrls: ['./payment-conditions.component.css']
})
export class PaymentConditionsComponent implements OnInit {
  users: any[];
  
  data: any = [];
  isAddingPayment: boolean=false;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
   
    this.getData();
  }
  
  addRow() {
    var filterArray = this.data.filter(x => x.isEditable == true);
    if(filterArray.length>0){
      for(var i=0;i<this.data.length;i++){
        this.data[i].isEditable=false;
      }
    }
    this.data = [...this.data];
    this.data.unshift({name: "", description: "",isactive:"", isEditable: true, isAdd:true});
  }

  cancelPaymentAddClick(row){
    this.data = [...this.data];
    this.data.shift();
    row.isEditable=false;
  }
  addPaymentClick(row){
    this.data = [...this.data];
    this.data.shift();
    row.isEditable=false;
  }
  onUpdateRow(row){
    row.isEditable=false;
  }

  editRow(row) {
    if(this.data[0].isAdd==true){
    this.data = [...this.data];
    this.data.shift();
    }
    this.data.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd=false;
  }

  cancelPaymentEditClick(row){
    row.isEditable=false;
  }

  save(row) {
    row.isEditable = false
  }

  delete(row,index){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data:{ msg:"Are you sure you want to delete ?"} ,
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined){
        this.data = [...this.data];
        this.data.splice(index, 1);
      }
      });
 }

 download() {
  var csvData = this.ConvertToCSV(this.data);
  var a = document.createElement("a");
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  var blob = new Blob([csvData], { type: 'text/csv' });
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'Payment Condition.csv';/* your file name*/
  a.click();
  return 'success';
}

ConvertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  var row = "";
  for (var index in objArray[0]) {
    //Now convert each value to string and comma-separated
    row += index + ',';
  }
  row = row.slice(0, -1);
  //append Label row with line break
  str += row + '\r\n';
  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','
      line += array[i][index];
    }
    str += line + '\r\n';
  }
  return str;
}

  getData() {
    this.data = [
      { name: "Payment1", description: "Condition1",isactive:true },
      { name: "Payment2", description: "Condition2",isactive:false },
      { name: "Payment3", description: "Condition3",isactive:false },
     
    ];     
    this.data.map(row => {
      row.isEditable = false;
    });

  };


}
