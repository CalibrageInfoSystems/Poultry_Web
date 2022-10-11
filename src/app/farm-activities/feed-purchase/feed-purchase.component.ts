import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DataFactory } from 'src/app/shared/dataFactory';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { FeedTransactionDialogComponent } from '../feed-transaction-dialog/feed-transaction-dialog.component';
import { ViewTransactionsDialogComponent } from '../view-transactions-dialog/view-transactions-dialog.component';
import * as moment from "moment";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-feed-purchase',
  templateUrl: './feed-purchase.component.html',
  styleUrls: ['./feed-purchase.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeedPurchaseComponent implements OnInit {
  clicked :boolean = false;
  @ViewChild('FD') private table;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  paymentTerms: any[] = [];
  UOMs = DataFactory.UOMs
  totalOutstandingAmount: any[] = []
  totalPaidAmount: any[] = []
  FROMDATE: Date;
  selectedDate: Date;
  fromDate: Date;
  FromDate: any;
  ToDate: any;
  existingFeedPurchase: any[] = [];
  rowData: any;
  req: any;
  Filter: any;
  totalFeedData: any = [];
  totalBrokerData: any = [];
  // feedPurchaseList: any[]; 
  feedPurchaseList: any = [];
  farmsList: any[];
  shedList: any[];
  isDataLoading: boolean = false;
  isAddFeedPurchase: boolean = false;
  isEditFeedPurchase: boolean = false;
  Id: any;
  LookUpTypeId: any;
  LookupData: any = [];
  FeedPurchaseRegisterData: any = [];
  AddfeedPurchaseList: any;
  AddfeedPurchaseForm: FormGroup;
  editfeedPurchaseForm: FormGroup;
  feedPurchaseFilterForm: FormGroup;


  AddMPfeedPurchaseForm: FormGroup;
  editMPfeedPurchaseForm: FormGroup;

  userData: any;
  ActivityRights: any = [];
  curDate = new Date();
  date = new Date();
  LookUp = DataFactory.LookUp;
  formDate: any;
  finalreq: any[];
  selectedFarm: any;
  paymentStatus: any;
  enteredRate: any;
  enteredWeight: any
  billAmount: any;
  TotalAmount: any;
  freightValue: any;
  ClassType = DataFactory.ClassType;
  PaymentAmounts = DataFactory.PaymentAmounts;
  PaymentStatus = DataFactory.PaymentStatus;
  paymentStatusList: any[] = [];
  collectionCounts: any;
  paymentTypes: any[] = [];
  paidAmount: any;
  outstandingAmount: any;
  additonalExpesess: any;
  checked: boolean = true;
  ConsiderFreight: boolean;
  UOMTypes: any[] = []
  differenceAmount: any;
  selectedUOM: any;
  enteredGST: any;
  finalAmount: any;
  gstCost: any
  editGstCost: number;
  paymentSummary: any;
  totalOutstandingSummaryAmount: any = 0;
  namesList: any[] = [];
  townsList: any[] = [];
  isAddMPFeedPurchase: boolean = false;
  totalAmount: any;
  MPtotalFeedData: any[] = [];
  isEditMPFeedPurchase: boolean = false;
  dueDate: any;
  feedTypes: any[] = [];
  images = [];
  image: any = null;
  base64: any = null;
  BASE64_MARKER: string = ';base64,';
  fileExtension: string;
  fileName: string;
  image1: any = null;
  base641: any = null;
  BASE64_MARKER1: string = ';base64,';
  fileExtension1: string;
  fileName1: string;
  isValidFile: Boolean = true;
  allowedImgExtensions = DataFactory.AllowedImgExtensions.Extensions;
  maxFileSize = DataFactory.AllowedImgExtensions.MaxFileSize;
  modal: HTMLElement;
  modalImg: HTMLElement;
  AReceivedDate: Date;
  @ViewChild("myInput") myInputVariable: ElementRef;
  @ViewChild("myInputEdit") myInputVariableEdit: ElementRef;
  @ViewChild("myMPInput") myInputMPVariable: ElementRef;
  @ViewChild("myMPInputEdit") myInputMPVariableEdit: ElementRef;
  selectedPaymentMothod: any;
  selectedPaymentType: any[];
  currentDate: Date;
  currentFY: number;
  finacialDayMonth: any;
  constructor(public dialog: MatDialog, private _dataService: DataService, private toastr: ToastrService, 
    private fb: FormBuilder,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.AddfeedPurchaseForm = fb.group({
      feedType: [''],
      brokerName: ['', Validators.required],
      Cost: ['', Validators.required],
      Weight: ['', Validators.required],
      Name: ['', Validators.required],
      Town: ['', Validators.required],
      BillDate: [''],
      lorryNumber: [''],
      Freight: [''],
      // ChequeNumber: [''],
      // ChequeDate: [''],
      paymentType: ['', Validators.required],
      remarks: [''],
      totalAmount: [''],
      billAmount: [''],
      invoiceNumber: [''],
      receivedDate: [''],
      AdditionalExpenses: [''],
      ConsiderFreight: [true],
      UOMType: ['', Validators.required],
      Gst: [''],
      finalAmount: ['', Validators.required],
      DueDate: [''],
      uploadInvoice: ['']
    });
    this.editfeedPurchaseForm = fb.group({
      feedType: [''],
      brokerName: ['', Validators.required],
      Cost: ['', Validators.required],
      Weight: [null, [Validators.required]],
      Name: ['', Validators.required],
      Town: ['', Validators.required],
      BillDate: [''],
      lorryNumber: [''],
      Freight: [''],
      // ChequeNumber: [''],
      // ChequeDate: [''],
      paymentType: ['', Validators.required],
      remarks: [''],
      totalAmount: [''],
      billAmount: [''],
      invoiceNumber: [''],
      receivedDate: [''],
      AdditionalExpenses: [''],
      ConsiderFreight: [true],
      UOMType: ['', Validators.required],
      Gst: [''],
      finalAmount: ['', Validators.required],
      DueDate: [''],
      uploadInvoice: ['']
    });
    this.feedPurchaseFilterForm = fb.group({
      feed: ['', Validators.required],
      fromDate: [this.FROMDATE],
      toDate: [this.ToDate],
      paymentStatusType: ['']
    });

    this.AddMPfeedPurchaseForm = fb.group({
      feedType: [''],
      receivedDate: ['', Validators.required],
      BillDate: [''],
      invoiceNumber: [''],
      vechileNumber: [''],
      medicineName: ['', Validators.required],
      Name: [''],
      Town: [''],
      DueDate: [''],
      rate: [''],
      Freight: [''],
      billAmount: ['', Validators.required],
      netAmount: ['', Validators.required],
      totalAmount: [''],
      uploadInvoice: []
    });
    this.editMPfeedPurchaseForm = fb.group({
      feedType: [''],
      receivedDate: ['', Validators.required],
      BillDate: [''],
      invoiceNumber: [''],
      vechileNumber: [''],
      medicineName: ['', Validators.required],
      Name: [''],
      Town: [''],
      DueDate: [''],
      rate: [''],
      Freight: [''],
      billAmount: ['', Validators.required],
      netAmount: ['', Validators.required],
      totalAmount: [''],
      uploadInvoice: []
    });
  }


  ngOnInit() {
    this.GetLookUpData();
    this.getPaymentStatus();
    this.getPaymentTypes();
    this.selectedDate = new Date();
    this.date = new Date();
    this.ToDate = new Date();
    this.currentDate = new Date();
    this.currentFY = this.currentDate.getMonth() + 1 > 3 ? this.currentDate.getFullYear() : +(this.currentDate.getFullYear() - 1);
    this.finacialDayMonth = "04/01/" + this.currentFY
    this.FROMDATE = new Date(this.finacialDayMonth);
    this.GetBrokersList();
    // this.GetPaymentStatus();
    this.GetUOMTypes()
  }
  //Get visit log data
  GetLookUpData(): void {
    this.isDataLoading = true;
    this.spinner.show();
    this._dataService.GetAll('FarmActivity/GetLookUpData' + '/' + this.Id + '/' + this.LookUpTypeId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.LookupData = Data.ListResult;
          this.isDataLoading = false;
          //feedDropDown
          var data = this.LookupData.filter(task => task.LookUpTypeId === this.LookUp.FeedTypes);
          this.feedTypes = data;
          this.totalFeedData = data.filter(x => x.NAME != "Medicines" && x.NAME != "Proteins");
          this.MPtotalFeedData = data.filter(x => x.NAME == "Medicines" || x.NAME == "Proteins");

        } else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        })
  }
  //Get Broker Details
  GetBrokersList() {
    this.isDataLoading = true;
    var BrokerId: null;
    this._dataService.Get('CompanyInfo/GetBrokerDetails', BrokerId)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.isDataLoading = false;
          //BrokerDropdown
          this.totalBrokerData = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  //Payment Types
  getPaymentStatus() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', DataFactory.ClassType.PaymentStatus)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.paymentStatus = Data.ListResult;
          this.selectedPaymentType = this.paymentStatus[0].TypeCdId;
          this.GetFeedPurchaseDetails();
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }

  // onSearch(){
  //   this.finalreq=[];
  //   var req = {
  //     "FeedTypeId": this.feedPurchaseFilterForm.value.feed,
  //     "FromDate": this.feedPurchaseFilterForm.value.FROMDATE,
  //     "ToDate": this.feedPurchaseFilterForm.value.ToDate,
  //     "FarmId":this.selectedFarm.FarmId
  //   }
  //   this._dataService.Post('FarmActivity/GetFeedPurchaseDetails/', req)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.feedPurchaseList = Data.Result;

  //         for(var i=0;i<this.feedPurchaseList.feedTypes.length;i++){
  //           var req={
  //             Id:this.feedPurchaseList.feedTypes[i].Id,
  //             LookUpTypeId:this.feedPurchaseList.feedTypes[i].LookUpTypeId,
  //             Name:this.feedPurchaseList.feedTypes[i].Name,
  //             Remarks:this.feedPurchaseList.feedTypes[i].Remarks,
  //             transactions:[]
  //           }
  //           req.transactions = this.feedPurchaseList.feedPurchaseDetails.filter(x => x.FeedTypeId == this.feedPurchaseList.feedTypes[i].Id);
  //           this.finalreq.push(req);  
  //         }
  //       }
  //       else{
  //         this.toastr.error("An error has occured");
  //       }
  //     },(error)=>{
  //       this.toastr.error("An error has occured");
  //     })
  // }

  onClearSearch() {
    // this.date=new Date();
    // this.feedPurchaseFilterForm.value.FROMDATE=this.FROMDATE;
    this.feedPurchaseFilterForm.reset();
    this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE = new Date(this.finacialDayMonth);
    this.GetFeedPurchaseDetails();
  }
  onChange(selectedPaymentStatusType)
  {
    this.selectedPaymentType=selectedPaymentStatusType
  }
  //Get Feed Data
  GetFeedPurchaseDetails(): void {
    this.finalreq = [];
    this.spinner.show();
    var req = {
      "FeedTypeId": this.feedPurchaseFilterForm.value.feed,
      "PaymentStatusId":this.selectedPaymentType,
      "FromDate": this.FROMDATE,
      "ToDate": this.selectedDate,
      "FarmId": this.selectedFarm.FarmId,
    }
    console.log(JSON.stringify(req))
    this.isDataLoading = true;
    this._dataService.Post('FarmActivity/GetFeedPurchaseDetails', req)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.feedPurchaseList = Data.Result;
          for (var i = 0; i < this.feedPurchaseList.feedTypes.length; i++) {
            var req = {
              Id: this.feedPurchaseList.feedTypes[i].Id,
              LookUpTypeId: this.feedPurchaseList.feedTypes[i].LookUpTypeId,
              Name: this.feedPurchaseList.feedTypes[i].Name,
              Remarks: this.feedPurchaseList.feedTypes[i].Remarks,
              transactions: []
            }
            req.transactions = this.feedPurchaseList.feedPurchaseDetails.filter(x => x.FeedTypeId == this.feedPurchaseList.feedTypes[i].Id);
            this.finalreq.push(req);
            let sump: number = 0;
            let sumo: number = 0;
            this.totalPaidAmount = this.feedPurchaseList.feedPurchaseDetails == null ? 0 : this.feedPurchaseList.feedPurchaseDetails.filter(
              pament => pament.PaymentStatusId === this.PaymentAmounts.PaidAmount)
            this.totalPaidAmount.forEach(a => sump += a.FinalAmount);
            this.paidAmount = Math.round(sump).toFixed(2)
            this.totalOutstandingAmount = this.feedPurchaseList.feedPurchaseDetails == null ? 0 : this.feedPurchaseList.feedPurchaseDetails.filter(
              pament => pament.PaymentStatusId === this.PaymentAmounts.OutstandingAmount);
            this.totalOutstandingAmount.forEach(a => sumo += a.DueAmount);
            this.outstandingAmount = Math.round(sumo).toFixed(2)
          }
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  Search = function () {
    this.GetFeedPurchaseDetails();
  }
  ChangeFromDate(fromDate) {
    this.FROMDATE = fromDate;
  }
  ChangeToDate(toDate) {
    this.ToDate = toDate;
  }
  // IsEnableSearch(){
  //   if(this.FromDate!=null && this.ToDate!=null){
  //     return false;
  //   }
  //   else{
  //     return true;
  //   }

  // }
  onStatusClick() {
    this.spinner.show();
    this._dataService.GetAll('FarmActivity/GetFeedSummary/'+ DataFactory.PaymentStatus.Outstanding+'/'+this.selectedFarm.FarmId)
      .subscribe((Data) => {
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.paymentSummary = Data.ListResult;
          this.totalOutstandingSummaryAmount = 0;
          if (this.paymentSummary != null && this.paymentSummary.length > 0) {
            for (var i = 0, len = this.paymentSummary.length; i < len; i++) {
              this.totalOutstandingSummaryAmount += this.paymentSummary[i].DueAmount;  // Iterate over your first array and then grab the second element add the values up
            }
          }
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }
  //Add Feed Purchase
  AddUpdateFeedPurchase() {
    this.isDataLoading = true;
    var req = {
      "Id": null,
      "FarmId": this.selectedFarm.FarmId,
      "BrokerId": this.AddfeedPurchaseForm.value.brokerName,
      "Cost": this.AddfeedPurchaseForm.value.Cost,
      "Weight": this.AddfeedPurchaseForm.value.Weight,
      "Name": this.AddfeedPurchaseForm.value.Name,
      "Town": this.AddfeedPurchaseForm.value.Town,
      "BillDate": this.AddfeedPurchaseForm.value.BillDate,
      "LorryNumber": this.AddfeedPurchaseForm.value.lorryNumber,
      "Freight": this.AddfeedPurchaseForm.value.Freight,
      "ChequeNumber": null, // this.AddfeedPurchaseForm.value.ChequeNumber,
      "ChequeDate": null, //this.AddfeedPurchaseForm.value.ChequeDate,
      "IsActive": true,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FeedTypeId": this.AddfeedPurchaseForm.value.feedType,
      "PaymentTypeId": this.AddfeedPurchaseForm.value.paymentType,
      "Remarks": this.AddfeedPurchaseForm.value.remarks,
      "PaymentStatusId": this.PaymentAmounts.OutstandingAmount,
      "TotalAmounts": this.AddfeedPurchaseForm.value.totalAmount,
      "BillAmounts": this.AddfeedPurchaseForm.value.billAmount,
      "Receiveddate": this.AddfeedPurchaseForm.value.receivedDate,
      "InvoiceNumber": this.AddfeedPurchaseForm.value.invoiceNumber,
      "AdditionalAxpenses": this.AddfeedPurchaseForm.value.AdditionalExpenses,
      "ConsiderFreight": this.checked,
      "UOMTypeId": this.AddfeedPurchaseForm.value.UOMType,
      "DifferenceAmount": null,
      "FinalAmount": this.AddfeedPurchaseForm.value.finalAmount,
      "GST": this.AddfeedPurchaseForm.value.Gst,
      "DueDate": this.AddfeedPurchaseForm.value.DueDate,
      "FileName": this.base64,
      "FileLocation": null,
      "FileExtension": this.fileExtension,
    }
this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateFeedPurchase', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.clicked = false;
        this.isDataLoading = false;
        if (Data.IsSuccess) {
          this.isAddFeedPurchase = false;
          this.myInputVariable.nativeElement.value = "";
          this.image = null;
          this.req = [];
          this.toastr.success("Feed Purchase Details Added Successfully");
          this.AddfeedPurchaseForm.reset();
          this.GetFeedPurchaseDetails();
          this.additonalExpesess = 0
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }
  onUpdateFeeedPurchase() {
    var req = {
      "Id": this.rowData.Id,
      "FarmId": this.selectedFarm.FarmId,
      "BrokerId": this.rowData.BrokerId,
      "Cost": this.rowData.Cost,
      "Weight": this.rowData.Weight,
      "Name": this.rowData.Name,
      "Town": this.rowData.Town,
      "BillDate": this.rowData.BillDate,
      "LorryNumber": this.rowData.LorryNumber,
      "Freight": this.rowData.Freight,
      "ChequeNumber": this.rowData.ChequeNumber,
      "ChequeDate": this.rowData.ChequeDate,
      "IsActive": this.rowData.IsActive,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate": this.rowData.CreatedDate,//this.rowData.CreatedDate ,
      "UpdatedByUserId": this.userData.Id,//this.rowData.UpdatedByUserId ,
      "UpdatedDate": new Date(),//this.rowData.UpdatedDate ,
      "FeedTypeId": this.rowData.FeedTypeId,
      "PaymentTypeId": this.rowData.PaymentTypeId,
      "Remarks": this.rowData.Remarks,
      "PaymentStatusId": this.rowData.PaymentStatusId,
      "TotalAmounts": this.rowData.TotalAmounts,
      "BillAmounts": this.rowData.BillAmounts,
      "Receiveddate": this.rowData.Receiveddate,
      "InvoiceNumber": this.rowData.InvoiceNumber,
      "AdditionalAxpenses": this.rowData.AdditionalAxpenses,
      "ConsiderFreight": this.rowData.ConsiderFreight,
      "UOMTypeId": this.rowData.UOMTypeId,
      "DifferenceAmount": this.rowData.DifferenceAmount,
      "FinalAmount": this.rowData.FinalAmount,
      "GST": this.rowData.GST,
      "DueDate": this.rowData.DueDate,
      "FileName": this.fileExtension == null ? this.rowData.FileName : this.base64,
      "FileLocation": this.fileExtension == null ? this.rowData.FileLocation : null,
      "FileExtension": this.fileExtension == null ? this.rowData.FileExtension : this.fileExtension,
    }
    this.isDataLoading = true;
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateFeedPurchase', req)
      .subscribe((Data) => {
        this.isDataLoading = false;
        this.clicked = false;
        this.spinner.hide();
        if (Data.IsSuccess) {
          this.toastr.success("Feed Purchase Details Updated Successfully");
          this.editfeedPurchaseForm.reset();
          this.myInputVariableEdit.nativeElement.value = "";
          this.isEditFeedPurchase = false;
          this.GetFeedPurchaseDetails();
          this.rowData.AdditionalAxpenses=0
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }


  onAddFeedPurchaseClick() {
    this.isAddFeedPurchase = true;
    this.finalAmount = 0;
    this.base64 = null;
    this.fileExtension = null;
    this.getPaymentTerms();
    this.townsList = [];
    this.namesList = [];
    this.TotalAmount = 0;
    this.additonalExpesess = 0;
  }
  onCancleFeeedPurchaseAdd() {
    this.AddfeedPurchaseForm.reset();
    this.TotalAmount = 0;
    this.finalAmount = 0;
    this.isAddFeedPurchase = false;
    this.myInputVariable.nativeElement.value = "";
    this.image = null;
    this.additonalExpesess = 0;
  }
  onEditFeedPurchaseClick(row) {
    this.image = null;
    this.base64 = null;
    this.fileExtension = null;
    this.image1 = null;
    this.base641 = null;
    this.fileExtension1 = null;
    this.getPaymentTerms();
    this.townsList = [];
    this.namesList = [];
    this.getPaymentTypes()
    if (row.FeedType != "Medicines" && row.FeedType != "Proteins") {
      this.isEditFeedPurchase = true;
      this.rowData = row;
    } else {
      this.isEditMPFeedPurchase = true;
      this.rowData = row;
    }
this.rowData.AdditionalAxpenses=0
    //this.onEditCheckedChange(this.rowData.ConsiderFreight)
  }
  onCancleFeeedPurchaseEdit() {
    this.isEditFeedPurchase = false;
    this.feedPurchaseList = this.existingFeedPurchase.map(x => Object.assign({}, x));
    this.myInputVariableEdit.nativeElement.value = "";
    this.rowData.AdditionalAxpenses=0
  }
  onDeleteFeedPurchaseClick(row) {
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
          "UpdatedDate": new Date(),//this.rowData.UpdatedDate ,

        }
        this.spinner.show();
        this._dataService.Post('FarmActivity/DeleteFeedPurchase', req)
          .subscribe((Data) => {
            this.spinner.hide();
            if (Data.IsSuccess) {
              this.toastr.success(Data.EndUserMessage);
              this.GetFeedPurchaseDetails();
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
  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    var exportreq = {
      FromDate: this.FROMDATE,
      ToDate: this.ToDate,
      FarmName: this.selectedFarm.FarmName,
      feedTypes: this.feedPurchaseList.feedTypes,
      feedPurchaseDetails: this.feedPurchaseList.feedPurchaseDetails,
    }
    this._dataService.Post('FarmActivity/ExportFeedReg/', exportreq).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Feed-Purchase.xlsx";
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

  onDateChange(item) {
    this.FROMDATE = item.value;
  }
  onGstChange(searchValue) {
    this.enteredGST = +searchValue
    this.TotalAmount = 0
    this.finalAmount = 0

    this.enteredRate = this.enteredRate == null ? 0 : this.enteredRate
    this.enteredWeight = this.enteredWeight == null ? 0 : this.enteredWeight
    this.freightValue = this.freightValue == null ? 0 : this.freightValue
    this.additonalExpesess = this.additonalExpesess == null ? 0 : this.additonalExpesess
    this.gstCost = this.gstCost == null ? 0 : this.gstCost
    if (this.selectedUOM == this.UOMs.Units) {
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess);
      this.finalAmount = Math.round(this.TotalAmount + this.freightValue).toFixed(2);
    }
    else {
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess);
      this.finalAmount = Math.round(this.TotalAmount + this.freightValue).toFixed(2);
    }
  }
  onRateChange(searchValue) {
    this.enteredRate = +searchValue;
    this.TotalAmount = 0;
    this.finalAmount = 0;
    this.enteredRate = this.enteredRate == null ? 0 : this.enteredRate;
    this.enteredWeight = this.enteredWeight == null ? 0 : this.enteredWeight;
    this.freightValue = this.freightValue == null ? 0 : this.freightValue;
    this.additonalExpesess = this.additonalExpesess == null ? 0 : this.additonalExpesess;
    this.gstCost = this.gstCost == null ? 0 : this.gstCost;
    this.enteredGST = this.enteredGST == null ? 0 : this.enteredGST
    if (this.selectedUOM == this.UOMs.Units) {
      // this.billAmount = this.enteredRate * this.enteredWeight
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess);
      this.finalAmount = Math.round(this.TotalAmount + this.freightValue).toFixed(2);
      // this.TotalAmount = this.billAmount- this.freightValue + this.additonalExpesess - this.differenceAmount

    }
    else {
      //this.billAmount = this.billAmount==null?0: this.billAmount
      // this.enteredWeight= this.billAmount/this.enteredRate*1000
      // this.enteredWeight=Math.round(1000/this.enteredRate) 
      // this.TotalAmount = this.enteredRate*this.enteredWeight/1000
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess);
      this.finalAmount = Math.round(this.TotalAmount + this.freightValue).toFixed(2);
    }
  }
  onWeightChange(searchValue) {
    this.enteredWeight = +searchValue;
    this.TotalAmount = 0;
    this.finalAmount = 0;
    this.enteredRate = this.enteredRate == null ? 0 : this.enteredRate;
    this.enteredWeight = this.enteredWeight == null ? 0 : this.enteredWeight;
    this.freightValue = this.freightValue == null ? 0 : this.freightValue;
    this.additonalExpesess = this.additonalExpesess == null ? 0 : this.additonalExpesess;
    this.gstCost = this.gstCost == null ? 0 : this.gstCost;
    if (this.selectedUOM == this.UOMs.Units) {
      // this.billAmount = this.enteredRate * this.enteredWeight;
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess);
      this.finalAmount = Math.round(this.TotalAmount + this.freightValue).toFixed(2);
    }
    else {
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess).toFixed(2)
      this.finalAmount = Math.round(this.TotalAmount + this.freightValue).toFixed(2);
    }
  }
  // onbillChange(searchValue)
  // {
  //   this.enteredWeight= 0;
  //   this.TotalAmount= 0;
  //   this.billAmount= +searchValue;
  //   if(this.selectedUOM==this.UOMs.Units)
  //   {
  //     this.TotalAmount = 0;
  //     this.enteredRate = this.enteredRate==null?0: this.enteredRate;
  //     this.enteredWeight = this.enteredWeight==null?0: this.enteredWeight;
  //     this.billAmount = this.enteredRate * this.enteredWeight;
  //     this.TotalAmount = Math.round(this.billAmount).toFixed(2);
  //     //this.TotalAmount = this.billAmount - this.freightValue + this.additonalExpesess - this.differenceAmount

  //   }
  //   else
  //   {
  //   this.enteredRate = this.enteredRate==null?0: this.enteredRate;
  //   this.freightValue = this.freightValue==null?0: this.freightValue;
  //   this.additonalExpesess = this.additonalExpesess==null?0: this.additonalExpesess;
  //   this.enteredWeight = Math.round(this.billAmount/this.enteredRate*1000) ;
  //   this.TotalAmount = Math.round(this.billAmount - this.freightValue + this.additonalExpesess - this.differenceAmount).toFixed(2);
  //   }
  // }
  onFreightChange(event) {
    this.TotalAmount = 0
    this.finalAmount = 0
    this.freightValue = +event;
    this.enteredRate = this.enteredRate == null ? 0 : this.enteredRate;
    this.enteredWeight = this.enteredWeight == null ? 0 : this.enteredWeight;
    this.freightValue = this.freightValue == null ? 0 : this.freightValue;
    this.additonalExpesess = this.additonalExpesess == null ? 0 : this.additonalExpesess;
    this.enteredGST = this.enteredGST == null ? 0 : this.enteredGST;
    this.gstCost = this.gstCost == null ? 0 : this.gstCost;
    if (this.selectedUOM == this.UOMs.Units) {
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess).toFixed(2);
      this.finalAmount = Math.round(+this.TotalAmount + this.freightValue).toFixed(2);
    }
    else {
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess).toFixed(2);
      this.finalAmount = Math.round(+this.TotalAmount + this.freightValue).toFixed(2)
    }
  }
  onAdditionalExpensesChange(searchValue) {
    this.additonalExpesess = +searchValue;
    this.TotalAmount = 0;
    this.finalAmount = 0;
    this.enteredRate = this.enteredRate == null ? 0 : this.enteredRate;
    this.enteredWeight = this.enteredWeight == null ? 0 : this.enteredWeight;
    //this.billAmount = this.billAmount==null?0: this.billAmount;
    this.freightValue = this.freightValue == null ? 0 : this.freightValue;
    this.additonalExpesess = this.additonalExpesess == null ? 0 : this.additonalExpesess;
    this.gstCost = this.gstCost == null ? 0 : this.gstCost;
    this.TotalAmount = this.TotalAmount == null ? 0 : this.TotalAmount;
    this.finalAmount = this.finalAmount == null ? 0 : this.finalAmount;

    if (this.selectedUOM == this.UOMs.Units) {
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess).toFixed(2);
      this.finalAmount = Math.round(+this.TotalAmount + this.freightValue).toFixed(2);
    }
    else {
      this.gstCost = (this.enteredRate * this.enteredWeight) * (this.enteredGST / 100);
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - (this.checked ? this.freightValue : 0) + this.additonalExpesess).toFixed(2);
      this.finalAmount = Math.round(+this.TotalAmount + this.freightValue).toFixed(2);
    }
  }
  // onDifferenceAmountChange(searchValue){
  // this.differenceAmount = +searchValue;
  // this.billAmount = this.billAmount==null?0: this.billAmount;
  //     this.freightValue = this.freightValue==null?0: this.freightValue;
  //     this.additonalExpesess = this.additonalExpesess==null?0: this.additonalExpesess;
  //     this.differenceAmount = this.differenceAmount==null?0: this.differenceAmount;
  //     this.TotalAmount = this.TotalAmount==null?0: this.TotalAmount;
  //     if( this.selectedUOM==this.UOMs.Units)
  //     {
  //       this.enteredRate = this.enteredRate==null?0: this.enteredRate;
  //     this.enteredWeight = this.enteredWeight==null?0: this.enteredWeight;
  //     this.billAmount = this.enteredRate * this.enteredWeight;
  //     this.TotalAmount = Math.round(this.billAmount -  this.freightValue + this.additonalExpesess - this.differenceAmount).toFixed(2);     
  //     }
  //     else
  //     {
  //       this.TotalAmount = Math.round(this.billAmount -  this.freightValue + this.additonalExpesess - this.differenceAmount).toFixed(2);
  //     }

  // }
  onEditGstChange(searchValue) {
    this.rowData.GST = +(searchValue == "" ? 0 : searchValue);
    this.rowData.Cost = this.rowData.Cost == null ? 0 : this.rowData.Cost;
    this.rowData.Weight = this.rowData.Weight == null ? 0 : this.rowData.Weight;
    this.rowData.TotalAmounts = 0;
    this.rowData.FinalAmount = 0;
    // this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
    // this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
    if (this.selectedUOM == this.UOMs.Units) {
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(+this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2);
      //this.rowData.TotalAmounts = this.rowData.BillAmounts - this.rowData.Freight + this.rowData.AdditionalAxpenses - this.rowData.DifferenceAmount
    }
    else {
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(+this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
      //  this.rowData.BillAmounts = this.rowData.BillAmounts==null?0: this.rowData.BillAmounts
      //  this.rowData.Weight = this.rowData.BillAmounts/this.rowData.Cost*1000 
      //  this.rowData.Weight =Math.round(this.rowData.Weight)
    }
  }
  onEditRateChange(searchValue) {
    this.rowData.Cost = +(searchValue == "" ? 0 : searchValue);
    this.rowData.TotalAmounts = 0;
    this.rowData.FinalAmount = 0;
    this.rowData.Cost = this.rowData.Cost == null ? 0 : this.rowData.Cost;
    this.rowData.Weight = this.rowData.Weight == null ? 0 : this.rowData.Weight;
    if (this.selectedUOM == this.UOMs.Units) {
      // this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
      //this.rowData.TotalAmounts = this.rowData.BillAmounts - this.rowData.Freight + this.rowData.AdditionalAxpenses - this.rowData.DifferenceAmount
    }
    else {
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
      //  this.rowData.BillAmounts = this.rowData.BillAmounts==null?0: this.rowData.BillAmounts
      //  this.rowData.Weight = this.rowData.BillAmounts/this.rowData.Cost*1000 
      //  this.rowData.Weight =Math.round(this.rowData.Weight)
    }

  }
  onEditWeightChange(searchValue) {
    this.rowData.Weight = +(searchValue == "" ? 0 : searchValue);
    this.rowData.TotalAmounts = 0;
    this.rowData.FinalAmount = 0;
    this.rowData.Cost = this.rowData.Cost == null ? 0 : this.rowData.Cost;
    this.rowData.Weight = this.rowData.Weight == null ? 0 : this.rowData.Weight;
    if (this.selectedUOM == this.UOMs.Units) {
      // this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
      //this.rowData.TotalAmounts = this.rowData.BillAmounts - this.rowData.Freight + this.rowData.AdditionalAxpenses - this.rowData.DifferenceAmount
    }
    else {
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
    }

  }
  // onEditbillChange(searchValue)
  // {
  //   this.rowData.BillAmounts = +searchValue;
  //   this.rowData.TotalAmounts=0;
  //     this.rowData.Cost = this.rowData.Cost==null?0: this.rowData.Cost;
  //     this.rowData.Weight = this.rowData.Weight==null?0: this.rowData.Weight;
  //     this.rowData.Freight = this.rowData.Freight==null?0: this.rowData.Freight;
  //   if(this.selectedUOM==this.UOMs.Units)
  //   {
  //    // this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
  //     this.rowData.TotalAmounts = Math.round((this.rowData.Cost * this.rowData.Weight)+this.editGstCost- this.rowData.Freight + this.rowData.AdditionalAxpenses).toFixed(2);
  //     this.rowData.FinalAmount =  this.rowData.TotalAmounts + this.rowData.Freight
  //     //this.rowData.TotalAmounts = this.rowData.BillAmounts - this.rowData.Freight + this.rowData.AdditionalAxpenses - this.rowData.DifferenceAmount
  //   }
  //   else
  //   {
  //  // this.rowData.Cost = this.rowData.Cost == null?0: this.rowData.Cost;
  //  // this.rowData.Weight =  Math.round(this.rowData.BillAmounts/this.rowData.Cost*1000);
  //   this.rowData.TotalAmounts =Math.round((this.rowData.Cost * this.rowData.Weight/1000) + this.gstCost - this.rowData.Freight + this.rowData.AdditionalAxpenses);
  //   this.rowData.FinalAmount =  this.rowData.TotalAmounts + this.rowData.Freight
  // }
  // }
  onEditFreightChange(searchValue) {
    this.rowData.Freight = +(searchValue == "" ? 0 : searchValue);
    this.rowData.TotalAmounts = 0;
    this.rowData.FinalAmount = 0;
    this.rowData.Cost = this.rowData.Cost == null ? 0 : this.rowData.Cost;
    this.rowData.Weight = this.rowData.Weight == null ? 0 : this.rowData.Weight;
    this.rowData.AdditionalAxpenses = this.rowData.AdditionalAxpenses == null ? 0 : this.rowData.AdditionalAxpenses;
    if (this.selectedUOM == this.UOMs.Units) {
      //this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(+this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
    }
    else {
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = (this.rowData.Cost * this.rowData.Weight) + this.editGstCost - this.rowData.Freight + this.rowData.AdditionalAxpenses;
      this.rowData.FinalAmount = Math.round(+this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
    }
  }
  onEditAdditionalExpensesChange(searchValue) {
    this.rowData.AdditionalAxpenses = +(searchValue == "" ? 0 : searchValue);
    this.rowData.TotalAmounts = 0;
    this.rowData.FinalAmount = 0;
    this.rowData.Cost = this.rowData.Cost == null ? 0 : this.rowData.Cost;
    this.rowData.Weight = this.rowData.Weight == null ? 0 : this.rowData.Weight;
    this.rowData.AdditionalAxpenses = this.rowData.AdditionalAxpenses == null ? 0 : this.rowData.AdditionalAxpenses;
    if (this.selectedUOM == this.UOMs.Units) {
      // this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
    }
    else {
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round(this.rowData.Cost * this.rowData.Weight) + this.editGstCost + this.rowData.AdditionalAxpenses - (this.rowData.ConsiderFreight ? this.rowData.Freight : 0);
      this.rowData.FinalAmount = Math.round(this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
    }
  }
  // onEditDifferenceAmountChange(searchValue){
  //   this.rowData.DifferenceAmount = +searchValue;
  //   if(this.selectedUOM==this.UOMs.Units)
  //   {
  //     this.TotalAmount =0;
  //     this.rowData.Cost = this.rowData.Cost==null?0: this.rowData.Cost;
  //     this.rowData.Weight = this.rowData.Weight==null?0: this.rowData.Weight;
  //     //this.rowData.BillAmounts = this.rowData.Cost * this.enteredWeight;
  //     this.rowData.TotalAmounts = Math.round((this.rowData.Cost * this.enteredWeight) - this.rowData.Freight + this.rowData.AdditionalAxpenses).toFixed(2);
  //   }
  //   else
  //   {
  //  // this.rowData.BillAmounts = this.rowData.BillAmounts==null?0: this.rowData.BillAmounts;
  //     this.rowData.Freight = this.rowData.Freight==null?0: this.rowData.Freight;
  //     this.rowData.AdditionalAxpenses = this.rowData.AdditionalAxpenses==null?0: this.rowData.AdditionalAxpenses;
  //     this.rowData.DifferenceAmount = this.rowData.DifferenceAmount==null?0: this.rowData.DifferenceAmount;
  //     this.rowData.TotalAmounts = this.rowData.TotalAmounts==null?0: this.rowData.TotalAmounts;
  //    this.rowData.TotalAmounts = (this.rowData.Cost * this.enteredWeight/1000) -  this.rowData.Freight + this.rowData.AdditionalAxpenses;
  //  }
  // }
  onChangePaymentStatusClick(row) {
    this.rowData = row;
    let dialogRef = this.dialog.open(FeedTransactionDialogComponent, {
      data: this.rowData,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.isDataLoading = true;
        var req = {
          "Id": 0,
          "FeedPurchaseId": this.rowData.Id,
          "PaymentTypeId": result.value.paymentType,
          "Amount": result.value.paidAmount,
          "ReferenceNumber": result.value.refrenceNumber == "" || undefined ? null : result.value.refrenceNumber,
          "TransactionDate": result.value.paidDate,
          "CreatedByUserId": this.userData.Id,
          "CreatedDate": new Date(),
          "FarmId": this.selectedFarm.FarmId
        }
        this.spinner.show();
        this._dataService.Post('FarmActivity/AddFeedTransaction', req)
          .subscribe((Data) => {
            this.spinner.hide();
            if (Data.IsSuccess) {
              this.toastr.success(Data.EndUserMessage);
              this.GetFeedPurchaseDetails();
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

  onViewTransactionClick(row) {
    let dialogRef = this.dialog.open(ViewTransactionsDialogComponent, {
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetFeedPurchaseDetails();
    });
  }

  initSourceUser = function (searchText) {
    this.namesList = [];
    this.searchText = searchText;
    this.isDataLoading = true;
    this.toHighlight = searchText;
    if (searchText.length > 1) {
      this.spinner.show();
      this._dataService.GetAll('FarmActivity/GetFeedPurchaseName/' + searchText + "/" + this.selectedFarm.FarmId)
        .subscribe((Data) => {
          this.spinner.hide();
          if (Data.IsSuccess) {
            this.namesList = Data.ListResult;
          }
          else {
          }
        }, (error) => {
          this.toastr.error("An error has occured");
        });

    }
    else {
      // this.users = [];
      // this.selectedUser = null;
      // this.isDataLoading = false;
      // this.userInfo={};
    }
  }


  initSourceTown = function (searchText) {
    this.isDataLoading = true;
    if (searchText.length > 1) {
      this.spinner.show();
      this._dataService.GetAll('FarmActivity/GetFeedPurchaseTown/' + searchText + "/" + this.selectedFarm.FarmId)
        .subscribe((Data) => {
          this.spinner.hide();
          if (Data.IsSuccess) {
            this.townsList = Data.ListResult;
          }
          else {
          }
        }, (error) => {
          this.toastr.error("An error has occured");
        });

    }
    else {
      // this.users = [];
      // this.selectedUser = null;
      // this.isDataLoading = false;
      // this.userInfo={};
    }
  }

  // //Get PaymentStatus
  // GetPaymentStatus() {
  //   this._dataService.Get('UserInfo/GetAllTypeCdDmt/', this.ClassType.PaymentStatus)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.paymentStatusList = Data.ListResult;
  //       }
  //       else {
  //         this.toastr.error("An error has occured");
  //       }
  //     },(error)=>{
  //       this.toastr.error("An error has occured");
  //     });
  // }
  //Get UOMTypes
  GetUOMTypes() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', this.ClassType.UOMType)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.UOMTypes = Data.ListResult;
          this.selectedUOM = this.UOMTypes[0].TypeCdId;
          this.onUOMChange(this.UOMTypes[0].TypeCdId);
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }
  //Payment Types
  getPaymentTypes() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', DataFactory.ClassType.PaymentMode)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.paymentTypes = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }

  //Payment Terms
  getPaymentTerms() {
    this._dataService.Get('UserInfo/GetAllTypeCdDmt/', DataFactory.ClassType.PaymentTerms)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.paymentTerms = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      });
  }
  onCheckedChange(checked) {
    this.TotalAmount = 0; this.finalAmount = 0;
    this.gstCost = (this.selectedUOM == DataFactory.UOMs.Tons ? (this.enteredRate * this.enteredWeight) : (this.enteredRate * this.enteredWeight)) * (this.enteredGST / 100);
    this.TotalAmount = Math.round((this.selectedUOM == DataFactory.UOMs.Tons ? (this.enteredRate * this.enteredWeight) : (this.enteredRate * this.enteredWeight)) - (checked == true ? this.freightValue : 0) + this.additonalExpesess + this.gstCost).toFixed(2);
    this.finalAmount = Math.round(+this.TotalAmount + this.freightValue).toFixed(2);
  }
  onEditCheckedChange(ConsiderFreight) {
    this.rowData.ConsiderFreight = ConsiderFreight;
    this.rowData.TotalAmounts = 0;
    this.rowData.FinalAmount = 0;
    this.editGstCost = (this.rowData.UOMTypeId == DataFactory.UOMs.Tons ? (this.rowData.Cost * this.rowData.Weight) : (this.rowData.Cost * this.rowData.Weight)) * (this.rowData.GST / 100);

    this.rowData.TotalAmounts = Math.round((this.rowData.UOMTypeId == DataFactory.UOMs.Tons ? (this.rowData.Cost * this.rowData.Weight) : (this.rowData.Cost * this.rowData.Weight)) - (ConsiderFreight == true ? this.rowData.Freight : 0) + this.rowData.AdditionalAxpenses + this.editGstCost).toFixed(2);
    this.rowData.FinalAmount = Math.round(+this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)

  }
  onUOMChange(UOMId) {
    this.selectedUOM = UOMId;
    // this.billAmount = this.billAmount==null?0: this.billAmount;
    this.freightValue = this.freightValue == null ? 0 : this.freightValue;
    this.additonalExpesess = this.additonalExpesess == null ? 0 : this.additonalExpesess;
    //this.differenceAmount = this.differenceAmount==null?0: this.differenceAmount;  
    this.TotalAmount = 0;
    this.finalAmount = 0;
    this.enteredRate = this.enteredRate == null ? 0 : this.enteredRate;
    this.enteredWeight = this.enteredWeight == null ? 0 : this.enteredWeight;
    this.freightValue = this.freightValue == null ? 0 : this.freightValue;
    this.additonalExpesess = this.additonalExpesess == null ? 0 : this.additonalExpesess;
    if (UOMId == this.UOMs.Units) {
      // this.billAmount = this.enteredRate * this.enteredWeight;
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - this.freightValue + this.additonalExpesess).toFixed(2);
      this.finalAmount = Math.round(+this.TotalAmount + this.freightValue).toFixed(2);
    }
    else {
      this.TotalAmount = Math.round((this.enteredRate * this.enteredWeight) + this.gstCost - this.freightValue + this.additonalExpesess).toFixed(2);
      this.finalAmount = Math.round(+this.TotalAmount + this.freightValue).toFixed(2);
    }
  }
  onEditUOMChange(UOMId) {
    this.selectedUOM = UOMId;
    this.rowData.TotalAmounts = 0
    // this.rowData.BillAmounts = this.rowData.BillAmounts==null?0: this.rowData.BillAmounts;
    this.rowData.Freight = this.rowData.Freight == null ? 0 : this.rowData.Freight;
    this.rowData.AdditionalAxpenses = this.rowData.AdditionalAxpenses == null ? 0 : this.rowData.AdditionalAxpenses;
    //this.rowData.DifferenceAmount = this.rowData.DifferenceAmount==null?0: this.rowData.DifferenceAmount;
    this.rowData.TotalAmounts = Math.round(this.rowData.TotalAmounts == null ? 0 : this.rowData.TotalAmounts).toFixed(2);
    if (UOMId == this.UOMs.Units) {
      // this.rowData.BillAmounts = this.rowData.Cost * this.rowData.Weight;
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round((this.rowData.Cost * this.rowData.Weight) + this.editGstCost - this.rowData.Freight + this.rowData.AdditionalAxpenses).toFixed(2);
      this.rowData.FinalAmount = Math.round(+this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
    }
    else {
      this.editGstCost = (this.rowData.Cost * this.rowData.Weight) * (this.rowData.GST / 100)
      this.rowData.TotalAmounts = Math.round((this.rowData.Cost * this.rowData.Weight) + this.editGstCost - this.rowData.Freight + this.rowData.AdditionalAxpenses).toFixed(2);
      this.rowData.FinalAmount = Math.round(+this.rowData.TotalAmounts + this.rowData.Freight).toFixed(2)
    }
  }

  onAddMPFeedPurchaseClick() {
    this.isAddFeedPurchase = false;
    this.isEditFeedPurchase = false;
    this.isAddMPFeedPurchase = true;
    this.totalAmount = 0;
    this.fileExtension1 = null;
    this.base641 = null;
  }

  onCancleMPFeeedPurchaseAdd() {
    this.AddMPfeedPurchaseForm.reset();
    this.totalAmount = 0;
    this.isAddMPFeedPurchase = false;
    this.myInputMPVariable.nativeElement = '';
    this.image1 = null;
  }

  calculateTotalAmount(freight) {
    var fer = this.AddMPfeedPurchaseForm.value.Freight == "" || null ? 0 : parseInt(this.AddMPfeedPurchaseForm.value.Freight);
    var net = this.AddMPfeedPurchaseForm.value.netAmount == "" ? 0 || null : parseInt(this.AddMPfeedPurchaseForm.value.netAmount);
    this.totalAmount = Math.round(+fer + net).toFixed(2);
  }

  //Add Feed Purchase
  saveMPFeedPurchase() {
    this.isDataLoading = true;
    var req = {
      "Id": null,
      "FarmId": this.selectedFarm.FarmId,
      "BrokerId": null,
      "Cost": this.AddMPfeedPurchaseForm.value.rate,
      "Weight": null,
      "Name": this.AddMPfeedPurchaseForm.value.Name,
      "Town": this.AddMPfeedPurchaseForm.value.Town,
      "BillDate": this.AddMPfeedPurchaseForm.value.BillDate,
      "LorryNumber": this.AddMPfeedPurchaseForm.value.vechileNumber,
      "Freight": this.AddMPfeedPurchaseForm.value.Freight,
      "ChequeNumber": null, // this.AddfeedPurchaseForm.value.ChequeNumber,
      "ChequeDate": null, //this.AddfeedPurchaseForm.value.ChequeDate,
      "IsActive": true,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FeedTypeId": this.AddMPfeedPurchaseForm.value.feedType,
      "PaymentTypeId": null,
      "Remarks": null,
      "PaymentStatusId": this.PaymentAmounts.OutstandingAmount,
      "TotalAmounts": this.AddMPfeedPurchaseForm.value.netAmount,
      "BillAmounts": this.AddMPfeedPurchaseForm.value.billAmount,
      "Receiveddate": this.AddMPfeedPurchaseForm.value.receivedDate,
      "InvoiceNumber": this.AddfeedPurchaseForm.value.invoiceNumber,
      "AdditionalAxpenses": null,
      "ConsiderFreight": null,
      "UOMTypeId": null,
      "DifferenceAmount": null,
      "FinalAmount": this.AddMPfeedPurchaseForm.value.totalAmount,
      "GST": null,
      "DueDate": this.AddMPfeedPurchaseForm.value.DueDate == "" || null || undefined ? null : this.AddMPfeedPurchaseForm.value.DueDate,
      "MedicineName": this.AddMPfeedPurchaseForm.value.medicineName,
      "FileName": this.base641,
      "FileLocation": null,
      "FileExtension": this.fileExtension1,
    }
this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateFeedPurchase', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.isDataLoading = false;
        this.clicked = false;
        if (Data.IsSuccess) {
          this.isAddMPFeedPurchase = false;
          this.toastr.success(Data.EndUserMessage);
          this.AddMPfeedPurchaseForm.reset();
          this.myInputMPVariable.nativeElement = '';
          this.image1 = null;
          this.GetFeedPurchaseDetails();
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  onCancleMPFeeedPurchaseEdit() {
    this.isEditMPFeedPurchase = false;
    this.feedPurchaseList = this.existingFeedPurchase.map(x => Object.assign({}, x));
    this.myInputMPVariableEdit.nativeElement = '';
    this.image1 = null;
  }

  onUpdateMPFeeedPurchase() {
    var req = {
      "Id": this.rowData.Id,
      "FarmId": this.selectedFarm.FarmId,
      "BrokerId": null,
      "Cost": this.editMPfeedPurchaseForm.value.rate,
      "Weight": null,
      "Name": this.editMPfeedPurchaseForm.value.Name,
      "Town": this.editMPfeedPurchaseForm.value.Town,
      "BillDate": this.editMPfeedPurchaseForm.value.BillDate,
      "LorryNumber": this.editMPfeedPurchaseForm.value.vechileNumber,
      "Freight": this.editMPfeedPurchaseForm.value.Freight,
      "ChequeNumber": null,
      "ChequeDate": null,
      "IsActive": this.rowData.IsActive,
      "CreatedByUserId": this.rowData.CreatedByUserId,
      "CreatedDate": this.rowData.CreatedDate,
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date(),
      "FeedTypeId": this.editMPfeedPurchaseForm.value.feedType,
      "PaymentTypeId": null,
      "Remarks": null,
      "PaymentStatusId": this.rowData.PaymentStatusId,
      "TotalAmounts": this.editMPfeedPurchaseForm.value.netAmount,
      "BillAmounts": this.editMPfeedPurchaseForm.value.billAmount,
      "Receiveddate": this.editMPfeedPurchaseForm.value.receivedDate,
      "InvoiceNumber": this.editMPfeedPurchaseForm.value.InvoiceNumber,
      "AdditionalAxpenses": null,
      "ConsiderFreight": null,
      "UOMTypeId": null,
      "DifferenceAmount": null,
      "FinalAmount": this.editMPfeedPurchaseForm.value.totalAmount,
      "GST": null,
      "DueDate": this.editMPfeedPurchaseForm.value.DueDate == "" || null || undefined ? null : this.editMPfeedPurchaseForm.value.DueDate,
      "MedicineName": this.editMPfeedPurchaseForm.value.medicineName,
      "FileName": this.fileExtension1 == null ? this.rowData.FileName : this.base641,
      "FileLocation": this.fileExtension1 == null ? this.rowData.FileLocation : null,
      "FileExtension": this.fileExtension1 == null ? this.rowData.FileExtension : this.fileExtension1,
    }
    this.isDataLoading = true;
    this.spinner.show();
    this._dataService.Post('FarmActivity/AddUpdateFeedPurchase', req)
      .subscribe((Data) => {
        this.spinner.hide();
        this.isDataLoading = false;
        if (Data.IsSuccess) {
          this.toastr.success(Data.EndUserMessage);
          this.myInputMPVariableEdit.nativeElement = '';
          this.image1 = null;
          this.editMPfeedPurchaseForm.reset();
          this.isEditMPFeedPurchase = false;
          this.GetFeedPurchaseDetails();
        }
        else {
          this.toastr.error(Data.EndUserMessage);
        }
      }, (error) => {
        this.toastr.error("An error has occured");
      })
  }

  calculateMPTotalAmount(freight) {
    var fer = this.editMPfeedPurchaseForm.value.Freight == "" || null ? 0 : parseInt(this.editMPfeedPurchaseForm.value.Freight);
    var net = this.editMPfeedPurchaseForm.value.netAmount == "" ? 0 || null : parseInt(this.editMPfeedPurchaseForm.value.netAmount);
    this.rowData.FinalAmount = Math.round(+fer + net).toFixed(2);
  }

  onSelectPaymentType(PaymentMode) {
    this.selectedPaymentMothod = PaymentMode;
    if ((PaymentMode == DataFactory.paymentMOdes.cash) || (PaymentMode == DataFactory.paymentMOdes.Cheque)) {
      this.dueDate = null;
    }
    else {
      var Data = this.paymentTerms.filter(x => x.TypeCdId == PaymentMode);
      var netValue = Data[0].Desc.split('Net');
      var nte = +netValue[1];
      this.dueDate = new Date(this.AddfeedPurchaseForm.value.receivedDate);
      this.dueDate.setDate(this.dueDate.getDate() + nte);
    }
  }


  onSelectEditPaymentType(PaymentMode) {
    if ((PaymentMode == DataFactory.paymentMOdes.Cash) || (PaymentMode == DataFactory.paymentMOdes.Cheque)) {

    }
    else {
      var Data = this.paymentTerms.filter(x => x.TypeCdId == PaymentMode);
      var netValue = Data[0].Desc.split('Net');
      var nte = +netValue[1];
      this.rowData.DueDate = new Date(this.editfeedPurchaseForm.value.receivedDate);
      this.rowData.DueDate.setDate(this.rowData.DueDate.getDate() + nte);
    }
  }

  capitalize(textboxid, str) {
    // string with alteast one character
    if (str && str.length >= 1) {
      var firstChar = str.charAt(0);
      var remainingStr = str.slice(1);
      str = firstChar.toUpperCase() + remainingStr;
    }
    // document.getElementById(textboxid).value = str;
  }
  onSelectEditFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    this.fileExtension = '.' + file.name.split('.').pop();
    if (this.allowedImgExtensions.indexOf((this.fileExtension).toLowerCase()) == -1) {
      this.isValidFile = false;
      this.toastr.error('This File is not allowed. Allowed File Extensions are ' + this.allowedImgExtensions.replace(/\;/g, ', '));
      this.myInputVariableEdit.nativeElement.value = "";
      return;
    }
    else {
      if (file.size > this.maxFileSize) {
        this.toastr.error('File Size exceeds the limit. Max. Allowed Size is : ' + this.maxFileSize + ' MB');
        this.myInputVariableEdit.nativeElement.value = "";
        this.isValidFile = false;
        return;
      }
      else {
        let reader = new FileReader();
        reader.onloadend = (e) => {
          this.isValidFile = true;
          this.image = reader.result;
          var base64Index = this.image.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
          this.base64 = this.image.substring(base64Index);
        }
        reader.readAsDataURL(file);
      }
    }
  }
  onSelectFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    this.fileExtension = '.' + file.name.split('.').pop();
    if (this.allowedImgExtensions.indexOf((this.fileExtension).toLowerCase()) == -1) {
      this.isValidFile = false;
      this.toastr.error('This File is not allowed. Allowed File Extensions are ' + this.allowedImgExtensions.replace(/\;/g, ', '));
      this.myInputVariable.nativeElement.value = "";
      return;
    }
    else {
      if (file.size > this.maxFileSize) {
        this.toastr.error('File Size exceeds the limit. Max. Allowed Size is : ' + this.maxFileSize + ' MB');
        this.myInputVariable.nativeElement.value = "";
        this.isValidFile = false;
        return;
      }
      else {
        let reader = new FileReader();
        reader.onloadend = (e) => {
          this.isValidFile = true;
          this.image = reader.result;
          var base64Index = this.image.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
          this.base64 = this.image.substring(base64Index);
        }
        reader.readAsDataURL(file);
      }
    }
  };
  onSelectMPEditFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    this.fileExtension1 = '.' + file.name.split('.').pop();
    if (this.allowedImgExtensions.indexOf((this.fileExtension1).toLowerCase()) == -1) {
      this.isValidFile = false;
      this.toastr.error('This File is not allowed. Allowed File Extensions are ' + this.allowedImgExtensions.replace(/\;/g, ', '));
      this.myInputMPVariableEdit.nativeElement.value = "";
      return;
    }
    else {
      if (file.size > this.maxFileSize) {
        this.toastr.error('File Size exceeds the limit. Max. Allowed Size is : ' + this.maxFileSize + ' MB');
        this.myInputMPVariableEdit.nativeElement.value = "";
        this.isValidFile = false;
        return;
      }
      else {
        let reader = new FileReader();
        reader.onloadend = (e) => {
          this.isValidFile = true;
          this.image1 = reader.result;
          var base64Index = this.image1.indexOf(this.BASE64_MARKER1) + this.BASE64_MARKER1.length;
          this.base641 = this.image1.substring(base64Index);
        }
        reader.readAsDataURL(file);
      }
    }
  }


  onSelectMPFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    this.fileExtension1 = '.' + file.name.split('.').pop();
    if (this.allowedImgExtensions.indexOf((this.fileExtension1).toLowerCase()) == -1) {
      this.isValidFile = false;
      this.toastr.error('This File is not allowed. Allowed File Extensions are ' + this.allowedImgExtensions.replace(/\;/g, ', '));
      this.myInputMPVariable.nativeElement.value = "";
      return;
    }
    else {
      if (file.size > this.maxFileSize) {
        this.toastr.error('File Size exceeds the limit. Max. Allowed Size is : ' + this.maxFileSize + ' MB');
        this.myInputMPVariable.nativeElement.value = "";
        this.isValidFile = false;
        return;
      }
      else {
        let reader = new FileReader();
        reader.onloadend = (e) => {
          this.isValidFile = true;
          this.image1 = reader.result;
          var base64Index = this.image1.indexOf(this.BASE64_MARKER1) + this.BASE64_MARKER1.length;
          this.base641 = this.image1.substring(base64Index);
        }
        reader.readAsDataURL(file);
      }
    }
  }



  //Display Image
  onViewDoc(picture) {
    // window.open(row.imageUrl);
    this.modal = document.getElementById('productModal');
    this.modalImg = document.getElementById("productImage");
    this.modal.style.display = "block";

    this.modalImg = picture;
  }
  //Closing Image
  closeImage() {
    this.modal.style.display = "none";
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

  onReceivedDate() {
    if ((this.selectedPaymentMothod == DataFactory.paymentMOdes.cash) || (this.selectedPaymentMothod == DataFactory.paymentMOdes.Cheque)) {
    }
    else {
      var Data = this.paymentTerms.filter(x => x.TypeCdId == this.selectedPaymentMothod);
      var netValue = Data[0].Desc.split('Net');
      var nte = +netValue[1];
      this.dueDate = new Date(this.AddfeedPurchaseForm.value.receivedDate);
      this.dueDate.setDate(this.dueDate.getDate() + nte);
    }
  }

  onEditReceivedDateChage() {
    if ((this.rowData.PaymentTypeId == DataFactory.paymentMOdes.cash) || (this.rowData.PaymentTypeId == DataFactory.paymentMOdes.Cheque)) {
    }
    else {
      var Data = this.paymentTerms.filter(x => x.TypeCdId == this.rowData.PaymentTypeId);
      var netValue = Data[0].Desc.split('Net');
      var nte = +netValue[1];
      this.rowData.DueDate = new Date(this.editfeedPurchaseForm.value.receivedDate);
      this.rowData.DueDate.setDate((this.rowData.DueDate).getDate() + nte);
    }
  }
}
