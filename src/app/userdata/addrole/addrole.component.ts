import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatOption } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DataFactory } from '../../shared/dataFactory';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrls: ['./addrole.component.css']
})
export class AddroleComponent implements OnInit {
  clicked:boolean = false;
  @ViewChild('ro') private table;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  rowData: any;
  addRoleForm: FormGroup;
  editRoleForm:FormGroup;
  isAddRoleDetails: boolean = false;
  isEditRoleDetails: boolean = false;
  roleInfo: any[] = [];
  selectedRightIds: any[] = [];
  filteredItems:any;
  roleList:any[]=[];
  roleActivityRights:any[]=[];
  activityRightsList: any[] = [];
  ActivityRights=[];
  userData: any;
  
  @ViewChild('allRightsSelected') private allRightsSelected: MatOption;
  @ViewChild('allEditRightsSelected') private allEditRightsSelected: MatOption;
  
  constructor(private _dataService: DataService, private router: Router, private fb: FormBuilder,
    private toastr: ToastrService,private spinner:NgxSpinnerService) {
    this.userData=JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights=JSON.parse(localStorage.getItem("UserActivityRights"));
    this.addRoleForm = fb.group({
      code: [null, Validators.required],
      roleName: [null, Validators.required],
      activityRights: [null, Validators.required],
      isActive: [true],
      description: [null, Validators.required]
    })
    this.editRoleForm=fb.group({
      code: [null, Validators.required],
      roleName: [null, Validators.required],
      activityRights: [null, Validators.required],
      isActive: [''],
      description: [null, Validators.required]
    })
  }

  ngOnInit() {
    this.GetAllRoles();
    this.GetActivityRights();
  }


  GetAllRoles(): void {
    this.spinner.show();
    this._dataService.Get('UserInfo/GetRoleById', null)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.roleInfo = Data.ListResult;
          this.roleList= Data.ListResult.map(x => Object.assign({}, x))
        }
        else {
          // toastr.error(Data.endUserMessage);

        }
      });
  }

  GetActivityRights(): void {
    this._dataService.GetAll('UserInfo/GetActivityRights')
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.activityRightsList = Data.ListResult;
        }
      });
  }

  selectAllRights() {
    if (this.allRightsSelected.selected) {
      this.addRoleForm.controls.activityRights
        .patchValue([...this.activityRightsList.map(item => item.Id), 0]);
    } else {
      this.addRoleForm.controls.activityRights.patchValue([]);
    }
  }

  selectRihts(all) {
    if (this.allRightsSelected.selected) {
      this.allRightsSelected.deselect();
      return false;
    }
    if (this.addRoleForm.controls.activityRights.value.length == this.activityRightsList.length)
      this.allRightsSelected.select();
  }


  selectEditAllRights() {
    if (this.allEditRightsSelected.selected) {
      this.editRoleForm.controls.activityRights
        .patchValue([...this.activityRightsList.map(item => item.Id), 0]);
    } else {
      this.editRoleForm.controls.activityRights.patchValue([]);
    }
  }

  selectEditRights(all) {
    if (this.allEditRightsSelected.selected) {
      this.allEditRightsSelected.deselect();
      return false;
    }
    if (this.editRoleForm.controls.activityRights.value.length == this.activityRightsList.length)
      this.editRoleForm.controls.activityRights
        .patchValue([...this.activityRightsList.map(item => item.Id), 0]);
      // this.allEditRightsSelected.select();
  }

  onSaveRoleClick(){
    if (this.addRoleForm.controls.activityRights.value.length >= this.activityRightsList.length){
      const valueToRemove = this.addRoleForm.value.activityRights.length
      this.filteredItems = this.addRoleForm.value.activityRights.slice(0,valueToRemove-1)
    }
    else{
      this.filteredItems=this.addRoleForm.value.activityRights;
    }
    this.spinner.show();
    var req={
      "ActivityRightIds": this.filteredItems.join(','),
      "Id": 0,
      "Code": this.addRoleForm.value.code,
      "NAME": this.addRoleForm.value.roleName,
      "Desc": this.addRoleForm.value.description,
      "ParentRoleId": null,
      "IsActive": this.addRoleForm.value.isActive,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('UserInfo/AddUpdateRole', req).subscribe((response) => {
      this.clicked = false;
      this.spinner.hide();
      if (response.IsSuccess) {
        this.isAddRoleDetails=false;
        this.addRoleForm.reset();
        this.toastr.success(response.EndUserMessage);
        this.GetAllRoles();
      }
      else {
        this.toastr.error(response.EndUserMessage);        
      }
    }, 
    (error) => {    
      this.toastr.error(error.error);              
    });
  }

  onUpdateRoleClick(){
    if (this.editRoleForm.controls.activityRights.value.length >= this.activityRightsList.length){
      const valueToRemove = this.editRoleForm.value.activityRights.length
      this.filteredItems = this.editRoleForm.value.activityRights.slice(0,valueToRemove-1)
    }
    else{
      this.filteredItems=this.editRoleForm.value.activityRights;
    }
    this.spinner.show();
    var req={
      "ActivityRightIds": this.filteredItems.join(','),
      "Id": this.rowData.Id,
      "Code": this.rowData.Code,
      "NAME": this.rowData.RoleName,
      "Desc": this.rowData.Desc,
      "ParentRoleId": null,
      "IsActive": this.rowData.IsActive,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate":this.rowData.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('UserInfo/AddUpdateRole', req).subscribe((response) => {
      this.clicked = false;
      this.spinner.hide();
      if (response.IsSuccess) {
        this.isEditRoleDetails=false;
                this.toastr.success(response.EndUserMessage);
        this.GetAllRoles();
        const { editRoleForm: { value: formValueSnap } } = this;
        this.editRoleForm.reset(formValueSnap);  
      }
      else {
        this.toastr.error(response.EndUserMessage);        
      }
    }, 
    (error) => {    
      this.toastr.error(error.error);              
    });
  }

  // Edit New Role
  onEditRoleClick(row) {
    this.selectedRightIds=[];
    this.isEditRoleDetails = true;
    this.rowData=row;
    this.selectedRightIds = this.rowData.ActivityRights.split(','); 
    this.selectedRightIds = this.selectedRightIds.map(Number);
    if(this.selectedRightIds.length == this.activityRightsList.length){
      this.selectedRightIds.push(0);
    }
  }

  // Add New Role
  onAddRoleClick() {
    this.isAddRoleDetails = true;
  }

  // Cancle Add Role
  onCancleRoleAdding() {
    this.isAddRoleDetails = false;
    const { addRoleForm: { value: formValueSnap } } = this;
    this.addRoleForm.reset(formValueSnap);
  }

  onCancleRoleEdit(){
    this.isEditRoleDetails = false;    
    this.roleInfo= this.roleList.map(x => Object.assign({}, x));
    const { editRoleForm: { value: formValueSnap } } = this;
    this.editRoleForm.reset(formValueSnap);  
  }

  GetActivityRightsByRoleId(row): void {
      this._dataService.Get('UserInfo/GetActivityRightsByRoleId', row.Id).subscribe((Data) => {
          if (Data.IsSuccess) {
            this.roleActivityRights = Data.ListResult;
          }
          else {
            // toastr.error(Data.endUserMessage);
  
          }
        });
    }

  //ExportToExcel
  download = function () {
    this.isDataLoading=true;
    this._dataService.Post('UserInfo/ExportRole', this.roleInfo).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Roles.xlsx";
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
