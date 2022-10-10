import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-view-transactions-dialog',
  templateUrl: './view-transactions-dialog.component.html',
  // providers: [
  //   { provide: MAT_DIALOG_DATA, useValue: {} },
  //   { provide: MatDialogRef, useValue: {} }
  // ],
  styleUrls: ['./view-transactions-dialog.component.css']
})
export class ViewTransactionsDialogComponent implements OnInit {

  isDataLoading:boolean=false;
  transactionData:any[]=[];
  constructor(private _dataService:DataService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ViewTransactionsDialogComponent>,private toastr: ToastrService) { }

  ngOnInit() {
    this.GetTransactionData();
  }

  GetTransactionData(): void {
    this.isDataLoading=true;
    this._dataService.GetAll('FarmActivity/GetFeedTransactions/' + this.data.Id)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.transactionData = Data.ListResult==null ? [] :  Data.ListResult;
           this.isDataLoading=false;
        }else{
          // this.toastr.error("An error has occured");
        }
      },
      (error)=>{
        // this.toastr.error("An error has occured");
      })
  }

  onDeleteClick(row){
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data:{ msg:"Are you sure you want to delete ?"} ,
      width: 'auto',
      height: 'auto'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined){
      this._dataService.Get('FarmActivity/DeleteFeedTransaction/', row.Id )
        .subscribe((Data) => {     
          if (Data.IsSuccess) {
            this.toastr.success(Data.EndUserMessage);
             this.GetTransactionData();
          }
          else{
            this.toastr.error("An error has occured");
          }
        },(error)=>{
          this.toastr.error("An error has occured");
        })
      }
      });
  }

  onCancelClick() {
    this.dialogRef.close(true);
  }
}
