import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatSelectModule ,MatCheckboxModule } from '@angular/material';
import { DailyproductionreportComponent } from './dailyproductionreport/dailyproductionreport.component';
import { FeedpurchasereportComponent } from './feedpurchasereport/feedpurchasereport.component';
import { EggsaleregisterComponent } from './eggsaleregister/eggsaleregister.component';
import { EggstockregisterComponent } from './eggstockregister/eggstockregister.component';
import { CullbirdsreportComponent } from './cullbirdsreport/cullbirdsreport.component';
import { VaccinationreportComponent } from './vaccinationreport/vaccinationreport.component';
import { ReportsComponent } from './reports.component';
import { MonthlybalancereportComponent } from './monthlybalancereport/monthlybalancereport.component';
import { Currency } from '../shared/Pipes/currencyformet.pipe';
import { IncomeexpensesreportComponent } from './incomeexpensesreport/incomeexpensesreport.component';
import { FeedDueReportComponent } from './feed-due-report/feed-due-report.component';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [Currency,ReportsComponent,DailyproductionreportComponent, FeedpurchasereportComponent,EggsaleregisterComponent,EggstockregisterComponent,CullbirdsreportComponent,VaccinationreportComponent, MonthlybalancereportComponent, IncomeexpensesreportComponent, FeedDueReportComponent],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    ReportsRoutingModule,
    TableModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule  ,
    MatCheckboxModule   
  ]
})
export class reportsModule { }
