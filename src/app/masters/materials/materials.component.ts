import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DataFactory } from '../../shared/dataFactory';
import { DataService } from '../../shared/data.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  
  
  Id: string;
  MaterialData: any;
  isEditable: boolean;
  ActivityRights: any;
  userData: any;
  data: any = [];
  delRow: any;
  isEdit:boolean=false;
  IsAdd:boolean=false;
  LookupData: any;
  LookUpTypeId:any;
  LookUp = DataFactory.LookUp;
  AddMaterialsForm:FormGroup;
  constructor(public dialog: MatDialog,private _dataService: DataService, private toastr: ToastrService,private fb:FormBuilder) { 
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.AddMaterialsForm = fb.group({
      NAME: ['', Validators.required],
      // Desc: ['', Validators.required],
      Remarks: ['', Validators.required],
      IsActive: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.getData();
  }
  getData (){
    this._dataService.GetAll('FarmActivity/GetLookUpData'+'/'+this.Id +'/'+ this.LookUpTypeId )
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.LookupData = Data.ListResult;
          this.isEditable = false;
           //feedDropDown
          this.MaterialData = this.LookupData.filter(
            task => task.LookUpTypeId ===this.LookUp.MaterialType);
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }
  
  addRow() {
    // var filterArray = this.MaterialData.filter(x => x.isEditable == true);
    // if(filterArray.length>0){
    //   for(var i=0;i<this.MaterialData.length;i++){
    //     this.MaterialData[i].isEditable=false;
    //   }
    // }
    if(this.MaterialData.length > 0){
      if(this.MaterialData[0].isAdd==true){
        this.MaterialData = [...this.MaterialData];
        this.MaterialData.shift();
        }
      this.MaterialData = [...this.MaterialData];
      this.MaterialData.unshift({NAME: "",Remarks:"",IsActive:true, isEditable: true, isAdd:true});
    }else{
      this.MaterialData.push({NAME: "", Remarks:"",IsActive:true, isEditable: true, isAdd:true});
      this.MaterialData = [...this.MaterialData];
    }

  }

  cancelMaterialAddClick(row){
    this.MaterialData = [...this.MaterialData];
    this.MaterialData.shift();
    row.isEditable=false;
  }
  addMaterialClick(row){
    var req={
      "Id":0,
      "LookUpTypeId":this.LookUp.MaterialType,
      "Name":this.AddMaterialsForm.value.NAME,
      "Remarks":this.AddMaterialsForm.value.Remarks,
      "IsActive":this.AddMaterialsForm.value.IsActive,
      "CreatedByUserId":this.userData.Id,
      "CreatedDate":new Date(),
      "UpdatedByUserId":this.userData.Id,
      "UpdatedDate":new Date()
    }
    this._dataService.Post('FarmActivity/AddUpdateLookUp/', req)
      .subscribe((Data) => {
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


    this.MaterialData = [...this.MaterialData];
    this.MaterialData.shift();
    row.isEditable=false;
  }
  editRow(row) {
    if(this.MaterialData[0].isAdd==true){
    this.MaterialData = [...this.MaterialData];
    this.MaterialData.shift();
    }
    this.MaterialData.filter(row => row.isEditable).map(r => { r.isEditable = false; return r })
    row.isEditable = true;
    row.isAdd=false;
  }
  //Update Materials
  onUpdateRow(row) {
    row.isEditable = false;
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
  cancelMaterialEditClick(row){
    row.isEditable=false;
    this.getData();
  }

  save(row) {
    row.isEditable = false
  }
//DElete  Row
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
        this._dataService.Post('FarmActivity/DeleteLookUp/', req)
          .subscribe((Data) => {
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
  this.isDataLoading=true;
  this._dataService.Post('FarmActivity/ExportFeed/', this.MaterialData).subscribe((result) => {
    if (result != null && result != undefined && result != '') {
      var data = result;
      var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = "Materials.xlsx";
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
//  download() {
//   var csvData = this.ConvertToCSV(this.MaterialData);
//   var a = document.createElement("a");
//   a.setAttribute('style', 'display:none;');
//   document.body.appendChild(a);
//   var blob = new Blob([csvData], { type: 'text/csv' });
//   var url = window.URL.createObjectURL(blob);
//   a.href = url;
//   a.download = 'Materials.csv';/* your file name*/
//   a.click();
//   return 'success';
// }

// ConvertToCSV(objArray) {
//   var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
//   var str = '';
//   var row = "";
//   for (var index in objArray[0]) {
//     //Now convert each value to string and comma-separated
//     row += index + ',';
//   }
//   row = row.slice(0, -1);
//   //append Label row with line break
//   str += row + '\r\n';
//   for (var i = 0; i < array.length; i++) {
//     var line = '';
//     for (var index in array[i]) {
//       if (line != '') line += ','
//       line += array[i][index];
//     }
//     str += line + '\r\n';
//   }
//   return str;
// }

  // getData() {
  //   this.data = [
  //     { name: "Maize", description: "Feed1",isactive:false },
  //     { name: "Sun Flower cake", description: "Feed3",isactive:true },
  //     { name: "Broken Rice", description: "Feed4",isactive:false },
     
  //   ];     
  //   this.data.map(row => {
  //     row.isEditable = false;
  //   });

  // };
}
