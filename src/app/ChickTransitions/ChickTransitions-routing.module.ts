import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChickShedComponent } from './chick-shed/chick-shed.component';
import { ChickTransitionsComponent } from './chick-transitions.component';
import { GrowerShedComponent } from './grower-shed/grower-shed.component';
import { LayerShedComponent } from './layer-shed/layer-shed.component';
import { CullingBirdsComponent } from './culling-birds/culling-birds.component';
import { AuthGuard } from '../shared/auth.guard';


const routes: Routes = [
    { path: '', component: ChickTransitionsComponent,canActivate: [AuthGuard] },
    { path: 'chickshed', component: ChickShedComponent,canActivate: [AuthGuard] },
    { path: 'growershed', component: GrowerShedComponent,canActivate: [AuthGuard] },
    { path: 'layershed', component: LayerShedComponent,canActivate: [AuthGuard] },
    { path:'cullingbirds', component:CullingBirdsComponent,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChickTrasitionsRoutingModule { }
