import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

import { UserService } from '../services/user.service';
import { LogsService }  from '../services/logs.service';
import { LoginService } from '../services/login.service';
declare var $;
@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
	userId : any;
	searchForm:FormGroup;
	isDisable:boolean =false;
	userInfo : any;
	currentUserDetail : any;
	fiveDaysLogs: any;
	p: number = 1;
	data = {
		firstDate : "",
		secondDate : "",
	};
	//imported
	modelValue;
	previousData : any;
	logs : any;
	flag = false;
	getLogsBySingleDate = false;
	getLogsBetweenDates = false;
	search = false;
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _userService: UserService,
		private _logService: LogsService,
		private _loginService: LoginService
	){
		this.searchForm = new FormGroup({
			fromDate:new FormControl(''),
			toDate: new FormControl('')
		});
		this.userInfo  = JSON.parse(localStorage.getItem("currentUser"));
		this.userId = this.activatedRoute.snapshot.paramMap.get('id');
		console.log(this.userId);
	}

	ngOnInit() {
		// this.getMACAddress();
		var self = this;
		$(function() {

			var start = moment().subtract(29, 'days');
			var end = moment();

			function cb(start, end) {
				self.getRangeDate(start, end);
				$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
			}

			$('#reportrange').daterangepicker({
				startDate: start,
				endDate: end,
				ranges: {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				}
			}, cb);

			cb(start, end);

		});
		$(document).ready(function(){
			$('[data-toggle="tooltip"]').tooltip();   
		});
		$( function() {
			$("#firstDate").datepicker();
		});
		$( function() {
			$("#secondDate").datepicker();
		});
		this.getUserById();
		this.getInitialRecord();
	}
	get f() { return this.searchForm.controls; }
	getUserById(){
		this._userService.getUserById(this.userId).subscribe((res) => {
			console.log("resposne of singleUser" , res); 
			this.currentUserDetail = res;
		} , (err) => {
			console.log("error of singleUser" , err); 
		});
	}
	toDate(value){
		console.log(value , this.searchForm.value);
		this.isDisable =false;
	}
	getInitialRecord(){
		this._logService.getLastFiveDaysAttendance(this.userId).subscribe((response) => {
			console.log("last five days response" , response);
			this.fiveDaysLogs = response;
		} ,(err) => {
			console.log("last five days error" , err);
		});
	}
	getRecord(){
		this.search = true;
		this.data.firstDate = (<HTMLInputElement>document.getElementById("firstDate")).value;
		// this.data.firstDate = moment(this.data.firstDate).format("DD/MM/YYYY")
		console.log(moment(this.data.firstDate).format("DD/MM/YYYY") == this.data.firstDate);
		this.data.secondDate = (<HTMLInputElement>document.getElementById("secondDate")).value;
		// if(this.data.secondDate)
			// this.data.secondDate = moment(this.data.secondDate).format("DD/MM/YYYY")

		console.log(" ====>" , this.data)
		this.flag = true;
		this.previousData = this.data;
		if(this.data.firstDate && this.data.secondDate){
			this.data['id'] = this.userId;
			console.log(this.data);
			this._logService.getLogsByNameBetweenDates(this.data).subscribe(res =>{
				this.logs = res;
				this.getLogsBetweenDates = true;
				this.getLogsBySingleDate = false;
				console.log(res);
				if(this.logs.length != 0){
					this.previousData = false;
				}
				this.flag = false;
			} , err =>{
				console.log(err);
				this.flag = false;
			});	
		}else if(this.data.firstDate && !this.data.secondDate){
			this.previousData = this.data;
			this.data['id'] = this.userId;
			console.log("Hello" , this.data);
			this._logService.getLogsByNameBySingleDate(this.data).subscribe(res =>{
				console.log(res);
				this.getLogsBetweenDates = false;
				this.getLogsBySingleDate = true;
				this.logs = res;
				if(this.logs.length != 0){
					this.previousData = false;
				}
				this.flag = false;
			} , err =>{
				console.log(err);
				this.flag = false;
			});
		}

	}
	resetForm(){
		this.search = false;
		(<HTMLInputElement>document.getElementById("firstDate")).value = "";
		(<HTMLInputElement>document.getElementById("secondDate")).value = "";

	}
	openModel(index){
		console.log("hey" , index);
		if(!this.search)
			this.modelValue = this.fiveDaysLogs[index];
		else{
			console.log("this.todaysAttendance in else ====>" , this.logs);
			this.modelValue = this.logs[index];
		}
		console.log(this.modelValue);
		$('#myModal').modal('show');
	}
	getRangeDate(start, end){
		moment(start._d).format("DD/MM/YYYY");
		var body = {
			userId : this.userId,
			startDate : moment(start._d).format("DD/MM/YYYY"),
			endDate : moment(end._d).format("DD/MM/YYYY")
		}
		this._logService.getLogsReportById(body).subscribe((res)=>{
			console.log("response of getLogsReportById" , res);
		} , (err)=>{
			console.log("err of getLogsReportById" , err);
		});
		// console.log(moment(start._d).format("DD/MM/YYYY"),moment(end._d).format("DD/MM/YYYY"));
	}
	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this.router.navigate(['login']);
	}
// 	getMACAddress() {
// 		require('getmac').getMac(function (err, macAddress) {
// 			if (err) throw err
// 				console.log(macAddress)
// 			alert(macAddress);
// 		})
// }
}
