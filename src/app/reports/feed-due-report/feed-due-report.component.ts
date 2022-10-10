import { Component, OnInit, ViewChild } from '@angular/core';
import * as _moment from "moment";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { default as _rollupMoment, Moment } from "moment";
import { Table } from 'primeng/table';
import { DataFactory } from 'src/app/shared/dataFactory';
import { FormControl } from "@angular/forms";
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
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
  selector: 'app-feed-due-report',
  templateUrl: './feed-due-report.component.html',
  styleUrls: ['./feed-due-report.component.scss'],
  providers: [
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },

    // { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeedDueReportComponent implements OnInit {
  checked:boolean= false;
  BrokerId: string;
  rightsdata:any[]=[];
  BrokerData: any[] = [];
  LookupData: any[] = [];
  feedTypes: any[] = [];
  totalFeedData: any[] = [];
  Id: string;
  fromDate: Date;
  toDate: Date;
  @ViewChild('Fd') table: Table;
  isDataLoading: boolean;
  LookUpTypeId: any;
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
  financialYears: string[];
  currentFY: string;
  selectedRecord: Number;
  monthlyRecords: any[] = [];
  isYear: boolean = false;
  feedDueDetails: any[] = [];  
  selectedFeedIds: any[] = [];  
  feedIds: string = null;
  selectedBrokerIds: any[] = [];  
  brokerIds: string = null;
  bchecked:boolean= false;
  brockerDetails:any[]=[];
  totalDue:any = {};
  constructor(private _dataService: DataService, private toastr: ToastrService,private spinner:NgxSpinnerService) {
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
    this.minDate = moment([currentYear, this.MMonth, 31]);
    this.financialYears = [];
    this.currentDate = new Date();
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 15);
    this.GetLookUpData();
    this.getData();
    this.getFeedPurchaseDueReports();
    for (var i = 2019; i <= this.currentDate.getFullYear(); i++) {
      this.financialYears.push(i + "-" + +(i + 1));
    }
    this.currentFY = this.currentDate.getMonth() + 1 > 3 ? this.currentDate.getFullYear() + "-" + +(this.currentDate.getFullYear() + 1) : +(this.currentDate.getFullYear() - 1) + "-" + this.currentDate.getFullYear();
  }


  //  Drop Down Change Event  
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
    this.getFeedPurchaseDueReports();
  }

  // Finantial Year Change Event
  chosenYear(event) {    
    this.Month = null;
    var newarr = event.value;
    var sliced = newarr.slice(0, -5);
    this.Year = sliced;
    this.getFeedPurchaseDueReports();
  }

  // Change event for year
  chosenYearHandler(normalizedYear: Moment) {    
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    var CYear = new Date(ctrlValue.year(normalizedYear.year()));
    this.Year = CYear.getFullYear();
    this.date.setValue(ctrlValue);
    // this.getMOnthlyReport();
  }

  // Chane event for Month
  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    var CDate = new Date(ctrlValue.month(normalizedMonth.month()));
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.Month = CDate.getMonth() + 1;
    this.Year = CDate.getFullYear();
    this.getFeedPurchaseDueReports();
  }

  // get Feed Purchase Due Reports
  getFeedPurchaseDueReports() {   
    var req = {
      "FeedTypes": this.feedIds,
      "Brokers": this.brokerIds,
      "FarmId": this.selectedFarm.FarmId,
      "FromDate": this.fromDate,
      "ToDate": this.toDate
    }
this.spinner.show();
    this._dataService.Post("FarmActivity/GetFeedPurchaseDueReport", req).subscribe(response => {
      this.spinner.hide();
      if (response.IsSuccess) {
        this.feedDueDetails = response.ListResult == null ? [] : response.ListResult;
        let DueSum :any = 0;
        this.feedDueDetails.forEach(d => DueSum += d.DueAmount);
        this.totalDue.DueAmount = DueSum;

      }
      else {
        this.toastr.error("An error has occured");
      }
    },
      (error) => {
        this.toastr.error("An error has occured");
      });
  }

  //TOGGLE FILTER
  toggleFilter = function () {
    this.table.reset();
    this.isFiltersEnabled = !this.isFiltersEnabled;
    if (this.isFiltersEnabled) {
      this.filterTooltip = "Disable Filters";
    }
    else {
      this.filterTooltip = "Enable Filters"
    }
  };

  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    this._dataService.Post('FarmActivity/ExportFeedPurchaseDueReports/', this.feedDueDetails).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Feed Purchase Due Details.xlsx";
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


  //Get visit log data
  GetLookUpData(): void {
    this.isDataLoading = true;
    this._dataService.GetAll('FarmActivity/GetLookUpData' + '/' + this.Id + '/' + this.LookUpTypeId)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.LookupData = Data.ListResult;
          this.isDataLoading = false;
          //feedDropDown
          var data = this.LookupData.filter(task => task.LookUpTypeId === DataFactory.LookUp.FeedTypes);
          this.feedTypes = data;          
          this.totalFeedData = data.filter(x => x.NAME != "Medicines" && x.NAME != "Proteins");
          // this.MPtotalFeedData = data.filter(x => x.NAME == "Medicines" || x.NAME == "Proteins");

        } else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        })
  }

  //Get Feed BrokerInfo
  getData() {
    this._dataService.GetAll('CompanyInfo/GetBrokerDetails/' + this.BrokerId)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.BrokerData = Data.ListResult == null ? [] : Data.ListResult;

        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  };

  
  onCheckedChange(checked) {
    if (checked) {
      for (var i = 0; i < this.feedTypes.length; i++) {
        this.rightsdata.push(this.feedTypes[i].Id);
      }
      if (this.rightsdata.length > 0)
        this.selectedFeedIds = this.rightsdata;
    }
    else {
      this.selectedFeedIds = [];
    }
    this.feedIds =  this.selectedFeedIds.length>0? this.selectedFeedIds.join(","):null;
  }

  onChange(deviceValue) {    
    var len = this.feedTypes.length;
    if (len == deviceValue.length) {
      this.checked = true;
    }
    else {
      this.checked = false;
    }
    this.feedIds =  this.selectedFeedIds.length>0? this.selectedFeedIds.join(","):null;  
  }

  onBCheckedChange(checked) {
    debugger
    if (checked) {
      for (var i = 0; i < this.BrokerData.length; i++) {
        this.brockerDetails.push(this.BrokerData[i].BrokerId);
      }
      if (this.brockerDetails.length > 0)
        this.selectedBrokerIds = this.brockerDetails;
    }
    else {
      this.selectedBrokerIds = [];
    }
    this.brokerIds =  this.selectedBrokerIds.length>0? this.selectedBrokerIds.join(","):null;
  }

  onBChange(deviceValue) {        
    var len = this.BrokerData.length;
    if (len == deviceValue.length) {
      this.bchecked = true;
    }
    else {
      this.bchecked = false;
    }
    this.brokerIds =  this.selectedBrokerIds.length>0? this.selectedBrokerIds.join(","):null;  
  }

  
  onSearchClick() {
    this.getFeedPurchaseDueReports();
  }

  onClearSearch() {
    this.selectedFeedIds = [];    
    this.feedIds = null;
    this.selectedBrokerIds =[];
    this.brokerIds = null;
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 15);
    this.getFeedPurchaseDueReports();
  }
}

