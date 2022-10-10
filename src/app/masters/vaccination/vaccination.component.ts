import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DataFactory } from '../../shared/dataFactory';


@Component({
  selector: 'app-vaccination',
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {
  clicked: boolean  = false;
  VaccinationList: any;
  isEditable: boolean;
  VaccinationData: any;
  Id: string;
  ActivityRights: any;
  userData: any;
  data: any=[];
  isAddVaccinationDetails: boolean=false;
  possibleStatuses= [];
  possibleUnit = [];
  AddVaccinationForm:FormGroup;
  ClassType = DataFactory.ClassType;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  constructor(public dialog: MatDialog,private _dataService: DataService, private toastr: ToastrService,private fb:FormBuilder) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.AddVaccinationForm = fb.group({
      Name: ['', Validators.required],
      VaccinationType: ['', Validators.required],
      Dosage: ['', Validators.required],
      Comments: ['', Validators.required],
      IsActive: ['', Validators.required],
    });
    
   }

  ngOnInit() {
    this.getData();
    this.GetVaccinationType();
    
  }

   //Get Vaccination Type
   GetVaccinationType() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', this.ClassType.VaccinationType)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.VaccinationList = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      });
  }

  addRow() {
    // var filterArray = this.VaccinationData.filter(x => x.isEditable == true);
    // if(filterArray.length>0){
    //   for(var i=0;i<this.VaccinationData.length;i++){
    //     this.VaccinationData[i].isEditable=false;
    //   }
    // }

    if (this.VaccinationData.length > 0) {

    if(this.VaccinationData[0].isAdd==true){
      this.VaccinationData = [...this.VaccinationData];
      this.VaccinationData.shift();
      }
    this.VaccinationData = [...this.VaccinationData];
    this.VaccinationData.unshift({Name: "", VaccinationType: "", Dosage:"", Comments: "",  IsActive:true, isEditable: true, isAdd:true});
    }else {
      this.VaccinationData.push({Name: "", VaccinationType: "", Dosage:"", Comments: "",  IsActive:true, isEditable: true, isAdd:true});
      this.VaccinationData = [...this.VaccinationData];
    }
  }


  cancelvaccinationAddClick(row){
    this.VaccinationData = [...this.VaccinationData];
    this.VaccinationData.shift();
    row.isEditable=false;
  }

  editRow(row) {
    if(this.VaccinationData[0].isAdd==true){
    this.VaccinationData = [...this.VaccinationData];
    this.VaccinationData.shift();
    }
    this.VaccinationData.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd=false;
  }
  onUpdateRow(row){
    row.isEditable=false;
    var req={
      "Id":row.Id,
      "Name":row.Name,
      "VaccinationTypeId":this.AddVaccinationForm.value.VaccinationType,
      "Dosage":row.Dosage,
      "Comments":row.Comments,
      "IsActive":row.IsActive,
      "CreatedByUserId":row.CreatedByUserId,
      "CreatedDate":row.CreatedDate,
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate":new Date()
    }
    this._dataService.Post('CompanyInfo/AddUpdateVaccination/', req)
      .subscribe((Data) => {
        this.clicked = false;
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
  cancelVaccinationEditClick(row){
    row.isEditable=false;
    this.getData();
  }

  save(row) {
    row.isEditable = false
  }


  addVaccinationClick(row) {
    // this.data.push({
    //   'Id': this.data.length,
    // })
    // row.isEditable = false

    var req={
      "Id":null,
      "Name":this.AddVaccinationForm.value.Name,
      "VaccinationTypeId":this.AddVaccinationForm.value.VaccinationType,
      "Dosage":this.AddVaccinationForm.value.Dosage,
      "Comments":this.AddVaccinationForm.value.Comments,
      "IsActive":this.AddVaccinationForm.value.IsActive,
      "CreatedByUserId":this.userData.Id,
      "CreatedDate":new Date(),
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate":new Date()
    }
    this._dataService.Post('CompanyInfo/AddUpdateVaccination/', req)
      .subscribe((Data) => {
        this.clicked = false;
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
    this.VaccinationData = [...this.VaccinationData];
    this.VaccinationData.shift();
    row.isEditable=false;
  }


//Delete VaccinationDetails
  delete(row, rowIndex) {
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
        this._dataService.Post('CompanyInfo/DeleteVaccination/', req)
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
    this._dataService.Post('CompanyInfo/ExportVaccination/', this.VaccinationData).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Vaccination.xlsx";
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

  //Get Vaccination Details
  getData (){
    this._dataService.GetAll('CompanyInfo/GetVaccinationDetails/'+ this.Id  )
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.VaccinationData = Data.ListResult;
          this.isEditable = false;
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
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
      this.sortField = this.table.sortField;
      this.sortOrder = this.table.sortOrder;
      this.table.reset();
      this.table.sortField = this.sortField;
      this.table.sortOrder = this.sortOrder;
      this.filterTooltip = "Enable Filters";
    }
  };
}
