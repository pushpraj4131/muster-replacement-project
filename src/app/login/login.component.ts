import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm:FormGroup;
	isDisable:boolean =false;
	constructor( 
		public _loginService: LoginService,
		private route: ActivatedRoute,
		private router: Router,
		) {
		if (this._loginService.currentUserValue) { 
			this.router.navigate(['/']);
		}

		this.loginForm = new FormGroup({
			email: new FormControl('', Validators.required),
			password:new FormControl('' , Validators.required)
		});
	}

	ngOnInit() {
	}
	get f() { return this.loginForm.controls; }

	login(value){
		this._loginService.loginUser(value).subscribe((response) => {
			console.log("successfull login"  , response);
			this.isDisable = false;
			localStorage.setItem('currentUser', JSON.stringify(response));
			// this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
			this.router.navigate(['app-component']);
		} , (err) => {
			console.log("err in login " , err);
		})
		console.log(value);
	}
}
