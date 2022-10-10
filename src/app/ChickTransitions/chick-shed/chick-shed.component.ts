import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { Validators } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { Router } from '@angular/router';
import { FormArray } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-chick-shed',
  templateUrl: './chick-shed.component.html',
  styleUrls: ['./chick-shed.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ChickShedComponent implements OnInit {
  shedDetailsList: any;
  selectedDate: any;
  curDate: any;
  ActivityRights: any;
  userData: any;
  addChickForm: FormGroup;
  batchInfo:any;
  batchDetailsList: any;
  getBatchInfo: any;
  isAddChickTransitions: boolean = false;
  selectedFarm: any;
  isDisabled:boolean=false;
  constructor(public dialog: MatDialog, private _dataService: DataService, private toastr: ToastrService, private fb: FormBuilder,private router:Router) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.batchInfo = JSON.parse(localStorage.getItem("BatchInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.onformBuild();
  }
  onformBuild(){
    this.addChickForm = this.fb.group({
      items: this.fb.array([])
    })
  }
  ngOnInit() {
    this.selectedDate=new Date();
    this.curDate=new Date();   
    this.getBatches();
    // this.GetChickSheds();
  }

    //Get all Batches
    getBatches(): void {
      var Id = null;
      this._dataService.GetAll('CompanyInfo/GetBatchInfoById'+'/'+Id +'/'+ this.selectedFarm.FarmId)
        .subscribe((Data) => {
          if (Data.IsSuccess) {
            this.batchDetailsList = Data.ListResult;
            this.getBatchInfo = this.batchDetailsList.filter(
              task => task.Name === this.batchInfo.Name);
              this.GetChickSheds();
          }          
          else {
            this.toastr.error("An error has occured");
          }
        },
        (error)=>{
          this.toastr.error("An error has occured");
        });
    }

  //Get Sheds by Shed Type
  GetChickSheds(): void {
    var ShedTypeId=DataFactory.ShedType.ChickShed;
    this._dataService.GetAll('Transitions/GetAvailableShedsByShedTypeId'+'/'+ShedTypeId +'/'+ this.selectedFarm.FarmId +'/'+ this.getBatchInfo[0].Id)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.shedDetailsList = Data.ListResult;
          for(var i=0;i<this.shedDetailsList.length;i++){
            (this.addChickForm.controls['items'] as FormArray).push(this.createItem(this.shedDetailsList[i]));
            }
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  createItem(item) {
    return this.fb.group({
      ShedId:item.ShedId,
      ShedName: item.ShedName ,
      ChicksCount: ['',Validators.required],
      TransitionDate:['',Validators.required],
      BatchId:['',Validators.required],
      IsActive:true,
      CreatedDate: new Date(),
      CreatedByUserId: this.userData.Id,
      UpdatedDate: new Date(),
      UpdatedByUserId: this.userData.Id,
    })
  }

  onSave(){
     var reqArr=[];
    //this.addChickForm.value.items;
    for (var i = 0; i < this.addChickForm.value.items.length; i++) {
      if(this.addChickForm.value.items[i].ChicksCount!='')
      reqArr.push(this.addChickForm.value.items[i]);
    }
    for(var i=0;i<reqArr.length;i++){
      reqArr[i].BatchId=this.getBatchInfo[0].Id;
      reqArr[i].TransitionDate=this.selectedDate;
    }
    this._dataService.Post('Transitions/AddUpdateTransitions/', reqArr)
    .subscribe((Data) => {
      if (Data.IsSuccess) {        
        this.toastr.success(Data.EndUserMessage);
        this.router.navigate(['/farm/batchdetails']);
        localStorage.removeItem("BatchInfo");
      }
      else {
        this.toastr.error("An error has occured");
      }
    },
      (error) => {
        this.toastr.error("An error has occured");
      });         
  }  

  // validation for chicks count
  onChange(value){
    this.isAddChickTransitions=false;
    var shedChicksCount=0;
    var ChicksCountarr=[];
    for (let i = 0; i < this.addChickForm.value.items.length; i++) {     
      if(this.addChickForm.value.items[i].ChicksCount!='')
      ChicksCountarr.push(this.addChickForm.value.items[i].ChicksCount);
      //shedChicksCount=shedChicksCount+parseInt(this.addChickForm.value.items[i].ChicksCount);
    }
    for(let i=0;i<ChicksCountarr.length;i++){
      shedChicksCount=shedChicksCount+parseInt(ChicksCountarr[i]);
    }

    if(this.batchInfo.ChicksCount<shedChicksCount){
      this.toastr.error("Sum of Shed Chicks should be equal to batch Chicks");   
      this.isDisabled=false;   
    }  
    else {
      this.isAddChickTransitions=true;  
      this.isDisabled=true;
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
  //On cancel click
  onCancle(){
    this.router.navigate(['/farm/batchdetails']);
  }
}