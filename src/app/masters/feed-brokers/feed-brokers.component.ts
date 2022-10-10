import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import  { SelectItem, Message, DataTable } from 'primeng/primeng'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-feed-brokers',
  templateUrl: './feed-brokers.component.html',
  styleUrls: ['./feed-brokers.component.css']
})
export class FeedBrokersComponent implements OnInit {
  clicked : boolean = false;
  isFiltersEnabled :boolean= false;
  @ViewChild(('fb')) fd: DataTable;
  filterTooltip = "Enable Filters";
  isEditable: boolean;
  BrokerData: any= [];
  Id: string;
  BrokerId: string;
  // data: any = [];
  delRow: any;
  isEdit:boolean=false;
  IsAdd:boolean=false;
  ActivityRights: any;
  userData: any;
  AddBrokerInfoForm:FormGroup;
  constructor(public dialog: MatDialog, private _dataService: DataService, 
    private toastr: ToastrService, private fb: FormBuilder,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.AddBrokerInfoForm = fb.group({
      Name: ['', Validators.required],
      Location: ['', Validators.required],
      MobileNumber: ['', Validators.required],
      IsActive: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getData();
  }
  //Add New Broker
  addRow() {
    if (this.BrokerData.length > 0) {
      if (this.BrokerData[0].isAdd == true) {
        this.BrokerData = [...this.BrokerData];
        this.BrokerData.shift();
      }
      this.BrokerData = [...this.BrokerData];
      this.BrokerData.unshift({ Name: "", Location: "", MobileNumber: "", IsActive: "true", isEditable: true, isAdd: true });
    } else {
      this.BrokerData.push({ Name: "", Location: "", MobileNumber: "", IsActive: "true", isEditable: true, isAdd: true });
      this.BrokerData = [...this.BrokerData];
    }
  }

  cancelFeedBrokerAddClick(row){
    this.BrokerData = [...this.BrokerData];
    this.BrokerData.shift();
    row.isEditable=false;
  }
  //Get Feed BrokerInfo
  getData() {
    this.spinner.show();
    this._dataService.GetAll('CompanyInfo/GetBrokerDetails/' + this.BrokerId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.BrokerData = Data.ListResult;
          this.isEditable = false;
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  };
  //AddBrokerINfo
  addFeedBrokerClick(row) {
    var req = {
      "Id": null,
      "Name": this.AddBrokerInfoForm.value.Name,
      "Location": this.AddBrokerInfoForm.value.Location,
      "MobileNumber": this.AddBrokerInfoForm.value.MobileNumber,
      "IsActive": this.AddBrokerInfoForm.value.IsActive,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('CompanyInfo/AddUpdateBrokerInfo/', req)
      .subscribe((Data) => {
        this.clicked = false;
        this.spinner.hide();
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

    this.BrokerData = [...this.BrokerData];
    this.BrokerData.shift();
    row.isEditable = false;
  }
//Edit BrokerInfo
  editRow(row) {
    if (this.BrokerData[0].isAdd == true) {
      this.BrokerData = [...this.BrokerData];
      this.BrokerData.shift();
    }
    this.BrokerData.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd = false;
  }
  cancelFeedBrokerEditClick(row){
    row.isEditable=false;
    this.getData();
  }
  
  //Update BrokerInfo
  onUpdateRow(row) {
    row.isEditable = false;
    var req = {
      "Id": row.BrokerId,
      "Name": row.Name,
      "Location": row.Location,
      "MobileNumber": row.MobileNumber,
      "IsActive": row.IsActive,
      "CreatedByUserId": row.CreatedByUserId,
      "CreatedDate": row.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('CompanyInfo/AddUpdateBrokerInfo/', req)
      .subscribe((Data) => {
        this.spinner.hide();
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
//Delete BrokerInfo
  delete(row, index) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to delete ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var req = {
          "Id": row.BrokerId,
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date()
        }
        this.spinner.show();
        this._dataService.Post('CompanyInfo/DeleteBroker/', req)
          .subscribe((Data) => {
            this.spinner.hide();
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
    this.isDataLoading = true;
    this._dataService.Post('CompanyInfo/ExportBroker/', this.BrokerData).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Feed Broker Info.xlsx";
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
toggleFilter(){
  this.fd.reset();
this.isFiltersEnabled = !this.isFiltersEnabled;
if (this.isFiltersEnabled)
  this.filterTooltip = "Disable Filters";
else {
  this.filterTooltip = "Enable Filters";
}

}
  
}
