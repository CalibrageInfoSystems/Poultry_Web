import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/primeng';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {PaginatorModule} from 'primeng/paginator';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthGuard } from './shared/auth.guard';
import { Conversion } from './shared/convertEggstoBoxes';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    LoginComponent,
    ChangepasswordComponent    
  ],
  imports: [
    NgxSpinnerModule,
    ChartsModule,
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    PaginatorModule,
    ModalModule.forRoot()
  ],
  providers: [ MessageService,AuthGuard,Conversion],
  entryComponents: [ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
