import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-eggsaleregister',
  templateUrl: './eggsaleregister.component.html',
  styleUrls: ['./eggsaleregister.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class EggsaleregisterComponent implements OnInit {
  salesRegList: any;
  req: any;
  isDataLoading: boolean = false;
  date = new Date();
  eggSaleFilterForm: FormGroup;
  FROMDATE: Date;
  selectedDate: Date;
  selectedFarm: any;
  finalreq: any[] = [];
  constructor(private _dataService: DataService, private toastr: ToastrService, private fb: FormBuilder) {
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm")); 
    this.eggSaleFilterForm = fb.group({
      fromDate: [''],
      toDate: ['']
    });
  }

  ngOnInit() {    
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    this.date = new Date();
    this.GetSaleRegister();
  }

  // //Get Feed Data
  // GetEggSaleDetails(): void {
  //   var req = {
  //     "TraderId": null,
  //     "FromDate": this.FROMDATE,
  //     "ToDate": this.date,
  //     "FarmId":this.selectedFarm.FarmId
  //   }
  //   this.isDataLoading = true;
  //   this._dataService.Post('Log/GetEggSaleDetails/', req)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.salesRegList = Data.Result;
  //       }
  //     })
  // }
    //Get egg sales data
    GetSaleRegister(): void {
      this.finalreq=[];
      var req = {
        "TraderId": null,
        "FromDate": this.FROMDATE,
        "ToDate": this.date,
        "FarmId":this.selectedFarm.FarmId
      }
      this._dataService.Post('Log/GetEggSaleDetails/', req)
        .subscribe((Data) => {
          if (Data.IsSuccess) {
            this.salesRegList = Data.Result;
            for(var i=0;i<this.salesRegList.Traders.length;i++){
              var req={
                traderId:this.salesRegList.Traders[i].Id,
                traderName:this.salesRegList.Traders[i].Name,
                numberofBoxes:this.salesRegList.Traders[i].NumberofBoxes,
                billingAmount:this.salesRegList.Traders[i].BillingAmount,
                receivedAmount:this.salesRegList.Traders[i].ReceivedAmount,
                dueAmount:this.salesRegList.Traders[i].DueAmount,
                saleTransactions:[],
                salePayment:[],
              }
              req.saleTransactions = this.salesRegList.SaleRegisterDetails.filter(x => x.TraderId == this.salesRegList.Traders[i].Id);
              req.salePayment = this.salesRegList.saleTransactions.filter(x => x.TraderId == this.salesRegList.Traders[i].Id);
              this.finalreq.push(req);  
            }
          }
          else{
            this.toastr.error("An error has occured");
          }
        },(error)=>{
          this.toastr.error("An error has occured");
        })
    }


  onClearSearch() {
    this.FROMDATE = new Date();
    this.eggSaleFilterForm.value.fromDate = this.FROMDATE;
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    this.date = new Date();
    this.GetSaleRegister();
  }
  onDateChange(item){
    this.FROMDATE=item.value;
  }
  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    var exportreq={
      FromDate:this.FROMDATE,
      ToDate:this.selectedDate,
      FarmName:this.selectedFarm.FarmName,
      saleTransactions:this.salesRegList.saleTransactions,
      SaleRegisterDetails:this.salesRegList.SaleRegisterDetails,
      Traders:this.salesRegList.Traders
    }
    this._dataService.Post('Log/ExportEggSale/', exportreq).subscribe((result) => {
    // this._dataService.Post('FarmActivity/ExportSalesReport/', this.salesRegList).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Egg Sale Report.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.isDataLoading = false;
      }
      else {
        this.toastr.error("An error has occured");
        this.isDataLoading = false;
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
