import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';

@Component({
  selector: 'app-temparature',
  templateUrl: './temparature.component.html',
  styleUrls: ['./temparature.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class TemparatureComponent implements OnInit {
  TemparatureData: any[];
  data: any;
  labels: any;
  list: any[] = [];
  dataSets: any[] = [];

  constructor(private _dataService: DataService,private toastr: ToastrService) {

  }
  ngOnInit() {
    this.GetTemparatureSchedule();
  }

  GetTemparatureSchedule(): void {
    this._dataService.GetAll('Benchmark/GetTemparatureSchedule')
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.TemparatureData = Data.ListResult;
          for (var i = 0; i < this.TemparatureData.length; i++) {
            this.list.push((this.TemparatureData[i].StartDay + '-' + this.TemparatureData[i].EndDay).toString());
            this.dataSets.push((this.TemparatureData[i].StartTemperature).toString());
          }
          this.data = {
            labels: this.list,
            datasets: [
              {
                label: 'Temperature (celsius)',
                data: this.dataSets,
                fill: false,
                borderColor: '#4bc0c0'
              }
            ]
          }
        }
        else{
          this.toastr.error("An error has occured");  
        }
      },
      (error) => {               
        this.toastr.error("An error has occured");
      });
  }

  //ExportToExcel
  download = function () {
    this.isDataLoading = true;
    this._dataService.Post('Benchmark/ExportTemparatureSchedule', this.TemparatureData).subscribe((result) => {
      if (result != null && result != undefined && result != '') {
        var data = result;
        var blob = this.b64toBlob(data, 'vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        var a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = "Temparature Schedule.xlsx";
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
}
