import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatOption, MatDialog } from '@angular/material';
import Swal from 'sweetalert2';
import { DataFactory } from '../../shared/dataFactory';
import { ConfirmationService } from 'primeng/primeng';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {
  clicked :boolean = false;
  @ViewChild('ui') private table;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  rowData: any;
  isAddUserInfoDetails: boolean = false;
  isEditUserInfoDetails:boolean=false;
  addNewUserForm:FormGroup;
  editUserForm:FormGroup;
  userInfo: any[]=[];  
  userList: any[]=[];  
  shedfarmInfo:any[]=[];  
  farmsList:any[]=[];
  rolesList:any[]=[];
  shedsList: any[];
  selectedFarmIds:any[]=[];
  selectedShedIds:any[]=[];
  filteredItems:any;
  ActivityRights=[];
  userData: any;

  @ViewChild('allShedsSelected') private allShedsSelected: MatOption;
  @ViewChild('allEditShedsSelected') private allEditShedsSelected: MatOption;
  selectedFarm: any;
  selectedFarms: any;
  
  constructor(private _dataService: DataService, private router: Router,
    private fb:FormBuilder,private toastr: ToastrService, public dialog: MatDialog, private spinner:NgxSpinnerService) {
    this.userData=JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights=JSON.parse(localStorage.getItem("UserActivityRights"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.addNewUserForm=fb.group({
      firstName:['',Validators.required],
      middleName:[''],
      lastName:['',Validators.required],
      mobileNumber:[''],
      contactNumber:['',Validators.required],
      emailId:['',Validators.compose([Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
      userName:['',Validators.required],
      password:['',Validators.required],
      farmName:['',Validators.required],
      shedName:[''],
      // shedName:['',Validators.required],
      roleName:['',Validators.required],
      isActive:[true]
    })
    this.editUserForm=fb.group({
      firstName:['',Validators.required],
      middleName:[''],
      lastName:['',Validators.required],
      mobileNumber:[''],
      contactNumber:['',Validators.required],
      emailId:['',Validators.compose([Validators.pattern('^[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
      userName:['',Validators.required],
      password:['',Validators.required],
      farmIds:['',Validators.required],
      shedIds:[''],
      // shedIds:['',Validators.required],
      roleName:['',Validators.required],
      isActive:[]
    })
   }

  ngOnInit() {
    this.GetAllUsers();
    this.getFarmsList();
    this.getRolesList();
  }

  GetAllUsers(): void {
    this.spinner.show();
    this.isAddUserInfoDetails = false;
    this.isEditUserInfoDetails = false;
    this._dataService.GetAll('UserInfo/GetUserInfo'+'/'+ null +'/'+ this.selectedFarm.FarmId).subscribe((Data) => {
      this.spinner.hide();
    // this._dataService.Get('UserInfo/GetUserInfo', null).subscribe((Data) => {
        if (Data.IsSuccess) {
          this.userInfo = Data.ListResult;
          this.userList= Data.ListResult.map(x => Object.assign({}, x))
        }
        else {
          // toastr.error(Data.endUserMessage);
        }
      });
  }

  getFarmsList() {
    this.spinner.show();
    this._dataService.Get('CompanyInfo/GetFarmInfoById/', null).subscribe((response) => {
      this.spinner.hide();
      if (response.IsSuccess) {
        this.farmsList = response.ListResult;
      }
      else {
      }
    });
  }

  getRolesList() {
    this._dataService.Get('UserInfo/GetRoleById/', null).subscribe((response) => {
      if (response.IsSuccess) {
        this.rolesList = response.ListResult;
      }
      else {
      }
    });
  }

  selectAllSheds() {
    if (this.allShedsSelected.selected) {
      this.addNewUserForm.controls.shedName
        .patchValue([...this.shedsList.map(item => item.Id), 0]);
    } else {
      this.addNewUserForm.controls.shedName.patchValue([]);
    }
  }

  selectShed(all) {
    if (this.allShedsSelected.selected) {
      this.allShedsSelected.deselect();
      return false;
    }
    if (this.addNewUserForm.controls.shedName.value.length == this.shedsList.length)
      this.allShedsSelected.select();
  }

  onselectFarm(){
    this.selectedFarms=this.addNewUserForm.value.farmName.join(',');
    this.getShedDetails(this.selectedFarms);
  }

  onEditSelectFarm(){
    var selectedEditFarms=this.editUserForm.value.farmIds.join(',');
    this.getShedDetails(selectedEditFarms);
  }

  selectEditShed(){
    if (this.allEditShedsSelected.selected) {
      this.allEditShedsSelected.deselect();
      return false;
    }
    if (this.editUserForm.controls.shedIds.value.length == this.shedsList.length)
      this.editUserForm.controls.shedIds
        .patchValue([...this.shedsList.map(item => item.Id), 0]);
      // this.allEditShedsSelected.select();
  }

  selectAllEditSheds(){
    if (this.allEditShedsSelected.selected) {
      this.editUserForm.controls.shedIds
        .patchValue([...this.shedsList.map(item => item.Id), 0]);
    } else {
      this.editUserForm.controls.shedIds.patchValue([]);
    }
  }
 
  getShedDetails(selectedFarms){
    var req={
        "FarmIds": selectedFarms
    }
    this._dataService.Post('CompanyInfo/GetShedInfoByFarmIds', req).subscribe((response) => {
      if (response.IsSuccess) {
        this.shedsList = response.ListResult;
        if(this.isEditUserInfoDetails){
          if(this.selectedShedIds.length == this.shedsList.length){
            this.selectedShedIds.push(0);
          }
        }
      }
      else {
      }
    });
  }


   // Open Edit User Info Form
   onEditUserInfoClick(row)
   {
    this.rowData=row;     
    this.getShedDetails(this.rowData.FarmIds);
     this.selectedFarmIds=[];
     this.selectedFarmIds = this.rowData.FarmIds.split(','); 
     this.selectedFarmIds = this.selectedFarmIds.map(Number);
     if(this.rowData.ShedIds!=null||this.rowData.ShedIds!=undefined){
      this.selectedShedIds=this.rowData.ShedIds.split(','); 
      this.selectedShedIds = this.selectedShedIds.map(Number);
     }     
     this.isEditUserInfoDetails = true;
   }

  // Open Add User Info Form
  onAddUserInfoClick()
  {
    this.isAddUserInfoDetails = true;
  }

  onCancleUserInfoEdit(){
    this.isEditUserInfoDetails = false;
    this.userInfo= this.userList.map(x => Object.assign({}, x));  
    const { editUserForm: { value: formValueSnap } } = this;
    this.editUserForm.reset(formValueSnap);  
  }

  onsaveUserInfo(){
    if (this.addNewUserForm.controls.shedName.value.length >= this.shedsList.length){
      const valueToRemove = this.addNewUserForm.value.shedName.length
      this.filteredItems = this.addNewUserForm.value.shedName.slice(0,valueToRemove-1)
    }
    else{
      this.filteredItems=this.addNewUserForm.value.shedName;
    }
    this.spinner.show();
    var req={
      "Id": 0,
      "FirstName": this.addNewUserForm.value.firstName,
      "Lastname": this.addNewUserForm.value.lastName,
      "MiddleName": this.addNewUserForm.value.middleName,
      "ContactNumber": this.addNewUserForm.value.contactNumber,
      "MobileNumber": this.addNewUserForm.value.mobileNumber,
      "UserName": this.addNewUserForm.value.userName,
      "Password": this.addNewUserForm.value.password,
      "RoleId": this.addNewUserForm.value.roleName,
      "Email": this.addNewUserForm.value.emailId,
      "IsActive": this.addNewUserForm.value.isActive,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "ShedIds": this.filteredItems==''?'':this.filteredItems.join(','),
      "FarmIds":this.selectedFarms
    }
    this._dataService.Post('UserInfo/AddUpdateUserInfo', req).subscribe((response) => {
      this.spinner.hide();
      this.clicked = false;
      if (response.IsSuccess) {
        this.isAddUserInfoDetails=false;
        this.addNewUserForm.reset();
        this.toastr.success(response.EndUserMessage);
        this.GetAllUsers();
      }
      else {
        this.toastr.error(response.EndUserMessage);        
      }
    }, 
    (error) => {               
      this.toastr.error(error.error);
    });
  }

  onUpdateUser(){
    if (this.editUserForm.controls.shedIds.value.length >= this.shedsList.length){
      const valueToRemove = this.editUserForm.value.shedIds.length
      this.filteredItems = this.editUserForm.value.shedIds.slice(0,valueToRemove-1)
    }
    else{
      this.filteredItems=this.editUserForm.value.shedIds;
    }
    this.selectedFarms=this.editUserForm.value.farmIds.join(',');
    this.spinner.show();
    var req={
      "Id": this.rowData.Id,
      "FirstName": this.rowData.FirstName,
      "Lastname": this.rowData.LastName,
      "MiddleName": this.rowData.MiddleName,
      "ContactNumber": this.rowData.ContactNumber,
      "MobileNumber": this.rowData.MobileNumber,
      "UserName": this.rowData.UserName,
      "Password": this.rowData.Password,
      "RoleId": this.rowData.RoleId,
      "Email": this.rowData.Email,
      "IsActive": this.rowData.IsActive,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate":this.rowData.CreatedDate,
      "UpdatedByUserId":  this.userData.Id,
      "UpdatedDate": new Date(),
      "ShedIds": this.filteredItems==''?'':this.filteredItems.join(','),//this.filteredItems.join(','),//this.addNewUserForm.value.shedName + ","
      "FarmIds":this.selectedFarms
    }
    this._dataService.Post('UserInfo/AddUpdateUserInfo', req).subscribe((response) => {
      this.spinner.hide();
      this.clicked = false;
      if (response.IsSuccess) {
        this.isEditUserInfoDetails=false;
        const { editUserForm: { value: formValueSnap } } = this;
        this.editUserForm.reset(formValueSnap);  
        this.toastr.success(response.EndUserMessage);
        this.GetAllUsers();
      }
      else {
        this.toastr.error(response.EndUserMessage);        
      }
    }, 
    (error) => {               
      this.toastr.error(error.error);
    });
  }

  // Cancle Add User Info
  onCancleUserInfoAdding()
  {
    this.isAddUserInfoDetails = false;
    const { addNewUserForm: { value: formValueSnap } } = this;
    this.addNewUserForm.reset(formValueSnap);
    this.addNewUserForm.reset();
  }

  GetShedsFarmsByUser(row): void {
    this.isEditUserInfoDetails = false;
    this._dataService.GetAll('CompanyInfo/GetUserSheds'+'/'+row.Id +'/'+ this.selectedFarm.FarmId).subscribe((Data) => {
          if (Data.IsSuccess) {
            this.shedfarmInfo = Data.ListResult;
          }
          else {
             this.toastr.error(Data.endUserMessage);
          }
        });
    }

//ExportToExcel
download = function () {  
  this.isDataLoading=true;
  this._dataService.Post('UserInfo/ExportUserInfo', this.userInfo).subscribe((result) => {
    if (result != null && result != undefined && result != '') {
      var data = result;
      var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = "Users.xlsx";
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

onDeleteUserClick(row)
{ 
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
      this._dataService.Post('UserInfo/DeleteUserInfo', req)
        .subscribe((Data) => {
          this.spinner.hide();          
          if (Data.IsSuccess) {
            this.GetAllUsers();
            this.toastr.success(Data.EndUserMessage);
          }
          else {
            this.toastr.error(Data.EndUserMessage);
          }
        })
    }
  });
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
