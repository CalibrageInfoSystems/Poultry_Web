import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import  { SelectItem, Message, DataTable } from 'primeng/primeng'
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-egg-traders',
  templateUrl: './egg-traders.component.html',
  styleUrls: ['./egg-traders.component.css']
})
export class EggTradersComponent implements OnInit { 
  clicked :boolean = false;
  isFiltersEnabled :boolean= false;
  @ViewChild(('dt')) dt: DataTable;
  filterTooltip = "Enable Filters"; 
  ActivityRights: any;
  userData: any;
  isEditable: boolean;
  TraderData: any;
  // TraderId: string;
  data: any = [];
  delRow: any;
  isEdit:boolean=false;
  IsAdd:boolean=false;
  AddTraderInfoForm:FormGroup;
  selectedFarm: any;
  constructor(public dialog: MatDialog,private _dataService: DataService, private toastr: ToastrService,private fb:FormBuilder,private spinner:NgxSpinnerService) { 
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.AddTraderInfoForm = fb.group({
      Name: ['', Validators.required],
      Location: ['', Validators.required],
      MobileNumber: ['', Validators.required],
      Commission: [''],
      IsActive: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getData();
  }

  //Add New Trader Click
  addRow() {
    // var filterArray = this.TraderData.filter(x => x.isEditable == true);
    // if(filterArray.length>0){
    //   for(var i=0;i<this.TraderData.length;i++){
    //     this.TraderData[i].isEditable=false;
    //   }
    // }
    if (this.TraderData.length > 0) {
      if (this.TraderData[0].isAdd == true) {
        this.TraderData = [...this.TraderData];
        this.TraderData.shift();
      }
      this.TraderData = [...this.TraderData];
      this.TraderData.unshift({ Name: "", Location: "", MobileNumber: "", IsActive: "true", isEditable: true, isAdd: true });
    } else {
      this.TraderData.push({ Name: "", Location: "", MobileNumber: "", IsActive: "true", isEditable: true, isAdd: true });
      this.TraderData = [...this.TraderData];
    }
  }

  cancelEggAddClick(row){
    this.TraderData = [...this.TraderData];
    this.TraderData.shift();
    row.isEditable=false;
  }

  //Add TradetInfo
  addEggClick(row) {

    var req = {
      "Id": null,
      "Name": this.AddTraderInfoForm.value.Name,
      "Location": this.AddTraderInfoForm.value.Location,
      "MobileNumber": this.AddTraderInfoForm.value.MobileNumber,
      "IsActive": this.AddTraderInfoForm.value.IsActive,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FarmId":this.selectedFarm.FarmId,
      "Commission":this.AddTraderInfoForm.value.Commission
    }
    this.spinner.show();
    this._dataService.Post('CompanyInfo/AddUpdateTraderInfo/', req)
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


    this.TraderData = [...this.TraderData];
    this.TraderData.shift();
    row.isEditable = false;
  }
  //Edit Trader
  editRow(row) {
    if(this.TraderData[0].isAdd==true){
    this.TraderData = [...this.TraderData];
    this.TraderData.shift();
    }
    this.TraderData.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd=false;
  }

  cancelEggEditClick(row){
    row.isEditable=false;
    // this.TraderData = [...this.TraderData];
    // this.TraderData.shift();
    this.getData();
  }

  DateChangeEvent(item){
        var req = {
      "FarmId":this.selectedFarm.FarmId,
      "date" : item.value
    }
    this._dataService.Post('Log/GetManageRateDetailsByDate', req).subscribe(res => {
      if (res.IsSuccess) {
         var Data = res.Result == null ? {} : res.Result;
        //  this.PulpRate = Data.NECCRate
      }
    })
  }

  // save(row) {
  //   row.isEditable = false
  // }
// Update TraderInfo
  onUpdateRow(row){
    row.isEditable=false;
    var req={
      "Id":row.TraderId,
      "Name":row.Name,
      "Location":row.Location,
      "MobileNumber":row.MobileNumber,
      "IsActive":row.IsActive,
      "CreatedByUserId":row.CreatedByUserId,
      "CreatedDate":row.CreatedDate,
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate":new Date(),
      "FarmId":this.selectedFarm.FarmId,
      "Commission":this.AddTraderInfoForm.value.Commission
    }
    this.spinner.show();
    this._dataService.Post('CompanyInfo/AddUpdateTraderInfo/', req)
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
//Delete Trader Info
  delete(row,index){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to delete ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
this.spinner.show();
    var req={
      "Id":row.TraderId,
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate":new Date()
    }
    this._dataService.Post('CompanyInfo/DeleteTrader/', req)
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
 
  //Get All TraderInfo
  getData (){
    debugger
    var TraderId=null;
    this.spinner.show();
    this._dataService.GetAll('Log/GetTraderDetails/'+TraderId +'/'+ this.selectedFarm.FarmId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.TraderData = Data.ListResult;
          this.isEditable = false;        
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  };

  //ExportToExcel
  download = function () {
    this.isDataLoading=true;
    this._dataService.Post('Log/ExportTrader/', this.TraderData).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Trader Details.xlsx";
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
   // restrict letters
   onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //  Accept Float Values
  acceptFloat(event) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode != 46)) {
      return false;
    }
    return true;
  }
  toggleFilter(){
    this.dt.reset();
  this.isFiltersEnabled = !this.isFiltersEnabled;
  if (this.isFiltersEnabled)
    this.filterTooltip = "Disable Filters";
  else {
    this.filterTooltip = "Enable Filters";
  }

  }
}
