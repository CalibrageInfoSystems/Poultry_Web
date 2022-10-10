import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

import Swal from 'sweetalert2'
import { DataService } from '../shared/data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string;
  password: string;
  issuccess: boolean = false;
  isLogin: boolean = true;
  errorMessage = null;
  logo: string;
  loginForm: FormGroup;
  activityRights: object = {};
  userActivityRights;
  userData: any;

  constructor(private _dataService: DataService, private formBuilder: FormBuilder, private router: Router) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
  }
  ngOnInit() {
    if(this.userData!=null){
      this.router.navigate(['/dashboard']);
    }
    this.logo = 'src/app/assets/images/logo1.jpg';
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  
  // login 
  login() { 
    var responceData = {
      "UserName": this.loginForm.value.userName,
      "Password": this.loginForm.value.password,
      isLoad: true
    }
    this._dataService.Post('Login/UserLogin', responceData)
      .subscribe((Data) => {
        if (Data.IsSuccess == 1) {
          localStorage.setItem('UserInfo', JSON.stringify(Data.Result.UserDetails[0]));
          localStorage.setItem('FarmsInfo', JSON.stringify(Data.Result.UserFarms));
          localStorage.setItem('SelectedFarm', JSON.stringify(Data.Result.UserFarms[0]));
          this.initActivityRights(Data.Result.UserDetails[0].ActivityRights);
          this.issuccess = true;
          this.isLogin = false;
          // window.location.href = '/dashboard';
          this.router.navigate(['/dashboard']);
          window.location.reload();
        }
        else {
          Swal.fire({
            title: "Oops",
            type: "error",
            html: "<h4>Invalid Username or Password<h4>",
            width: "'auto'"
          })
        }
      })
  }

  
  //All Activity Rights
  initActivityRights(res) {
    var userActivityRights = res.split(",")
    this.activityRights = {
      CanViewMasters: 1,
      CanManageMasters: 2,
      CanViewVisitLogs: 3,
      CanManageVisitLogs: 4,
      CanViewEggProductionLogs: 5,
      CanManageEggProductionLogs: 6,
      CanViewEggSaleRegister: 7,
      CanManageEggSaleRegister: 8,
      CanViewBatchDetails: 9,
      CanManageBatchDetails: 10,
      CanViewShedDetails: 11,
      CanManageShedDetails: 12,
      CanViewFeedPurchase: 13,
      CanManageFeedPurchase: 14,
      CanViewFeedGrinding: 15,
      CanManageFeedGrinding: 16,
      CanViewVaccinationDetails: 17,
      CanManageVaccinationDetails: 18,
      CanViewInorOutRegistration: 19,
      CanManageInorOutRegistration: 20,
      CanViewChickShedTransitions: 21,
      CanManageChickShedTransitions: 22,
      CanViewGrowerShedTransitions: 23,
      CanManageGrowerShedTransitions: 24,
      CanViewLayerShedTransitions: 25,
      CanManageLayerShedTransitions: 26,
      CanViewCullingBirds: 27,
      CanManageCullingBirds: 28,
      CanViewComanyInfo: 29,
      CanManageComanyInfo: 30,
      CanViewFarmsInfo: 31,
      CanManageFarmsInfo: 32,
      CanViewUserInfo: 33,
      CanManageUserInfo: 34,
      CanViewRoleInfo: 35,
      CanManageRoleInfo: 36,
      CanViewVaccination: 37,
      CanManageVaccination: 38,
      CanViewTemparature: 39,
      CanManageTemparature: 40,
      CanViewReports:41,
      CanViewIncomeExpenses:42,
      CanManageIncomeExpenses:43,
      CanManageReports :44,
      CanViewDialyProductionReports :45,
      CanViewFeedPurchaseReports :46,
      CanViewEggSaleReports :47,
      CanViewEggStockReports :48,
      CanViewCullBirdsReports :49,
      CanViewMonthlyBalanceReports :50,
      CanViewFeed :51,
      CanManageFeed :52,
      CanViewFeedBrokers :53,
      CanManageFeedBrokers :54,
      CanViewMaterials :55,
      CanManageMaterials :56,
      CanViewEggTraders :57,
      CanManageEggTraders :58,
      CanViewHatchery :59,
      CanManageHatchery :60

    };

    this.userActivityRights = {
      CanViewMasters: userActivityRights.indexOf(this.activityRights["CanViewMasters"] + "") >= 0 ? true : false,
      CanManageMasters: userActivityRights.indexOf(this.activityRights["CanManageMasters"] + "") >= 0 ? true : false,
      CanViewVisitLogs: userActivityRights.indexOf(this.activityRights["CanViewVisitLogs"] + "") >= 0 ? true : false,
      CanManageVisitLogs: userActivityRights.indexOf(this.activityRights["CanManageVisitLogs"] + "") >= 0 ? true : false,
      CanViewEggProductionLogs: userActivityRights.indexOf(this.activityRights["CanViewEggProductionLogs"] + "") >= 0 ? true : false,
      CanManageEggProductionLogs: userActivityRights.indexOf(this.activityRights["CanManageEggProductionLogs"] + "") >= 0 ? true : false,
      CanViewEggSaleRegister: userActivityRights.indexOf(this.activityRights["CanViewEggSaleRegister"] + "") >= 0 ? true : false,
      CanManageEggSaleRegister: userActivityRights.indexOf(this.activityRights["CanManageEggSaleRegister"] + "") >= 0 ? true : false,
      CanViewBatchDetails: userActivityRights.indexOf(this.activityRights["CanViewBatchDetails"] + "") >= 0 ? true : false,
      CanManageBatchDetails: userActivityRights.indexOf(this.activityRights["CanManageBatchDetails"] + "") >= 0 ? true : false,
      CanViewShedDetails: userActivityRights.indexOf(this.activityRights["CanViewShedDetails"] + "") >= 0 ? true : false,
      CanManageShedDetails: userActivityRights.indexOf(this.activityRights["CanManageShedDetails"] + "") >= 0 ? true : false,
      CanViewFeedPurchase: userActivityRights.indexOf(this.activityRights["CanViewFeedPurchase"] + "") >= 0 ? true : false,
      CanManageFeedPurchase: userActivityRights.indexOf(this.activityRights["CanManageFeedPurchase"] + "") >= 0 ? true : false,
      CanViewFeedGrinding: userActivityRights.indexOf(this.activityRights["CanViewFeedGrinding"] + "") >= 0 ? true : false,
      CanManageFeedGrinding: userActivityRights.indexOf(this.activityRights["CanManageFeedGrinding"] + "") >= 0 ? true : false,
      CanViewVaccinationDetails: userActivityRights.indexOf(this.activityRights["CanViewVaccinationDetails"] + "") >= 0 ? true : false,
      CanManageVaccinationDetails: userActivityRights.indexOf(this.activityRights["CanManageVaccinationDetails"] + "") >= 0 ? true : false,
      CanViewInorOutRegistration: userActivityRights.indexOf(this.activityRights["CanViewInorOutRegistration"] + "") >= 0 ? true : false,
      CanManageInorOutRegistration: userActivityRights.indexOf(this.activityRights["CanManageInorOutRegistration"] + "") >= 0 ? true : false,
      CanViewChickShedTransitions: userActivityRights.indexOf(this.activityRights["CanViewChickShedTransitions"] + "") >= 0 ? true : false,
      CanManageChickShedTransitions: userActivityRights.indexOf(this.activityRights["CanManageChickShedTransitions"] + "") >= 0 ? true : false,
      CanViewGrowerShedTransitions: userActivityRights.indexOf(this.activityRights["CanViewGrowerShedTransitions"] + "") >= 0 ? true : false,
      CanManageGrowerShedTransitions: userActivityRights.indexOf(this.activityRights["CanManageGrowerShedTransitions"] + "") >= 0 ? true : false,
      CanViewLayerShedTransitions: userActivityRights.indexOf(this.activityRights["CanViewLayerShedTransitions"] + "") >= 0 ? true : false,
      CanManageLayerShedTransitions: userActivityRights.indexOf(this.activityRights["CanManageLayerShedTransitions"] + "") >= 0 ? true : false,
      CanViewCullingBirds: userActivityRights.indexOf(this.activityRights["CanViewCullingBirds"] + "") >= 0 ? true : false,
      CanManageCullingBirds: userActivityRights.indexOf(this.activityRights["CanManageCullingBirds"] + "") >= 0 ? true : false,
      CanViewComanyInfo: userActivityRights.indexOf(this.activityRights["CanViewComanyInfo"] + "") >= 0 ? true : false,
      CanManageComanyInfo: userActivityRights.indexOf(this.activityRights["CanManageComanyInfo"] + "") >= 0 ? true : false,
      CanViewFarmsInfo: userActivityRights.indexOf(this.activityRights["CanViewFarmsInfo"] + "") >= 0 ? true : false,
      CanManageFarmsInfo: userActivityRights.indexOf(this.activityRights["CanManageFarmsInfo"] + "") >= 0 ? true : false,
      CanViewUserInfo: userActivityRights.indexOf(this.activityRights["CanViewUserInfo"] + "") >= 0 ? true : false,
      CanManageUserInfo: userActivityRights.indexOf(this.activityRights["CanManageUserInfo"] + "") >= 0 ? true : false,
      CanViewRoleInfo: userActivityRights.indexOf(this.activityRights["CanViewRoleInfo"] + "") >= 0 ? true : false,
      CanManageRoleInfo: userActivityRights.indexOf(this.activityRights["CanManageRoleInfo"] + "") >= 0 ? true : false,
      CanViewVaccination: userActivityRights.indexOf(this.activityRights["CanViewVaccination"] + "") >= 0 ? true : false,
      CanManageVaccination: userActivityRights.indexOf(this.activityRights["CanManageVaccination"] + "") >= 0 ? true : false,
      CanViewTemparature: userActivityRights.indexOf(this.activityRights["CanViewTemparature"] + "") >= 0 ? true : false,
      CanManageTemparature: userActivityRights.indexOf(this.activityRights["CanManageTemparature"] + "") >= 0 ? true : false,
      CanViewReports: userActivityRights.indexOf(this.activityRights["CanViewReports"] + "") >= 0 ? true : false,
      CanViewIncomeExpenses: userActivityRights.indexOf(this.activityRights["CanViewIncomeExpenses"] + "") >= 0 ? true : false,
      CanManageIncomeExpenses: userActivityRights.indexOf(this.activityRights["CanManageIncomeExpenses"] + "") >= 0 ? true : false,
      CanManageReports: userActivityRights.indexOf(this.activityRights["CanManageReports"] + "") >= 0 ? true : false,
      CanViewDialyProductionReports: userActivityRights.indexOf(this.activityRights["CanViewDialyProductionReports"] + "") >= 0 ? true : false,
      CanViewFeedPurchaseReports: userActivityRights.indexOf(this.activityRights["CanViewFeedPurchaseReports"] + "") >= 0 ? true : false,
      CanViewEggSaleReports: userActivityRights.indexOf(this.activityRights["CanViewEggSaleReports"] + "") >= 0 ? true : false,
      CanViewEggStockReports: userActivityRights.indexOf(this.activityRights["CanViewEggStockReports"] + "") >= 0 ? true : false,
      CanViewCullBirdsReports: userActivityRights.indexOf(this.activityRights["CanViewCullBirdsReports"] + "") >= 0 ? true : false,
      CanViewMonthlyBalanceReports: userActivityRights.indexOf(this.activityRights["CanViewMonthlyBalanceReports"] + "") >= 0 ? true : false,
      CanViewFeed: userActivityRights.indexOf(this.activityRights["CanViewFeed"] + "") >= 0 ? true : false,
      CanManageFeed: userActivityRights.indexOf(this.activityRights["CanManageFeed"] + "") >= 0 ? true : false,
      CanViewFeedBrokers: userActivityRights.indexOf(this.activityRights["CanViewFeedBrokers"] + "") >= 0 ? true : false,
      CanManageFeedBrokers: userActivityRights.indexOf(this.activityRights["CanManageFeedBrokers"] + "") >= 0 ? true : false,
      CanViewMaterials: userActivityRights.indexOf(this.activityRights["CanViewMaterials"] + "") >= 0 ? true : false,
      CanManageMaterials: userActivityRights.indexOf(this.activityRights["CanManageMaterials"] + "") >= 0 ? true : false ,
      CanViewEggTraders: userActivityRights.indexOf(this.activityRights["CanViewEggTraders"] + "") >= 0 ? true : false, 
      CanManageEggTraders: userActivityRights.indexOf(this.activityRights["CanManageEggTraders"] + "") >= 0 ? true : false,
      CanViewHatchery: userActivityRights.indexOf(this.activityRights["CanViewHatchery"] + "") >= 0 ? true : false ,
      CanManageHatchery: userActivityRights.indexOf(this.activityRights["CanManageHatchery"] + "") >= 0 ? true : false 
    }
    localStorage.setItem('UserActivityRights', JSON.stringify(this.userActivityRights));
  }
}

