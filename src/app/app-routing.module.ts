import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import component
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LogsSummaryComponent } from './logs-summary/logs-summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AppComponent } from './app.component';
const routes: Routes = [
	{
		path:"app-component",
		component : AppComponent,
	},
	{
		path:"",
		component : DashboardComponent,
	},
	{
		path : 'logs-summary',
		component : LogsSummaryComponent
	},
	{
		path : 'user-profile',
		component : UserProfileComponent
	},
	{
		path : 'login',
		component : LoginComponent
	},
	{
		path : 'all-users',
		component : AllUsersComponent
	},
	{
		path : 'all-users/user-detail/:id',
		component : UserDetailComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
