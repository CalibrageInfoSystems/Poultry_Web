import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { DataService } from '../shared/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  userData: any;
  constructor(private _dataService: DataService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      userName: [''],
      Oldpassword: ['', [Validators.required, Validators.minLength(6)]],
      Newpassword: ['', [Validators.required, Validators.minLength(6)]],
      Conformpassword: ['', [Validators.required, Validators.minLength(6)]]

    });

  }

  // change password
  ChangePassword() {
    var req = {
      "UserId": this.userData.Id,
      "OldPassword": this.changePasswordForm.value.Oldpassword,
      "NewPassword": this.changePasswordForm.value.Newpassword,
      "ConformPassword": this.changePasswordForm.value.Conformpassword
      // isLoad:true

    }

    this._dataService.Post('Login/ChangePassword', req).subscribe((response) => {
      if (response.IsSuccess == 1) {
        this.toastr.success(response.Message);
        this.router.navigate(['/dashboard']);
        //this.userData = response.UserData;
      }
      else {
        this.toastr.error("An error has occured"); 
      }
    },
    (error)=>{
      this.toastr.error("An error has occured");
    });
  }

}
