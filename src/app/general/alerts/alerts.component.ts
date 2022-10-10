import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  ActivityRights: any;
  Alerts: any;
  userData: any;
  constructor(private router: Router, private _dataService: DataService, private toastr: ToastrService, ) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
  }

  ngOnInit() {
    this.GetLatest();
    // this.AlertInfo(row);
  }
  // this.GetLatest();
  //Tbale Binding Left 
  GetLatest() {
    // if (this.Alerts.length == 0 ||this.Alerts==undefined)
    var req =
    {
      "UserId": this.userData.Id,
      "Id": null
    }
    this._dataService.Post('Alert/GetAlertByUser', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.Alerts = Data.ListResult;
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }

  // rightside data binding
  AlertInfo = function (row) {
    this.gridReq = [{
      "AlertType": row.Name,
      "HTMLDesc": row.HTMLDesc,
      "AlertCreatedBy": row.AlertRaisedBy,
      "AlertDate": row.CreatedDate,
      "Desc": row.Desc
    }]
    if (row.IsRead == false) {
      var req = {
        "Id": row.AlertId,
        "IsRead": true,
        "UpdatedByUserId": row.UpdatedByUserId,
        "UpdatedDate": new Date()
      }
      this._dataService.Post('Alert/UpdateAlert', req)
        .subscribe((Data) => {
          if (Data.IsSuccess) {
            this.UpdatedAlert = Data.ListResult;
            this.GetLatest();
          }
          else {
            this.toastr.error("An error has occured");
          }
        },
          (error) => {
            this.toastr.error("An error has occured");
          });
    }
  }
}
