import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/data.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import * as moment from "moment";
import Chart from 'chart.js';

@Component({
  selector: 'app-productionanalysis',
  templateUrl: './productionanalysis.component.html',
  styleUrls: ['./productionanalysis.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ProductionanalysisComponent implements OnInit {
  
  productonAnalysisList: any[];
  req: any;
  isDataLoading: boolean = false;
  date = new Date();
  //productionanalysisFilterForm: FormGroup;
  FROMDATE: Date;
  toDate:Date;
  selectedDate: Date;
  selectedFarm: any;
  //
  myChart:any;
  ctx:any;
  canvas:any;
  EggAvg: any;
  productionlist: any[]=[];
  productionData: any[]=[];
  productiondataSets:any[]=[];
  eggrateData: any= [];
  data: { labels: any; datasets: { label: string; data: any; fill: boolean; borderColor: string;   backgroundColor: string,}[]; };
  dataSets: any[]=[];
  list: any[] = [];
  egglist:any[]=[];
  eggdataSets: any[]=[];
    line: any;
  linetemp: any ;
  bardatapur:any= [];
  linetempfeed: any=[];
  productions:any;
  inwardPayment:any;
  outwardPayment:any;
  sales:any[]=[];
  dailyStock:any[]=[];
  userData: any;
  selectedValue:any;
  selectedEggrateValue:any;
  selectedProductionValue:any;
  FeedColors:any[]=[];
  datasetValue = [];
  feedData: any;
  ProdAvg: any;
  displayDate: any;
  paymentDifference: any;
  totalSales: number;
  curDate:any;
  farmDeatils: any={};
  weatherData:any={};
  temparature: any;
  chart: any;
  backgroundColor: any;
  productionAnalysisForm: FormGroup;

  constructor(private _dataService: DataService, private toastr: ToastrService, private fb: FormBuilder) { 
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm")); 

    this.productionAnalysisForm = fb.group({ 
      fromDate: [this.FROMDATE],
      toDate: [this.toDate],
    });


    const cc = moment();
    const hours=cc.hour();
    if(hours > 17){ 
      this.selectedDate=new Date();
    }else{
      var date=moment().subtract(1, 'days').format();
      this.selectedDate=new Date(date);
    }
    this.curDate = new Date();
  }

  ngOnInit() {
   this.FROMDATE = new Date();
    this.selectedDate = new Date();
    this.FROMDATE.setDate(this.FROMDATE.getDate() - 15);
    this.date = new Date();
    this.productionByView();
    this.EggRateByView();

    
    //     this.FeedColors=[
    // "#dd4b39","#a18181", "#d0f441","#00c0ef","#3c8dbc","#ff851b","#f012be","#00a65a","#605ca8","#00FF00","#000000","#dd4b39"];
    

  }
  // onDateChange(item){
  //   this.FROMDATE=item.value;
  // }

onClearSearch() {
  this.FROMDATE = new Date();
  this.productionAnalysisForm.value.fromDate = this.FROMDATE;
  this.selectedDate = new Date();
  this.FROMDATE.setDate(this.FROMDATE.getDate() - 15);
  this.date = new Date();
  this.productionByView();
  this.EggRateByView();
}
onSearch(){
  this.productionByView();
  this.EggRateByView();

}
//charts 
  //production Percentage Get Chart
  productionByView() {
    this.productionData = [];
    this.productionlist=[];
    this.productiondataSets=[];
    var req = {
    //this.FROMDATE.setDate(this.FROMDATE.getDate() - 15);
   // this.date = new Date();

      "StartDate":this.FROMDATE,
      "EndDate":this.date,
      "view": '',
      "FarmId":this.selectedFarm.FarmId
    }
    this._dataService.Post('Dashboard/GetProductionPercentageByView', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.ProdAvg=Data.Result.avgCartons.AvgCartons;
              this.productionData =  Data.Result.monthlyCartons;
          for (var i = 0; i < this.productionData.length; i++) {
                        this.productionlist.push(new Date(this.productionData[i].Date).toString().slice(0,10));
            this.productiondataSets.push(this.productionData[i].Cartons);
          }

          this.linetemp = {
            labels: this.productionlist,
            datasets: [
              {
               label: 'Production ',
                data: this.productiondataSets,
                //fill: false,
                borderColor: '#4bc0c0'

              }
            ]
          }
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }

//EggRatePerformance Get Chart
EggRateByView() {
  this.eggrateData = [];
  this.egglist= [];
  this.eggdataSets= [];
  var req = {
    "StartDate":this.FROMDATE,
    "EndDate":this.date,
    "view": '',
    "FarmId":this.selectedFarm.FarmId
  }
  this._dataService.Post('Dashboard/GetEggRateByView', req)
    .subscribe((Data) => {        
      if (Data.IsSuccess) {
        this.EggAvg=Data.Result.avgEggRate.AvgEggRate;
        this.eggrateData =  Data.Result.monthlyEggRate;
        for (var i = 0; i < this.eggrateData.length; i++) {
          
            this.egglist.push(new Date(this.eggrateData[i].Date).toString().slice(0,10) );
            this.eggdataSets.push(this.eggrateData[i].EggRate);
        }
        Chart.defaults.global.legend.display = false;
        // Chart.defaults.global.tooltips.enabled = true;
        this.line = {
          labels: this.egglist,
          datasets: [
            {

              label: 'Egg Rate ',
              data: this.eggdataSets,
              //fill: false,
              borderColor: '#4bc0c0'

            }
          ]
        }
      }
      else{
        this.toastr.error("An error has occured");
      }
    },(error)=>{
      this.toastr.error("An error has occured");
    })
}

}
