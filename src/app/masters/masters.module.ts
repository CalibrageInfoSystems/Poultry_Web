import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersComponent } from './masters.component';
import { FeedComponent } from './feed/feed.component';
import { FeedBrokersComponent } from './feed-brokers/feed-brokers.component';
import { TableModule } from 'primeng/table';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { PaymentConditionsComponent } from './payment-conditions/payment-conditions.component';
import { VaccinationComponent } from './vaccination/vaccination.component';
import { MaterialsComponent } from './materials/materials.component';
import { MastersRoutingModule } from './masters-routing.module';
import {MatDatepickerModule,MatNativeDateModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatCheckboxModule} from '@angular/material';
import {DataTableModule, ButtonModule, SharedModule, DropdownModule} from 'primeng/primeng';
import { EggTradersComponent } from './egg-traders/egg-traders.component';
import { HatcheriesComponent } from './hatcheries/hatcheries.component';
import { NgxSpinnerModule } from "ngx-spinner";



@NgModule({
  declarations: [MastersComponent,FeedComponent,FeedBrokersComponent,PaymentConditionsComponent,VaccinationComponent, MaterialsComponent, EggTradersComponent, HatcheriesComponent  ],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    TableModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MastersRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    DataTableModule, ButtonModule, SharedModule,DropdownModule,MatCheckboxModule
    
    
  ]
})
export class MastersModule { }
