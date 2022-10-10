import { Component, OnInit ,ViewChild} from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataFactory } from '../../shared/dataFactory';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import  { SelectItem, Message, DataTable } from 'primeng/primeng';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeedComponent implements OnInit {
  clicked:boolean = false;
  isFiltersEnabled :boolean= false;
  @ViewChild(('fd')) fd: DataTable;
  filterTooltip = "Enable Filters"; 
  ActivityRights: any;
  userData: any;
  Id: string;
  isEditable: boolean;
  FeedData: any;
  LookupData: any;
  data: any = [];
  delRow: any;
  isEdit:boolean=false;
  IsAdd:boolean=false;
  LookUpTypeId:any;
  LookUp = DataFactory.LookUp;
  AddfeedForm:FormGroup;
  constructor(public dialog: MatDialog,private _dataService: DataService, private toastr: ToastrService,private fb:FormBuilder,private spinner:NgxSpinnerService) { 
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.AddfeedForm = fb.group({
      NAME: ['', Validators.required],
      // Desc: ['', Validators.required],
      Remarks: [''],
      IsActive: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getData();
  }

  //Get All Feed Details
  getData() {
    this.spinner.show();
    this._dataService.GetAll('FarmActivity/GetLookUpData' + '/' + this.Id + '/' + this.LookUpTypeId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.LookupData = Data.ListResult;
          this.isEditable = false;
          //feedDropDown
          this.FeedData = this.LookupData.filter(
            task => task.LookUpTypeId === this.LookUp.FeedTypes);
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }


//On AddClick
  addRow() {
    if (this.FeedData.length > 0) {
      if (this.FeedData[0].isAdd == true) {
        this.FeedData = [...this.FeedData];
        this.FeedData.shift();
      }
      this.FeedData = [...this.FeedData];
      this.FeedData.unshift({ NAME: "", Remarks: "", IsActive: true, isEditable: true, isAdd: true });
    } else {
      this.FeedData.push({ NAME: "", Remarks: "", IsActive: true, isEditable: true, isAdd: true });
      this.FeedData = [...this.FeedData];
    }
  }

  cancelFeedAddClick(row){
    this.FeedData = [...this.FeedData];
    this.FeedData.shift();
    row.isEditable=false;
  }
//Update Feed Details
  onUpdateRow(row) {
    row.isEditable = false;
    this.spinner.show();
    var req = {
      "Id": row.Id,
      "LookUpTypeId": row.LookUpTypeId,
      "Name": row.NAME,
      "Remarks": row.Remarks,
      "IsActive": row.IsActive,
      "CreatedByUserId": row.CreatedByUserId,
      "CreatedDate": row.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this._dataService.Post('FarmActivity/AddUpdateLookUp/', req)
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
  }
//add Feed Details
  addFeedClick(row) {
    var req = {
      "Id": 0,
      "LookUpTypeId": this.LookUp.FeedTypes,
      "Name": this.AddfeedForm.value.NAME,
      "Remarks": this.AddfeedForm.value.Remarks,
      "IsActive": this.AddfeedForm.value.IsActive,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateLookUp/', req)
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
    this.FeedData = [...this.FeedData];
    this.FeedData.shift();
    row.isEditable = false;
  }


  editRow(row) {
    if(this.FeedData[0].isAdd==true){
    this.FeedData = [...this.FeedData];
    this.FeedData.shift();
    }
    this.FeedData.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd=false;
  }

  cancelFeedEditClick(row){
    row.isEditable=false;
    this.getData();
  }

  save(row) {
    row.isEditable = false
  }

  delete(row, index) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to delete ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var req = {
          "Id": row.Id,
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date()
        }
        this.spinner.show();
        this._dataService.Post('FarmActivity/DeleteLookUp/', req)
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
    this._dataService.Post('FarmActivity/ExportFeed/', this.FeedData).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Feed.xlsx";
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
