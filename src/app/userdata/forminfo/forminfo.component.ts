import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DataFactory } from '../../shared/dataFactory';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-forminfo',
  templateUrl: './forminfo.component.html',
  styleUrls: ['./forminfo.component.css']
})
export class ForminfoComponent implements OnInit {
  clicked:boolean = false;
  @ViewChild('fi') private table;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  rowData: any;
  ActivityRights: any;
  userData: any;
  CompanyList: any;
  BreedList: any;
  isEditable: boolean;
  FormInfoData: any;
  Id: string;
  isAddFormDetails: boolean = false;
  isEditFormDetails: boolean = false;
  mainGrid: boolean = true;
  mainBtns: boolean = true;
  formInfo: any = []
  poultryBreeds: any[];
  totalRecords: number;
  selected: string;
  ClassType = DataFactory.ClassType;
  AddFormInfoForm: FormGroup;
  EditFormInfoForm: FormGroup;

  constructor(public dialog: MatDialog, private _dataService: DataService, private toastr: ToastrService, private fb: FormBuilder,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.AddFormInfoForm = fb.group({
      FarmName: ['', Validators.required],
      Company: ['', Validators.required],
      AddressLine1: ['', Validators.required],
      AddressLine2: ['', Validators.required],
      Village: ['', Validators.required],
      Mandal: ['', Validators.required],
      District: ['', Validators.required],
      State: ['', Validators.required],
      PinCode: ['', Validators.required],
      Area: ['', Validators.required],
      MobileNumber: ['', Validators.required],
      Breed: ['', Validators.required],
      IsActive: ['', Validators.required]
    });


    this.EditFormInfoForm = fb.group({
      FarmName: ['', Validators.required],
      Company: ['', Validators.required],
      AddressLine1: ['', Validators.required],
      AddressLine2: ['', Validators.required],
      Village: ['', Validators.required],
      Mandal: ['', Validators.required],
      District: ['', Validators.required],
      State: ['', Validators.required],
      PinCode: ['', Validators.required],
      Area: ['', Validators.required],
      MobileNumber: ['', Validators.required],
      Breed: ['', Validators.required],
      IsActive: ['', Validators.required]
    });
    
   }

  ngOnInit() {
    this.getData();
    this.GetBreedType();
    this.getCompanyInfo();
  }
  //Get Vaccination Type
  GetBreedType() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', this.ClassType.Breed)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.BreedList = Data.ListResult;
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      });
  }


  //Get All FormInfo
  getCompanyInfo() {
    this._dataService.GetAll('CompanyInfo/GetCompanyInfo/' + this.Id)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.CompanyList = Data.ListResult;
          this.isEditable = false;
        }
      })
  };

   //Get All FormInfo
  getData() {
    this.spinner.show();
    this._dataService.GetAll('CompanyInfo/GetFarmInfoById/' + this.Id)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.FormInfoData = Data.ListResult;
          this.isEditable = false;
        }
      })
  };
   // Edit Form Data
  onEditFormClick(row) {
    this.rowData=row;
    this.isAddFormDetails = false;
    this.mainGrid = false;
    this.mainBtns = false;
    this.isEditFormDetails = true;
    this.getData();
  }

  // Add Form Data
  onAddFormClick() {
    this.isAddFormDetails = true;
    this.mainGrid = false;
    this.mainBtns = false;
    this.isEditFormDetails = false;
    this.AddFormInfoForm.reset();
    this.getData();

  }
  //Save FormInfo
  onSaveFormClick() {
    this.spinner.show();
    var req = {
      "Id": null,
      "CompanyId": this.AddFormInfoForm.value.Company,
      "Name": this.AddFormInfoForm.value.FarmName,
      "AddressLine1": this.AddFormInfoForm.value.AddressLine1,
      "AddressLine2": this.AddFormInfoForm.value.AddressLine2,
      "Village": this.AddFormInfoForm.value.Village,
      "Mandal": this.AddFormInfoForm.value.Mandal,
      "District": this.AddFormInfoForm.value.District,
      "State": this.AddFormInfoForm.value.State,
      "PinCode": this.AddFormInfoForm.value.PinCode,
      "Area": this.AddFormInfoForm.value.Area,
      "BreedTypeId": this.AddFormInfoForm.value.Breed,
      "MobileNumber": this.AddFormInfoForm.value.MobileNumber,
      "IsActive": this.AddFormInfoForm.value.IsActive,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),

    }
    this._dataService.Post('CompanyInfo/AddUpdateFarmInfo/', req)
      .subscribe((Data) => {
        this.clicked = false;
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isAddFormDetails = false;
          this.mainGrid = true;
          this.getData();
         
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      })
  }

  //Cancle Add Form 
  onCancleFormAdding() {
    this.isAddFormDetails = false;
    this.mainBtns = true;
    this.isEditFormDetails = false;
    this.mainGrid = true;
  }
//UpdatedForm
  onUpdateForm(){
    var req = {
      "Id": this.rowData.Id,
      "CompanyId": this.rowData.CompanyId,
      "Name": this.rowData.FarmName,
      "AddressLine1": this.rowData.AddressLine1,
      "AddressLine2": this.rowData.AddressLine2,
      "Village": this.rowData.Village,
      "Mandal": this.rowData.Mandal,
      "District": this.rowData.District,
      "State": this.rowData.State,
      "PinCode": this.rowData.Pincode,
      "Area": this.rowData.Area,
      "BreedTypeId": this.rowData.BreedTypeId,
      "MobileNumber": this.rowData.MobileNumber,
      "IsActive": this.EditFormInfoForm.value.IsActive,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate":this.rowData.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),

    }
    this.spinner.show();
    this._dataService.Post('CompanyInfo/AddUpdateFarmInfo/', req)
      .subscribe((Data) => {
        this.clicked = false;
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.getData();
          this.isEditFormDetails = false;
          this.mainGrid = true;
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      })
  }


//Delete BrokerInfo
onDeleteClick(row,index){
  var req={
    "Id":row.Id,
    "UpdatedByUserId":this.userData.Id,
    "UpdatedDate":new Date()
  }
  this.spinner.show();
  this._dataService.Post('CompanyInfo/DeleteFarm/', req)
  .subscribe((Data) => {
    this.spinner.hide();
    if (Data.IsSuccess) {
      this.toastr.success(Data.EndUserMessage);
      this.getData();
    }
    else {
      this.toastr.error(Data.EndUserMessage);
    }
  })
}
//  // download xl
//  download()
//  {
//    var csvData = this.ConvertToCSV(this.FormInfoData);
//    var a = document.createElement("a");
//    a.setAttribute('style', 'display:none;');
//    document.body.appendChild(a);
//    var blob = new Blob([csvData], { type: 'text/csv' });
//    var url = window.URL.createObjectURL(blob);
//    a.href = url;
//    a.download = 'Farm Details.csv';/* your file name*/
//    a.click();
//    return 'success';
//  }
// ConvertToCSV(objArray)
// {
//   var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//   var str = '';
//   var row = "";
//   for (var index in objArray[0])
//   {
//     //Now convert each value to string and comma-separated
//     row += index + ',';
//   }
//   row = row.slice(0, -1);
//   //append Label row with line break
//   str += row + '\r\n';
//   for (var i = 0; i < array.length; i++)
//    {
//     var line = '';
//     for (var index in array[i])
//     {
//       if (line != '') line += ','
//       line += array[i][index];
//     }
//     str += line + '\r\n';
//   }
//   return str;
//  }



 
  //ExportToExcel
  download = function () {
    this.isDataLoading=true;
    this._dataService.Post('CompanyInfo/ExportFarmInfo/', this.FormInfoData).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "FarmInfo.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.isDataLoading=false;
      }
      else {
        this.toastr.error(result.StatusMessage);
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
  this.table.reset();
  this.isFiltersEnabled = !this.isFiltersEnabled;
  if (this.isFiltersEnabled)
    this.filterTooltip = "Disable Filters";
  else {
    this.filterTooltip = "Enable Filters";
  }
};
}
