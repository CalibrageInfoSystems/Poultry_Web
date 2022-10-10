import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { AddroleComponent } from './addrole/addrole.component';
import { ForminfoComponent } from './forminfo/forminfo.component';
import { CompanyinfoComponent } from './companyinfo/companyinfo.component';

import { UserdataComponent } from './userdata.component';


// import { LayerShedComponent } from './layer-shed/layer-shed.component';


const routes: Routes = [
    { path: '', component: UserdataComponent },
    { path: 'addrole', component: AddroleComponent },
    { path: 'forminfo', component: ForminfoComponent },
    { path: 'companyinfo', component: CompanyinfoComponent },
    { path: 'userinfo', component: UserinfoComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDataRoutingModule { }
