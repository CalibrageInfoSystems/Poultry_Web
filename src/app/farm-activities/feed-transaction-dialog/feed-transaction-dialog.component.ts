import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDialogRef, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/data.service';
import { DataFactory } from 'src/app/shared/dataFactory';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-feed-transaction-dialog',
  templateUrl: './feed-transaction-dialog.component.html',
  styleUrls: ['./feed-transaction-dialog.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeedTransactionDialogComponent implements OnInit {

  transactionForm:FormGroup;
  paymentTypes:any[]=[];
  payDate=new Date();
  isDiscount:boolean=false;
  totalAmount:any;

  constructor(private fb : FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<FeedTransactionDialogComponent>,private _dataService: DataService,private toastr: ToastrService) {
    this.transactionForm=fb.group({
      feedType:[''],
      name:[''],
      receiveddate:[''],
      dueAmount:[''],
      paymentType:[''],
      refrenceNumber:[''],
      paidDate:[''],
      paidAmount:['',Validators.required]
    })
   }

  ngOnInit() {
    this.data = this.data;
    this.getPaymentTypes();
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  searchModel(value){
    this.totalAmount= this.data.DueAmount
    if(value > this.totalAmount){
      this.transactionForm.controls['paidAmount'].setValidators([Validators.required,Validators.max(this.totalAmount)]);
      this.transactionForm.controls["paidAmount"].updateValueAndValidity();
    }
  }

  //Payment Types
  getPaymentTypes() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', DataFactory.ClassType.PaymentMode)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.paymentTypes = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }

  // only Accept numbers only
  numberOnly(event: any) {
    const numberpattern = /[0-9\+\-.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!numberpattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
