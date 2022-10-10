import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-feedpurchasereport',
  templateUrl: './feedpurchasereport.component.html',
  styleUrls: ['./feedpurchasereport.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeedpurchasereportComponent implements OnInit {
  feedPurchaseList:any;
  req:any;
  isDataLoading:boolean=false;
  date = new Date();
  feedPurchaseFilterForm:FormGroup;
  FROMDATE: Date;
  selectedDate: Date;
  selectedFarm: any;
  constructor(private _dataService: DataService, private toastr: ToastrService,private fb: FormBuilder) {
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm")); 
    this.feedPurchaseFilterForm = fb.group({
      fromDate: [''],
      toDate: ['']
    });
  }

  ngOnInit() {    
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    this.date=new Date();
    this.GetFeedPurchaseDetails();
  }
  //Get Feed Data
  GetFeedPurchaseDetails(): void {
    var req = {
      "TraderId": null,
      "FromDate": this.FROMDATE,
      "ToDate": this.date,
      "FarmId":this.selectedFarm.FarmId
    }
    this.isDataLoading=true;
    this._dataService.Post('FarmActivity/GetFeedPurchaseDetails',req )
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.feedPurchaseList = Data.Result;       
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }

  onClearSearch(){
     this.FROMDATE = new Date();
     this.feedPurchaseFilterForm.value.fromDate=this.FROMDATE;
     this.selectedDate = new Date();
     this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
     this.date=new Date();
     this.GetFeedPurchaseDetails();
  }

  onDateChange(item){
    this.FROMDATE=item.value;
  }

   //ExportToExcel
 download = function () {
  this.isDataLoading=true;
  var FeedPurchaseReq={
     "FromDate": this.FROMDATE,
      "ToDate": this.date,
      "FarmName":this.selectedFarm.FarmName,
      "feedTypes":this.feedPurchaseList.feedTypes,
      "feedPurchaseDetails":this.feedPurchaseList.feedPurchaseDetails
  }
  this._dataService.Post('FarmActivity/ExportPurchaseReport/', FeedPurchaseReq).subscribe((result) => {
    if (result != null && result != undefined && result != '') {
      var data = result;
      var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = "Feed-Purchase Report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.isDataLoading=false;
    }
    else {
      this.toastr.error("An error has occured");
      this.isDataLoading=false;
    }
  });
}

b64toBlob(b64Data, contentType, sliceSize) {
contentType = contentType || '';
sliceSize = sliceSize || 512;

var byteCharacters = atob(b64Data);
var byteArrays = [];

for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
}

var blob = new Blob(byteArrays, { type: contentType });
return blob;
};
}
