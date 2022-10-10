import { Component, OnInit } from '@angular/core';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { DataFactory } from '../../shared/dataFactory';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-inword-register',
  templateUrl: './inword-register.component.html',
  styleUrls: ['./inword-register.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class InwordRegisterComponent implements OnInit {
  FROMDATE: Date;
  selectedDate: Date;
  date = new Date();
  ActivityRights: any;
  userData: any;
  MaterialData: any;
  Id: string;
  isEditable: boolean;
  InOutRegisterData: any;
  rowData: any;
  itemsList: any[];
  isShowItemNameAdd: boolean;
  inOrOutRegisterList: any[];
  isAddingInwordRegister: boolean = false;
  isEditingInwordRegister = {};
  isShowItemNameEdit: boolean = false;
  date7: Date;
  AddInOutRegForm: FormGroup;
  LookUp = DataFactory.LookUp;
  LookUpTypeId = this.LookUp.MaterialType;
  selectedFarm: any;

  constructor(public dialog: MatDialog, private _dataService: DataService, private toastr: ToastrService, private fb: FormBuilder) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.AddInOutRegForm = fb.group({
      Name: ['', Validators.required],
      MaterialName: ['', Validators.required],
      Location: ['', Validators.required],
      InDate: ['', Validators.required],
      VehicleNumber: ['', Validators.required],
      OutDate: [''],
      UnitsCount: ['', Validators.required],
      OtherMaterial: [''],
    });
  }

  ngOnInit() {
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 7);
    this.getMaterial();
    this.onSearch();

  }
  //material DropDown
  getMaterial() {
    this._dataService.GetAll('FarmActivity/GetLookUpData' + '/' + this.Id + '/' + this.LookUpTypeId)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.MaterialData = Data.ListResult;
          this.isEditable = false;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  //On Search and Get all InoutREgistration Details
  onSearch() {
    var req = {
      "Id": null,
      "FromDate": this.FROMDATE,//=new Date(),//'2019-04-06 15:16:12.400',
      "ToDate": this.date,//=new Date() //'2019-04-06 15:16:12.400' 
      "FarmId": this.selectedFarm.FarmId
    }
    this._dataService.Post('FarmActivity/GetInOutRegisters/', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.InOutRegisterData = Data.ListResult;
          this.isEditable = false;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  };

  //Clear 
  onClearSearch() {
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 7);
    this.date = new Date();
    this.onSearch();
  }

  //AddInOutRegister Details
  onInwordRegAdd() {
    var req =
    {
      "Id": null,
      "MaterialId": this.AddInOutRegForm.value.MaterialName,
      "Name": this.AddInOutRegForm.value.Name,
      "Location": this.AddInOutRegForm.value.Location,
      "InDate": this.AddInOutRegForm.value.InDate,
      "VehicleNumber": this.AddInOutRegForm.value.VehicleNumber,
      "OutDate": this.AddInOutRegForm.value.OutDate,
      "OtherMaterial": this.AddInOutRegForm.value.OtherMaterial,
      "UnitsCount": this.AddInOutRegForm.value.UnitsCount,
      "IsActive": true,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FarmId": this.selectedFarm.FarmId
    }
    this._dataService.Post('FarmActivity/AddUpdateInOutRegister/', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isAddingInwordRegister = false;
          this.onSearch();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  //Edit 
  onEditInwordRegClick(row, rowIndex) {
    this.isEditingInwordRegister = {};
    this.isEditingInwordRegister[rowIndex] = true;
    this.rowData = row;
  }

  //Update InOutRegister Details
  onUpdateRow(row) {
    var req =
    {
      "Id": this.rowData.Id,
      "MaterialId": this.rowData.MaterialId,
      "Name": this.rowData.Name,
      "Location": this.rowData.Location,
      "InDate": this.rowData.InDate,
      "VehicleNumber": this.rowData.VehicleNumber,
      "OutDate": this.rowData.OutDate,
      "OtherMaterial": this.rowData.OtherMaterial,
      "UnitsCount": this.rowData.UnitsCount,
      "IsActive": true,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate": this.rowData.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FarmId": this.selectedFarm.FarmId
    }
    this._dataService.Post('FarmActivity/AddUpdateInOutRegister/', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isEditingInwordRegister = false;
          this.onSearch();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  onAddinwordRegClick() {
    this.isAddingInwordRegister = true;
  }

  onCancleInwordRegAdd() {
    this.isAddingInwordRegister = false;
    this.isShowItemNameAdd = false;
    this.AddInOutRegForm.reset();
    this.selectedDate = new Date();

  }
  // Onselect Material Change  event  
  onItemNameChangeEvent(item) {
    var filterData = this.MaterialData.filter(x => x.Id == item.value)
    if (filterData[0].NAME == "Other") {
      this.isShowItemNameAdd = true;
      this.AddInOutRegForm.addControl('OtherMaterial', new FormControl("", Validators.required));
      this.AddInOutRegForm.get('OtherMaterial').clearValidators();
      this.AddInOutRegForm.get('OtherMaterial').updateValueAndValidity({ emitEvent: false, onlySelf: true });
      this.AddInOutRegForm.get('OtherMaterial').setValidators([Validators.required]);
      this.AddInOutRegForm.get('OtherMaterial').updateValueAndValidity({ emitEvent: false, onlySelf: true });
    } else {
      this.isShowItemNameAdd = false;
      this.AddInOutRegForm.removeControl('OtherMaterial');
      this.AddInOutRegForm.get('OtherMaterial').clearValidators();
      this.AddInOutRegForm.get('OtherMaterial').updateValueAndValidity({ emitEvent: false, onlySelf: true });
      this.AddInOutRegForm.addControl('OtherMaterial', new FormControl(""));
      this.AddInOutRegForm.get('OtherMaterial').updateValueAndValidity({ emitEvent: false, onlySelf: true });
    }
  }



  onItemNameChangeEdit(row) {
    if (row.ItemName == "Other") {
      this.isShowItemNameEdit = true;
    } else {
      this.isShowItemNameEdit = false;
    }
  }

  onCancleInwordRegEdit() {
    this.isEditingInwordRegister = false;
    this.isShowItemNameEdit = false;
  }

  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    var registerExport = {
      FromDate: this.FROMDATE,
      ToDate: this.date,
      FarmName:this.selectedFarm.FarmName,
      InOutRegisterData: this.InOutRegisterData,
    }
    this._dataService.Post('FarmActivity/ExportInOutReg/', registerExport).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "In/Out Register.xlsx";
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

  onDateChange(item) {
    this.FROMDATE = item.value;
  }
}
