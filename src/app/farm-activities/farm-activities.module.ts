import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { farmactivitiesRoutingModule } from './farm-activities-routing.module';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BatchDetailsComponent } from './batch-details/batch-details.component';
import { ShedDetailsComponent } from './shed-details/shed-details.component';
import { FeedPurchaseComponent } from './feed-purchase/feed-purchase.component';
import { FeedGrindingComponent } from './feed-grinding/feed-grinding.component';
import { VaccinationDetailsComponent } from './vaccination-details/vaccination-details.component';
import { FarmActivitiesComponent } from './farm-activities.component';
import {MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatAutocompleteModule, MatDialogModule} from '@angular/material';
import { InwordRegisterComponent } from './inword-register/inword-register.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TabViewModule } from 'primeng/primeng';
import { FeedTransactionDialogComponent } from './feed-transaction-dialog/feed-transaction-dialog.component';
import { ViewTransactionsDialogComponent } from './view-transactions-dialog/view-transactions-dialog.component';
import { TitleCasePipe } from '../shared/Pipes/TitleCase.Pipe';
import { IncomeExpensesComponent } from './income-expenses/income-expenses.component';
import {DialogModule} from 'primeng/dialog';
import { DataTableModule } from 'primeng/primeng'; 
import { PaginatorModule } from 'primeng/primeng'; 
import { Currency } from '../shared/Pipes/indformet.pipe';
import { BatchPerfomanceComponent } from './batch-perfomance/batch-perfomance.component';
import { ChartModule } from 'primeng/primeng';
import { ProductionanalysisComponent } from './productionanalysis/productionanalysis.component';
import { ChartsModule } from 'ng2-charts';
import {ToastModule} from 'primeng/toast';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [Currency,FarmActivitiesComponent,BatchDetailsComponent, ShedDetailsComponent, FeedPurchaseComponent, FeedGrindingComponent, VaccinationDetailsComponent, InwordRegisterComponent, FeedTransactionDialogComponent, ViewTransactionsDialogComponent,TitleCasePipe, IncomeExpensesComponent, BatchPerfomanceComponent, ProductionanalysisComponent],
  imports: [
    DataTableModule,
    ToastModule,
    ChartsModule,
    PaginatorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    farmactivitiesRoutingModule,
    TableModule,
    CalendarModule,
    FormsModule,
    ChartModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    TabViewModule,
    MatDialogModule,
    DialogModule,
    NgxSpinnerModule
  ],
  entryComponents: [FeedTransactionDialogComponent,ViewTransactionsDialogComponent],
})
export class farmactivitiesModule { }
