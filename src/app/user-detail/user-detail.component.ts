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
	totalHoursToWork :any;
	totalHoursWorked :any;
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
		this.search = false;
		this._logService.getLastFiveDaysAttendance(this.userId).subscribe(async (response) => {
			console.log("last five days response" , response);
			await this.properFormatDate(response);
			this.fiveDaysLogs = response;
			await this.calculateTotalDuration(this.fiveDaysLogs);
		} ,(err) => {
			console.log("last five days error" , err);
		});
	}
	resetForm(){
		this.search = false;
		(<HTMLInputElement>document.getElementById("reportrange")).value = "";
		// (<HTMLInputElement>document.getElementById("secondDate")).value = "";

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
		if(this.fiveDaysLogs){
		console.log(" date " ,new Date(start._d).toISOString() , new Date(end._d).toISOString());
		var body = {
			userId : this.userId,
			startDate : new Date(start._d).toISOString(),
			endDate : new Date(end._d).toISOString()
		}
			this.search = true;
			this._logService.getLogsReportById(body).subscribe((res)=>{
				console.log("response of getLogsReportById" , res);
				this.logs = this.properFormatDate(res);
				//calculate the total duration
				// this.logs = res;
				this.calculateTotalDuration(this.logs);
			} , (err)=>{
				console.log("err of getLogsReportById" , err);
			});
		}
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
	calculateTotalDuration(array){
		var workingHours = 0;
		var totalHours = 0;
		array.forEach((obj)=>{
			// console.log(obj);
			if(obj.diffrence){
				totalHours = totalHours + 30600; 
				workingHours = workingHours + moment.duration(obj.diffrence).asSeconds();
				console.log(moment.duration(obj.diffrence).asSeconds());
			}
		});
		this.totalHoursToWork =  moment.utc(totalHours*1000).format('HH:mm:ss');
		this.totalHoursWorked = moment.utc(workingHours*1000).format('HH:mm:ss');
		console.log("total hours attednent ====>" , moment.utc(workingHours*1000).format('HH:mm:ss'));
		console.log("total hours to attendnace====>" , moment.utc(totalHours*1000).format('HH:mm:ss'));

	}
	properFormatDate(data){
		return data = data.filter((obj)=>{
			console.log("Before date =======>" , obj.date);
			obj.date = moment(obj.date).utc().format("DD/MM/YYYY");
			// obj.date = moment(obj.date).format("DD/MM/YYYY");
			console.log("after date =======>" , obj.date);
			return obj.date;
		});
	}
}
