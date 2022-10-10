import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyproductionreportComponent } from './dailyproductionreport/dailyproductionreport.component';
import { FeedpurchasereportComponent } from './feedpurchasereport/feedpurchasereport.component';
import { EggsaleregisterComponent } from './eggsaleregister/eggsaleregister.component';
import { EggstockregisterComponent } from './eggstockregister/eggstockregister.component';
import { CullbirdsreportComponent } from './cullbirdsreport/cullbirdsreport.component';
import { VaccinationreportComponent } from './vaccinationreport/vaccinationreport.component';
import { ReportsComponent } from './reports.component';
import { AuthGuard } from '../shared/auth.guard';
import { MonthlybalancereportComponent } from './monthlybalancereport/monthlybalancereport.component';
import { IncomeexpensesreportComponent } from './incomeexpensesreport/incomeexpensesreport.component';
import { FeedDueReportComponent } from './feed-due-report/feed-due-report.component';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children:[{ path: 'dailyproduction', component: DailyproductionreportComponent,canActivate: [AuthGuard] },
    { path: 'feedpurchase', component: FeedpurchasereportComponent,canActivate: [AuthGuard] },
    { path: 'eggsale', component: EggsaleregisterComponent,canActivate: [AuthGuard] },
    { path:'eggstock', component:EggstockregisterComponent,canActivate: [AuthGuard]},
    { path: 'cullbirds', component: CullbirdsreportComponent,canActivate: [AuthGuard] },
    { path:'vaccination', component:VaccinationreportComponent,canActivate: [AuthGuard]},
    { path:'monthlybalance', component:MonthlybalancereportComponent,canActivate: [AuthGuard]},
    { path:'incomeexpensesreport', component:IncomeexpensesreportComponent,canActivate: [AuthGuard]},
    { path:'feedduereport', component:FeedDueReportComponent,canActivate: [AuthGuard]}
  ]  
    // ng g c incomeexpensesreport
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }