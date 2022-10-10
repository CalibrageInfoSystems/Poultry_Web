import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-dailyproductionreport',
  templateUrl: './dailyproductionreport.component.html',
  styleUrls: ['./dailyproductionreport.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class DailyproductionreportComponent implements OnInit {
  viewLogs: any = [];
  viewLogsList: any[] = []
  curDate: any; 
  selectedDate: any;
  req: any;
  isDataLoading: boolean = false;
  finalreq: any[];
  selectedFarm: any;
  constructor(private _dataService: DataService,private toastr:ToastrService) {
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
   }

  ngOnInit() {
    this.curDate = new Date();
    this.selectedDate = new Date();
    this.GetVisitLogs();
  }
  //Get visit log data
  GetVisitLogs(): void {
    this.isDataLoading = true;
    this.finalreq=[];
    this.req = {
      "visitedDate": this.selectedDate,
      "FarmId":this.selectedFarm.FarmId
    }
    this._dataService.Post('Log/GetVisitLogByDate/', this.req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.viewLogs = Data.Result;
          // this.viewLogsList= Data.Result.map(x => Object.assign({}, x));
          for(var i=0;i<this.viewLogs.shedTypes.length;i++){
            var req={
              ShedTypeId:this.viewLogs.shedTypes[i].ShedTypeId,
              shedType:this.viewLogs.shedTypes[i].ShedType,
              logs:[],
              Summaries:this.viewLogs.visitLogSummary.filter(x=>x.ShedTypeId==this.viewLogs.shedTypes[i].ShedTypeId)
            }
            req.logs=this.viewLogs.visitLogDetails.filter(x=>x.ShedType==this.viewLogs.shedTypes[i].ShedType);
            req.logs.map(function(obj){
              obj.isEditingvisitlog=false;
            })
            this.finalreq.push(req);
            this.isDataLoading = false;
          }
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }

  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    var excelReq={
      SelectedDate:this.selectedDate,
      FarmName:this.selectedFarm.FarmName,
      shedTypes:this.viewLogs.shedTypes,
      visitLogDetails:this.viewLogs.visitLogDetails,
      visitLogSummary:this.viewLogs.visitLogSummary
      // VisitLogResponse:this.viewLogs
    }
    this._dataService.Post('Log/ExportVisitLog/', excelReq).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Production Report.xlsx";
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
