import { Component, OnInit,ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-cullbirdsreport',
  templateUrl: './cullbirdsreport.component.html',
  styleUrls: ['./cullbirdsreport.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class CullbirdsreportComponent implements OnInit {
  @ViewChild('cb') private table;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  culledBirds:any[]=[];
  req:any;
  isDataLoading:boolean=false;
  date = new Date();
  culledBirdsFilterForm:FormGroup;
  FROMDATE: Date;
  selectedDate: Date;
  selectedFarm: any;
  constructor(private _dataService: DataService, private toastr: ToastrService,private fb: FormBuilder,private spinner:NgxSpinnerService) { 
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm")); 
    this.culledBirdsFilterForm = fb.group({
      fromDate: [''],
      toDate: ['']
    });
  }

  ngOnInit() {
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    this.date=new Date();
    this.GetCullBirdsDetails();
  }

    //Get Culled Birds Data
    GetCullBirdsDetails(): void {
      var req = {
        "FromDate": this.FROMDATE,
        "ToDate": this.date,
        "FarmId":this.selectedFarm.FarmId
      }
      this.isDataLoading=true;
      this.spinner.show();
      this._dataService.Post('Transitions/GetCullBirdsDetails',req )
        .subscribe((Data) => {
          this.spinner.hide();
          if (Data.IsSuccess) {
            this.culledBirds = Data.ListResult;       
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
    this.culledBirdsFilterForm.value.fromDate=this.FROMDATE;
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    this.date=new Date();
    this.GetCullBirdsDetails();
 }
 onDateChange(item){
  this.FROMDATE=item.value;
}

 //ExportToExcel
download = function () {
this.isDataLoading=true;
var cullBirdsExport={
  FromDate: this.FROMDATE,
  ToDate: this.date,
  FarmName:this.selectedFarm.FarmName,
  culledBirds: this.culledBirds
}
this._dataService.Post('Transitions/ExportCullBirds/', cullBirdsExport).subscribe((result) => {
  if (result != null && result != undefined && result != '') {
    var data = result;
    var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = "Culled Birds.xlsx";
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

//TOGGLE FILTER
toggleFilter = function () {
  this.table.reset();
  this.isFiltersEnabled = !this.isFiltersEnabled;
  if (this.isFiltersEnabled)
    this.filterTooltip = "Disable Filters";
  else {
    this.filterTooltip = "Enable Filters";
  }
};
}
