import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { DataFactory } from '../../shared/dataFactory';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-addlogs',
  templateUrl: './addlogs.component.html',
  styleUrls: ['./addlogs.component.css']
})
export class AddlogsComponent implements OnInit {

  addVisitlogForm:FormGroup;
  shedsList:any[]=[];
  isLoading:boolean=false;
  viewLogs: any[] = [];
  userData: any;
  status = DataFactory.Status;
  isDataLoading:boolean=false;
  selectedFarm: any;

  constructor(private fb: FormBuilder,private _dataService: DataService,private toastr: ToastrService) { 
    this.userData=JSON.parse(localStorage.getItem("UserInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
   this.onformBuild();
  }

  onformBuild(){
    this.addVisitlogForm = this.fb.group({
      items: this.fb.array([])
    })
  }

  ngOnInit() {
    this.GetSheds();
    this.GetVisitLogs();
  }
  //Get Sheds By User Id
  GetSheds(): void {
    this.isLoading=true;
    this._dataService.GetAll('CompanyInfo/GetShedsByUserId'+'/'+ this.userData.Id +'/'+ this.selectedFarm.FarmId)
      .subscribe((Data) => {
        this.isLoading=false;        
        if (Data.IsSuccess) {
          this.shedsList = Data.ListResult;
          for(var i=0;i<this.shedsList.length;i++){
            (this.addVisitlogForm.controls['items'] as FormArray).push(this.createItem(this.shedsList[i]));
            }
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      });
  }

  onBlurMethod(ShedName,index){
    var shedChicks=this.shedsList.filter(x=>x.ShedId==ShedName.value.ShedId);
    if(ShedName.value.NumberofEggs>shedChicks[0].Capacity)
      this.toastr.error("Eggs count is greater than Birds count");
      this.addVisitlogForm.value.items[index].NumberofEggs=null;
  }

  createItem(item) {
    return this.fb.group({
      ShedId:item.ShedId,
      ShedName: item.ShedName + ' (Batch:' + item.BatchName + ' )',
      // ShedName: item.ShedName + '( ' + item.FarmName + ' )',
      Died: [''],
      Hurt: [''],
      NumberofEggs: ['',item.ShedTypeId==DataFactory.ShedType.ChickShed ? null : Validators.required],
      DamagedEggs: [''],
      Feed: ['',Validators.required],
      AgeinWeeks:item.AgeinWeeks,
      ShedTypeId:item.ShedTypeId,
      isRequired:[],
      BatchName:item.BatchName,
      BatchId:item.BatchId
    })
  }

  isFieldRequired(item){
    if(item !=undefined){
      if(item.value.ShedTypeId==DataFactory.ShedType.ChickShed){
        return false;
      }else{
        return true;        
      }
    }
  }

  isFieldReadOnly(item){
    if(item !=undefined){
      if(item.value.ShedTypeId==DataFactory.ShedType.ChickShed){
        return false;
      }else{
        return true;        
      }
    }
  }

  isApprovedOrDeclined(value){
    if(value !=undefined){
      if(value.StatusTypeId==this.status.Approved){
        return false;
      }else{
        return true;                
      }
    }else{
      return true;                      
    }
  }

  onCancleLogAdding(){
    this.addVisitlogForm.reset();
    this.onformBuild();    
    this.GetSheds();
    this.GetVisitLogs();
  }

  //Add Daily Logs
  addVisitLog() {
    this.isDataLoading=true;
    var finalreq: any[] = [];
    for(var i=0;i<this.addVisitlogForm.value.items.length;i++){
      if(this.viewLogs.length>0){
       
        var filteredList=this.viewLogs.filter(x=>x.ShedId==this.addVisitlogForm.value.items[i].ShedId);
      
        var req={
          "Id": 0,
          "ShedId": this.addVisitlogForm.value.items[i].ShedId,
          "Died": this.addVisitlogForm.value.items[i].Died,
          "Hurt": this.addVisitlogForm.value.items[i].Hurt,
          "Feed": this.addVisitlogForm.value.items[i].Feed,
          "DamagedEggs": this.addVisitlogForm.value.items[i].DamagedEggs,
          "NumberofEggs": this.addVisitlogForm.value.items[i].NumberofEggs,
          "StatusTypeId": filteredList[0].StatusTypeId==DataFactory.Status.Declined ? DataFactory.Status.Pending : filteredList[0].StatusTypeId,//DataFactory.Status.Pending,
          "CreatedByUserId":this.userData.Id,
          "CreatedDate": new Date(),
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date(),
          "BatchId":this.addVisitlogForm.value.items[i].BatchId
        }
      finalreq.push(req);   
      }
      else{
        var req1={
          "Id": 0,
          "ShedId": this.addVisitlogForm.value.items[i].ShedId,
          "Died": this.addVisitlogForm.value.items[i].Died,
          "Hurt": this.addVisitlogForm.value.items[i].Hurt,
          "Feed": this.addVisitlogForm.value.items[i].Feed,
          "DamagedEggs": this.addVisitlogForm.value.items[i].DamagedEggs,
          "NumberofEggs": this.addVisitlogForm.value.items[i].NumberofEggs,
          "StatusTypeId": DataFactory.Status.Pending,
          "CreatedByUserId":this.userData.Id,
          "CreatedDate": new Date(),
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date(),
          "BatchId":this.addVisitlogForm.value.items[i].BatchId
        }
      finalreq.push(req1);   
      }
    }
    this._dataService.Post('Log/AddVisitLog/', finalreq)
      .subscribe((Data) => {
        this.isDataLoading=false;        
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.GetVisitLogs();
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        } 
      },
      (error) => {    
        this.isDataLoading=false;                
        this.toastr.error(error.error);              
        });
  }

   //Get visit log data
   GetVisitLogs(): void {
     var req = {
      "visitedDate": new Date(),
      "FarmId":this.selectedFarm.FarmId
    }
    this._dataService.Post('Log/GetVisitLogByDate/', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.viewLogs = Data.Result.visitLogDetails;         
          // this.viewLogsList= Data.ListResult.map(x => Object.assign({}, x));
        }
      })
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
}
