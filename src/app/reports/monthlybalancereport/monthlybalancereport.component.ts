import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import * as _moment from "moment";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { default as _rollupMoment, Moment } from "moment";
import { FormControl } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { DataFactory } from 'src/app/shared/dataFactory';
import { NgxSpinnerService } from 'ngx-spinner';
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY"
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};



@Component({
  selector: 'app-monthlybalancereport',
  templateUrl: './monthlybalancereport.component.html',
  styleUrls: ['./monthlybalancereport.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class MonthlybalancereportComponent implements OnInit {
  @ViewChild('dt') table: Table;
  isDataLoading: boolean;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  date = new FormControl(moment());
  monthlyReportsList: any[] = [];
  userData: any;
  selectedFarm: any;
  currentDate: Date;
  Month: Number;
  Year: Number;
  minDate: Moment;
  MMonth: number;
  totalData: any = {};
  averagerate:number;
  averageproduction:number;
  financialYears: string[];
  currentFY: string;
  selectedRecord: Number;
  monthlyRecords: any[] = [];
  isYear: boolean = false;
  constructor(private _dataService: DataService, private toastr: ToastrService, private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
  }

  ngOnInit() {
    this.monthlyRecords = DataFactory.MonthlyData;
    this.selectedRecord = this.monthlyRecords[0].Id;
    const currentYear = moment().year();
    this.currentDate = new Date();
    this.Month = this.currentDate.getMonth() + 1;
    this.MMonth = this.currentDate.getMonth();
    this.Year = this.currentDate.getFullYear();
    this.minDate = moment([currentYear, this.MMonth, 31])
    this.getMOnthlyReport();
    this.financialYears = []
    this.currentDate = new Date();
    for (var i = 2019; i <= this.currentDate.getFullYear(); i++) {
      this.financialYears.push(i + "-" + +(i + 1));
    }
    this.currentFY = this.currentDate.getMonth() + 1 > 3 ? this.currentDate.getFullYear() + "-" + +(this.currentDate.getFullYear() + 1) : +(this.currentDate.getFullYear() - 1) + "-" + this.currentDate.getFullYear();
  }

  // Get Monthly  Reports Data
  getMOnthlyReport() {  
    
    let sumB: any = 0; let sumBR: any = 0;
    let sumF: any = 0; let sumTAM: any = 0;
    let sumR: any = 0; let sumDA: any = 0;
    let sumTA: any = 0; let sumP: any = 0;
    let sumNG: any = 0; let sumM: any = 0;
    var req = {
      "month": this.Month,
      "year": this.Year,
      "farmId": this.selectedFarm.FarmId
    }
    this.spinner.show();
    this._dataService.Post('FeedGrinding/GetMonthlyBalancesReport', req).subscribe((response) => {
      this.spinner.hide();
      if (response.IsSuccess) {
        this.monthlyReportsList = response.ListResult == null ? [] : response.ListResult;

        this.monthlyReportsList.forEach(a => sumB += a.OpeningBirds);
        this.monthlyReportsList.forEach(a => sumF += a.Tonnes);
        this.monthlyReportsList.forEach(a => sumR += a.Rate);
        this.monthlyReportsList.forEach(a => sumTA += a.FeedAmount);
        this.monthlyReportsList.forEach(a => sumNG += a.NumberofEggs);
        this.monthlyReportsList.forEach(a => sumBR += a.BillRate);
        this.monthlyReportsList.forEach(a => sumTAM += a.EggsAmount);
        this.monthlyReportsList.forEach(a => sumDA += a.DifferenceAmount);
        this.monthlyReportsList.forEach(a => sumP += a.Production);
        this.monthlyReportsList.forEach(a => sumM += a.Mortality);
        this.totalData.OpeningBirds = sumB;
        this.totalData.Tonnes = sumF;
        this.totalData.Rate = sumR;
        this.totalData.FeedAmount = sumTA;
        this.totalData.NumberofEggs = sumNG;
        this.totalData.BillRate = sumBR;
        this.averagerate=sumBR/(this.monthlyReportsList.length);
        this.totalData.EggsAmount = sumTAM;
        this.totalData.DifferenceAmount = sumDA;
        this.totalData.Production = sumP;
        this.averageproduction=sumP/(this.monthlyReportsList.length);
        this.totalData.Mortality = sumM;
      }
      else {
        this.toastr.error("An error has occured");
      }
    }, (error) => {
      this.toastr.error("An error has occured");
    });
  }

  //ExportToExcel
  download = function () {
    this._dataService.Post('FeedGrinding/ExportMonthlyBalancesReport/', this.monthlyReportsList).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Monthly-Sheet Report.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      else {
        this.toastr.error("An error has occured");
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

  chosenYear(event) {
    debugger
    this.Month = null;
    var newarr = event.value;
    var sliced = newarr.slice(0, -5);
    this.Year = sliced
    this.getMOnthlyReport();
  }
  // Chane event for Month
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    debugger
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    var CDate = new Date(ctrlValue.month(normalizedMonth.month()));
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.Month = CDate.getMonth() + 1;
    this.Year = CDate.getFullYear();
    this.getMOnthlyReport();
  }

  // Change event for year
  chosenYearHandler(normalizedYear: Moment) {
    debugger
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    var CYear = new Date(ctrlValue.year(normalizedYear.year()));
    this.Year = CYear.getFullYear();
    this.date.setValue(ctrlValue);
    this.getMOnthlyReport();
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
  onOptionType(evt) {
    this.isYear = evt == 1 ? false : true;
    this.currentDate = new Date();
    if (this.isYear) {
      this.currentFY = this.currentDate.getMonth() + 1 > 3 ? this.currentDate.getFullYear() + "-" + +(this.currentDate.getFullYear() + 1) : +(this.currentDate.getFullYear() - 1) + "-" + this.currentDate.getFullYear();
      this.Year = this.Year = this.currentDate.getFullYear();
      this.Month = null
    }
    else {
      this.Year = this.Year = this.currentDate.getFullYear();
      this.Month = this.currentDate.getMonth() + 1;  
      this.date = new FormControl(moment());    
    }
    this.getMOnthlyReport();
  }
}
