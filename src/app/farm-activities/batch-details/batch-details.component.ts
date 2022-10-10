import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { DataFactory } from 'src/app/shared/dataFactory';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { FormArray } from '@angular/forms';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import * as moment from "moment";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class BatchDetailsComponent implements OnInit {
  clicked: boolean = false;
  batchHistoryDetails: any[] = [];
  isEnableAddingShedSave: boolean = false;
  AddShedData: any[] = [];
  isAddShedDetails: boolean = false;
  addRowData: any = {};
  addingBatchData: FormGroup;
  isAddingBatchData: boolean = false;
  @ViewChild('ac') private table;
  @ViewChild('in') private table1;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  isFiltersEnable: boolean = false;
  Tooltip = "Enable Filters";
  isShedDetails: boolean = false;
  isEnableShedSave: boolean = false;
  rowData: any;
  AddShedDetails: any[] = [];
  batchDetailsList: any[] = [];
  batchArray: any[] = [];
  farmsList: any[];
  shedTypes: any[] = [];
  isAddCulbirds: boolean = false;
  isAddBatchDetails: boolean = false;
  isTransactionsView: boolean = false;
  isEditBatchDetails: boolean = false;
  canMoveChicks: boolean = false;
  isEnableSave: boolean = false;
  currentDate = new Date();
  disposeTypes: any[] = [];
  // UserId = DataFactory.Login.LoginId;
  addCulbirds: FormGroup;
  addBatchDetails: FormGroup;
  editBatchDetails: FormGroup;
  ActivityRights = [];
  userData: any;
  chickTransitions: any;
  ShedTypes: { ChickShed: number; GrowerShed: number; LayerShed: number; };
  selectedFarm: any;
  FarmInfo: any;
  activeBatches: any[] = [];
  inActiveBatches: any[] = [];
  batchDetails: any;
  HatcheryData: any;
  filteredHatcheries: any;
  shedDetailsList: any;
  addChickForm: any;
  selectedShed: any;
  selectedDate: Date;
  curDate: Date;
  isCulling: boolean = false;
  isSale: boolean = false;
  cullBirdDate: any;
  birdsCount = [];
  disposeBatchForm: any;
  totalBirds: number;
  ShedType: any;
  showVaccination: boolean = false;
  isVaccine: boolean = false;
  AddForm: FormGroup;
  vaccinataionDeatls: any[] = [];
  batchInfo: any;
  vaccineSchedule: any;
  batchInfoDetails: any;
  selectedTransdate: Date;
  addShedDataForm: any;
  addShedForm: any
  constructor(private _dataService: DataService, public dialog: MatDialog, private toastr: ToastrService, private _fb: FormBuilder,
     private router: Router,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.FarmInfo = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.ShedTypes = DataFactory.ShedType;
    this.addCulbirds = this._fb.group({
      Batch: [''],
      CostPerKg: [''],
      TotalWeight: [''],
      disposeTypeId: ['', Validators.required],
      totalAmount: ['', Validators.required],
      cullBirdDate: ['', Validators.required],
      totalBirds: ['', Validators.required]
    })
    this.addBatchDetails = this._fb.group({
      batchName: ['', Validators.required],
      farmName: this.FarmInfo.FarmId,
      chickCount: ['', Validators.required],
      isActive: [true],
      hatcheryName: ['', Validators.required],
      startDate: ['', Validators.required],
      amount: ['', Validators.required],
      transactionDate: ['', Validators.required],
      shedTypeId: ['', Validators.required]
    })
    this.editBatchDetails = _fb.group({
      batchName: ['', Validators.required],
      farmName: this.FarmInfo.FarmId,
      chickCount: ['', Validators.required],
      isActive: [''],
      hatcheryName: ['', Validators.required],
      startDate: ['', Validators.required],
      amount: ['', Validators.required],
      // transactionDate: ['', Validators.required]
    })
    this.addingBatchData = _fb.group({
      shedTypeId: [],
      transactionDate: [],
      batchName: ['', Validators.required],
      ChicksCount: ['', Validators.required],
      amount: ['', Validators.required],
      availableChicks: []
    })
    this.onformBuild();
    // this.onformBuild();
    this.disposeBatchForm = this._fb.group({
      items: this._fb.array([])
    })
    this.AddForm = this._fb.group({
      date: [this.currentDate, Validators.required]
    })
    this.addShedForm = this._fb.group({
      items: this._fb.array([])
    })
    this.addShedDataForm = this._fb.group({
      items: this._fb.array([])
    })
  }
  onformBuild() {
    this.addChickForm = this._fb.group({
      items: this._fb.array([])
    })
  }
  ngOnInit() {
    this.selectedDate = new Date();
    this.selectedTransdate = new Date();
    this.curDate = new Date();
    this.cullBirdDate = new Date();
    this.getHatcheries();
    this.getBatches();
    this.getDisposeTypes();
    this.getShedTypes();
  }

  //Get all Farms
  // getFarms(): void {
  //   // var Id = this.FarmInfo.FarmId;
  //   this._dataService.Get('CompanyInfo/GetFarmInfoById', this.FarmInfo.FarmId)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.farmsList = Data.ListResult;
  //         this.selectedFarm=this.farmsList[0];
  //       }
  //       else {
  //         this.toastr.error("An error has occured");
  //       }
  //     });
  // }

  //Get Hatchery Data
  getHatcheries() {
    var HatcheryId = null;
    this.spinner.show();
    this._dataService.GetAll('Transitions/GetHatcheryDetails/' + HatcheryId + '/' + this.FarmInfo.FarmId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.HatcheryData = Data.ListResult;
          //feedDropDown
          this.filteredHatcheries = this.HatcheryData.filter(
            task => task.IsActive === true);
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        })
  };

  //Get all Batches
  getBatches(): void {
    var Id = null;
    this.spinner.show();
    this._dataService.GetAll('CompanyInfo/GetBatchInfoById' + '/' + Id + '/' + this.FarmInfo.FarmId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.batchDetailsList = Data.ListResult;
          this.activeBatches = this.batchDetailsList.filter(
            task => task.IsActive === true);
          this.inActiveBatches = this.batchDetailsList.filter(
            task => task.IsActive === false);
          this.batchArray = Data.ListResult.map(x => Object.assign({}, x))
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }
  //culBirds
  onAddCullbirds() {
    this.isAddCulbirds = true;
    var reqArr = [];
    var ctt = [];
    for (var i = 0; i < this.disposeBatchForm.value.items.length; i++) {
      if (this.disposeBatchForm.value.items[i].ChicksCount != '')
        reqArr.push(this.disposeBatchForm.value.items[i]);
    }
    var selectedShedChickCount = 0;
    for (var i = 0; i < reqArr.length; i++) {
      reqArr[i].BatchId = this.batchDetails.Id;
      reqArr[i].TransitionDate = this.cullBirdDate;
      reqArr[i].FromShedId = this.shedDetailsList[i].ShedId;
      selectedShedChickCount = selectedShedChickCount + (+reqArr[i].ChicksCount);
    }

    for (var i = 0; i < this.disposeBatchForm.value.items.length; i++) {
      ctt.push(
        {
          "Id": null,
          "CullingId ": null,
          "SheedId": this.shedDetailsList[i].ShedId,
          "CullingBirds": this.disposeBatchForm.value.items[i].ChicksCount,
          "BatchId": + this.batchDetails.Id
        }
      )

    }
    if (selectedShedChickCount > +this.batchDetails.ChicksCount) {
      this.toastr.error('Birds count should not exceed original shed birds count')
    } else {

      var req = {
        "chickTransaction": reqArr,
        // ShedId: +this.shedDetailsList[i].ShedId,
        "BatchId": +this.batchDetails.Id,
        "Cost": this.addCulbirds.value.CostPerKg,
        "Weight": this.addCulbirds.value.TotalWeight,
        "CullDate": this.addCulbirds.value.cullBirdDate,
        "CreatedByUserId": this.userData.Id,
        "DisposeType": this.addCulbirds.value.disposeTypeId,
        "TotalAmount": this.addCulbirds.value.totalAmount,
        "FarmId": this.FarmInfo.FarmId,
        "cullingTransaction": ctt
      }
    }
    this.spinner.show();
    this._dataService.Post('Transitions/CullBirds/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.clicked = false;
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.isAddCulbirds = false;
          this.disposeBatchForm.reset();
          this.getBatches();
          this.addCulbirds.get('disposeTypeId').setValue(null);
          this.isSale = false;
          this.isCulling = false;
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  onCancleCulbirds() {
    this.isAddCulbirds = false;
    this.disposeBatchForm.reset();
    this.isCulling = false;
    this.isSale = false;
    this.addCulbirds.get('disposeTypeId').setValue(null);
  }
  onCullDateChange() {
    while (this.disposeBatchForm.controls['items'].length !== 0) {
      this.disposeBatchForm.controls['items'].removeAt(0)
    }
    var req = {
      "FarmId": this.FarmInfo.FarmId,
      "BatchId": this.batchDetails.Id,
      "CullDate": this.cullBirdDate
    }
    this.spinner.show();
    this._dataService.Post('Transitions/GetShedsByBatchId/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.shedDetailsList = Data.ListResult;
          for (var i = 0; i < this.shedDetailsList.length; i++) {
            (this.disposeBatchForm.controls['items'] as FormArray).push(this.createDisposeItem(this.shedDetailsList[i]));
            let sum: number = 0;
            this.shedDetailsList.forEach(a => sum += a.CurrentChicksCount);
            this.totalBirds = sum
          }
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  onDisposeClick(row) {
    this.batchDetails = row;
    this.isAddCulbirds = true;
    this.onCullDateChange();
  }

  //EndculBirds
  onAddBatchClick() {
    this.isAddBatchDetails = true;
    this.addBatchDetails.get('isActive').setValue(true)
  }

  onSave() {
    var ShedData = [];
    var ss = [];
    for (var i = 0; i < this.addShedForm.value.items.length; i++) {

      ShedData.push(this.addShedForm.value.items[i])

    }

    for (var i = 0; i < ShedData.length; i++) {
      ss.push(
        {
          "Id": null,
          "BatchId": null,
          "ShedId": this.AddShedDetails[i].ShedId,
          "ChicksCount": ShedData[i].ChicksCount,
          "TransitionDate": this.addBatchDetails.value.transactionDate,
          "IsActive": true,
          "CreatedByUserId": this.userData.Id,
          "CreatedDate": new Date(),
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date(),
          "FromShedId": null
        }
      )
    }
    var addUpdatebatchObj = {
      "Name": this.addBatchDetails.value.batchName,
      "FarmId": this.FarmInfo.FarmId,
      "ChicksCount": this.addBatchDetails.value.chickCount,
      "BatchStartDate": this.addBatchDetails.value.startDate,
      "IsActive": this.addBatchDetails.value.isActive,
      "CreatedDate": this.currentDate,
      "CreatedByUserId": this.userData.Id,
      "UpdatedDate": this.currentDate,
      "UpdatedByUserId": this.userData.Id,
      "HatcheryId": this.addBatchDetails.value.hatcheryName,
      "Amount": this.addBatchDetails.value.amount,
      "TransactionDate": this.addBatchDetails.value.transactionDate,
      "ShedId": 0,
      "BatchId": 0,
      "AvailableBirds": 0,
      "chickTransaction": ss

    }
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddBatchInfo/', addUpdatebatchObj)
      .subscribe((Data) => {
        this.clicked = false;
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.addBatchDetails.reset();
          this.addShedForm.reset();
          this.isShedDetails = false;
          this.isAddBatchDetails = false;
          this.toastr.success(Data.EndUserMessage);
          this.getBatches();
          //addUpdatebatchObj.Id = Math.max.apply(Math, this.activeBatches.map(function (o) { return o.Id; }))
          // localStorage.setItem('BatchInfo', JSON.stringify(addUpdatebatchObj));
          // this.router.navigate(['/chick/chickshed']);          
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }
  onCancleBatchAdding() {
    this.isAddBatchDetails = false;
    //this.selectedFarm=this.farmsList[0];    
    //const { addBatchDetails: { value: formValueSnap } } = this;
    //this.addBatchDetails.reset(formValueSnap); 
    this.addBatchDetails.reset();
    this.addShedForm.reset();
    this.isShedDetails = false;
    this.selectedDate = new Date();
    this.selectedTransdate = new Date();
  }
  onEditBatchDetailsClick(row) {
    debugger
    this.isEditBatchDetails = true;
    this.rowData = row;
  }
  onCancleBatchEditing() {
    this.isEditBatchDetails = false;
    this.batchDetailsList = this.batchArray.map(x => Object.assign({}, x));
    const { editBatchDetails: { value: formValueSnap } } = this;
    this.editBatchDetails.reset(formValueSnap);
  }

  onUpdateBAtch() {
    var req = {
      "Id": this.rowData.Id,
      "Name": this.rowData.Name,
      "FarmId": this.FarmInfo.FarmId,
      "ChicksCount": this.rowData.ChicksCount,
      "IsActive": this.rowData.IsActive,
      "CreatedDate": this.rowData.CreatedDate,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "UpdatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "HatcheryId": this.editBatchDetails.value.hatcheryName,
      "BatchStartDate": this.editBatchDetails.value.startDate,
      "Amount": this.editBatchDetails.value.amount,
      "TransactionDate": this.editBatchDetails.value.transactionDate

    }
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateBatchInfo/', req)
      .subscribe((Data) => {
        this.clicked = false;
        this.spinner.hide();
        if (Data.IsSuccess) {
          const { editBatchDetails: { value: formValueSnap } } = this;
          this.editBatchDetails.reset(formValueSnap);
          this.getBatches();
          this.toastr.success(Data.EndUserMessage);
          this.isEditBatchDetails = false;
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  // onDeleteBatchDetailsClick(row) {
  //   let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     data: { msg: "Are you sure you want to delete ?" },
  //     width: 'auto',
  //     height: 'auto'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != undefined) {
  //       this.batchDetailsList.splice(this.batchDetailsList.indexOf(row), 1);
  //     }
  //   });
  // }
  //Delete BrokerInfo
  // onDeleteBatchDetailsClick(row) {
  //   let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     data: { msg: "Are you sure you want to delete ?" },
  //     width: 'auto',
  //     height: 'auto'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != undefined) {
  //       var req = {
  //         "Id": row.Id,
  //         "UpdatedByUserId": this.userData.Id,
  //         "UpdatedDate": new Date()
  //       }
  //       this._dataService.Post('CompanyInfo/DeleteBatch/', req)
  //         .subscribe((Data) => {
  //           if (Data.IsSuccess) {
  //             this.toastr.success(Data.EndUserMessage);
  //             this.getBatches();
  //           }
  //           else {
  //             this.toastr.error("An error has occured");
  //           }
  //         })
  //     }
  //   });
  // }

  //get chick transactions by batchid
  GetBatchInfo(row) {
    this.isEditBatchDetails = false;
    this.spinner.show();
    this._dataService.GetAll('Transitions/GetChickTransitionsByBatchId' + '/' + row.Id + '/' + this.FarmInfo.FarmId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.chickTransitions = Data.ListResult;
          // this.batchArray = Data.ListResult.map(x => Object.assign({}, x))
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  //get chick transactions by batchid
  GetBirdsCount(row) {
    this.isEditBatchDetails = false;
    this.spinner.show();
    this._dataService.GetAll('CompanyInfo/GetBirdsCountByBatchId' + '/' + row.Id + '/' + this.FarmInfo.FarmId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.birdsCount = Data.ListResult;
          // this.batchArray = Data.ListResult.map(x => Object.assign({}, x))
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  onMoveChicks(row) {
    localStorage.setItem('BatchInfo', JSON.stringify(row));
    if (row.ShedTypeId == null)
      this.router.navigate(['/chick/chickshed']);
    else if (row.ShedTypeId == this.ShedTypes.ChickShed)
      this.router.navigate(['/chick/growershed']);
    else if (row.ShedTypeId == this.ShedTypes.GrowerShed)
      this.router.navigate(['/chick/layershed']);
  }
  //Export
  download = function () {
    this.isDataLoading = true;
    this._dataService.Post('CompanyInfo/ExportBatchInfo/', this.batchDetailsList).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Batch Details.xlsx";
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


  onChangeShed(row, ShedType) {
    this.canMoveChicks = true;
    this.selectedShed = row;
    this.GetShedsbyShedType(row, ShedType);
  }

  onSelectShedType(event) {

    while (this.addShedForm.controls['items'].length !== 0) {
      this.addShedForm.controls['items'].removeAt(0)
    }
    var req = {
      "ShedId": 0,
      "ShedTypeId": this.addBatchDetails.value.shedTypeId,
      "FarmId": this.FarmInfo.FarmId,
      "BatchId": null,
      "TransitionDate": this.addBatchDetails.value.transactionDate
    }
    this.AddShedDetails = [];
    this._dataService.Post('Transitions/GetShedInfoByShedTypeId/', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.AddShedDetails = Data.ListResult;
          if (this.AddShedDetails.length > 0) {
            this.isShedDetails = true;
          }
          else {
            this.isShedDetails = true;
          }
          for (var i = 0; i < this.AddShedDetails.length; i++) {
            (this.addShedForm.controls['items'] as FormArray).push(this.createShedItem(this.AddShedDetails[i]));
          }
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  onTransitionDateChange() {
    while (this.addChickForm.controls['items'].length !== 0) {
      this.addChickForm.controls['items'].removeAt(0)
    }
    // for (var i = 0; i <= length; i++) {
    //   this.addChickForm.controls['items'].removeAt(i);
    // }
    var req = {
      "ShedId": this.rowData.ShedId,
      "ShedTypeId": this.ShedType,
      "FarmId": this.FarmInfo.FarmId,
      "BatchId": this.rowData.BatchId,
      "TransitionDate": this.selectedDate
    }
    this.spinner.show();
    this._dataService.Post('Transitions/GetShedInfoByShedTypeId/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.shedDetailsList = Data.ListResult;
          for (var i = 0; i < this.shedDetailsList.length; i++) {
            (this.addChickForm.controls['items'] as FormArray).push(this.createItem(this.shedDetailsList[i]));
          }
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }
  //Get Sheds by Shed Type
  GetShedsbyShedType(row, ShedType): void {
    this.rowData = row;
    this.ShedType = ShedType;
    this.onTransitionDateChange();
  }
  createItem(item) {
    return this._fb.group({
      ShedId: item.ShedId,
      ShedName: item.ShedName,
      ChicksCount: ['', Validators.required],
      TransitionDate: ['', Validators.required],
      BatchId: ['', Validators.required],
      IsActive: true,
      CreatedDate: new Date(),
      CreatedByUserId: this.userData.Id,
      UpdatedDate: new Date(),
      UpdatedByUserId: this.userData.Id,
      ShedCapacity: item.ShedCapacity,
      AvailableChicksCount: item.AvailableChicksCount,
      CurrentChicksCount: item.CurrentChicksCount
    })
  }

  createShedItem(item) {
    return this._fb.group({
      ShedId: item.ShedId,
      ShedName: item.ShedName,
      AvailableChicksCount: item.AvailableChicksCount,
      ChicksCount: ['', Validators.required],
      TransitionDate: ['', Validators.required],
      ShedCapacity: item.ShedCapacity,
      BatchId: ['', Validators.required],
      IsActive: true,
      CreatedDate: new Date(),
      CreatedByUserId: this.userData.Id,
      UpdatedDate: new Date(),
      UpdatedByUserId: this.userData.Id,
      FromShedId: item.ShedId
    })
  }
  createDisposeItem(item) {
    return this._fb.group({
      ShedId: item.ShedId,
      ShedName: item.ShedName,
      BatchId: ['', Validators.required],
      BatchName: ['', Validators.required],
      ChicksCount: ['', Validators.required],
      AvailableBirds: item.CurrentChicksCount
    })
  }
  onCancelMovingBirds() {
    this.canMoveChicks = false;
    // var length =this.addChickForm.controls['items'].length;
    // for (var i = 0; i <= length; i++) {
    //   this.addChickForm.controls['items'].removeAt(i);
    // }
    // while (this.addChickForm.controls['items'].length !== 0) {
    //   this.addChickForm.controls['items'].removeAt(0)
    // }
    // this.addChickForm.reset();
  }

  onSaveMovingBirds() {
    var reqArr = [];
    //this.addChickForm.value.items;
    for (var i = 0; i < this.addChickForm.value.items.length; i++) {
      if (this.addChickForm.value.items[i].ChicksCount != '')
        reqArr.push(this.addChickForm.value.items[i]);
    }
    var selectedShedChickCount = 0;
    for (var i = 0; i < reqArr.length; i++) {
      reqArr[i].BatchId = this.selectedShed.BatchId;
      reqArr[i].TransitionDate = this.selectedDate;
      reqArr[i].FromShedId = this.selectedShed.ShedId;
      selectedShedChickCount = selectedShedChickCount + (+reqArr[i].ChicksCount);
    }

    if (selectedShedChickCount > +this.selectedShed.ChicksCount) {
      this.toastr.error('Birds count should not exceed original shed birds count')
    } else {
      // var selectedShedreq = {
      //   ShedId: this.selectedShed.ShedId,
      //   ChicksCount: (+this.selectedShed.ChicksCount) - selectedShedChickCount,
      //   TransitionDate: this.selectedDate,
      //   BatchId: this.selectedShed.BatchId,
      //   IsActive: true,
      //   CreatedDate: new Date(),
      //   CreatedByUserId: this.userData.Id,
      //   UpdatedDate: new Date(),
      //   UpdatedByUserId: this.userData.Id,
      // }

      // reqArr.push(selectedShedreq);
      var req = {
        chickTransaction: reqArr,
        ShedId: +this.selectedShed.ShedId,
        BatchId: +this.selectedShed.BatchId,
        AvailableBirds: this.selectedShed.CurrentChicksCount
      }
      this.spinner.show();
      this._dataService.Post('Transitions/MoveChickTransitions/', req)
        .subscribe((Data) => {
          this.spinner.hide();
          if (Data.IsSuccess) {
            this.toastr.success(Data.EndUserMessage);
            this.canMoveChicks = false;
            // this.router.navigate(['/farm/batchdetails']);
            // localStorage.removeItem("BatchInfo");
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

  onTransitionsView(row) {
    this.isTransactionsView = true;
    this.rowData = row;
    this.getBatchHistoryDetails(row);
    this.GetBatchInfo(row);
  }
  onViewCancel() {
    this.isTransactionsView = false;
  }

  onViewScheduleCancel() {
    this.showVaccination = false;
  }

  // validation for chicks count
  onBirdLimitChange(value, row) {
    this.isEnableSave = false;
    if (this.selectedShed.CurrentChicksCount < row.value.AvailableChicksCount) {
      if (this.selectedShed.CurrentChicksCount < +value) {
        this.toastr.error("Birds count should not exceed shed capacity");
        this.isEnableSave = false;
      }
      else
        this.isEnableSave = true;
    } else {
      if (row.value.AvailableChicksCount < +value) {
        this.toastr.error("Birds count should not exceed shed capacity");
        this.isEnableSave = false;
      }
      else
        this.isEnableSave = true;
    }
  }
  checkValue(row) {
    this.rowData = row;
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to Make Active ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        var addUpdatebatchObj = {
          "Id": this.rowData.Id,
          "Name": this.rowData.Name,
          "FarmId": this.FarmInfo.FarmId,
          "ChicksCount": this.rowData.ChicksCount,
          "IsActive": true,
          "CreatedDate": this.rowData.CreatedDate,
          "CreatedByUserId": this.rowData.CreatedByUserId,
          "UpdatedDate": new Date(),
          "UpdatedByUserId": this.userData.Id,
          "HatcheryId": this.rowData.HatcheryId,
          "BatchStartDate": this.rowData.BatchStartDate,
          "Amount": this.rowData.Amount,
          "TransactionDate": this.rowData.TransactionDate
        }
        this.spinner.show();
        this._dataService.Post('FarmActivity/AddUpdateBatchInfo/', addUpdatebatchObj)
          .subscribe((Data) => {
            this.spinner.hide();
            if (Data.IsSuccess) {
              this.toastr.success(Data.EndUserMessage);
              this.getBatches();
            }
            else {
              this.toastr.error("An error has occured");
            }
          },
            (error) => {
              this.toastr.error("An error has occured");

            });
      }
    })
  }

  //Culling Type Data
  getDisposeTypes() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', DataFactory.ClassType.DisposedType).subscribe(data => {
      if (data.IsSuccess) {
        this.disposeTypes = (data.ListResult) == null ? [] : data.ListResult;
      }
      else {
        this.toastr.error("An Error has Occured")
      }
    }, (error) => {
      this.toastr.error("An Error has Occured")
    })
  }

  //  Change event for dispose type
  onSelectDisposeType(event) {
    if (event == DataFactory.IncomeTypes.Culling) {
      this.isCulling = true;
      this.isSale = false;
      this.addCulbirds.get('CostPerKg').setValidators([Validators.required]);
      this.addCulbirds.get('CostPerKg').updateValueAndValidity();
      this.addCulbirds.get('CostPerKg').setValue('');
      this.addCulbirds.get('TotalWeight').setValidators([Validators.required]);
      this.addCulbirds.get('TotalWeight').updateValueAndValidity();
      this.addCulbirds.get('TotalWeight').setValue('')
      this.addCulbirds.get('totalAmount').setValue('')
    }
    else {
      this.isCulling = false;
      this.isSale = true;
      this.addCulbirds.get('CostPerKg').setValidators([]);
      this.addCulbirds.get('CostPerKg').updateValueAndValidity();
      this.addCulbirds.get('CostPerKg').setValue('')
      this.addCulbirds.get('TotalWeight').setValidators([]);
      this.addCulbirds.get('TotalWeight').updateValueAndValidity();
      this.addCulbirds.get('TotalWeight').setValue('')
      this.addCulbirds.get('totalAmount').setValue('')
    }
  }

  // On Total Weight Change
  onTotalWeightChange(event) {
    this.addCulbirds.get('totalAmount').setValue(this.addCulbirds.value.CostPerKg * this.addCulbirds.value.TotalWeight)
  }

  // On Cost Change
  onCostChange(event) {
    if (this.addCulbirds.value.TotalWeight != null || this.addCulbirds.value.TotalWeight != '') {
      this.addCulbirds.get('totalAmount').setValue((this.addCulbirds.value.CostPerKg * (this.addCulbirds.value.TotalWeight)).toFixed(2))
    }
    else {
      this.addCulbirds.get('totalAmount').setValue('')
    }
  }

  onAddVaccinClick(row) {
    this.showVaccination = true;
    this.batchInfo = row;
    this.GetVaccineInfo();
  }

  onVaccinClick(row) {
    this.AddForm.reset({
      date: this.currentDate
    })
    this.isVaccine = true;
    this.vaccineSchedule = row;
  }

  onAddCancelClick() {
    this.isVaccine = false;
  }

  //get chick transactions by batchid
  GetVaccineInfo() {
    this.isEditBatchDetails = false;
    this._dataService.Get('FarmActivity/GetVaccinScheduleByBatchId', this.batchInfo.Id)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.batchInfoDetails = Data.Result == null ? [] : Data.Result.BatchDetails;
          this.vaccinataionDeatls = Data.Result == null ? [] : Data.Result.VaccineDetails;
          this.isVaccine = false;
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  onConfirmClick() {
    var req = {
      "Id": null,
      "FarmId": this.FarmInfo.FarmId,
      "BatchId": this.batchInfo.Id,
      "VaccinationId": this.vaccineSchedule.VaccinationId,
      "VaccinatedDate": this.AddForm.value.date,
      "IsActive": true,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateChickVaccination/', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.GetVaccineInfo();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  //Shed Type Data
  getShedTypes() {
    this.spinner.show();
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', DataFactory.ClassType.ShedType).subscribe(data => {
      this.spinner.hide();
      if (data.IsSuccess) {
        this.shedTypes = (data.ListResult) == null ? [] : data.ListResult;
      }
      else {
        this.toastr.error("An Error has Occured")
      }
    }, (error) => {
      this.toastr.error("An Error has Occured")
    })
  }

  // validation for chicks count
  onChange(value) {
    var shedChicksCount = 0;
    var ChicksCountarr = [];
    for (let i = 0; i < this.addShedForm.value.items.length; i++) {
      if (this.addShedForm.value.items[i].ChicksCount != '')
        ChicksCountarr.push(this.addShedForm.value.items[i].ChicksCount);
      //shedChicksCount=shedChicksCount+parseInt(this.addChickForm.value.items[i].ChicksCount);
    }
    for (let i = 0; i < ChicksCountarr.length; i++) {
      shedChicksCount = shedChicksCount + parseInt(ChicksCountarr[i]);
    }

    if (this.addBatchDetails.value.chickCount == shedChicksCount) {
      this.isEnableShedSave = true;
    }
    else {
      this.isEnableShedSave = false;
    }
    if (this.addBatchDetails.value.chickCount < shedChicksCount) {
      this.toastr.error("Sum of Shed Chicks should be equal to batch Chicks");

    }


  }
  //TOGGLE FILTER
  toggleFilter = function () {
    this.table.reset();
    this.isFiltersEnabled = !this.isFiltersEnabled;
    if (this.isFiltersEnabled)
      this.filterTooltip = "Disable Filters";
    else {
      this.filterTooltip = "Enable Filters";
    }
  };
  toggle = function () {
    this.table1.reset();
    this.isFiltersEnable = !this.isFiltersEnable;
    if (this.isFiltersEnable)
      this.Tooltip = "Disable Filters";
    else {
      this.Tooltip = "Enable Filters";
    }
  };

  addBatchData(row) {
    debugger
    this.isAddingBatchData = true;
    this.addRowData = row;
    this.addingBatchData.get('transactionDate').setValue(this.currentDate);
    this.getAddShedDetails();
  }

  onSaveAddBatchData() {
    var ShedData = [];
    var ss = [];
    for (var i = 0; i < this.addShedDataForm.value.items.length; i++) {

      ShedData.push(this.addShedDataForm.value.items[i])

    }

    for (var i = 0; i < ShedData.length; i++) {
      ss.push(
        {
          "Id": 0,
          "BatchId": this.addRowData.Id,
          "ShedId": this.AddShedData[i].ShedId,
          "ChicksCount": ShedData[i].ChicksCount,
          "TransitionDate": this.addingBatchData.value.transactionDate,
          "IsActive": true,
          "CreatedByUserId": this.userData.Id,
          "CreatedDate": new Date(),
          "UpdatedByUserId": this.userData.Id,
          "UpdatedDate": new Date(),
          "FromShedId": null
        }
      )
    }
    var req = {
      "Amount": this.addingBatchData.value.amount,
      "BirdsCount": this.addingBatchData.value.ChicksCount,
      "FarmId": this.FarmInfo.FarmId,
      "chickTransaction": ss
    }
    this.spinner.show();
    this._dataService.Post('Transitions/AddBirdstoBatch', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.clicked = false;
        if (Data.IsSuccess) {
          this.isAddingBatchData = false;
          this.isEnableAddingShedSave = false;
          this.addingBatchData.get('amount').setValue(null);
          this.addingBatchData.get('ChicksCount').setValue(null);
          this.toastr.success(Data.EndUserMessage);
          this.getBatches();
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  onCancleAddingBatchData() {
    this.isAddingBatchData = false;
    this.addingBatchData.get('amount').setValue(null);
    this.addingBatchData.get('ChicksCount').setValue(null);
    this.addRowData = {};
    this.isEnableAddingShedSave = false;
  }


  getAddShedDetails() {
    while (this.addShedDataForm.controls['items'].length !== 0) {
      this.addShedDataForm.controls['items'].removeAt(0)
    }
    var req = {
      "ShedId": 0,
      "ShedTypeId": this.addRowData.ShedTypeId,
      "FarmId": this.FarmInfo.FarmId,
      "BatchId": this.addRowData.Id,
      "TransitionDate": this.addingBatchData.value.transactionDate
    }
    this.AddShedData = [];
    this.spinner.show()
    this._dataService.Post('Transitions/GetShedInfoByShedTypeId', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.AddShedData = Data.ListResult;
          if (this.AddShedData.length > 0) {
            this.isAddShedDetails = true;
          }
          else {
            this.isAddShedDetails = false;
          }
          for (var i = 0; i < this.AddShedData.length; i++) {
            (this.addShedDataForm.controls['items'] as FormArray).push(this.createShedItem(this.AddShedData[i]));
          }
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }

  // validation for chicks count
  onChicksChange(value) {
    var shedChicksCount = 0;
    var ChicksCountarr = [];
    for (let i = 0; i < this.addShedDataForm.value.items.length; i++) {
      if (this.addShedDataForm.value.items[i].ChicksCount != '')
        ChicksCountarr.push(this.addShedDataForm.value.items[i].ChicksCount);
      //shedChicksCount=shedChicksCount+parseInt(this.addChickForm.value.items[i].ChicksCount);
    }
    for (let i = 0; i < ChicksCountarr.length; i++) {
      shedChicksCount = shedChicksCount + parseInt(ChicksCountarr[i]);
    }

    if (this.addingBatchData.value.ChicksCount == shedChicksCount) {
      this.isEnableAddingShedSave = true;
    }
    else {
      this.isEnableAddingShedSave = false;
    }
    if (this.addingBatchData.value.ChicksCount < shedChicksCount) {
      this.toastr.error("Sum of Shed Chicks should be equal to batch Chicks");

    }
  }

  onChangeDate() {
    this.getAddShedDetails();
  }

  getBatchHistoryDetails(row) {
    debugger
    this.batchHistoryDetails = [];
    this.spinner.show();
    this._dataService.GetAll('Transitions/GetBatchHistoryDetailsByBatchId/' + row.Id)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.batchHistoryDetails = Data.ListResult == null ? [] : Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        })
  }
}