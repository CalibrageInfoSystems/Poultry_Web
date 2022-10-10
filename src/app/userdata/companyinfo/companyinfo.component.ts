import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-companyinfo',
  templateUrl: './companyinfo.component.html',
  styleUrls: ['./companyinfo.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class CompanyinfoComponent implements OnInit {
  isEditCompanyInfoDetails: boolean = false;
  // mainGrid: boolean = true;
  isEnable: boolean = false;

  companyInfo: any;
  curDate: any;
  editCompanyDetails: FormGroup;
  userData: any;
  existingInfo: any[]=[];
  ActivityRights: any;
  constructor(private _dataService: DataService, private router: Router,private toastr: ToastrService, private _fb: FormBuilder,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.editCompanyDetails = _fb.group({
      Name: ['', Validators.required],
      DisplayName: ['', Validators.required],
      RegistrationNumber: [''],
      OwnerName: ['', Validators.required],
      AddressLine1: ['', Validators.required],
      AddressLine2: [''],
      Village: ['', Validators.required],
      Mandal: ['', Validators.required],
      District: ['', Validators.required],
      State: ['', Validators.required],
      Pincode: ['', Validators.required],
      MobileNumber: ['', Validators.required],
      Email: ['', Validators.required],
      YearOfEstablishment: ['', Validators.required],
      IsActive:['']
    })
   }

  ngOnInit() {
    this.GetCompany();
    this.curDate = new Date();
    this.editCompanyDetails.disable();
  }

  GetCompany(): void {
    var Id:null
    this.spinner.show();
      this._dataService.Get('CompanyInfo/GetCompanyInfo/', Id)
        .subscribe((Data) => {
          this.spinner.hide();
          if (Data.IsSuccess) {
            this.companyInfo = Data.ListResult[0];
            // this.existingInfo= Data.ListResult[0].map(x => Object.assign({}, x)); 
          }
          else {
             this.toastr.error(Data.EndUserMessage);  
          }
        });
    }

  // Edit Company Info Details
  onEditCompanyInfoClick() {
    this.isEditCompanyInfoDetails = true;
    this.isEnable = true;
    this.editCompanyDetails.enable();
  }

  // Cancle Company Info Details
  onCancleCompanyInfoAdding() {
    this.isEditCompanyInfoDetails = false;
    this.isEnable = false;
    this.GetCompany();
    // this.companyInfo= this.existingInfo.map(x => Object.assign({}, x));     
    this.editCompanyDetails.disable();
    const { editCompanyDetails: { value: formValueSnap } } = this;
    this.editCompanyDetails.reset(formValueSnap);
  }

  //on Update Click
  onUpdate() {
    var req = {
      "Id": this.companyInfo.Id,
      "Name": this.editCompanyDetails.value.Name,
      "DisplayName": this.editCompanyDetails.value.DisplayName,
      "RegistrationNumber": this.editCompanyDetails.value.RegistrationNumber,
      "AddressLine1":this.editCompanyDetails.value.AddressLine1,
      "AddressLine2":this.editCompanyDetails.value.AddressLine2,
      "Village":this.editCompanyDetails.value.Village,
      "Mandal":this.editCompanyDetails.value.Mandal,
      "District":this.editCompanyDetails.value.District,
      "State":this.editCompanyDetails.value.State,
      "Pincode":this.editCompanyDetails.value.Pincode,
      "MobileNumber":this.editCompanyDetails.value.MobileNumber,
      "IsActive":this.editCompanyDetails.value.IsActive,
      "CreatedByUserId":this.companyInfo.CreatedByUserId,
      "CreatedDate": this.companyInfo.CreatedDate,      
      "UpdatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "OwnerName":this.editCompanyDetails.value.OwnerName,
      "YearOfEstablishment":this.editCompanyDetails.value.YearOfEstablishment,
      "Email":this.editCompanyDetails.value.Email
    }
    this.spinner.show();
    this._dataService.Post('CompanyInfo/AddUpdateCompanyInfo/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {         
          this.toastr.success(Data.EndUserMessage);
          this.onCancleCompanyInfoAdding();
          this.GetCompany();
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      },
        (error) => {
          this.toastr.error(error.error);
        });
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
