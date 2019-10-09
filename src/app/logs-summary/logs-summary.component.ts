import { Component, OnInit } from '@angular/core';
import { LogsService } from '../services/logs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from '../filter.pipe';
import * as moment from 'moment';



declare var $;

@Component({
	selector: 'app-logs-summary',
	templateUrl: './logs-summary.component.html',
	styleUrls: ['./logs-summary.component.css'],
	providers: [FilterPipe]
})
export class LogsSummaryComponent implements OnInit {
	searchData : any;
	userInfo : any;
	currentMonthLogs  ;
	currentMonthLogsCount = [] ;
	modelValue : any ;
	p: number = 1;

	//imported
	data = {
		firstDate : "",
		secondDate : "",
		name: ""
	};
	previousData : any;
	logs : any;
	flag = false;
	getLogsBySingleDate = false;
	getLogsBetweenDates = false;
	constructor(public _logService: LogsService , private route: ActivatedRoute,
		private router: Router , public _loginService: LoginService , public _filterPipe: FilterPipe) { }

	ngOnInit() {
		// $(function() {
		// 	$("#searchName").autocomplete({
		// 		source: [ "akshita keratiya" , "vishal pankhaniya" , "vivek malvi" , "komal shakhiya" , "foram trada" , "happy bhalodiya" , "ram odedra" , "yuvrajsinh jadeja" , "meghna trivedi" , "swati chauhan" , "shraddha gami" , "ankit jadav" , "bhavik kalariya" , "kuldip koradia" , "rohit vishvakarma" , "mehul bhatt" , "kuldip siddhpura"],
		// 	});
		// });
		this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		this.getLogsCountByMonthDefault();
		if(this.userInfo.userRole != 'admin')
			this.page(1);
		else if(this.userInfo.userRole == 'admin'){
			this.getTodaysAttendance();
			// this.page(1);
		}
	}
	
	getLogsCountByMonthDefault(){
		this._logService.getLogsCountByMonthDefault().subscribe((response: any) => {
			// this.currentMonthLogs = response;
			let count = 1;
			while(response['length'] >= 1){
				response['length'] = response['length'] / 5;
				this.currentMonthLogsCount.push(count);
				count++;
			}
			if(count != 2)
				this.currentMonthLogsCount.push(count)
			console.log("this.currentMonthLogsCount " , this.currentMonthLogsCount);
		}, (err) => {
			console.log("err of getLogsByMonthDefault ==>" , err);
		});
	}
	openModel(index){
		console.log("hey" , index);

		this.modelValue = this.currentMonthLogs[index];
		console.log(this.modelValue);
		$('#myModal').modal('show');
	}
	// If userRole == employee
	page(i){
		console.log("====>" , i);
		this._logService.getLogsByMonthDefaultByPage({page : i}).subscribe((response) => {
			console.log("response of getLogsByMonthDefault ==>" , response);
			this.currentMonthLogs =  this.properFormatDate(response);
			// this.currentMonthLogs = response;
		}, (err) => {
			console.log("err of getLogsByMonthDefault ==>" , err);
		});	
	}
	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this.router.navigate(['login']);
	}
	getRecord(){
		this.flag = true;
		console.log("this.data;" , this.data);
		this.previousData = this.data;
		//find only first date . 
		if(this.data.firstDate){
			console.log(" this.data.firstDate " , this.data.firstDate);
			this.previousData = this.data;
			this._logService.getLogsBySingleDate(this.data).subscribe(res =>{
				this.getLogsBetweenDates = false;
				this.getLogsBySingleDate = true;
				this.currentMonthLogs = this.properFormatDate(res);
				// this.currentMonthLogs = res;

				this.searchData = res
				if(this.currentMonthLogs.length != 0){
					this.previousData = false;
				}
				this.flag = false;
				console.log(res);
			} , err =>{
				console.log(err);
				this.flag = false;
			});	
		}
	}
	getTodaysAttendance(){
		this._logService.getTodaysAttendance().subscribe((response:any) => {
			console.log('getTodaysAttendance response in logs '  , response);
			this.currentMonthLogs = this.properFormatDate(response.data);
			// this.currentMonthLogs = response.data;
			this.searchData = response.data;
			// const data = JSON.stringify(this.todaysAttendance);
			// this.filteredData = JSON.parse(data);
		} , (err) => {
			console.log('getTodaysAttendance error'  , err);
		})	
	}
	searchByName(items){
		var field1 = (<HTMLInputElement>document.getElementById("searchName")).value;
			
		this.currentMonthLogs = this._filterPipe.transform(items, field1);
		console.log("Items  =====> " , items );
		console.log("field 1 =====> " , field1 , "current month logs =====>" , this.currentMonthLogs);
	}

	// searchByName(items){
	// 	var field1 = (<HTMLInputElement>document.getElementById("nameSearch")).value;
	// 	this.filteredData = this._filterPipe.transform(items, field1);
	// }
	properFormatDate(data){
		return data = data.filter((obj)=>{
			return obj.date = moment(obj.date).utc().format("DD/MM/YYYY");
		});
	}
}
