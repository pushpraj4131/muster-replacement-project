import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import  { config } from '../config'; 
@Injectable({
	providedIn: 'root'
})
export class LoginService {

	private currentUserSubject: BehaviorSubject<any>;
	public currentUser: Observable<any>;
	constructor(public _http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}
	public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }
	loginUser(body){
		return this._http.post(  config.baseApiUrl+"user/login" , body)
		.pipe(map(user => {
			console.log("login user=========>", user);
			if (user) {
				localStorage.setItem('currentUser', JSON.stringify(user));

				this.currentUserSubject.next(user);
			}

			return user;
		}));
	}
	logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
     	this.currentUserSubject.next(null);
     	
    }
}
