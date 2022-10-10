import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { DataFactory } from 'src/app/shared/dataFactory';
import { DatePipe } from '@angular/common';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { Conversion } from 'src/app/shared/convertEggstoBoxes';
import { DataTable } from 'primeng/primeng';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-eggprotectionlog',
  templateUrl: './eggprotectionlog.component.html',
  styleUrls: ['./eggprotectionlog.component.css'],
  providers: [DatePipe,
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class EggprotectionlogComponent implements OnInit {
  isFiltersEnabled: boolean = false;
  @ViewChild(('ht')) ht: DataTable;
  filterTooltip = "Enable Filters";
  eggStockInfo: any = {};
  isPackedShow: boolean = false;
  eggStockDetails: any[] = [];
  ActivityRights: any;
  userData: any;
  currrentData: any;
  //disableButton: boolean = true;
  isAddFormDetails: boolean = false;
  mainGrid: boolean = true;
  saveData: boolean = false;
  editData: boolean = true;
  cancelData: boolean = false;
  showTextBox: boolean = false;
  existingEggRegister: any[] = [];
  editEggRegisterForm: FormGroup;


  q = new Date();
  m = this.q.getMonth() + 1;
  d = this.q.getDate();
  y = this.q.getFullYear();

  currentDate = new Date(this.y, this.m, this.d);
  isDataLoading: boolean = false;
  totalRecords: number;
  req: any;
  eggStock: any[] = [];
  selectedEggStock: any;
  curDate: any;
  selectedDate: any;
  FromDate: any;
  ToDate: any;
  UserId = DataFactory.Login.LoginId;
  eggStockdata: any;
  isEdit: boolean = false;
  IsAdd: boolean = false;
  index: any;
  IsAdded: boolean = true;
  selectedFarm: any;
  TotalAmount: any;
  DailyProduction: any;
  Damage: any;
  BillRate: any;
  constructor(private _dataService: DataService, private toastr: ToastrService, private datePipe: DatePipe, private fb: FormBuilder,
    private conversion: Conversion, private spinner: NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.editEggRegisterForm = fb.group({
      // Packing: ['', Validators.required],
      // Damage: [''],
      // NECCRate: ['', Validators.required],
      // BillRate: ['', Validators.required],
      // PulpRate :[Validators.required],      
      // CullBirdRate: ['', Validators.required],
      Remarks: [''],
      FreeIssue: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.curDate = new Date();
    this.selectedDate = new Date();
    this.FromDate = new Date();
    this.FromDate.setDate(this.FromDate.getDate() - 7);
    this.ToDate = new Date();
    this.getData();
  }

  // add new Egg protection
  addNewEggProtection() {
    this.IsAdded = false;
    var filterArray = this.eggStock.filter(x => x.isEditable == true);
    if (filterArray.length > 0) {
      for (var i = 0; i < this.eggStock.length; i++) {
        this.eggStock[i].isEditable = false;
      }
    }
    this.eggStock = [...this.eggStock];
    this.eggStock.unshift({ Date: "", OpeningStock: "", DailyProduction: "", Total: "", Packing: "", Damaged: "", CreatedByUserId: "", CreatedDate: "", UpdatedByUserId: "", UpdatedDate: "", isEditable: true, isAdd: true });
  }
  ChangeFromDate(fromDate) {
    this.FromDate = fromDate;
  }
  ChangeToDate(toDate) {
    this.ToDate = toDate;
  }

  // edit row
  editRow(row) {
    if (this.eggStock[0].isAdd == true) {
      this.eggStock = [...this.eggStock];
      this.eggStock.shift();
    }
    this.eggStock.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd = false;
  }

  //Update row
  updateRow(row) {
    var req = {
      // "Id": null,
      // "Date": row.LogDate,
      // "OpeningStock": row.OpeningStock,
      // "DailyProduction": row.DailyProduction,
      // "NECCRate":row.NECCRate,
      // "CullBirdRate":row.CullRate,
      // "BillRate":row.PulpRate,
      // "Total": row.Total,
      // "Packing": row.Packing,
      // "Damage": row.Damage,
      // "ClosingStock": row.ClosingStock,
      // "CreatedByUserId": this.userData.Id,
      // "CreatedDate":  new Date(),
      // "UpdatedByUserId": this.userData.Id,
      // "UpdatedDate": new Date(),
      // "FarmId":this.selectedFarm.FarmId,
      // "FreeIssue":row.FreeIssue,
      // "Remarks":row.Remarks
      "Id": 0,
      "FarmId": this.selectedFarm.FarmId,
      "StockInCartons": row.FreeIssue,
      "Remarks": row.Remarks,
      "IssuedDate": row.Date,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('FarmActivity/AddUpdateFreeIssueStock', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.getData();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  // Cancle Edit
  cancelVaccinationEditClick(row) {
    row.isEditable = false;
    this.eggStock = this.existingEggRegister.map(x => Object.assign({}, x));
  }
  // save Data
  SavedDataClick(row) {
    row.isEditable = false
    this.saveData = false;
    this.editData = true;
    this.cancelData = false;
  }
  // Cancel Edit
  CancelEdit(row) {
    row.isEditable = false;
    this.saveData = false;
    this.editData = true;
    this.cancelData = false;
  }
  Search = function () {
    this.getData();
  }
  //Get Egg Stock data
  getData(): void {
    debugger
    this.isDataLoading = true;
    this.req = {
      "FromDate": this.FromDate,//=new Date(),//'2019-04-06 15:16:12.400',
      "ToDate": this.ToDate,//=new Date() //'2019-04-06 15:16:12.400' 
      "FarmId": this.selectedFarm.FarmId
    }
    this.spinner.show();
    this._dataService.Post('Log/GetEggStockInfo/', this.req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.eggStock = Data.ListResult == null ? 0 : Data.ListResult
          // this.DailyProduction=Data.ListResult[0].DailyProduction;
          // this.Damage=Data.ListResult[0].Damage;
          // this.BillRate=Data.ListResult[0].BillRate;
          // this.TotalAmount=this.DailyProduction-this.Damage*this.BillRate;
          // Data.ListResultDailyProduction=Data.ListResult.DailyProduction==null?0:Data.ListResult.DailyProduction
          // Data.ListResult.BillRate=Data.ListResult.BillRate==null?0:Data.ListResult.BillRate
          // Data.ListResult.Damaged=Data.ListResult.Damaged==null?0:Data.ListResult.Damaged
          // this.TotalAmount=Data.ListResult.DailyProduction-Data.ListResult.Damaged*Data.ListResult.BillRate
          this.currrentData = Data.ListResult[0].LogDate;
          this.currrentData = this.datePipe.transform(this.currrentData, 'yyyy-MM-dd');
          var curDate = this.curDate.toDateString();
          this.eggStock.map(function (obj) {
            var x = new Date(obj.Date)
            obj.disabled = (x.toDateString() == curDate) ? false : true
          });
          this.existingEggRegister = Data.ListResult.map(x => Object.assign({}, x));

          this.isDataLoading = false;
        }
        else {
          this.toastr.error("An error has occured");
          this.isDataLoading = false;
        }

      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  //Closing stock calculation
  onPackedChange(row) {
    row.ClosingStock = 0;
    if (row.Packing > row.Total) {
      this.toastr.error('packing should always be less than total production');
    }
    row.ClosingStock = this.conversion.EggstoBoxes(this.conversion.BoxestoEggs(row.Total) - (row.Packing > 0 ? Math.round(this.conversion.BoxestoEggs(row.Packing)) : 0) - (row.Damage > 0 ? Math.round(this.conversion.BoxestoEggs(row.Damage)) : 0));
    // row.ClosingStock = 0;
    //(row.Total - (parseFloat(row.Packing) + (row.Damage==null ? 0.0 : parseFloat(row.Damage)))).toFixed(2);//this.eggStockdata[0].ClosingStock;
    // var beforeNumber=row.ClosingStock.toString().split(".")[0];
    // var afterNumber=parseFloat("." + row.ClosingStock.toString().split(".")[1]);

    // if(afterNumber > 0.6 ){
    //   beforeNumber=parseInt(beforeNumber)+1;
    //   afterNumber=afterNumber-0.6;
    // }      
    // row.ClosingStock=parseInt(beforeNumber) + afterNumber;
    // var x=this.conversion.BoxestoEggs(row.Total);
    row.TotalAmount = this.conversion.BoxestoEggs(row.Total) * row.BillRate;
    //beforeNumber*210*row.BillRate + afterNumber*30*row.BillRate;

  }
  onNECCRateChange(row) {

    // if (row.Packing > row.Total) {
    //   this.toastr.error('paking ammount always less than total');
    // }
    row.BillRate = (parseFloat(row.NECCRate) - 0.15).toFixed(2);
    // row.BillRate = row.NECCRate-0.05;//this.eggStockdata[0].ClosingStock;

  }
  //adding new Egg stock registration
  addFeedClick(row) {
    var req = {
      "Id": null,
      "Date": row.Date,
      "OpeningStock": row.OpeningStock,
      "DailyProduction": row.DailyProduction,
      "Total": row.total,
      "Packing": row.Packing,
      "Damage": row.Damage,
      "ClosingStock": row.ClosingStock,
      "CreatedByUserId": row.CreatedByUserId,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.UserId,
      "UpdatedDate": new Date(),
      "FarmId": this.selectedFarm.FarmId,

    }
    this._dataService.Post('Log/AddUpdateEggStockRegister/', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.getData();
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
    this._dataService.Post('Log/ExportStockReg/', this.eggStock).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Egg Stock Register.xlsx";
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
    this.FromDate = item.value;
  }
  onMouseOver(row) {
    this.eggStockDetails = [];
    this.eggStockInfo = {};
    this.eggStockInfo = row
    var req = {
      "date": row.Date,
      "FarmId": this.selectedFarm.FarmId
    }
    this._dataService.Post("Log/GetTraderPackageDetailsByDate", req).subscribe(res => {
      if (res.IsSuccess) {
        this.eggStockDetails = res.ListResult == null ? [] : res.ListResult;
        console.log(this.eggStockDetails)
        this.isPackedShow = true;
      }
      else {
        this.eggStockDetails = [];
        this.toastr.error(res.EndUserMessage);
        this.isPackedShow = false;

      }
    }, (error) => {
      this.toastr.error("An Error has Occured");
      this.isPackedShow = false;

    })


  }
  onMouseOut() {
    this.isPackedShow = false;

  }
  toggleFilter() {
    this.ht.reset();
    this.isFiltersEnabled = !this.isFiltersEnabled;
    if (this.isFiltersEnabled)
      this.filterTooltip = "Disable Filters";
    else {
      this.filterTooltip = "Enable Filters";
    }
  }
}