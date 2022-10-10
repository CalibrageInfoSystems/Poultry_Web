import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChickTrasitionsRoutingModule } from './ChickTransitions-routing.module';
import { ChickShedComponent } from './chick-shed/chick-shed.component';
import { ChickTransitionsComponent } from './chick-transitions.component';
import {TableModule} from 'primeng/table';
import { GrowerShedComponent } from './grower-shed/grower-shed.component';
import { LayerShedComponent } from './layer-shed/layer-shed.component';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule,MatFormFieldModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatSelectModule  } from '@angular/material';
import { CullingBirdsComponent } from './culling-birds/culling-birds.component';


@NgModule({
  declarations: [ChickShedComponent, ChickTransitionsComponent,GrowerShedComponent,LayerShedComponent,CullingBirdsComponent],
  imports: [
    CommonModule,
    ChickTrasitionsRoutingModule,
    TableModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule     
  ]
})
export class ChickTrasitionsModule { }
