import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VaccinationComponent } from './vaccination/vaccination.component';
import { TemparatureComponent } from './temparature/temparature.component';
// import { EggprotectionlogComponent } from './eggprotectionlog/eggprotectionlog.component';
import { BenchmarkComponent } from './benchmark.component';
import { AuthGuard } from '../shared/auth.guard';

// import { LayerShedComponent } from './layer-shed/layer-shed.component';


const routes: Routes = [
    { path: '', component: BenchmarkComponent,canActivate: [AuthGuard] },
    { path: 'vaccination', component: VaccinationComponent,canActivate: [AuthGuard] },
    { path: 'temprature', component: TemparatureComponent,canActivate: [AuthGuard] },
    // { path: 'eggprotection', component: EggprotectionlogComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenchMarkRoutingModule { }
