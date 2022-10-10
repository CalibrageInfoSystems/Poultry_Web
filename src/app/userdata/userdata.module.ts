import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserDataRoutingModule  } from './userdata-routing.module';
import {UserinfoComponent  } from './userinfo/userinfo.component';
import {AddroleComponent  } from './addrole/addrole.component';
import {ForminfoComponent  } from './forminfo/forminfo.component';
import {CompanyinfoComponent  } from './companyinfo/companyinfo.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatSelectModule,MatCheckboxModule  } from '@angular/material';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { UserdataComponent } from './userdata.component';

import {FieldsetModule} from 'primeng/fieldset';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  declarations: [UserdataComponent,UserinfoComponent,AddroleComponent,ForminfoComponent,CompanyinfoComponent],
  imports: [
    CommonModule,
    UserDataRoutingModule,
    TableModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule  ,
    FieldsetModule ,
    NgxSpinnerModule 
  ]
})
export class UserDataModule { }
