import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vaccinationreport',
  templateUrl: './vaccinationreport.component.html',
  styleUrls: ['./vaccinationreport.component.css']
})
export class VaccinationreportComponent implements OnInit {
  batches:any[];
  vaccinationDetails:any[];
  constructor() { }

  ngOnInit() {
    this.batches = [
      { name: 'Batch1',chickCount:20000 },
      { name: 'Batch2',chickCount:20000 },
      { name: 'Batch3',chickCount:20000 },
      { name: 'Batch4',chickCount:30000 }
    ];
    this.vaccinations();
  }
vaccinations(){
  this.vaccinationDetails=[
    {
      "BatchNo": 1, "Age": 1,"Vaccination": "Vaccination1", "DueDate": "3/03/2018","Status": "Done","VaccinatedDate": "2/03/2019"
    },
    {
      "BatchNo": 1, "Age": 1,"Vaccination": "Vaccination2", "DueDate": "10/03/2018","Status": "Pending","VaccinatedDate": ""
    },
    {
      "BatchNo": 2, "Age": 4,"Vaccination": "Vaccination3", "DueDate": "22/03/2018","Status": "Done","VaccinatedDate": "23/03/2019"
    },
    {
      "BatchNo": 2, "Age": 4,"Vaccination": "Vaccination1", "DueDate": "27/03/2018","Status": "Pending","VaccinatedDate": ""
    }
  ]
}
download() {
  var csvData = this.ConvertToCSV(this.vaccinationDetails);
  var a = document.createElement("a");
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  var blob = new Blob([csvData], { type: 'text/csv' });
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'Vaccinations report.csv';/* your file name*/
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
