import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogRoutingModule  } from './logs-routing.module';
import {AddlogsComponent  } from './addlogs/addlogs.component';
import {ViewlogsComponent  } from './viewlogs/viewlogs.component';
import {EggprotectionlogComponent  } from './eggprotectionlog/eggprotectionlog.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatSelectModule,MatCheckboxModule  } from '@angular/material';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { LogsComponent } from './logs.component';
// Import PrimeNG modules
import {DataTableModule, ButtonModule, SharedModule} from 'primeng/primeng';
import { EggSaleRegisterComponent } from './egg-sale-register/egg-sale-register.component';
import { AddDailyLogsComponent } from './add-daily-logs/add-daily-logs.component';
// import { BrowserModule } from '@angular/platform-browser';
import { Currency } from '../shared/Pipes/rupees.pipe';
import {DialogModule} from 'primeng/dialog';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [Currency,LogsComponent,AddlogsComponent,ViewlogsComponent,EggprotectionlogComponent, EggSaleRegisterComponent, AddDailyLogsComponent],
  imports: [
    CommonModule,
    LogRoutingModule,
    DialogModule,
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
    MatCheckboxModule,
    FormsModule, DataTableModule, ButtonModule, SharedModule,NgxSpinnerModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LogsModule { }
