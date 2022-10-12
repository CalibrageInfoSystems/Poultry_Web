import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { Router } from '@angular/router';
import { DataFactory } from 'src/app/shared/dataFactory';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { Table } from 'primeng/table';
import { NgxSpinnerService } from 'ngx-spinner';
// import Swal from 'sweetalert2';
@Component({
  selector: 'app-viewlogs',
  templateUrl: './viewlogs.component.html',
  styleUrls: ['./viewlogs.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ViewlogsComponent implements OnInit {
  // @ViewChild('dt') table: Table;
  // // isDataLoading: boolean;
  // isFiltersEnabled = false;
  // filterTooltip = "Enable Filters";
  manageRateForm: FormGroup;
  isManageRate: boolean = false;
  viewLogs: any = [];
  viewLogsList: any[] = []
  curDate: any;
  selectedDate: any = null;
  req: any;
  // status:any;
  obj: any;
  deleterow: any;
  isDataLoading: boolean = false;
  isAddlogDetails: boolean = false;
  isEditlogDetails: boolean = false;
  IsShed: boolean = false;
  // sheds: any = [];
  isLoading: boolean = false;
  isEditingvisitlog = {};

  addVisitLogObj: object;
  status = DataFactory.Status;
  ShedType = DataFactory.ShedType;
  rowData: any;
  addVisitlogForm: FormGroup;
  editVisitlogForm: FormGroup;
  userData: any;
  finalreq: any[];
  isShow: boolean
  selectedFarm: any;
  modalRef: BsModalRef;
  rowNote: any;
  Mortality: any;
  Feed: any;
  TotalEggs: any;
  RemainingBirds: number;
  AvaiableBirds: any;
  NoOfEggs: any;
  damagedEggs: any;
  layerProduction: any;
  totalCartoEggs: any;
  ManageData: any = {};
  manageDate: Date;
  ActivityRights: any;
  constructor(private _dataService: DataService, private router: Router, private toastr: ToastrService, private fb: FormBuilder,
    public dialog: MatDialog, private modalService: BsModalService, private spinner: NgxSpinnerService) {
    this.onFormBuild();
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.editVisitlogForm = this.fb.group({
      Feed: ['', Validators.required]
    })
  }

  //to View note
  openModal(row, template: TemplateRef<any>) {
    this.rowNote = {
      batch: row.BatchName,
      shed: row.ShedName,
      note: row.Remarks
    }
    this.modalRef = this.modalService.show(template);
  }


  onFormBuild() {
    this.addVisitlogForm = this.fb.group({
      items: this.fb.array([])
    });

    this.manageRateForm = this.fb.group({
      date: ['', Validators.required],
      cullRate: ['', Validators.required],
      neccRate: ['', Validators.required],
      pulpRate: ['', Validators.required],
      billRate: ['', Validators.required],
    })
  }

  ngOnInit() {
    // this.GetSheds();
    this.curDate = new Date();
    //this.selectedDate = new Date()
    this.GetVisitLogs();
  }


  //Get visit log data
  GetVisitLogs(): void {
    this.isDataLoading = true;
    this.finalreq = [];
    var req = {
      "visitedDate": this.selectedDate,
      "FarmId": this.selectedFarm.FarmId
    }
    this.spinner.show();
    let sumD: any = 0; let sumA: any = 0;
    let sumH: any = 0; let sumO: any = 0;
    let sumF: any = 0; let sumE: any = 0;
    //second row summary
    let sumNE: any = 0; let sumDE: any = 0;
    //third row summary
    let sumLP: any = 0; let sumTEC: any = 0;
    this._dataService.Post('Log/GetVisitLogByDate/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.viewLogs = Data.Result;
          this.selectedDate = Data.Result.shedTypes[0].LogDate;
          // this.viewLogsList= Data.Result.map(x => Object.assign({}, x));
          for (var i = 0; i < this.viewLogs.shedTypes.length; i++) {
            var req = {
              ShedTypeId: this.viewLogs.shedTypes[i].ShedTypeId,
              shedType: this.viewLogs.shedTypes[i].ShedType,
              logs: [],
              Summaries: this.viewLogs.visitLogSummary.filter(x => x.ShedTypeId == this.viewLogs.shedTypes[i].ShedTypeId)
            }
            req.logs = this.viewLogs.visitLogDetails.filter(x => x.ShedTypeId == this.viewLogs.shedTypes[i].ShedTypeId);
            // req.logs=this.viewLogs.visitLogDetails.filter(x=>x.ShedType==this.viewLogs.shedTypes[i].ShedType);
            req.logs.map(function (obj) {
              obj.isEditingvisitlog = false;
            })

            req.logs.forEach(a => sumD += a.Died);
            req.logs.forEach(a => sumH += a.Hurt);
            req.logs.forEach(a => sumF += a.Feed);
            this.Mortality = sumD + sumH
            this.Feed = sumF
            req.logs.forEach(a => sumA += a.RemainingBirds);
            this.RemainingBirds = sumA
            req.logs.forEach(a => sumO += a.OpeningBirds);
            this.AvaiableBirds = sumO


            if (req.ShedTypeId == DataFactory.ShedType.LayerShed) {
              //Second row summaries
              req.logs.forEach(a => sumNE += a.NumberofEggs);
              this.NoOfEggs = sumNE;

              req.logs.forEach(a => sumDE += a.DamagedEggs);
              this.damagedEggs = sumDE;

              req.logs.forEach(a => sumE += a.TotalEggs);
              this.TotalEggs = sumE

              //Third row summaries

              req.logs.forEach(a => sumLP += a.Percentage);
              this.layerProduction = sumLP;

              this.totalCartoEggs = this.TotalEggs / 210;
            }



            // var layerIds=req.logs.filter(x=>x.ShedTypeId==this.viewLogs.shedTypes[i].ShedTypeId);

            // for(var i=0;i<req.logs.length;i++){
            //   if(req.logs[i].StatusType=="Pending"){
            //     this.isShow=true;
            //     //status
            //   }else{
            //     this.isShow=false;                
            //   }
            // }
            this.finalreq.push(req);
            this.isDataLoading = false;
          }
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }


  //Actions
  approveOrDecline(row, status) {
    this.obj = {
      "Id": row.Id,
      "StatusTypeId": status == 'Approve' ? DataFactory.Status.Approved : DataFactory.Status.Declined,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "ShedId": row.ShedId,
      "CreatedByUserId": row.CreatedByUserId
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to " + status + " ?" },
      width: 'auto',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.spinner.show();
        this._dataService.Post('Log/UpdateVisitLogStatus/', this.obj)
          .subscribe((Data) => {
            this.spinner.hide();
            if (Data.IsSuccess) {
              this.toastr.success(status == 'Approve' ? 'Status has been Approved Successfully' : 'Status has been Dclined Successfully');
              this.GetVisitLogs();
            }
            else {
              this.toastr.error("An error has occured");
            }
          }, (error) => {
            this.toastr.error("An error has occured");
          })
      }
    });
  }
  //Actions
  approveAll(data) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to  Approve" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var pendingData = data.filter(ele => ele.StatusTypeId == DataFactory.Status.Pending);
        //loop pendingData{}
        pendingData.forEach(ele => {
          this.obj = {
            "LogDate": this.selectedDate,// new Date(),
            "ShedTypeId": ele.ShedTypeId,
            "StatusTypeId": DataFactory.Status.Approved,
            "UpdatedByUserId": this.userData.Id,
            "UpdatedDate": new Date(),
            "FarmId": this.selectedFarm.FarmId
          }
          this.spinner.show();
          this._dataService.Post('Log/ApproveVisitLogsByShedTypeId/', this.obj)
            .subscribe((Data) => {
              this.spinner.hide();
              if (Data.IsSuccess) {
                this.toastr.success('Status has been Approved Successfully');
                this.GetVisitLogs();
              }
              else {
                this.toastr.error("An error has occured");
              }
            }, (error) => {
              this.toastr.error("An error has occured");
            })
        });
      }
    });
  }

  onCancleEditvisit(row) {
    row.isEditingvisitlog = false;
  }
  //Edit 
  onEditvisitClick(row, rowIndex, reg) {
    row.isEditingvisitlog = true;
    this.rowData = row;
  }
  UpdateVisitLog(row, status) {
    this.obj = {
      "Died": row.Died,
      "Hurt": row.Hurt,
      "Feed": row.Feed,
      "DamagedEggs": row.DamagedEggs,
      "NumberofEggs": row.NumberofEggs,
      "Id": row.Id,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "ShedId": row.ShedId,
      "IsProduction": row.IsProduction
      //"CreatedByUserId": row.CreatedByUserId
    }
    this.spinner.show();
    this._dataService.Post('Log/UpdateVisitLogDetails/', this.obj)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isEditingvisitlog = false;
          // this.GetInOutRegisters();
          this.GetVisitLogs();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })

  }

  // createItem(item) {
  //   return this.fb.group({
  //     ShedId:item.Id,
  //     ShedName: item.ShedName + '( ' + item.FarmName + ' )',
  //     Died: [''],
  //     Hurt: [''],
  //     NumberofEggs: [''],
  //     DamagedEggs: [''],
  //     Feed: ['',Validators.required]
  //   })
  // }

  //Get Sheds By User Id
  // GetSheds(): void {
  //   this.isLoading=true;
  //   var req = {
  //     UserId : this.userData.Id,
  //     FarmId : this.selectedFarm.FarmId,
  //     Date :this.selectedDate
  //   }

  //   this._dataService.Post('CompanyInfo/GetShedsByUserId',req )
  //     .subscribe((Data) => {
  //       this.isLoading=false;        
  //       if (Data.IsSuccess) {
  //         this.sheds = Data.ListResult;
  //       }
  //       else {
  //         this.toastr.error("An error has occured");
  //       }
  //     },(error)=>{
  //       this.toastr.error("An error has occured");
  //     });
  // }

  disableButton(data) {
    // data.forEach(element => {
    // element.StatusTypeId==DataFactory.Status.Pending
    // });
    if (data.find(ele => ele.StatusTypeId == DataFactory.Status.Pending))
      return true;
    else
      return false;

  }
  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    var excelReq = {
      SelectedDate: this.selectedDate,
      FarmName: this.selectedFarm.FarmName,
      shedTypes: this.viewLogs.shedTypes,
      visitLogDetails: this.viewLogs.visitLogDetails,
      visitLogSummary: this.viewLogs.visitLogSummary
      // VisitLogResponse:this.viewLogs
    }
    this._dataService.Post('Log/ExportVisitLog/', excelReq).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Visit Log.xlsx";
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
  // // Open Add Log Form
  // onAddLogClick() {
  //   this.isAddlogDetails = true;
  //   for(var i=0;i<this.sheds.length;i++){
  //     (this.addVisitlogForm.controls['items'] as FormArray).push(this.createItem(this.sheds[i]))
  //     }
  // }

  // // Cancle Add Log
  // onCancleLogAdding() {
  //   this.isAddlogDetails = false;
  //   // this.addVisitlogForm.controls['items']=this.fb.array([]);
  //   this.onFormBuild();
  // }

  // //Decline Daily Log Record
  // delete(row) {
  //   this.deleterow = {
  //     "Id": row.Id
  //   }
  //   let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     data: { msg: "Are you sure you want to Decline ?" },
  //     width: 'auto',
  //     height: 'auto'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != undefined) {
  //       this._dataService.Post('Log/DeleteVisitLogDetails/', this.deleterow)
  //         .subscribe((Data) => {
  //           if (Data.IsSuccess) {
  //             this.toastr.success(Data.EndUserMessage);
  //             this.GetVisitLogs();
  //           }
  //         })
  //     }
  //   });
  // }

  // //Add Daily Logs
  // addVisitLog() {
  //   var finalreq: any[] = [];
  //   for(var i=0;i<this.addVisitlogForm.value.items.length;i++){
  //     var req={
  //       "Id": 0,
  //       "ShedId": this.addVisitlogForm.value.items[i].ShedId,
  //       "Died": this.addVisitlogForm.value.items[i].Died,
  //       "Hurt": this.addVisitlogForm.value.items[i].Hurt,
  //       "Feed": this.addVisitlogForm.value.items[i].Feed,
  //       "DamagedEggs": this.addVisitlogForm.value.items[i].DamagedEggs,
  //       "NumberofEggs": this.addVisitlogForm.value.items[i].NumberofEggs,
  //       "StatusTypeId": DataFactory.Status.Pending,
  //       "CreatedByUserId":this.userData.Id,
  //       "CreatedDate": new Date(),
  //       "UpdatedByUserId": this.userData.Id,
  //       "UpdatedDate": new Date()
  //     }
  //   finalreq.push(req);   
  //   }
  //   this._dataService.Post('Log/AddVisitLog/', finalreq)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.isAddlogDetails = false;
  //         this.toastr.success(Data.EndUserMessage);
  //         this.GetVisitLogs();
  //         this.onFormBuild();
  //       }
  //       else {
  //         this.toastr.error(Data.EndUserMessage);
  //       } 
  //     },
  //     (error) => {    
  //         this.toastr.success(error.error);              
  //       });
  // }


  // //Edit VisitLog Record
  // editLog(row) {
  //   this.rowData = row;
  //   this.isEditlogDetails = true;
  // }


  // updateVisitLog(row) {
  //   var req = {
  //     "Id": row.Id,
  //     "Died": row.Died,
  //     "Hurt": row.Hurt,
  //     "Feed": row.Feed,
  //     "DamagedEggs": row.DamagedEggs,
  //     "NumberofEggs": row.NumberofEggs,
  //     "UpdatedByUserId": this.userData.Id,
  //     "UpdatedDate": new Date()
  //   }
  //   this._dataService.Post('Log/UpdateVisitLogDetails/', req)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.isEditlogDetails = false;
  //         this.toastr.success(Data.EndUserMessage);
  //         const { editVisitlogForm: { value: formValueSnap } } = this;
  //         this.editVisitlogForm.reset(formValueSnap);  
  //         this.GetVisitLogs();
  //       }
  //       else {
  //         this.toastr.error(Data.EndUserMessage);
  //       }
  //     },
  //     (error) => {    
  //         this.toastr.success(error.error);              
  //       });
  // }

  // onCancleLogEditing() {
  //   this.isEditlogDetails = false;
  //   this.viewLogs= this.viewLogsList.map(x => Object.assign({}, x));    
  //   const { editVisitlogForm: { value: formValueSnap } } = this;
  //   this.editVisitlogForm.reset(formValueSnap);     
  // }
  // On Manege Rate Click
  onManegeRateClick() {
    this.isManageRate = true;
    this.ManageData = {};
    this.manageDate = this.selectedDate;
    this.manageRateForm.reset({
      date: this.manageDate
    });
    this.OnManageDateChange();
  }

  // On Save  Manage Rate
  onSaveManageRateClick() {
    this.isManageRate = false;
    var req = {
      "Id": (this.ManageData.Id == null || this.ManageData.Id == undefined) ? null : this.ManageData.Id,
      "Date": this.manageRateForm.value.date,
      "FarmId": this.selectedFarm.FarmId,
      "CullRate": this.manageRateForm.value.cullRate,
      "NECCRate": this.manageRateForm.value.neccRate,
      "PulpRate": this.manageRateForm.value.pulpRate,
      "BillRate": this.manageRateForm.value.billRate,
      "CreatedByUserId": (this.ManageData.CreatedByUserId == null || this.ManageData.CreatedByUserId == undefined) ? this.userData.Id : this.ManageData.CreatedByUserId,
      "CreatedDate": (this.ManageData.CreatedDate == null || this.ManageData.CreatedDate == undefined) ? new Date() : this.ManageData.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()

    }
    this.spinner.show();
    this._dataService.Post('Log/AddUpdateManageRateDetails', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);

        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  // On cancel  Manage Rate
  onCancelManageRateClick() {
    this.isManageRate = false;
    this.manageDate = this.selectedDate;
  }

  // Manage Date Change event
  OnManageDateChange() {
    debugger
    this.ManageData = {};
    var req = {
      "FarmId": this.selectedFarm.FarmId,
      "date": this.manageDate
    }
    this.spinner.show();
    this._dataService.Post('Log/GetManageRateDetailsByDate', req).subscribe(res => {
      this.spinner.hide();
      if (res.IsSuccess) {
        this.ManageData = res.Result == null ? {} : res.Result;
      }
    })

  }
  //TOGGLE FILTER
  // toggleFilter = function () {
  //   this.isFiltersEnabled = !this.isFiltersEnabled;
  //   if (this.isFiltersEnabled) {
  //     this.filterTooltip = "Disable Filters";
  //   }
  //   else {
  //     this.filterTooltip = "Enable Filters";
  //     this.sortField = this.table.sortField;
  //     this.sortOrder = this.table.sortOrder;
  //     this.table.reset();
  //     this.table.sortField = this.sortField;
  //     this.table.sortOrder = this.sortOrder;

  //   }
  // };

}
