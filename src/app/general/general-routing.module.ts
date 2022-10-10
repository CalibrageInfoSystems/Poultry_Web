import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlertsComponent } from './alerts/alerts.component';

const routes: Routes = [
{ path: '', component: DashboardComponent },
{ path: 'dashboard', component: DashboardComponent },
{ path: 'alerts', component: AlertsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
   