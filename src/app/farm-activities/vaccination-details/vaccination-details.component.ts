import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-vaccination-details',
  templateUrl: './vaccination-details.component.html',
  styleUrls: ['./vaccination-details.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class VaccinationDetailsComponent implements OnInit {
  // ChickAge: any;
  FROMDATE: Date;
  formDate: any;
  date = new Date();
  VaccinationData: any;
  selectedDate: Date;
  curDate=new Date();
  BatchList: any;
  AddBrokerInfoForm: FormGroup;
  ActivityRights: any;
  userData: any;
  // Id: string;
  isEditable: boolean;
  ChickVaccinationData: any;
  rowData: any;
  isAddVaccinDetails:boolean=false;
  batchesList:any[];    
  // batchCtrl: FormControl;
  filteredBatches: Observable<any[]>;
  VaccinationDetailsList: any[]; 
  isEditVaccinDetails:boolean=false;
  AddChickVaccinationForm:FormGroup;
  EditChickVaccinationForm:FormGroup;
  Age:any;
  maxDate=new Date();
  FarmInfo: any;
  constructor(public dialog: MatDialog,private _dataService: DataService, private toastr: ToastrService,private fb:FormBuilder) { 
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.FarmInfo = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.AddChickVaccinationForm = fb.group({
      BatchName: ['', Validators.required],
      Age: ['', Validators.required],
      VaccinationName: ['', Validators.required],
      VaccinationDate: ['', Validators.required],
    });

    this.EditChickVaccinationForm = fb.group({
      BatchName: ['', Validators.required],
      Age: ['', Validators.required],
      VaccinationName: ['', Validators.required],
      VaccinationDate: ['', Validators.required],
    });

    // this.batchCtrl = new FormControl();
    // this.batchCtrl.valueChanges.subscribe(val => {
    //   this.filterBatches(val);
    // }); 
  }

  ngOnInit() {
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.getData();
    this.getBatchInfo();
    this.getVaccination();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
    // this.onSearch();   
  }

//   filterBatches(name: string) {
//     let filteredData = this.batchesList.filter(State =>
//       State.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
//     this.filteredBatches = new Observable(observer => {
//         observer.next(filteredData);
//     }); 
// }

onDateChange(item){
  this.formDate=item.value;
}

 //Get Batch Info
 getBatchInfo (){
   var Id=null;
  this._dataService.GetAll('CompanyInfo/GetBatchInfoById/'+ Id +'/'+ this.FarmInfo.FarmId)
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.BatchList = Data.ListResult;
        this.isEditable = false;
      }
      else{
        this.toastr.error("An error has occured");
      }
    },(error)=>{
      this.toastr.error("An error has occured");
    })
};

 //Get Vaccination Details
 getVaccination (){
  var Id=null;
  this._dataService.GetAll('CompanyInfo/GetVaccinationDetails/'+ Id )
    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.VaccinationData = Data.ListResult;
        this.isEditable = false;
      }else{
        this.toastr.error("An error has occured");
      }
    },(error)=>{
      this.toastr.error("An error has occured");
    })
};
//Get all ChickVaccination Details
// getData(){
//   var req={
//     "Id":null,
//     "FromDate":null,
//     "ToDate":null,
//     "FarmId":this.FarmInfo.FarmId
//   }
//   this._dataService.Post('FarmActivity/GetChickVaccinations/', req)
//   .subscribe((Data) => {
//     if (Data.IsSuccess) {
//       this.ChickVaccinationData = Data.ListResult;
//       this.isEditable = false;
//     }
//     else{
//       this.toastr.error("An error has occured");
//     }
//   },(error)=>{
//     this.toastr.error("An error has occured");
//   })
  
// }

getData(){
  var req = {
    "Id":null,
    "FromDate": this.FROMDATE,//=new Date(),//'2019-04-06 15:16:12.400',
    "ToDate": this.date,//=new Date() //'2019-04-06 15:16:12.400' 
    "FarmId":this.FarmInfo.FarmId
  }
  this._dataService.Post('FarmActivity/GetChickVaccinations/', req)
  .subscribe((Data) => {
    if (Data.IsSuccess) {
      this.ChickVaccinationData = Data.ListResult;
      this.isEditable = false;
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
  this.FROMDATE.setDate(this.FROMDATE.getDate() - 30);
  this.date=new Date();
  this.getData();
}

//batch change
onSelectBatch(name) {
  var ChickAge =  this.BatchList.find(x => x.Id == name.Id);
  this.Age =  ChickAge.AgeinWeeks + '/' + ChickAge.AgeinDays;
 }

// onItemNameChangeEvent(item){
//   var AgeInDays=this.BatchList.filter(x=>x.Id==item.value)
//   this.Age =  AgeInDays.AgeinDays;
// }

onVaccinDetailsAdd(){
  var req={
    "Id":null,
    "FarmId":this.FarmInfo.FarmId,
    "BatchId":this.AddChickVaccinationForm.value.BatchName,
    "VaccinationId":this.AddChickVaccinationForm.value.VaccinationName,
    "VaccinatedDate":this.AddChickVaccinationForm.value.VaccinationDate,
    "IsActive":true,
    "CreatedByUserId":this.userData.Id,
    "CreatedDate":new Date(),
    "UpdatedByUserId":this.userData.Id,
    "UpdatedDate":new Date()
  }
  this._dataService.Post('FarmActivity/AddUpdateChickVaccination/', req)

    .subscribe((Data) => {
      if (Data.IsSuccess) {
        this.toastr.success(Data.EndUserMessage);
        this.isAddVaccinDetails=false;
        this.getData();
        this.onCancleVaccinDetailsAdd();
      }
      else {
        this.toastr.error("An error has occured");
      }
    },(error)=>{
      this.toastr.error("An error has occured");
    })

}

  onAddVaccnDetailsClick(){
    this.Age=null;
    this.isAddVaccinDetails=true;
  }

  onCancleVaccinDetailsAdd(){
    this.isAddVaccinDetails=false;
    this.AddChickVaccinationForm.reset();
    this.selectedDate = new Date();
  }
  onEditVaccinDetailsClick(row){
    this.isEditVaccinDetails=true;
    row.AgeinWeeks=row.AgeinWeeks +'/'+ row.AgeinDays;
    this.rowData=row;   
  }

  onVaccinationDetailsEdit(){
    var req={
      "Id":this.rowData.Id,
      "FarmId":this.FarmInfo.FarmId,
      "BatchId":this.rowData.BatchId,
      "VaccinationId":this.rowData.VaccinationId,
      "VaccinatedDate":this.rowData.VaccinatedDate,
      "IsActive":true,
      "CreatedByUserId":this.rowData.CreatedByUserId,
      "CreatedDate":this.rowData.CreatedDate,
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate":new Date()
    }
    this._dataService.Post('FarmActivity/AddUpdateChickVaccination/', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isEditVaccinDetails=false;
            this.getData();
            // this.onSearch()
        }
        else {
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }

  onCancleVaccinDetailsEdit(){
    this.isEditVaccinDetails=false;
    this.getData();
  }

  //Delete BrokerInfo
  onDeleteVaccinDetailsClick(row, index) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to delete ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var req = {
          "Id": row.Id,
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date()
        }
        this._dataService.Post('FarmActivity/DeleteChickVaccination/', req)
          .subscribe((Data) => {
            if (Data.IsSuccess) {
              this.toastr.success(Data.EndUserMessage);
              this.getData();
            }
            else {
              this.toastr.error("An error has occured");
            }
          },(error)=>{
            this.toastr.error("An error has occured");
          })
      }
    });
  }

   //ExportToExcel
   download = function () {
    this.isDataLoading=true;
     var vaccinarionExport = {
       FromDate: this.FROMDATE,
       ToDate: this.date,
       FarmName:this.FarmInfo.FarmName,
       ChickVaccinationData: this.ChickVaccinationData
     }
    this._dataService.Post('FarmActivity/ExportChickVaccination/', vaccinarionExport).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Chick Vaccinations.xlsx";
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
}

// export class State {
//   constructor(public name: string) { }
// }
