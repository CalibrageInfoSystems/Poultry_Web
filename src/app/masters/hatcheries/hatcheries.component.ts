import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { DataFactory } from '../../shared/dataFactory';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import  { SelectItem, Message, DataTable } from 'primeng/primeng';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-hatcheries',
  templateUrl: './hatcheries.component.html',
  styleUrls: ['./hatcheries.component.css']
})
export class HatcheriesComponent implements OnInit {
  clicked : boolean = false;
  isFiltersEnabled :boolean= false;
  @ViewChild(('ht')) ht: DataTable;
  filterTooltip = "Enable Filters";
  selectedFarm: any;
  HatcheryData: any;
  AddhatcheriesForm: FormGroup;
  ActivityRights: any;
  userData: any;
  Id: string;
  isEditable: boolean;
  LookupData: any;
  data: any = [];
  delRow: any;
  isEdit:boolean=false;
  IsAdd:boolean=false;
  LookUpTypeId:any;
  LookUp = DataFactory.LookUp;
  // isFiltersEnabled = false;
  // filterTooltip = "Enable Filters";
  constructor(public dialog: MatDialog,private _dataService: DataService, private toastr: ToastrService,private fb:FormBuilder,private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.AddhatcheriesForm = fb.group({
      HatcheryName: ['', Validators.required],
      Location: ['', Validators.required],
      IsActive: [''],
    });
   }

   //Add Hatchery Button
   addRow() {
    if (this.HatcheryData.length > 0) {
      if (this.HatcheryData[0].isAdd == true) {
        this.HatcheryData = [...this.HatcheryData];
        this.HatcheryData.shift();
      }
      this.HatcheryData = [...this.HatcheryData];
      this.HatcheryData.unshift({ HatcheryName: "", Location: "",  IsActive: "true", isEditable: true, isAdd: true });
    } else {
      this.HatcheryData.push({ HatcheryName: "", Location: "", IsActive: "true", isEditable: true, isAdd: true });
      this.HatcheryData = [...this.HatcheryData];
    }
  }
  //Add Cancel Click
  cancelHatcheryAddClick(row){
    this.HatcheryData = [...this.HatcheryData];
    this.HatcheryData.shift();
    row.isEditable=false;
  }


//Initall
  ngOnInit() {
    this.getData();
  }
//Get Hatchery Data
 getData (){
  var HatcheryId=null;
  this.spinner.show();
  this._dataService.GetAll('Transitions/GetHatcheryDetails/'+HatcheryId +'/'+ this.selectedFarm.FarmId)
    .subscribe((Data) => {
      this.spinner.hide();
      if (Data.IsSuccess) {
        this.HatcheryData = Data.ListResult;
        this.isEditable = false;        
      }
      else{
        this.toastr.error("An error has occured");
      }
    },(error)=>{
      this.toastr.error("An error has occured");
    })
};
//Add Hatchery
addHatcheryClick(row) {

  var req = {
    "Id": null,
    "FarmId":this.selectedFarm.FarmId,
    "Name": this.AddhatcheriesForm.value.HatcheryName,
    "Location": this.AddhatcheriesForm.value.Location,
    "IsActive": this.AddhatcheriesForm.value.IsActive,
    "CreatedByUserId": this.userData.Id,
    "CreatedDate": new Date(),
    "UpdatedByUserId": this.userData.Id,
    "UpdatedDate": new Date()
   
  }
  this.spinner.show();
  this._dataService.Post('Transitions/AddUpdateHatchery/', req)
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


  this.HatcheryData = [...this.HatcheryData];
  this.HatcheryData.shift();
  row.isEditable = false;
}

//Edit Hatchery
editRow(row) {
  if(this.HatcheryData[0].isAdd==true){
  this.HatcheryData = [...this.HatcheryData];
  this.HatcheryData.shift();
  }
  this.HatcheryData.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
  row.isEditable = true;
  row.isAdd=false;
}
// Update Hatchery
onUpdateRow(row){
  row.isEditable=false;
  var req={
    "Id":row.Id,
    "FarmId":this.selectedFarm.FarmId,
    "Name":row.HatcheryName,
    "Location":row.Location,
    "IsActive":row.IsActive,
    "CreatedByUserId":row.CreatedByUserId,
    "CreatedDate":row.CreatedDate,
    "UpdatedByUserId":this.userData.Id,
    "UpdatedDate":new Date()
  }
  this.spinner.show();
  this._dataService.Post('Transitions/AddUpdateHatchery/', req)
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

//Delete Hatchery
delete(row,index){
  let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: { msg: "Are you sure you want to delete ?" },
    width: 'auto',
    height: 'auto'
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result != undefined) {

  var req={
    "Id":row.Id,
    "UpdatedByUserId":this.userData.Id,
    "UpdatedDate":new Date()
  }
  this.spinner.show();
  this._dataService.Post('Transitions/DeleteHatchery/', req)
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

//edit Cancel Click
cancelHatcheryEditClick(row){
  row.isEditable=false;
  this.getData();
}

  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    this._dataService.Post('Transitions/ExportHatchery/', this.HatcheryData).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Hatchery Details.xlsx";
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
    this.ht.reset();
  this.isFiltersEnabled = !this.isFiltersEnabled;
  if (this.isFiltersEnabled)
    this.filterTooltip = "Disable Filters";
  else {
    this.filterTooltip = "Enable Filters";
  }
}


}

