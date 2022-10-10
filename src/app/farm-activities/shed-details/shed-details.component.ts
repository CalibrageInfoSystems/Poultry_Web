import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { DataFactory } from '../../shared/dataFactory';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-shed-details',
  templateUrl: './shed-details.component.html',
  styleUrls: ['./shed-details.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ShedDetailsComponent implements OnInit {
  clicked: boolean = false;
  @ViewChild('dt') table: Table;
  isDataLoading: boolean;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  rowData: any;
  shedDetailsList: any[];  
  shedsArray: any[];  
  farmsList:any[];  
  shedList:any[];
  shedTypeList:any[];
  isAddShedDetails:boolean=false;
  isEditShedDetails:boolean=false;
  addShedDetailsForm:FormGroup;
  editShedDetailsForm:FormGroup;
  ActivityRights = [];
  userData: any;
  selectedFarm: any;
  FarmInfo: any;
  
  constructor(public dialog: MatDialog,private _dataService: DataService, private toastr: ToastrService,private _fb:FormBuilder,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.FarmInfo = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.addShedDetailsForm=_fb.group({
      shedNumber:['',Validators.required],
      farmName:this.FarmInfo.FarmId,
      shedType:['',Validators.required],
      capacity:['',Validators.required],
      isActive:[true]
    })
    this.editShedDetailsForm=_fb.group({
      shedNumber:['',Validators.required],
      farmName:this.FarmInfo.FarmId,
      shedType:['',Validators.required],
      capacity:['',Validators.required],
      isActive:['']
    })
   }

  ngOnInit() {
    this.GetSheds();
    this.getFarms();
    this.getShedType();
  }
  //Get Sheds By User Id
  GetSheds(): void {  
    var Id:null;
    this.spinner.show();
    this._dataService.GetAll('CompanyInfo/GetShedInfoById'+'/'+ Id +'/'+ this.FarmInfo.FarmId)
      .subscribe((Data) => { 
        this.spinner.hide();    
        if (Data.IsSuccess) {
          this.shedDetailsList = Data.ListResult;
          this.shedsArray = Data.ListResult.map(x => Object.assign({}, x)); 
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
      (error) => {    
        this.toastr.error("An error has occured");              
        });
  }

  //Get all Farms
  getFarms(): void {
    this._dataService.Get('CompanyInfo/GetFarmInfoById', this.FarmInfo.FarmId)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.farmsList = Data.ListResult;
          this.selectedFarm=this.farmsList[0];
        }
        else {
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      });
  }

  getShedType(){
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', DataFactory.ClassType.ShedType)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.shedTypeList = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      });
  }

  onAddShedClick(){
    this.isAddShedDetails=true;
  }

  onShedSave(){
    var req={
      "Id": null,
      "Name": this.addShedDetailsForm.value.shedNumber,
      "FarmId": this.FarmInfo.FarmId,
      "ShedTypeId": this.addShedDetailsForm.value.shedType,
      "Capacity": this.addShedDetailsForm.value.capacity,
      "IsActive": this.addShedDetailsForm.value.isActive,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateShedInfo/', req)
    .subscribe((Data) => {
      this.spinner.hide();
      this.clicked = false;
      if (Data.IsSuccess) {
        this.toastr.success(Data.EndUserMessage);
        this.GetSheds();
        this.isAddShedDetails = false;
      }
      else {
        this.toastr.error("An error has occured");
      }
    },
      (error) => {
        this.toastr.error("An error has occured");
      });
  }

  onCancleShedAdding(){
    this.isAddShedDetails=false; 
    this.addShedDetailsForm.reset();
    this.addShedDetailsForm=this._fb.group({
      shedNumber:['',Validators.required],
      farmName:this.FarmInfo.FarmId,
      shedType:['',Validators.required],
      capacity:['',Validators.required],
      isActive:[true]
    })
    
    // const { addShedDetailsForm: { value: formValueSnap } } = this;
    // this.addShedDetailsForm.reset(formValueSnap);      
  }
  onEditShedDetailsClick(row){
    this.isEditShedDetails=true;
    this.rowData=row;
  }

  onShedUpdate(){
    var req={
      "Id": this.rowData.Id,
      "Name": this.rowData.ShedName,
      "FarmId": this.rowData.FarmId,
      "ShedTypeId": this.rowData.ShedTypeId,
      "Capacity": this.rowData.Capacity,
      "IsActive": this.rowData.IsActive,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate": this.rowData.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateShedInfo/', req)
    .subscribe((Data) => {
      this.spinner.hide();
      this.clicked = false;
      if (Data.IsSuccess) {
        const { editShedDetailsForm: { value: formValueSnap } } = this;
        this.editShedDetailsForm.reset(formValueSnap);    
        this.toastr.success(Data.EndUserMessage);
        this.GetSheds();
        this.isEditShedDetails = false;
      }
      else {
        this.toastr.error("An error has occured");
      }
    },
      (error) => {
        this.toastr.error("An error has occured");
      });
  }

  onCancleShedEdit(){
    this.isEditShedDetails=false;
    this.shedDetailsList = this.shedsArray.map(x => Object.assign({}, x))    
    const { editShedDetailsForm: { value: formValueSnap } } = this;
    this.editShedDetailsForm.reset(formValueSnap);    
  }
  // onDeleteShedDetailsClick(row){
  //   let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     data:{ msg:"Are you sure you want to delete ?"} ,
  //     width: 'auto',
  //     height: 'auto'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != undefined){
  //       this.shedDetailsList.splice(this.shedDetailsList.indexOf(row), 1);
  //     }
  //     });
  // }


  onDeleteShedDetailsClick(row) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to delete ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.spinner.show();
        var req = {
          "Id": row.Id,
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date()
        }
        this._dataService.Post('CompanyInfo/Deleteshed/', req)
          .subscribe((Data) => {
            this.spinner.hide();
            if (Data.IsSuccess) {
              this.toastr.success(Data.EndUserMessage);
              this.GetSheds();
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
  //Export
  download = function () {
    this.isDataLoading = true;
    this._dataService.Post('CompanyInfo/ExportShedInfo/', this.shedDetailsList).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Shed Details.xlsx";
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
}
