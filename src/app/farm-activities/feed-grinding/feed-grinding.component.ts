import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Row } from 'primeng/primeng';
import  { SelectItem, Message, DataTable } from 'primeng/primeng';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-feed-grinding',
  templateUrl: './feed-grinding.component.html',
  styleUrls: ['./feed-grinding.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeedGrindingComponent implements OnInit {
  clicked :boolean = false;
  isFiltersEnabled :boolean= false;
  @ViewChild(('fg')) fg: DataTable;
  filterTooltip = "Enable Filters"; 
  isEditable: boolean = false;
  IsAdd: boolean = false;
  currentDate: Date;
  isAddFeedGrinding: boolean = false;
  isEditFeedGrinding: boolean = false;
  feedGrindingList: any[] = [];
  feedGrindingData: any[] = [];
  addFeedGrinding: FormGroup;
  editFeedGrinding: FormGroup;
  edittedRowData: any;
  userData: any;
  selectedFarm: any;
  fromDate: Date;
  toDate: Date;
  ActivityRights:any;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private _dataService: DataService,
     private toastr: ToastrService,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.addFeedGrinding = fb.group({
      date: ['', Validators.required],
      noOfTon: ['', Validators.required],
      cost: ['', Validators.required]
    })
    // this.editFeedGrinding= fb.group({
    //   date:['',Validators.required],
    //   noOfTon:['',Validators.required],
    //   cost:['',Validators.required]
    // })
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getFarmGrigindingList();
  }

  getFarmGrigindingList() {    
    var req =
    {
      "farmId": this.selectedFarm.FarmId,
      "typeId": 1,
      "FromDate": this.fromDate,
      "ToDate": this.toDate
    }
    this.spinner.show();
    this._dataService.Post('FeedGrinding/GetFeedGrindingDetails/', req).subscribe((response) => {
      this.spinner.hide();
      if (response.IsSuccess) {
        this.isEditable = false;
        this.feedGrindingList = response.ListResult == null ? [] : response.ListResult;
        this.feedGrindingData = response.ListResult == null ? [] : response.ListResult.map(x => Object.assign({}, x));
      }
      else {
      }
    });
  }

  onAddFeedGrindingClick() {
    if (this.feedGrindingList.length > 0) {
      if (this.feedGrindingList[0].isAdd == true) {
        this.feedGrindingList = [...this.feedGrindingList];
        this.feedGrindingList.shift();
      }
      this.feedGrindingList = [...this.feedGrindingList];
      this.feedGrindingList.unshift({ FGDate: "", AmountPerTonne: "", Tonnes: "", isEditable: true, isAdd: true });
    } else {
      this.feedGrindingList.push({ FGDate: "", AmountPerTonne: "", Tonnes: "", isEditable: true, isAdd: true });
      this.feedGrindingList = [...this.feedGrindingList];
    }
  }

  onSaveFeeedGrindingAdd(row) {
       var req = {
      "Id": 0,
      "FGDate": this.addFeedGrinding.value.date,
      "FarmId": this.selectedFarm.FarmId,
      "Tonnes": this.addFeedGrinding.value.noOfTon,
      "AmountPerTonne": this.addFeedGrinding.value.cost,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('FeedGrinding/AddUpdateFeedGrindingDetails', req)
      .subscribe((response) => {
        this.spinner.hide();
        this.clicked = false;
        if (response.IsSuccess) {
          this.isAddFeedGrinding = false;
          this.toastr.success(response.EndUserMessage);
          this.getFarmGrigindingList();
        }
        else {
          this.toastr.error(response.EndUserMessage);
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
    this.feedGrindingList = [...this.feedGrindingList];
    this.feedGrindingList.shift();
    row.isEditable = false;
  }

  onCancleFeeedGrindingAdd(row) {
    this.feedGrindingList = [...this.feedGrindingList];
    this.feedGrindingList.shift();
    row.isEditable = false;

  }


  onEditFeedGrindingClick(row) {

    if (this.feedGrindingList[0].isAdd == true) {
      this.feedGrindingList = [...this.feedGrindingList];
      this.feedGrindingList.shift();
    }
    this.feedGrindingList.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd = false;

  }

  onupdateFeeedGrindingEdit(row) {
    row.isEditable = false;
    var req = {
      "Id": row.Id,
      "FGDate": row.FGDate,
      "FarmId": this.selectedFarm.FarmId,
      "Tonnes": row.Tonnes,
      "AmountPerTonne": row.AmountPerTonne,
      "CreatedByUserId": row.CreatedByUserId,
      "CreatedDate": row.CreatedDate,
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('FeedGrinding/AddUpdateFeedGrindingDetails', req)
      .subscribe((response) => {
        this.clicked = false;
        this.spinner.hide();
        if (response.IsSuccess) {
          this.toastr.success(response.EndUserMessage);
          this.getFarmGrigindingList();
        }
        else {
          this.toastr.error(response.EndUserMessage);
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }


  onDeleteFeedGrindingClick(row) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to delete ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.spinner.show();
        this._dataService.Deleteincfeed('FeedGrinding/DeleteFeedGrindingDetails', row.Id)
          .subscribe((Data) => {
            this.spinner.hide();
            if (Data.IsSuccess) {
              this.toastr.success(Data.EndUserMessage);
              this.getFarmGrigindingList();
            }
            else {
              this.toastr.error(Data.EndUserMessage);
            }
          }, (error) => {
            this.toastr.error("An error has occured");
          })
      }
    });
  }

  onCancleFeeedGrindingEdit(row) {
    row.isEditable = false;
    this.getFarmGrigindingList();
  }


  //Export
  download() {
    var csvData = this.ConvertToCSV(this.feedGrindingList);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'Feed grinding Details.csv';/* your file name*/
    a.click();
    return 'success';
  }
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";
    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  // restrict letters
  onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57  ) && (charCode != 46)) {
      return false;
    }
    return true;
  }

  // On Clear Click
  onClearSearch() {
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getFarmGrigindingList();
  }

  // On Search Click
  onSearchClick() {
    this.getFarmGrigindingList();
  }
  toggleFilter(){
    this.fg.reset();
  this.isFiltersEnabled = !this.isFiltersEnabled;
  if (this.isFiltersEnabled)
    this.filterTooltip = "Disable Filters";
  else {
    this.filterTooltip = "Enable Filters";
  }
}
}
