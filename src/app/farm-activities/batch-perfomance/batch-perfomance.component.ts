import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { ToastrService } from 'ngx-toastr';
import { Conversion } from 'src/app/shared/convertEggstoBoxes';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-batch-perfomance',
  templateUrl: './batch-perfomance.component.html',
  styleUrls: ['./batch-perfomance.component.scss']
})
export class BatchPerfomanceComponent implements OnInit {
  rightsdata: any[] = [];
  userData: any;
  ActivityRights: any;
  FarmInfo: any;
  batchAnalysisData: any[] = [];
  batchDetailsList: any[] = [];
  activeBatches: any[] = [];
  selectedBatchIds: any[] = [];
  linetempfeed: any = [];
  linetempMorality: any = [];
  linetempProduction: any = [];
  types: any[] = [];
  Week: string[] = [];
  WeekList: any[] = [];
  feedData: any[] = [];
  MoralityData: any[] = [];
  ProductionData: any[] = [];
  analysisData: any[] = [];
  FeedColors: any[] = [];
  productiondatasetValue: any[] = [];
  mortalitydatasetValue: any[] = [];
  datasetValueM: any[] = [];
  datasetValueP: any[] = [];
  options: any;
  mortality: any;
  StartDate: any;
  ProductionInCartons: any;
  feed: any;
  productionInCartons: any;
  checked: boolean = false;
  selectedBatches: any[] = [];
  batchTypes: any[] = [];
  batchNameslist: any[] = [];
  feedCostlist: any[]=[];
  feedCostdataSets: any[] = [];
  feedTypes:any[]=[];
  constructor(private _dataService: DataService, private toastr: ToastrService, 
    private conversion: Conversion, private spinner:NgxSpinnerService) {
    this.userData = JSON.parse(localStorage.getItem("UserInfo"));
    this.ActivityRights = JSON.parse(localStorage.getItem("UserActivityRights"));
    this.FarmInfo = JSON.parse(localStorage.getItem("SelectedFarm"));

    this.options = {
      legend: {
        display: false
      }
    };
  }

  ngOnInit() {    
    this.getBatches();
    this.types = [ 'Mortalirt', 'Production'];
    this.FeedColors = [
      "#dd4b39", "#a18181", "#d0f441", "#00c0ef", "#3c8dbc", "#ff851b", "#f012be", "#00a65a", "#605ca8", "#00FF00", "#000000", "#dd4b39"];
  }


  //Get all Batches
  getBatches(): void {    
    this.spinner.show();
    var Id = null;
    this._dataService.GetAll('CompanyInfo/GetBatchInfoById' + '/' + Id + '/' + this.FarmInfo.FarmId)
      .subscribe((Data) => { 
        this.spinner.hide();       
        if (Data.IsSuccess) {
          this.batchDetailsList = Data.ListResult;
          this.activeBatches = this.batchDetailsList.filter(
            task => task.IsActive === true);
          this.selectedBatchIds = this.activeBatches.map(a => a.Id);
          this.selectedBatches = this.activeBatches;
          // this.selectedBatch = this.selectedBatch == 0? this.activeBatches[0].Id:this.selectedBatch; 
          // this. getBatchpermanceData  
          this.onSearchClick()
        }
        else {
          this.toastr.error("An error has occured");
        }
      },
        (error) => {
          this.toastr.error("An error has occured");
        });
  }
  onCheckedChange(checked) {
    this.selectedBatchIds = [];
    if (checked) {
      for (var i = 0; i < this.batchDetailsList.length; i++) {
        this.rightsdata.push(this.batchDetailsList[i].Id);
      }
      if (this.rightsdata.length > 0)
        this.selectedBatchIds = this.rightsdata;
    }
    else {
      this.selectedBatchIds = [];
    }

  }

  onChange(deviceValue) {
    this.selectedBatchIds = [];
    this.selectedBatchIds = deviceValue;
    var len = this.batchDetailsList.length;
    if (len == deviceValue.length) {
      this.checked = true;
    }
    else {
      this.checked = false;
    }


  }
  // Get Batch Details 
  getBatchpermanceData() {    
    this.analysisData = [];
    this.batchAnalysisData=[];
    this.ProductionData = [];
    this.feedData = [];
    this.MoralityData = [];
    this.WeekList = [];
    this.Week = [];    
    this.batchNameslist=[];
    this.spinner.show();
    this._dataService.GetAll('CompanyInfo/GetBatchAnalysisByBatchId/' + this.selectedBatchIds.join(",")).subscribe(res => {
    this.spinner.hide();
      if (res.IsSuccess) {        
         this.batchAnalysisData = res.ListResult;
        // this.batchAnalysisData=res.ListResult.sort((a, b) => (a.WeekCount < b.WeekCount ? -1 : 1));
        // Getting Sum Of Production And Mortality data batch wise

        for (var i = 0; i < this.selectedBatches.length; i++) {
          // splitting  Batch wise deatils in selected batches
          var plist = this.batchAnalysisData.filter(m => m.BatchId == this.selectedBatches[i].Id);
          let sumM: any = 0; let sumP: any = 0;
          // sum of Batch Wise Mortality
          plist.forEach(a => sumM += a.Mortality);
          this.selectedBatches[i].TMortality = sumM;
          // sum of Batch Wise Production
          plist.forEach(p => sumP += p.ProductionInCartons);
          this.selectedBatches[i].TProduction = sumP;
        }

        // Data caluclation for Line Chart  //  start
        for (var i = 0; i < this.batchAnalysisData.length; i++) {
          if (this.WeekList[this.batchAnalysisData[i].WeekCount]) continue;
          this.WeekList[this.batchAnalysisData[i].WeekCount] = true;
          this.Week.push(this.batchAnalysisData[i].WeekCount);
          //  this.feedCostdataSets.push(this.batchAnalysisData[i].WeekCount);
        }
     
        this.batchTypes =[];
        for(var i = 0; i < this.batchAnalysisData.length; i++){
          if( this.batchNameslist[this.batchAnalysisData[i].BatchName]) continue;
          this.batchNameslist[this.batchAnalysisData[i].BatchName] = true;
          this.batchTypes.push(this.batchAnalysisData[i].BatchName);
        }

       
        this.productiondatasetValue=[];
        for (var j = 0; j < this.batchTypes.length; j++) {
          this.productiondatasetValue[j] = {
            label: this.batchTypes[j],
            data: this.getProductiomArray(this.batchTypes[j]),
            fill: false,
            borderColor: this.FeedColors[j],
          }
        }

        this.mortalitydatasetValue = [];
        for (var j = 0; j < this.batchTypes.length; j++) {
          this.mortalitydatasetValue[j] = {
            label: this.batchTypes[j],
            data: this.getMortalityArray(this.batchTypes[j]),
            fill: false,
            borderColor: this.FeedColors[j],
          }
        }

        this.linetempProduction = {
          labels: this.Week,
          datasets:this.productiondatasetValue
        }
        this.linetempMorality = {
          labels: this.Week,
          datasets: this.mortalitydatasetValue
        }
        // Data caluclation for Line Chart // end

        // let sumA: any = 0; let sumB: any = 0;
        // let sumC: any = 0; let sumD: any = 0;
        // this.StartDate = this.batchAnalysisData[0].StartDate
        // this.batchAnalysisData.forEach(a => sumB += a.Mortality);
        // this.mortality = sumB;
        // this.batchAnalysisData.forEach(a => sumC += a.Feed);
        // this.feed = sumC;
        // this.batchAnalysisData.forEach(a => sumD += a.ProductionInCartons);
        // this.productionInCartons = Math.round(sumD);
      }

      else {
        this.toastr.error("An error has occured");
      }
    },
      (error) => {
        this.toastr.error("An error has occured");
      });
  }

  getProductiomArray(feedType) {    
    this.feedData = [];
    this.feedData = this.batchAnalysisData.filter(x => {
      return x.BatchName == feedType
    });
    var array = []
    this.Week.forEach(element => {
      for (var i = 0; i < this.feedData.length; i++) {
        if (this.feedData[i].WeekCount == element) {
          array.push(this.feedData[i].ProductionInCartons);
        }        
      }
    });
    return array
  }
  getMortalityArray(feedType) {    
    this.feedData = [];
    this.feedData = this.batchAnalysisData.filter(x => {
      return x.BatchName == feedType
    });
    var array = []
    this.Week.forEach(element => {
      for (var i = 0; i < this.feedData.length; i++) {
        if (this.feedData[i].WeekCount == element) {
          array.push(this.feedData[i].Mortality);
        }
      }
    });
    return array
  }

  // Clear the data
  onClearSearch() {
    this.selectedBatchIds = this.activeBatches.map(a => a.Id);
    this.selectedBatches = this.batchDetailsList.filter(b => this.selectedBatchIds.includes(b.Id));
    this.getBatchpermanceData();
  }
  onSearchClick() {    
    this.selectedBatches = this.batchDetailsList.filter(b => this.selectedBatchIds.includes(b.Id));
    this.getBatchpermanceData();
  }
}
