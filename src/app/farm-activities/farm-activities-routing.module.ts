import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FarmActivitiesComponent } from './farm-activities.component';
import { BatchDetailsComponent } from './batch-details/batch-details.component';
import { ShedDetailsComponent } from './shed-details/shed-details.component';
import { FeedPurchaseComponent } from './feed-purchase/feed-purchase.component';
import { FeedGrindingComponent } from './feed-grinding/feed-grinding.component';
import { VaccinationDetailsComponent } from './vaccination-details/vaccination-details.component';
import { InwordRegisterComponent } from './inword-register/inword-register.component';
import { AuthGuard } from '../shared/auth.guard';
import { IncomeExpensesComponent } from './income-expenses/income-expenses.component';
import { BatchPerfomanceComponent } from './batch-perfomance/batch-perfomance.component';
import { ProductionanalysisComponent } from './productionanalysis/productionanalysis.component';



const routes: Routes = [
  {
      path: '',
      component: FarmActivitiesComponent,
      children: [
        { path: 'batchdetails', component: BatchDetailsComponent,canActivate: [AuthGuard] },
        { path: 'sheddetails', component: ShedDetailsComponent,canActivate: [AuthGuard] },
        { path: 'feedpurchase', component: FeedPurchaseComponent,canActivate: [AuthGuard] },
        { path: 'feedgrinding', component: FeedGrindingComponent,canActivate: [AuthGuard]},
        { path: 'vaccinationdetails', component: VaccinationDetailsComponent,canActivate: [AuthGuard] },
        { path: 'inoutregister', component: InwordRegisterComponent,canActivate: [AuthGuard] },
        { path: 'incomeexpenses', component: IncomeExpensesComponent,canActivate: [AuthGuard] },
        { path: 'batchperformance', component: BatchPerfomanceComponent,canActivate: [AuthGuard] },
        { path: 'productanalysis', component: ProductionanalysisComponent,canActivate: [AuthGuard] },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class farmactivitiesRoutingModule { }
