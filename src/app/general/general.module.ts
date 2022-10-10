import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { GeneralComponent } from './general/general.component';
import { ChartModule } from 'primeng/primeng';
import { GeneralComponent } from './general.component';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule } from '@angular/material';
import {ToastModule} from 'primeng/toast';
import { AlertsComponent } from './alerts/alerts.component';
import { Currency } from '../shared/Pipes/currency.pipe';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [DashboardComponent, GeneralComponent, AlertsComponent,Currency],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    ChartModule,
    TableModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ToastModule,
    ChartsModule,
    NgxSpinnerModule
  ]
})
export class GeneralModule { }
