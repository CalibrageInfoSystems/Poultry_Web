import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MastersComponent } from './masters.component';
import { FeedComponent } from './feed/feed.component';
import { FeedBrokersComponent } from './feed-brokers/feed-brokers.component';
import { MaterialsComponent } from './materials/materials.component';
import { PaymentConditionsComponent } from './payment-conditions/payment-conditions.component';
import { VaccinationComponent } from './vaccination/vaccination.component';
import { EggTradersComponent } from './egg-traders/egg-traders.component';
import { HatcheriesComponent } from './hatcheries/hatcheries.component';
import { AuthGuard } from '../shared/auth.guard';


const routes: Routes = [
  { path: '', component: MastersComponent, 
  children: [
    { path: 'feed', component: FeedComponent ,canActivate: [AuthGuard]},
    { path: 'feedbroker', component: FeedBrokersComponent,canActivate: [AuthGuard] },
    { path: 'materials', component: MaterialsComponent,canActivate: [AuthGuard] },
    { path: 'paymentcondition', component: PaymentConditionsComponent,canActivate: [AuthGuard] },
    { path: 'vaccination', component: VaccinationComponent,canActivate: [AuthGuard] },
    { path: 'eggtrader', component: EggTradersComponent ,canActivate: [AuthGuard]},
    { path: 'hatcheries', component: HatcheriesComponent,canActivate: [AuthGuard] },
  ]
}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
