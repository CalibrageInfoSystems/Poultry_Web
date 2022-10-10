import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { FormControl } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { IfStmt, ThrowStmt } from '@angular/compiler';
import { Conversion } from 'src/app/shared/convertEggstoBoxes';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
//import {Pipe, PipeTransform} from "@angular/core";
// import { RoundPipe } from 'src/app/shared/round.Pipe';
@Component({
  selector: 'app-egg-sale-register',
  templateUrl: './egg-sale-register.component.html',
  styleUrls: ['./egg-sale-register.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class EggSaleRegisterComponent implements OnInit {
  clicked:boolean = false;
  @ViewChild('dt') table: Table;
  isDataLoading: boolean;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  traderDetails: any = {};
  PulpRate: Number;
  LocalTrader: boolean = false;
  Amount: any
  BillRate: any;
  FROMDATE: Date;
  selectedDate: Date;
  fromDate: Date;
  selectedTrader: any;
  rowData: any;
  req: any;
  salesRegList: any = [];
  traders: any;
  isAddingSaleReg: boolean = false;
  isEditingSaleReg: boolean = false;
  isAddAmount: boolean = false;
  date: Date;
  AddEggSaleRegForm: FormGroup;
  UserId = DataFactory.Login.LoginId;
  finalreq: any[] = [];
  EditEggSaleRegForm: FormGroup;
  addAmountForm: FormGroup;
  eggSaleRegFilterForm: FormGroup;
  paymentModeList: any = [];
  payMode: any;
  ActivityRights = [];
  userData: any;
  ClassType = DataFactory.ClassType;
  isShowItemNameAdd: boolean;
  selectedFarm: any;

  constructor(private _dataService: DataService, private toastr: ToastrService, public dialog: MatDialog,
    private fb: FormBuilder, private conversion: Conversion,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));

    this.AddEggSaleRegForm = fb.group({
      Saledate: ['', Validators.required],
      trader: ['', Validators.required],
      numberofboxes: ['', Validators.required],
      neccrate: ['', Validators.required],
      billrate: ['', Validators.required],
      lorrynumber: [''],
      remarks: [''],
      amount: ['', Validators.required],
      // paymentMode:'',
      //receivedamount: '',
      damaged:['']
    });
    this.EditEggSaleRegForm = fb.group({
      date: ['', Validators.required],
      trader: ['', Validators.required],
      numberofboxes: ['', Validators.required],
      neccrate: ['', Validators.required],
      billrate: ['', Validators.required],
      lorrynumber: [''],
      remarks: [''],
      amount: ['', Validators.required],
      damaged:['']
    });
    this.addAmountForm = fb.group({
      Receiveddate: ['', Validators.required],
      trader: ['', Validators.required],
      paymentMode: ['', Validators.required],
      receivedAmount: ['', Validators.required],
      ChequeNumber: ['']
    });
    this.eggSaleRegFilterForm = fb.group({
      trader: ['', Validators.required],
      fromDate: [''],
      toDate: ['']
    });
  }

  ngOnInit() {
    this.date = new Date();
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    this.date = new Date();
    this.GetSaleRegister();
    this.GetTraders();
    this.GetPaymentMode();
  }

  //Get all Traders
  GetTraders() {
    this.spinner.show();
    this._dataService.GetAll('CompanyInfo/GetTraderInfoById/' + null + '/' + this.selectedFarm.FarmId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.traders = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }

  //Get payment mode
  GetPaymentMode() {
    this.spinner.show();
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', this.ClassType.PaymentMode)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.paymentModeList = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }

  onPaymentModeSelect(item) {
    var filterData = this.paymentModeList.filter(x => x.TypeCdId == item.value)
    if (filterData[0].TypeCdId == "12") {
      this.isShowItemNameAdd = true;
      this.addAmountForm.addControl('ChequeNumber', new FormControl("", Validators.required));
      this.addAmountForm.get('ChequeNumber').clearValidators();
      this.addAmountForm.get('ChequeNumber').updateValueAndValidity({ emitEvent: false, onlySelf: true });
      this.addAmountForm.get('ChequeNumber').setValidators([Validators.required]);
      this.addAmountForm.get('ChequeNumber').updateValueAndValidity({ emitEvent: false, onlySelf: true });
    } else {
      this.isShowItemNameAdd = false;
      this.addAmountForm.removeControl('ChequeNumber');
      this.addAmountForm.get('ChequeNumber').clearValidators();
      this.addAmountForm.get('ChequeNumber').updateValueAndValidity({ emitEvent: false, onlySelf: true });
      this.addAmountForm.addControl('ChequeNumber', new FormControl(""));
      this.addAmountForm.get('ChequeNumber').updateValueAndValidity({ emitEvent: false, onlySelf: true });
    }
  }

  // onNccRatechange(item){

  //   this.BillRate ==(this.AddEggSaleRegForm.value.neccrate - 0.5)

  // }
  // onKey(){

  // }
  // onKey(value) {
  //   //this.values += value + ' | ';
  //   this.BillRate==this.AddEggSaleRegForm.value.neccrate-0.5;
  // }
  onSearchChange(value) {
    debugger
    if (!this.LocalTrader) {
      this.BillRate = (this.PulpRate == null || value == "")  ? null : (parseFloat(value) - 0.05).toFixed(2);
      this.Amount = (this.BillRate == null || value == "" )? null : (+this.BillRate * +(this.conversion.BoxestoEggs(+this.AddEggSaleRegForm.value.numberofboxes))).toFixed(2)
    }


  }
  onChange(value) {
    if (!this.LocalTrader) {
      this.rowData.BillRate = (this.rowData.NECCRate == null || value == "") ? null : (parseFloat(value) - 0.05).toFixed(2);
      this.rowData.BillAmount = (this.rowData.BillRate == null || value == "") ? null : (+this.rowData.BillRate * +(this.conversion.BoxestoEggs(+this.EditEggSaleRegForm.value.numberofboxes))).toFixed(2);
    }
    // this.rowData.BillRate=value-0.05;
  }

  // onSearch(){
  //   this.finalreq=[];
  //   var req = {
  //     "TraderId": this.eggSaleRegFilterForm.value.trader,
  //     "FromDate": this.eggSaleRegFilterForm.value.fromDate,
  //     "ToDate": this.eggSaleRegFilterForm.value.toDate,
  //     "FarmId":this.selectedFarm.FarmId
  //   }
  //   this._dataService.Post('Log/GetEggSaleDetails/', req)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.salesRegList = Data.Result;

  //         for(var i=0;i<this.salesRegList.Traders.length;i++){
  //           var req={
  //             traderId:this.salesRegList.Traders[i].Id,
  //             traderName:this.salesRegList.Traders[i].Name,
  //             billingAmount:this.salesRegList.Traders[i].BillingAmount,
  //             receivedAmount:this.salesRegList.Traders[i].ReceivedAmount,
  //             numberofBoxes:this.salesRegList.Traders[i].NumberofBoxes,
  //             dueAmount:this.salesRegList.Traders[i].DueAmount,
  //             saleTransactions:[],
  //             salePayment:[],
  //           }
  //           req.saleTransactions = this.salesRegList.SaleRegisterDetails.filter(x => x.TraderId == this.salesRegList.Traders[i].Id);
  //           req.salePayment = this.salesRegList.saleTransactions.filter(x => x.TraderId == this.salesRegList.Traders[i].Id);
  //           this.finalreq.push(req); 
  //         }
  //       }
  //       else{
  //         this.toastr.error("An error has occured");
  //       }
  //     },(error)=>{
  //       this.toastr.error("An error has occured");
  //     })
  // }

  onClearSearch() {
    this.FROMDATE = new Date();
    this.eggSaleRegFilterForm.value.fromDate = this.FROMDATE;
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    this.date = new Date();
    this.GetSaleRegister();
  }

  //Get egg sales data
  GetSaleRegister(): void {
    debugger;

    this.finalreq = [];
    var req = {
      "TraderId": this.eggSaleRegFilterForm.value.trader,
      "FromDate": this.FROMDATE,//this.eggSaleRegFilterForm.value.fromDate,
      "ToDate": this.selectedDate,//this.eggSaleRegFilterForm.value.toDate,
      "FarmId": this.selectedFarm.FarmId
    }
    this.spinner.show();
    this._dataService.Post('Log/GetEggSaleDetails/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.salesRegList = Data.Result;
          for (var i = 0; i < this.salesRegList.Traders.length; i++) {
            var req = {
              traderId: this.salesRegList.Traders[i].Id,
              traderName: this.salesRegList.Traders[i].Name,
              numberofBoxes: this.salesRegList.Traders[i].NumberofBoxes,
              billingAmount: this.salesRegList.Traders[i].BillingAmount,
              receivedAmount: this.salesRegList.Traders[i].ReceivedAmount,
              dueAmount: this.salesRegList.Traders[i].DueAmount,
              saleTransactions: [],
              salePayment: [],
            }
            req.saleTransactions = this.salesRegList.SaleRegisterDetails.filter(x => x.TraderId == this.salesRegList.Traders[i].Id);
            req.saleTransactions.sort(function (a, b) {
              return +new Date(b.Date) - +new Date(a.Date)
            })
            req.salePayment = this.salesRegList.saleTransactions.filter(x => x.TraderId == this.salesRegList.Traders[i].Id);
            this.finalreq.push(req);
          }
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }


  //On Add Button Click
  onAddEggSale() {
    this.isAddingSaleReg = true;
    this.LocalTrader = false;
    this.PulpRate = null;
    //this.selectedTrader=traderId;
  }

  onEditClick(row) {
    this.isEditingSaleReg = true;
    this.rowData = row;
    this.LocalTrader = this.rowData.Name == 'Local Sales' ? true : false;
  }

  //Cancel Add Click
  onCancleAddClick() {
    this.LocalTrader = false;
    this.isAddingSaleReg = false;
    this.traderDetails = {};
    const { EditEggSaleRegForm: { value: formValueSnap } } = this;
    this.EditEggSaleRegForm.reset(formValueSnap);
    this.AddEggSaleRegForm.reset();
    this.date = new Date();
  }

  //Cancel edit Click  
  onCancleEditClick() {
    this.isEditingSaleReg = false;
  }
  //Add Egg Sale Register
  onSaveClick() {
    var req = {
      "Id": null,
      "TraderId": this.AddEggSaleRegForm.value.trader,
      "Date": this.AddEggSaleRegForm.value.Saledate,
      "LorryNumber": this.AddEggSaleRegForm.value.lorrynumber,
      "NumberofBoxes": this.AddEggSaleRegForm.value.numberofboxes,
      "NECCRate": this.AddEggSaleRegForm.value.neccrate,
      "BILLRate": this.AddEggSaleRegForm.value.billrate,
      //"ReceivedAmount": this.AddEggSaleRegForm.value.receivedamount,
      "IsActive": true,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FarmId": this.selectedFarm.FarmId,
      "Remarks": this.AddEggSaleRegForm.value.remarks,
      "Amount": this.AddEggSaleRegForm.value.amount,
      "Damaged":this.AddEggSaleRegForm.value.damaged

    }
    this.spinner.show();
    this._dataService.Post('Log/AddUpdateEggSaleRegister/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.clicked = false;
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.onCancleAddClick();
          this.GetSaleRegister();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  //update egg sle register
  onUpdateClick() {    
    var req = {
      "Id": this.rowData.Id,
      "TraderId": this.rowData.TraderId,
      "Date": this.rowData.Date,
      "LorryNumber": this.rowData.LorryNumber,
      "NumberofBoxes": this.rowData.NumberofBoxes,
      "NECCRate": this.rowData.NECCRate,
      "BILLRate": this.rowData.BillRate,
      //"ReceivedAmount": this.rowData.receivedamount,
      "IsActive": true,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate": this.rowData.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FarmId": this.selectedFarm.FarmId,
      "Remarks": this.rowData.Remarks,
      "Amount": this.rowData.BillAmount,
      "Damaged":this.rowData.Damaged
    }
    this.spinner.show();
    this._dataService.Post('Log/AddUpdateEggSaleRegister/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.clicked = false;
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isEditingSaleReg = false;
          const { EditEggSaleRegForm: { value: formValueSnap } } = this;
          this.EditEggSaleRegForm.reset(formValueSnap);
          this.GetSaleRegister();
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  onTrasactionDelete(row) {
    this.spinner.show();
    this._dataService.GetAll('Log/DeleteTraderTransaction/' + row.Id)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.GetSaleRegister();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  onAddAmountClick() {
    this.isAddAmount = true;
    // this.selectedTrader=traderId; 
  }
  onCancleAmountAddClick() {
    this.isAddAmount = false;
    this.addAmountForm.reset();
    //this.date = new Date();    
    this.addAmountForm.get('ChequeNumber').clearValidators();
    this.addAmountForm.get('ChequeNumber').updateValueAndValidity({ emitEvent: false, onlySelf: true });
  }

  onSaveAmountClick() {
    var req = {
      "Id": 0,
      "TraderId": this.addAmountForm.value.trader,
      "Date": this.addAmountForm.value.Receiveddate,
      "ReceivedAmount": this.addAmountForm.value.receivedAmount,
      "IsActive": true,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "PaymentTypeId": this.addAmountForm.value.paymentMode,
      "CheckNumber": this.addAmountForm.value.ChequeNumber,
      "FarmId": this.selectedFarm.FarmId
    }
    this.spinner.show();
    this._dataService.Post('Log/AddUpdateTraderTransactions', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.clicked = false;
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isAddAmount = false;
          this.addAmountForm.reset();
          this.GetSaleRegister();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    var exportreq = {
      FromDate: this.FROMDATE,
      ToDate: this.selectedDate,
      FarmName: this.selectedFarm.FarmName,
      saleTransactions: this.salesRegList.saleTransactions,
      SaleRegisterDetails: this.salesRegList.SaleRegisterDetails,
      Traders: this.salesRegList.Traders
    }
    this._dataService.Post('Log/ExportEggSale/', exportreq).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Egg Sale Register.xlsx";
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
  // restrict letters
  onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onDateChange(item) {
    this.FROMDATE = item.value;
  }

  onSelectTraderType(event) {
    this.traderDetails = {};
    var trader = this.traders.filter(t => t.Id == event)
    this.traderDetails = trader[0];
    if (this.isEditingSaleReg) {
      this.EditEggSaleRegForm.get('amount').setValue(null);
      this.EditEggSaleRegForm.get('billrate').setValue(null);
    }
    
    this.LocalTrader = this.traderDetails.Name == 'Local Sales' ? true : false;
    this.BillRate = this.LocalTrader == true ? null : this.PulpRate == null ? null : ((+this.PulpRate) - (+this.traderDetails.Commission)).toFixed(2);
    this.Amount = (this.BillRate == null || this.AddEggSaleRegForm.value.numberofboxes == null) ? null :
      ((+this.BillRate) * (+ (this.conversion.BoxestoEggs(+this.AddEggSaleRegForm.value.numberofboxes)))).toFixed(2)

  }



  onCartonsChange(cartons) {
    debugger;

    if (!this.LocalTrader) {
      this.Amount = (this.BillRate == null || this.AddEggSaleRegForm.value.numberofboxes == "") ? null : ((+this.conversion.BoxestoEggs(cartons) * +this.BillRate).toFixed(2));
    }

    else {
      this.BillRate = (this.Amount == null || this.AddEggSaleRegForm.value.numberofboxes == "") ? null : (+ ( +this.Amount)/(+this.conversion.BoxestoEggs(cartons))).toFixed(2);
    }
  }

  onEditCartonsChange(cartons) {
    if (!this.LocalTrader) {
      this.rowData.BillAmount = (this.rowData.BillRate == null || this.EditEggSaleRegForm.value.numberofboxes == "") ? null : (+this.conversion.BoxestoEggs(cartons) * +this.rowData.BillRate).toFixed(2);
    }
    else {
      this.rowData.BillRate = (this.rowData.BillAmount == null || this.EditEggSaleRegForm.value.numberofboxes == "") ? null : ( +this.rowData.BillAmount / +(this.conversion.BoxestoEggs(cartons))).toFixed(2);
    }
  }

  onBillRateChange(value) {
    if (!this.isEditingSaleReg) {
      this.Amount = (this.BillRate == null || this.AddEggSaleRegForm.value.numberofboxes == null || value == "") ? null : (+this.conversion.BoxestoEggs(+this.AddEggSaleRegForm.value.numberofboxes) * +this.BillRate).toFixed(2);
    }
    else {
      this.rowData.BillAmount = (this.rowData.BillAmount == null || this.EditEggSaleRegForm.value.numberofboxes == null || value == "") ? null : (+this.conversion.BoxestoEggs(+this.EditEggSaleRegForm.value.numberofboxes) * +this.rowData.BillRate).toFixed(2);
    }

  }

  onAmountChange() {
    if (!this.isEditingSaleReg) {
      this.BillRate = (this.Amount == null || this.AddEggSaleRegForm.value.numberofboxes == null) ? null : ((+this.Amount) / +(this.conversion.BoxestoEggs(+this.AddEggSaleRegForm.value.numberofboxes))).toFixed(2);
    }
    else {
      this.rowData.BillRate = (this.rowData.BillAmount == null || this.EditEggSaleRegForm.value.numberofboxes == null) ? null :
        ((+this.rowData.BillAmount) / +(this.conversion.BoxestoEggs(+this.EditEggSaleRegForm.value.numberofboxes))).toFixed(2);
    }
  }

  DateChangeEvent(item) {
    var req = {
      "FarmId": this.selectedFarm.FarmId,
      "date": item.value
    }
    this._dataService.Post('Log/GetManageRateDetailsByDate', req).subscribe(res => {
      if (res.IsSuccess) {
        var Data = res.Result == null ? {} : res.Result;
        this.PulpRate = Data.PulpRate;
        if ((this.AddEggSaleRegForm.value.trader != null && !this.LocalTrader)) {
          this.BillRate = this.PulpRate == null ? null : +this.PulpRate - +this.traderDetails.Commission;
          this.Amount = (this.BillRate == null || this.AddEggSaleRegForm.value.numberofboxes == null) ? null :
            ((+this.BillRate) * (+ (this.conversion.BoxestoEggs(+this.AddEggSaleRegForm.value.numberofboxes)))).toFixed(2)
        }

      }
    })
  }
   //TOGGLE FILTER
   toggleFilter = function () {
    this.isFiltersEnabled = !this.isFiltersEnabled;
    if (this.isFiltersEnabled) {
      this.filterTooltip = "Disable Filters";
    }
    else {
      this.filterTooltip = "Enable Filters";
      this.sortField = this.table.sortField;
      this.sortOrder = this.table.sortOrder;
      this.table.reset();
      this.table.sortField = this.sortField;
      this.table.sortOrder = this.sortOrder;
      
    }
  };
}
