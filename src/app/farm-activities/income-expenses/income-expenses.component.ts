import { Component, OnInit ,ViewChild} from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataFactory } from 'src/app/shared/dataFactory';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-income-expenses',
  templateUrl: './income-expenses.component.html',
  styleUrls: ['./income-expenses.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class IncomeExpensesComponent implements OnInit {
  clicked: boolean = false;
  @ViewChild('IN') private table;
  @ViewChild('ex') private table1;
  isFiltersEnabled: boolean = false;
  filterTooltip = "Enable Filters";
  isFiltersEnable: boolean = false;
  Tooltip = "Enable Filters";
  fromDate: Date;
  toDate: Date;
  selectedIncome: number;
  isDataLoading: boolean = false;
  currentDate: Date = new Date();
  expensesDataList: any[] = [];
  AddForm: FormGroup;
  incomeTypes: any = {};
  expenseTypes: any = {};
  expensesTypeList: any[] = [];
  incomeOrExpensiveDetails: any[] = [];
  ExpenseName: string = '';
  isAdding: boolean = false;
  isIncome: boolean = false;
  isExpense: boolean = false;
  isName: boolean;
  userData: any;
  totalData :any ={};
  selectedFarm: any;
  incomeList:any[]=[];
  expensesList:any[]=[];
  ActivityRights:any;
  constructor(private dataService: DataService, private toastr: ToastrService, public dialog: MatDialog,
    private fb: FormBuilder,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.AddForm = this.fb.group({
      date: [this.currentDate, Validators.required],
      Income: ['', Validators.required],
      amount: ['', Validators.required],
      name: ['']
    })
    this.isName = false;
  }

  ngOnInit() {
    this.incomeTypes = DataFactory.IncomeTypes;
    this.expenseTypes = DataFactory.ExpensesTypes;
    this.expensesTypeList = DataFactory.ExpensesTypeData;
    this.selectedIncome = DataFactory.ClassType.Income;
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getExpensesData();
    
  }

  // Get Expenses Data
  getExpensesData() {  
    this.spinner.show();  
    this.incomeList = [];
    this.expensesList = [];
    let sumB: any = 0; let sumBR: any = 0; 
       
    var req = {
      "farmId": this.selectedFarm.FarmId,
      "typeId": null,
      "FromDate": this.fromDate,
      "ToDate": this.toDate
    }
    this.dataService.Post('IncomeExpenses/GetIncomeExpenses', req).subscribe(res => {
      this.spinner.hide();  
      if (res.IsSuccess) {        
        this.expensesDataList = res.ListResult == null ? [] : res.ListResult;        
        this.incomeList = this.expensesDataList.filter(I=>I.ClassTypeId == DataFactory.ClassType.Income );
        this.expensesList = this.expensesDataList.filter(I=>I.ClassTypeId == DataFactory.ClassType.Expenses );
        this.incomeList.forEach(a => sumB += a.Amount);
        this.totalData.Amount = sumB;
        this.expensesList.forEach(a => sumBR += a.Amount);
        this.totalData.ExpensesAmount = sumBR;
      }
      else {        
        this.toastr.error("An error has occured");
        
      }
    }, (error) => {      
      this.toastr.error("An error has occured");
    });
  }

  // On Delete Expense click
  onDeleteIncomeDetailsClick(row) {   
    debugger; 
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { msg: "Are you sure you want to delete ?" },
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result != undefined) {
        this.spinner.show();              
        this.dataService.Deleteincfeed('IncomeExpenses/DeleteIncomeExpenses', row.Id)
          .subscribe((Data) => {
            this.spinner.hide();  
            if (Data.IsSuccess) {
              this.toastr.success(Data.EndUserMessage);
              this.getExpensesData();
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

  // On Add Income Click
  onAddIncomeClick() {
    this.AddForm.reset({
      date: this.currentDate
    })
    this.isAdding = true;
    this.isIncome = true;
    this.isExpense = false;
    this.ExpenseName = 'Add Income';
    this.getIncomeOrExpenseData(DataFactory.ClassType.Income)
  }

  // On Add Expense Click
  onAddExpenseClick() {
    this.AddForm.reset({
      date: this.currentDate
    })
    this.isAdding = true;
    this.isIncome = false;
    this.isExpense = true;
    this.ExpenseName = 'Add Expense';
    this.getIncomeOrExpenseData(DataFactory.ClassType.Expenses)
  }

  // On Add Cancel Click
  onAddCancelClick() {
    this.isAdding = false;
    this.isIncome = false;
    this.isExpense = false;
    this.isName = false;
  }

  // On save click
  onSaveClick() {
        var req =
    {
      "Id": null,
      "IEDate": this.AddForm.value.date,
      "FarmId": this.selectedFarm.FarmId,
      "IncomeTypeId": this.AddForm.value.Income,
      "Name": this.AddForm.value.name,
      "Amount": this.AddForm.value.amount,
      "CreatedByUserId": this.userData.Id,
      "CreatedDate": new Date(),
      "UpdatedByUserId": this.userData.Id,
      "UpdatedDate": new Date()
    }
    this.spinner.show();
    this.dataService.Post('IncomeExpenses/AddIncomeExpenses', req).subscribe(res => {
      this.spinner.hide();
      if (res.IsSuccess) {
        this.clicked = false;
        this.toastr.success(res.EndUserMessage);
        this.getExpensesData();
        this.isAdding = false;
        this.isIncome = false;
        this.isExpense = false;
        this.isName = false;
      }
      else {
        this.toastr.error("An error has occured");
      }
    }, (error) => {
      this.toastr.error("An error has occured");
    });
  }
  // Get Income/Expense Types Using ClassTypeId
  getIncomeOrExpenseData(classtypeId) {
    this.spinner.show();
    this.incomeOrExpensiveDetails = [];
    this.dataService.Get('UserInfo/GetAllTypeCdDmt', classtypeId).subscribe(res => {
      this.spinner.hide();
      if (res.IsSuccess) {
        var data = res.ListResult == null ? [] : res.ListResult;

        this.incomeOrExpensiveDetails = (data == []) ? data : data.filter(x => (x.TypeCdId != DataFactory.IncomeTypes.Production)
          && (x.TypeCdId != DataFactory.IncomeTypes.culling) && (x.TypeCdId != DataFactory.ExpensesTypes.FeedPurchase) &&
          (x.TypeCdId != DataFactory.ExpensesTypes.BatchCost))
      }
      else {
        this.toastr.error("An error has occured")
      }
    }, (error) => {
      this.toastr.error("An error has occured");
    })
  }

  // // restrict letters
  onlyNumber(event) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //Accept Alphabets only
  onlyLetters(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    //if (!((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)) {
    if (!((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || (charCode == 8 || charCode == 32))) {
      return false;
    }
    return true;
  }

  //change event for Income Type
  onSelectIncomeType(income) {
    
    if ((income == DataFactory.IncomeTypes.Others) || (income == DataFactory.IncomeTypes.ExpensiveOthers)) {
      this.isName = true;
      this.AddForm.get('name').setValidators([Validators.required]);
      this.AddForm.get('name').updateValueAndValidity();
      this.AddForm.get('name').setValue('')
    }
    else {
      this.isName = false;
      this.AddForm.get('name').setValidators([]);
      this.AddForm.get('name').updateValueAndValidity();
      this.AddForm.get('name').setValue('')
    }
  }

  // On clear Click
  onClearSearch() {
    this.selectedIncome = DataFactory.ClassType.Income;
    this.fromDate = new Date();
    this.toDate = new Date();
    this.fromDate.setDate(this.fromDate.getDate() - 30);
    this.getExpensesData();
  }

  // On export Click
  download() {
    this.isDataLoading = true;
    this.spinner.show();
    this.dataService.Post('IncomeExpenses/ExportInvoiceExpensesReport', this.expensesDataList).subscribe((result) => {
      this.spinner.hide();
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', null);
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Income/Expense.xlsx";
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

  // On Search Click
  onSearchClick() {
    this.getExpensesData();
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
}



