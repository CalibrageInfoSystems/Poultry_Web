import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Conversion } from 'src/app/shared/convertEggstoBoxes';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/date.adaptor';
import * as moment from "moment";
import { WeatherService } from 'src/app/shared/weather.service';
import Chart from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class DashboardComponent implements OnInit {
  myChart:any;
  ctx:any;
  canvas:any;
  showDate:boolean = false;
  ManageData:any = {};
  EggAvg: any;
  DropdownForFeed:any[]=[];
  Months:any[]=[];
  feedTypes:any[]=[];
  MonthList: any[]=[];
  feedCostlist: any[]=[];
  feedCostdataSets: any[]=[];
  feedCostData: any=[];
  productionlist: any[]=[];
  productionData: any[]=[];
  productiondataSets:any[]=[];
  eggrateData: any= [];
  data: { labels: any; datasets: { label: string; data: any; fill: boolean; borderColor: string;   backgroundColor: string,}[]; };
  dataSets: any[]=[];
  list: any[] = [];
  egglist:any[]=[];
  eggdataSets: any[]=[];
  // piedata: any;
  // bardata: any;
  line: any;
  // pola: any;
  // nut: any;
  linetemp: any ;
  bardatapur:any= [];
  linetempfeed: any=[];
  productions:any;
  inwardPayment:any;
  outwardPayment:any;
  sales:any[]=[];
  dailyStock:any[]=[];
  userData: any;
  Dropdowndata:any[]=[];
  selectedValue:any;
  selectedEggrateValue:any;
  selectedProductionValue:any;
  FeedColors:any[]=[];
  datasetValue = [];
  feedData: any;
  selectedFarm: any;
  ProdAvg: any;
  displayDate: any;
  paymentDifference: any;
  totalSales: number;
  selectedDate: any;
  curDate:any;
  farmDeatils: any={};
  weatherData:any={};
  temparature: any;
  chart: any;
  backgroundColor: any;

  constructor(private messageService: MessageService,private weatherService: WeatherService, private _dataService: DataService,private toastr: ToastrService,private router: Router,private conversion:Conversion) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.selectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
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


  selectData(event) {
    this.messageService.add({ severity: 'info', summary: 'Data Selected', 'detail': this.line.datasets[event.element._datasetIndex].data[event.element._index] });
  }
  selectDatafeed(event){
    this.messageService.add({ severity: 'info', summary: 'Data Selected', 'detail': this.linetempfeed.datasets[event.element._datasetIndex].data[event.element._index] });
  }

  ngOnInit() {
    // this.chart = new Chart('canvas', {
    //   type: 'pie',
    //   data: {
    //     labels: ['Maize','BrokenRice','DOB','Sunflower','Soya','Groundnut','Stone','Chicken Feed','jawar'],
    //     datasets: [
    //       { 
    //         data: [10,10,10,10,10,10,10,10,10,20],
    //         backgroundColor: [
    //           "#FF6384",
    //           "#63FF84",
    //           "#84FF63",
    //           "#8463FF",
    //           "#6384FF",
    //           "#FF9966",
    //           "#9966FF",
    //           "#9966AA",
    //           "#99661C",
    //           "#996699"
    //       ],
    //         fill: false
            
    //       },
    //     ]
    //   },
    //   // options: {
    //   //   legend: {
    //   //     display: false
    //   //   },
    //   //   tooltips:{
    //   //     enabled:false
    //   //   }
    //   // }
    // });
    // this.chart = new Chart('canvases', {
    //   type: 'pie',
    //   data: {
    //      labels: ['Amount'],
    //     datasets: [
    //       { 
    //         data: [50,50],
    //         backgroundColor: ['rgba(255, 0, 0, 1)','rgba(255, 0, 0, 0.1)'],
    //         fill: false
    //       },
    //     ]
    //   },
    //   // options: {
    //   //   legend: {
    //   //     display: false
    //   //   },
    //   //   tooltips:{
    //   //     enabled:false
    //   //   }
    //   // }
    // });

    this.displayDate=null;
    this.selectedDate = null;
    if(this.userData!=null){
      this.router.navigate(['/dashboard']);
    }
    if(this.selectData != null){
      this.getFarmDeatils();
    }
    this.onSelectDate();
    this.Dropdowndata=[    
      {    
        "Id": 0,    
        "Name": 'Week'    
      },    
      {    
        "Id": 1,    
        "Name": 'Month'    
      },    
    ];
    this.DropdownForFeed=[    
      {    
        "Id": 0,    
        "Name": 'Week'    
      },    
      {    
        "Id": 1,    
        "Name": 'Month'    
      },    
      {    
        "Id": 2,    
        
        "Name": 'Year'    
      },
    ];
    this.selectedValue=this.DropdownForFeed[2].Name;
    this.selectedEggrateValue=this.Dropdowndata[0].Name;
    this.selectedProductionValue=this.Dropdowndata[0].Name;
    this.FeedCostPerformance();
    this.productionByView("Week");
    this.EggRateByView("Week");
    this.FeedPurchageByView("Year");
    this.FeedColors=[
    "#dd4b39","#a18181", "#d0f441","#00c0ef","#3c8dbc","#ff851b","#f012be","#00a65a","#605ca8","#00FF00","#000000","#dd4b39"];
    // this.backgroundColor= [
    //   "#D8BFD8",
    //   "#F0F8FF",
    //   "#6495ED",
    //   "#F5F5DC",
    //   "#008B8B",
    //   "#A9A9A9",
    //   "#808000",
    //   "#2E8B57",
    //   "#F5F5F5",
    //   "#9ACD32"
    //             // "#8463FF",
    //             // "#6384FF",
    //             // "#FF9966",
    //             // "#9966FF",
    //             // "#9966AA",
    //             // "#99661C",
    //             // "#996699"
    //         ];
    //         innerWidth=50
  }

  onSelectDate(){
    this.GetAllProductions();    
    this.GetDashboardPaymentsPackingAndProd();    
  }

  onChangeDate(){
    this.selectedDate = this.displayDate;
    this.GetAllProductions();
    this.GetDashboardPaymentsPackingAndProd();    
  }
   onItemNameChangeEvent (item){
    this.FeedPurchageByView(item.value);
    this.myChart.destroy();
   }

   getFarmDeatils(): void {
    this._dataService.Get('CompanyInfo/GetFarmInfoById/',this.selectedFarm.FarmId).subscribe((Data) => {
        if (Data.IsSuccess) {
          this.farmDeatils = Data.ListResult[0];
          this.getWeatherTemparature();
        }
        else {
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      });
  }

  
  getWeatherTemparature(): void {
    this.weatherService.getCurrentWeather(this.farmDeatils.Pincode).subscribe((Data) => {
       this.weatherData =Data;
       if(this.weatherData  != null){
         this.temparature =this.weatherData.main.temp;
       }
       console.log( JSON.stringify(this.weatherData ))
      },(error)=>{
        this.toastr.error("An error has occured");
      });
  }

  GetAllProductions(): void {
    
    var req={
      "FarmId": this.selectedFarm.FarmId,
      "Date": this.selectedDate
    }
    this._dataService.Post('Dashboard/GetDashboardProductionDetails',req).subscribe((Data) => {
        if (Data.IsSuccess) {
          this.productions = Data.ListResult[0];
          this.displayDate=this.productions.Date;
          this.OnManageDateChange();
        }
        else {
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      });
  }
  GetDashboardPaymentsPackingAndProd(): void {
    
    var req={
      "FarmId": this.selectedFarm.FarmId,
      "Date": this.selectedDate
    }
    this._dataService.Post('Dashboard/GetDashboardPaymentsPackingAndProd',req).subscribe((Data) => {
        if (Data.IsSuccess) {
          this.inwardPayment=Data.Result.InwardPayment.InwardPayment;
          this.outwardPayment=Data.Result.OutwardPayment.OutwardPayment
          this.paymentDifference=this.inwardPayment-this.outwardPayment;
          this.sales=Data.Result.sales;
          this.dailyStock=Data.Result.dailyStock;
          this.totalSales = 0;
          var totalEggs = 0;
          if (this.sales!=null) {
            for (let index = 0; index < this.sales.length; index++) {
             totalEggs  = totalEggs + this.sales[index].PackedEggs;             
            }
            this.totalSales = this.conversion.EggstoBoxes(totalEggs);
          }          
        }
        else {
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      });
  }
   //FeedCost Performance
   FeedCostPerformance() {
    this.bardatapur = [];
    this._dataService.Get('Dashboard/GetFeedCostByFY',this.selectedFarm.FarmId)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.feedCostData = Data.ListResult;          
          for (var i = 0; i < this.feedCostData.length; i++) {
            if( this.MonthList[this.feedCostData[i].MonthName]) continue;
            this.MonthList[this.feedCostData[i].MonthName] = true;
            this.Months.push(this.feedCostData[i].MonthName);
             this.feedCostdataSets.push(this.feedCostData[i].FeedCost);
          }

          for(var i = 0; i < this.feedCostData.length; i++){
            if( this.feedCostlist[this.feedCostData[i].FeedName]) continue;
            this.feedCostlist[this.feedCostData[i].FeedName] = true;
            this.feedTypes.push(this.feedCostData[i].FeedName);
          }
          for (var j=0; j<this.feedTypes.length; j++) {  
            this.datasetValue[j] = {
              label: this.feedTypes[j],
              data:  this.getFeedArray(this.feedTypes[j]) ,
              fill: false,
              borderColor: this.FeedColors[j],
          //  backgroundColor:this.backgroundColor[j]
            } 
        }
          this.linetempfeed = {
            labels: this.Months,
            datasets: 
              this.datasetValue
          }
        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }
  getFeedArray(feedType){
    this.feedData=[];
    this.feedData=   this.feedCostData.filter(x=>{ 
      return x.FeedName==feedType
    }); 
    var array=[]
    this.Months.forEach(element => { 
      for(var i = 0; i < this.feedData.length; i++){
        if(this.feedData[i].MonthName==element){
          array.push(this.feedData[i].FeedCost );
        }
      } 
    });
  return array
  }
  //onProductionChangeEvent
  onProductionChangeEvent(item) {
    this.productionByView(item.value);
  }
  //production Percentage Get Chart
  productionByView(item) {
    this.productionData = [];
    this.productionlist=[];
    this.productiondataSets=[];
    var req = {
      "view": item,
      "FarmId":this.selectedFarm.FarmId
    }
    this._dataService.Post('Dashboard/GetProductionPercentageByView', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.ProdAvg=Data.Result.avgCartons.AvgCartons;
          if(item=='Year')
              this.productionData =  Data.Result.yearlyCartons;
          else
              this.productionData =  Data.Result.monthlyCartons;
          for (var i = 0; i < this.productionData.length; i++) {
            if(item=='Year')
              this.productionlist.push(this.productionData[i].Month);
            else
              this.productionlist.push(new Date(this.productionData[i].Date).toString().slice(0,10));
            this.productiondataSets.push(this.productionData[i].Cartons);
          }

          this.linetemp = {
            labels: this.productionlist,
            datasets: [
              {
                label: 'Production ',
                data: this.productiondataSets,
                fill: false,
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

  //EggRatePerformance change event
  onChangeEvent(item) {
    this.EggRateByView(item.value);
  }
  //EggRatePerformance Get Chart
  EggRateByView(item) {
    this.eggrateData = [];
    this.egglist= [];
    this.eggdataSets= [];
    var req = {
      "view": item,
      "FarmId":this.selectedFarm.FarmId
    }
    this._dataService.Post('Dashboard/GetEggRateByView', req)
      .subscribe((Data) => {        
        if (Data.IsSuccess) {
          this.EggAvg=Data.Result.avgEggRate.AvgEggRate;

        if(item=='Year')
          this.eggrateData =  Data.Result.yearlyEggRate;
        else
          this.eggrateData =  Data.Result.monthlyEggRate;

          // this.eggrateData = Data.Result;
          for (var i = 0; i < this.eggrateData.length; i++) {
            if(item=='Year')
              this.egglist.push(this.eggrateData[i].Month);
            else
              this.egglist.push(new Date(this.eggrateData[i].Date).toString().slice(0,10) );

            // this.egglist.push(new Date(this.eggrateData[i].Date).toISOString().slice(0,10));
            this.eggdataSets.push(this.eggrateData[i].EggRate);
          }

          this.line = {
            labels: this.egglist,
            datasets: [
              {

                label: 'Cost ',
                data: this.eggdataSets,
                fill: false,
                borderColor: '#565656'

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



  //feedPurchageView
  FeedPurchageByView(item) {
    this.bardatapur = [];
    this.list=[];
    this.dataSets=[];
    var req = {
      "view": item,
      "FarmId":this.selectedFarm.FarmId
    }
    this._dataService.Post('Dashboard/GetFeedPurchageByView', req)
      .subscribe((Data) => {
        if (Data.IsSuccess) {
          this.bardatapur = Data.ListResult;
          for (var i = 0; i < this.bardatapur.length; i++) {
            this.list.push((this.bardatapur[i].BrokerName));
            this.dataSets.push((this.bardatapur[i].FeedCost).toFixed(2));
          }

          this.data = {
            labels: this.list,
            datasets: [
              {

                label: 'Amount ',
                backgroundColor: '#42A5F5',
                data: this.dataSets,
                fill: false,
                // borderColor: '#4bc0c0'

                borderColor: '#7CB342'
              }
            ]
          }

          this.canvas = document.getElementById('myChart');    
    this.canvas.parentNode.style.height = '250px';
    this.canvas.parentNode.style.width = '100%';
    //this.ctx = this.canvas.getContext('2d');
    
    
    this.myChart = new Chart(this.canvas, {
      type: 'pie',
      data: {
        labels: this.list,
        datasets: [{
          label: '# of Votes',
          data: this.dataSets,
          backgroundColor: [
            '#002b49',
            '#003D66',
            '#0062A3',
            '#0093F5',
            '#33ADFF',
            '#70C6FF',
            '#ADDEFF',
            '#EBF7FF',
            '#143390',
            '#1D4CD7',
            '#4B72E7',
            '#819CEE'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: 'Predicted world population (millions) in 2050'
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            padding: 9,
          },
          onClick: (e) => e.stopPropagation()
        }

      }
    });



        }
        else{
          this.toastr.error("An error has occured");
        }
      },(error)=>{
        this.toastr.error("An error has occured");
      })
  }

  // Manage Date Change event
  OnManageDateChange() {
        this.ManageData = {};
    var req = {
      "FarmId": this.selectedFarm.FarmId,
      "date": this.displayDate
    }

    this._dataService.Post('Log/GetManageRateDetailsByDate', req).subscribe(res => {
      if (res.IsSuccess) {
        this.ManageData = res.Result == null ? {} : res.Result;
        this.showDate = res.Result == null ?false:true
      }
    })

  }

}
