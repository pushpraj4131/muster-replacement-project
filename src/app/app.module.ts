import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
// import {  } from './app.ro';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { FilterPipe} from './filter.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogsSummaryComponent } from './logs-summary/logs-summary.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { FilterPipe } from './filter.pipe';
import { AllUsersComponent } from './all-users/all-users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LogsSummaryComponent,
    UserProfileComponent,
    LoginComponent,
    FilterPipe,
    AllUsersComponent,
    UserDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
