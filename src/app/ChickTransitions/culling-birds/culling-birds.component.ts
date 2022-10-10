import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/Confirmation/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-culling-birds',
  templateUrl: './culling-birds.component.html',
  styleUrls: ['./culling-birds.component.css']
})
export class CullingBirdsComponent implements OnInit {
  layerSheds : any[];
  rangeDates:any;
  batchRowGroupdata: any;
  isAddingCullingBirds:boolean=false;
  isAddShed:boolean=false;
  batchCtrl: FormControl;
  filteredBatches: Observable<any[]>;
  i = 1;
  currentIndex=0;
  addSheds:any[]=[];
  batches=[];
  sheds=[];
  chicks=0;
  edittedRowData: any;
  editCullingBirdsArray: any[] = [];
  isEditCullingBirds:boolean=false;
  date = new FormControl(new Date());
  birdscount:any;
  constructor(public dialog: MatDialog) {
    this.batchCtrl = new FormControl();
    this.batchCtrl.valueChanges.subscribe(val => {
      this.filterBatches(val);
    });
    this.onAddShedClick();
   }

  ngOnInit() {
    this.batches = [
      { name: 'Batch1',chickCount:20000 },
      { name: 'Batch2',chickCount:20000 },
      { name: 'Batch3',chickCount:20000 },
      { name: 'Batch4',chickCount:30000 }
    ];
    this.sheds = [
      { name: 'Layer Shed1' },
      { name: 'Layer Shed2' },
      { name: 'Layer Shed3' },
      { name: 'Layer Shed4' },
      { name: 'Layer Shed5' },
      { name: 'Layer Shed6' }
    ];
  this.filteredBatches = new Observable(observer => {
    setTimeout(() => {
        observer.next(this.batches);
    }, 1000);
  }); 
    this.layerDetails(); 
    this.batchRowGroup();
  }
  //Adding Multiple sheds to batch
  onAddShedClick() {
    this.isAddShed = true;
    this.i = this.i;
    this.addSheds.push({
      'Id': this.i
      // 'sheds': this.sheds
    })
    this.currentIndex = this.addSheds.length - 1;
    this.i = this.i + 1;
  }

  //Remove Added shed
  deleteShed = function (shed, index) {
    this.findAndRemove(this.addSheds, 'id', shed.Id);
    if (this.addSheds.length == 0)
      this.isAddShed = false;
  }
findAndRemove=function (array, property, value) {
  var elements = array.filter(function (el) {
      return el.Id == value;
  });
  if (elements.length > 0) {
      var ind = array.lastIndexOf(elements[0]);
      array.splice(ind, 1);
  }
}

  onAddCullingBirdsClick(){
    this.isAddingCullingBirds=true;
  }

  onCancleAddClick(){
    this.isAddingCullingBirds=false;
    this.isAddShed=false;
    this.addSheds=[];
    this.onAddShedClick();
  }
  layerDetails(){
    this.layerSheds  = [
      {
        Date: "14/03/2019",
        BatchName: "Batch1",
        ShedName: "Layer Shed1",
        BirdsCount: 10000,
        CulledBirds:10000
      },
      {
        Date: "14/03/2019",
        BatchName: "Batch1",
        ShedName: "Layer Shed3",
        BirdsCount: 10000,
        CulledBirds:10000
      },
      {
        Date: "16/03/2019",
        BatchName: "Batch2",
        ShedName: "Layer Shed4",
        BirdsCount: 10000,
        CulledBirds:10000
      },
      {
        Date: "16/03/2019",
        BatchName: "Batch2",
        ShedName: "Layer Shed5",
        BirdsCount: 10000,
        CulledBirds:10000
      },
      {
        Date: "15/03/2019",
        BatchName: "Batch3",
        ShedName: "Layer Shed2",
        BirdsCount: 10000,
        CulledBirds:10000
      } ,
      {
        Date: "15/03/2019",
        BatchName: "Batch3",
        ShedName: "Layer Shed6",
        BirdsCount: 10000,
        CulledBirds:10000
      }       
    ]
  }

  filterBatches(name: string) {
    let filteredData = this.batches.filter(batch =>
      batch.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    this.filteredBatches = new Observable(observer => {
        observer.next(filteredData);
    }); 
}
onbatchSort() {
  this.batchRowGroup();
}
batchRowGroup() {
  this.batchRowGroupdata = {};
  if (this.layerSheds) {
    for (let i = 0; i < this.layerSheds.length; i++) {
      let rowData = this.layerSheds[i];
      let BatchName = rowData.BatchName;
      if (i == 0) {
        this.batchRowGroupdata[BatchName] = { index: 0, size: 1 };
      }
      else {
        let previousRowData = this.layerSheds[i - 1];
        let previousRowGroup = previousRowData.BatchName;
        if (BatchName === previousRowGroup)
          this.batchRowGroupdata[BatchName].size++;
        else
          this.batchRowGroupdata[BatchName] = { index: i, size: 1 };
      }
    }
  }
}
//On Delete batch
// onDeleteLayerBatchClick(row,index){
//   this.layerSheds.splice(index, 1);
// }
onDeleteCullingBirdsClick(row) {
  let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: { msg: "Are you sure you want to delete ?" },
    width: 'auto',
    height: 'auto'
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result != undefined) {
      this.layerSheds.splice(this.layerSheds.indexOf(row), 2);
      this.layerSheds=[...this.layerSheds];
    }
  });
}

onEditCullingBirdsClick(row, index) {
  var BirdsCount = 0;
  this.edittedRowData = row;
  this.editCullingBirdsArray = [];
  this.isEditCullingBirds = true;
  const batchArray = this.layerSheds.filter(x => x.BatchName == row.BatchName);
  for (var i = 0; i < batchArray.length; i++) {
    this.editCullingBirdsArray.push({
      'shedselection':batchArray[i].ShedName,
        'date':this.date,
        'birdscount':10000
    });
  }
}
onShedSelect(data,index){
  if(this.isEditCullingBirds){
    this.editCullingBirdsArray[index].birdscount="20000"
  }else{
    this.birdscount[index]="20000"
  }
}
onAddCullingBirdsEditClick(){
this.editCullingBirdsArray.push({
  'Id': this.editCullingBirdsArray.length,
})
}
onRemoveCullingBirdsEditClick(shed,index){
this.findAndRemoves(this.editCullingBirdsArray, 'id', shed.Id);
if (this.editCullingBirdsArray.length == 0)
  this.isAddingCullingBirds = false;
}
findAndRemoves=function (array, property, value) {
var elements = array.filter(function (el) {
    return el.Id == value;
});
if (elements.length > 0) {
    var ind = array.lastIndexOf(elements[0]);
    array.splice(ind, 1);
}
}  
onCancleCullingBirdsEdit(){
this.isEditCullingBirds=false;    
}
onSelectBatch(name) {
  this.chicks =  this.batches.find(x => x.name == name).chickCount;
}
download() {
  var csvData = this.ConvertToCSV(this.layerSheds);
  var a = document.createElement("a");
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  var blob = new Blob([csvData], { type: 'text/csv' });
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'Culling Birds.csv';/* your file name*/
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
}
