import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { DataFactory } from 'src/app/shared/dataFactory';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-incomeexpensesreport',
  templateUrl: './incomeexpensesreport.component.html',
  styleUrls: ['./incomeexpensesreport.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class IncomeexpensesreportComponent implements OnInit {
  // @ViewChild('IN') private Table;
  // @ViewChild('out')  private table;
  profitLoss:number = 0;
  isDataLoading: boolean;
  incomeExpenses: any[]=[];
  fromDate: Date;
  toDate: Date;
  selectedFarm: any;
  incomeList:any[]=[];
  expensesList:any[]=[];
  totalData :any ={};
  currentDate: Date = new Date();
  exportData: { FromDate: Date; ToDate: Date; IncomeExpenseData: any[]; };
  // isFiltersEnabled: boolean = false;
  // filterTooltip = "Enable Filters";
  constructor(private _dataService: DataService, private toastr: ToastrService,private spinner:NgxSpinnerService) {
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
   }

  ngOnInit() {
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.GetIncomeExpenses();
  }
  //Get Data
  GetIncomeExpenses(){
    this.incomeList = [];
    this.expensesList = [];
    let sumB: any = 0; let sumBR: any = 0; 
    var req = {
      "FormDate": this.fromDate,
      "ToDate": this.toDate,
      "FarmId":this.selectedFarm.FarmId
    }
    this.isDataLoading = true;
    this.spinner.show();
    this._dataService.Post('IncomeExpenses/GetIncomeExpenseReports', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.incomeExpenses = Data.ListResult;
          this.incomeList = this.incomeExpenses.filter(I=>I.ClassTypeId == DataFactory.ClassType.Income );
          this.expensesList = this.incomeExpenses.filter(I=>I.ClassTypeId == DataFactory.ClassType.Expenses );
          this.incomeList.forEach(a => sumB += a.Amount);
        this.totalData.IncomeAmount = sumB;
        this.expensesList.forEach(a => sumBR += a.Amount);
        this.totalData.ExpensesAmount = sumBR;
        this.profitLoss = +this.totalData.IncomeAmount - +this.totalData.ExpensesAmount
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }
  // On clear Click
  onClearSearch() {
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.GetIncomeExpenses();
  }
  // On export Click
  download() {
    var req=
    {
      "FromDate": this.fromDate,
      "ToDate": this.toDate,
      "IncomeExpenseData":this.incomeExpenses
    }
    this.isDataLoading = true;
    this._dataService.Post('IncomeExpenses/ExportIncomeExpenseReports',req ).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', null);
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Income/Expense Report.xlsx";
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
    (error)=>{
      this.toastr.error("An error has occured");
    }
    
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
  // toggleFilter = function () {
  //   this.table.reset();
  //   this.isFiltersEnabled = !this.isFiltersEnabled;
  //   if (this.isFiltersEnabled)
  //     this.filterTooltip = "Disable Filters";
  //   else {
  //     this.filterTooltip = "Enable Filters";
  //   }
  // };
}
