import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component'
import {LoginComponent} from './login/login.component'
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: '',  loadChildren: './general/general.module#GeneralModule',canActivate: [AuthGuard] },
  { path: 'chick',  loadChildren: './ChickTransitions/ChickTrasitions.module#ChickTrasitionsModule',canActivate: [AuthGuard] },
  { path: 'log',  loadChildren: './logs/logs.module#LogsModule',canActivate: [AuthGuard] },
  { path: 'userdata',  loadChildren: './userdata/userdata.module#UserDataModule',canActivate: [AuthGuard] },
  { path: 'benchmark',  loadChildren: './benchmark/benchmark.module#BenchMarkModule',canActivate: [AuthGuard] },
  { path:'masters', loadChildren: './masters/masters.module#MastersModule',canActivate: [AuthGuard]},
  { path: 'farm',  loadChildren: './farm-activities/farm-activities.module#farmactivitiesModule',canActivate: [AuthGuard]},
  { path: 'reports',  loadChildren: './reports/reports.module#reportsModule',canActivate: [AuthGuard]},
  { path: 'login', component:LoginComponent},
  // { path: '', component:AppComponent},
  { path: 'changePassword', component:ChangepasswordComponent},
  // { path: '', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
