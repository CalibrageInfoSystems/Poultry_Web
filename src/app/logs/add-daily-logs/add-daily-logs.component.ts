import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { DataFactory } from '../../shared/dataFactory';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-daily-logs',
  templateUrl: './add-daily-logs.component.html',
  styleUrls: ['./add-daily-logs.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class AddDailyLogsComponent implements OnInit {
  clicked:boolean = false;
  userData: any;
  selectedFarm: any;
  logData: any;
  shedsList:any[]=[];
  logDataByShedType:any[]=[];
  isDataLoading:boolean=false;
  curDate: any;
  selectedDate: Date;
  addDaiyLogForm: FormGroup;
  constructor(private fb: FormBuilder,private _dataService: DataService,private toastr: ToastrService ,private spinner:NgxSpinnerService) {
    this.userData=JSON.parse(localStorage.getItem("UserInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.addDaiyLogForm = this.fb.group({
      seleclogDate: ['', Validators.required],
    })
   }

   ngOnInit() {    
    this.curDate = new Date();
    this.selectedDate = new Date();
    this.GetLogData();
  }

  //Get visit log data
  GetLogData(): void {
    debugger
    this.shedsList=[];
    this.logDataByShedType=[];
    this.logData=[];
    this.isDataLoading = true;
    var req={
        UserId:this.userData.Id,
        FarmId:this.selectedFarm.FarmId,
        Date:this.selectedDate
    }
    this.spinner.show();
    this._dataService.Post('Log/GetVisitLogDateByUserId/',req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.isDataLoading = false;
        if (Data.IsSuccess) {
          this.logData = Data.ListResult;
          //Distinct Shed Types 
          var shedTypes = [];
          for (var i = 0; i < this.logData.length; i++) {
            if (shedTypes[this.logData[i].ShedType]) continue;
            shedTypes[this.logData[i].ShedType] = true;
            this.shedsList.push(this.logData[i].ShedType);
          }
          for (var i = 0; i < this.shedsList.length; i++) {
            var req = {
              shedType: this.shedsList[i],
              shedLogData: [],
            }
            req.shedLogData = this.logData.filter(x => x.ShedType == this.shedsList[i]);
            if(this.shedsList[i] == "Chick Shed"){
              for (var j = 0; j < req.shedLogData.length; j++) {
                req.shedLogData[j].IsProduction=false;
              }
            }else{
              for (var k = 0; k < req.shedLogData.length; k++) {
                if(req.shedLogData[k].IsProduction == null){
                  req.shedLogData[k].IsProduction=true;
                }
              }
            }
            
            this.logDataByShedType.push(req);
          }
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }
  //Add Daily Logs
  addVisitLog() {
    this.isDataLoading=true;
    var finalreq: any[] = [];
    for (var i = 0; i < this.logDataByShedType.length; i++) {
      for (var j = 0; j < this.logDataByShedType[i].shedLogData.length; j++) {
        var req = {
          "Id": 0,
          "ShedId": this.logDataByShedType[i].shedLogData[j].ShedId,
          "Died": this.logDataByShedType[i].shedLogData[j].Died,
          "Hurt": this.logDataByShedType[i].shedLogData[j].Hurt,
          "Feed": this.logDataByShedType[i].shedLogData[j].Feed,
          "DamagedEggs": this.logDataByShedType[i].shedLogData[j].DamagedEggs,
          "NumberofEggs": this.logDataByShedType[i].shedLogData[j].NumberofEggs,
          "StatusTypeId": DataFactory.Status.Pending,
          "CreatedByUserId": this.userData.Id,
          "CreatedDate": new Date(),
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date(),
          "BatchId":this.logDataByShedType[i].shedLogData[j].BatchId,          
          "ChicksCount":this.logDataByShedType[i].shedLogData[j].ChicksCount,
          "Remarks":this.logDataByShedType[i].shedLogData[j].Remarks,
          "LogDate":this.addDaiyLogForm.value.seleclogDate,
          "TransitionDate" : this.logDataByShedType[i].shedLogData[j].TransitionDate,
          "IsProduction": this.logDataByShedType[i].shedLogData[j].IsProduction
        }
        finalreq.push(req);
      }
    }
    var visitLogReq={
      Log:finalreq,
      Date:this.selectedDate
    }
    this.spinner.show();
    this._dataService.Post('Log/AddVisitLog/', visitLogReq)
      .subscribe((Data) => { 
        this.spinner.hide();
        this.clicked = false;       
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.GetLogData();
          this.logDataByShedType=[]
          // this.selectedDate = new Date();
          this.isDataLoading = false;          
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.isDataLoading = false;
          this.toastr.error("An error has occured");
        });
  }

  //On cancel click
  onCancleLogAdding(){
    this.GetLogData();
  }

  isCheckShed(value){
    if(value !=undefined){
      if(value==DataFactory.ShedType.ChickShed){
        return false;
      }else{
        return true;                
      }
    }else{
      return true;                      
    }
  }

  isApprovedOrDeclined(value){
    if(value !=undefined){
      if(value==DataFactory.Status.Approved){
        return false;
      }else{
        return true;                
      }
    }else{
      return true;                      
    }
  }

   // restrict letters
   onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onChangeLogDate($event)
  {
    this.GetLogData();
  }
}
