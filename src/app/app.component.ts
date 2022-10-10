import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/data.service';
import * as $ from 'jquery';
import * as moment from "moment";
import { ToastrService } from 'ngx-toastr';
import { WeatherService } from 'src/app/shared/weather.service';
import { MessageService } from 'primeng/primeng';
import { DataFactory } from './shared/dataFactory';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  curDate:any;
  SelectedFarm: any;
  req: any;
  Alerts: any;
  userData: any;
  isload: boolean = false;
  userActivityRights: any;
  ReadAlerts: any;
  dataRefresher :any;
  userFarms: any;
  isFarm1:boolean=true;
  isFarm2:boolean=false;
  FaramOne:any;
  farmDeatils: any={};
  weatherData:any={};
  temparature: any;
  line: any;
  // pola: any;
  // nut: any;
  linetemp: any ;
  bardatapur:any= [];
  linetempfeed: any=[];
  BSP:number;
  BSPC:number;
  constructor(private messageService: MessageService,private router: Router, private weatherService: WeatherService, private _dataService: DataService,private toastr: ToastrService ) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.userFarms = JSON.parse(localStorage.getItem("FarmsInfo"));
    this.SelectedFarm = JSON.parse(localStorage.getItem("SelectedFarm"));
    this.userActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.isload = this.userData == undefined || null ? false : true
   // this.FaramOne=localStorage.setItem('FirstFarm', JSON.stringify(this.userFarms.farm[0]));
   this.curDate = new Date();
    
  }

  

  selectData(event) {
    this.messageService.add({ severity: 'info', summary: 'Data Selected', 'detail': this.line.datasets[event.element._datasetIndex].data[event.element._index] });
  }
  ngOnInit() {
    this.BSP = DataFactory.FarmIds.BSP;
    this.BSPC = DataFactory.FarmIds.BSPC
    if(this.selectData != null){
      this.getFarmDeatils();
    }
    // this.AlertInfo();
    // this.dataRefresher  = setInterval(() => {
    //   this.AlertInfo(); 
    // }, 120000);
  }
  // ngOnDestroy() {
  //   if (this.dataRefresher ) {
  //     clearInterval(this.dataRefresher );
  //   }
  // }

  title = 'Poultry';

  // ngAfterViewInit() {
  //   $.getScript('assets/js/custom.js');
  // }

  // AlertInfo() {
  //   var req =
  //   {
  //     "UserId": this.userData.Id,
  //     "Id": null
  //   }
  //   this._dataService.Post('Alert/GetAlertByUser', req)
  //     .subscribe((Data) => {
  //       if (Data.IsSuccess) {
  //         this.Alerts = Data.ListResult;
  //         this.ReadAlerts = this.Alerts.filter(
  //           alert => alert.IsRead === false);
  //       }
  //     })
  // }

  OnFarmSelect(farm){
    
    localStorage.removeItem("SelectedFarm");
    localStorage.setItem('SelectedFarm', JSON.stringify(farm));
    //event.target.classList.add('sample2');

    // this.isFarm1=false;
    // this.isFarm2=true;
  }
  
 

  logout() {
    localStorage.removeItem("UserInfo");
    localStorage.removeItem("FarmsInfo");
    localStorage.removeItem("SelectedFarm"); 
    localStorage.removeItem("BatchInfo");
    // window.location.href = '/Poultry/login';   
    window.location.href = '/PoultryWeb_Test/login'; 
  }
  getFarmDeatils(): void {
    this._dataService.Get('CompanyInfo/GetFarmInfoById/',this.SelectedFarm.FarmId).subscribe((Data) => {
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






















}
