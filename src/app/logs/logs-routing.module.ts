import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddlogsComponent } from './addlogs/addlogs.component';
import { ViewlogsComponent } from './viewlogs/viewlogs.component';
import { EggprotectionlogComponent } from './eggprotectionlog/eggprotectionlog.component';
import { LogsComponent } from './logs.component';
import { EggSaleRegisterComponent } from './egg-sale-register/egg-sale-register.component';
import { AddDailyLogsComponent } from './add-daily-logs/add-daily-logs.component';
import { AuthGuard } from '../shared/auth.guard';

// import { LayerShedComponent } from './layer-shed/layer-shed.component';


const routes: Routes = [
    { path: '', component: LogsComponent,canActivate: [AuthGuard] },
    { path: 'addlog', component: AddlogsComponent,canActivate: [AuthGuard] },
    { path: 'viewlog', component: ViewlogsComponent ,canActivate: [AuthGuard]},
    { path: 'eggprotection', component: EggprotectionlogComponent ,canActivate: [AuthGuard]},
    { path: 'eggsalereg', component: EggSaleRegisterComponent,canActivate: [AuthGuard] },
    {path:'adddailylog',component:AddDailyLogsComponent,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogRoutingModule { }
