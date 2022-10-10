import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BenchMarkRoutingModule  } from './benchmark-routing.module';
import {VaccinationComponent  } from './vaccination/vaccination.component';
import {TemparatureComponent  } from './temparature/temparature.component';
// import {EggprotectionlogComponent  } from './eggprotectionlog/eggprotectionlog.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatSelectModule  } from '@angular/material';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { BenchmarkComponent } from './benchmark.component';
// import { ChartModule, TabViewModule } from 'primeng/primeng';
// import { ChartsModule } from 'ng2-charts';
// Import PrimeNG modules
import {DataTableModule, ButtonModule, SharedModule, TabViewModule} from 'primeng/primeng';

// charts 
import {ChartModule} from 'primeng/chart';





@NgModule({
  declarations: [BenchmarkComponent,VaccinationComponent,TemparatureComponent],
  imports: [
    CommonModule,
    BenchMarkRoutingModule,
    ChartModule,
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
    FormsModule, 
    DataTableModule, 
    ButtonModule, 
    SharedModule,
    // ChartsModule,
    TabViewModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class BenchMarkModule { }
