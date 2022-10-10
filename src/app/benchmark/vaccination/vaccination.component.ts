import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-vaccination',
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {
  @ViewChild('dt') table: Table;
  isDataLoading: boolean;
  isFiltersEnabled = false;
  filterTooltip = "Enable Filters";
  mainGrid:boolean=true;
  isAddVaccinationDetails:boolean=false
  VaccinationData: any[] =[];
  isEdit:boolean=false;
  IsAdd:boolean=false;
  IsAdded: boolean=true;
  constructor(private _dataService: DataService,private toastr: ToastrService) { }

  ngOnInit() {
    this.GetVaccinationSchedule();
  }
  GetVaccinationSchedule(): void {
    this._dataService.GetAll('Benchmark/GetVaccinationSchedule')
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.VaccinationData = Data.ListResult;
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
      (error) => {
        this.toastr.error("An error has occured");
      });
  }

  vaccinationdetails=[{
    "name":"v1",
    "age1":true,
    "age2":true,
    "age3":false,
    "age4":true,
    "age5":false,
    "age6":true,
    "age7":true,
    "age8":false,
    "age9":true,
    "age10":false,
  },{
    "name":"v2",
    "age1":false,
    "age2":true,
    "age3":false,
    "age4":true,
    "age5":false,
    "age6":true,
    "age7":true,
    "age8":false,
    "age9":true,
    "age10":false,
  },{
    "name":"v3",
    "age1":true,
    "age2":false,
    "age3":false,
    "age4":true,
    "age5":false,
    "age6":true,
    "age7":true,
    "age8":false,
    "age9":true,
    "age10":false,
  },{
    "name":"v4",
    "age1":true,
    "age2":false,
    "age3":false,
    "age4":false,
    "age5":false,
    "age6":true,
    "age7":true,
    "age8":false,
    "age9":true,
    "age10":false,
  },{
    "name":"v5",
    "age1":true,
    "age2":false,
    "age3":false,
    "age4":false,
    "age5":false,
    "age6":true,
    "age7":true,
    "age8":false,
    "age9":true,
    "age10":false,
  }]

    //ExportToExcel
    download = function () {
      this.isDataLoading=true;
      this._dataService.Post('Benchmark/ExportVaccinationSchedule', this.VaccinationData).subscribe((result) => {
        if (result != null && result != undefined && result != '') {
          var data = result;
          var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          var a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = "Vaccination Schedule.xlsx";
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
       //TOGGLE FILTER
       toggleFilter = function () {
        this.isFiltersEnabled = !this.isFiltersEnabled;
        if (this.isFiltersEnabled) {
          this.filterTooltip = "Disable Filters";
        }
        else {
          this.filterTooltip = "Enable Filters";
          this.sortField = this.table.sortField;
          this.sortOrder = this.table.sortOrder;
          this.table.reset();
          this.table.sortField = this.sortField;
          this.table.sortOrder = this.sortOrder;
          
        }
      };
}
