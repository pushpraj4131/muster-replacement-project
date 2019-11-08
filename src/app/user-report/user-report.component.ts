import { Component, OnInit , ViewChild , ViewEncapsulation } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
declare var $;
import { UserService } from '../services/user.service';
import { LogsService } from '../services/logs.service';
@Component({
	selector: 'app-user-report',
	templateUrl: './user-report.component.html',
	styleUrls: ['./user-report.component.css'],
	encapsulation: ViewEncapsulation.None

})
export class UserReportComponent implements OnInit {
	logs:any;
	foundRecordUser:any = null;
	reportForm:FormGroup;
	userInfo:any;	
	developers:any;
	bsConfig: Partial<BsDatepickerConfig>
	myDateValue: Date;
	p: number = 1;
	searchRecordDate:any;
	timeToWork = 30600;
	totalHoursWorked:any;
	totalHoursToWork:any;
	fullTimeWorked:any;
	lessTimeWorked:any;
	isDisable:boolean =false;  modelDate = '';
	allEmployeeSearch:boolean;
	allLogs:any;
	modelValue:any;
	modelMessage:any;
	constructor(
		public _logsService: LogsService,
		public _userService: UserService 
		){
		this.reportForm = new FormGroup({
			id: new FormControl(''),
			date:new FormControl('' , Validators.required)
		});
	}

	ngOnInit() {
		this.reportForm.reset();

		this.userInfo  = JSON.parse(localStorage.getItem("currentUser"));
		this.getAllUsers();
		this.myDateValue = new Date();

		
		this.bsConfig = Object.assign({}, { containerClass: 'theme-green custom' });
	}
	get f() { return this.reportForm.controls; }
	getAllUsers(){
		this._userService.getAllUsers().subscribe((res:any)=>{
			console.log("all users ===>" , res);
			// res.unshift({'_id' : 'All' , 'name' : 'All Employee'})
			this.developers = res;
		},(err)=>{
			console.log("error in getting all users ===>" , err);
		});
	}
	onOpenCalendar(container) {
		container.monthSelectHandler = (event: any): void => {
			container._store.dispatch(container._actions.select(event.date));
		};     
		container.setViewMode('month');
	}
	tableHeader = [];
	tableData = [];
	getReport(value){
		this.fullTimeWorked = 0;
		this.lessTimeWorked = 0;
		var newDate:any = moment(value.date).add(1 , 'days');
		value['startDate'] = new Date(newDate).toISOString();
		newDate =  moment(newDate).endOf('month')
		value['endDate'] = new Date(newDate._d).toISOString();
		delete value['date'];
		console.log("value ==>" , value);
		if(value.id == null){
			value.id = 'All';
		}
		this._logsService.getReportFlagWise(value).subscribe(async(res:any)=>{
			this.isDisable = false;
			if(!res.foundLogs){
				this.searchRecordDate= null;
				this.allEmployeeSearch = true;
				this.allLogs = res;
				console.log("this.allLogs ===>" , res);
				
				this.allLogs = await this.formatResponse(this.allLogs);
				this.tableHeader = Object.keys(...this.allLogs);
				this.tableData = Object.values(...res);
				console.log(this.tableHeader);
				console.log(this.tableData);
			}else{
				this.allEmployeeSearch = false;
				res.foundLogs.forEach((data) => {
					if(data.diffrence != '-'){
						data['seconds'] = moment.duration(data.diffrence).asSeconds();

					}else{
						data['seconds'] = null
					}
				});
				res.foundLogs.forEach((data) => {
					if(data['seconds'] >= this.timeToWork){
						this.fullTimeWorked++;
					}else{
						this.lessTimeWorked++;
					}

				});
				
				if(value.id != 'All'){
					if(res.foundLogs[0].user)
						this.foundRecordUser = res.foundLogs[0].user[0];
				}else{
					this.foundRecordUser = null;
				}
				this.searchRecordDate = moment(value.startDate).format('MMMM YYYY');
				this.logs = this.properFormatDate(res.foundLogs);
				this.totalHoursWorked = res.TotalHoursCompleted;
				this.totalHoursToWork = res.TotalHoursToComplete;
			}
			this.reportForm.reset();
		} , (err:any)=>{
			this.reportForm.reset()
			this.isDisable = false;;
			console.log("error of get report By flag" , err)
		});
	}
	properFormatDate(data){
		console.log("data @99 ===>" , data)
		return data = data.filter((obj)=>{
			// console.log("Before date =======>" , obj.date);
			obj.date = moment(obj.date).utc().format("DD/MM/YYYY");
			// console.log("after date =======>" , obj.date);
			return obj.date;
		});
	}
	formatResponse(res1){
		console.log("al res1ponse" , res1);
		console.log("al ldevelopers" , this.developers);
		// console.log(res1);
		var obj = {
			absentCount:null,
			changed: null,
			date:null,
			day:null,
			diffrence:null,
			status:null,
			timeLog: null,
			user: [],
			userId:null,
			_id: null
		}

		for(let [key , value] of Object.entries(res1[0])){
			var flag = 1;
			var responseValue:any = value;
			var responseKey:any = key;
			// console.log("key changes ===>" , key);
			this.developers.forEach((devData , index)=>{
				responseValue.forEach((resData)=>{
					if(devData._id == resData.user[0]._id){
						flag = 0;
					}
				});
				if(flag == 1){
					obj.user.push(devData);
					res1[0][key].push(obj);
				}
				flag = 1;
				obj = {
					absentCount:null,
					changed: null,
					date:null,
					day:null,
					diffrence:null,
					status:null,
					timeLog: null,
					user: [],
					userId:null,
					_id: null
				}
			});
		}
		console.log("res1 [0 ] ======+++++>" , res1[0] );
		for(let [key, value] of Object.entries(res1[0])){
			console.log("date changed" , key);
			res1[0][key].sort(function(a, b){
				var nameA=a.user[0].name.toLowerCase(), nameB=b.user[0].name.toLowerCase()
				if (nameA < nameB) //sort string ascending
					return -1 
				if (nameA > nameB)
					return 1
				return 0 //default return value (no sorting)
			})
		}
		var temp = Object.values(...res1);
		temp.forEach((arrayData)=>{
			console.log("array aData +====>" , arrayData);
			arrayData.forEach((objData)=>{
				if(objData.diffrence == null){
					objData['seconds'] = 'AB';
				}
				else if(objData.diffrence == '-'){
					objData['seconds'] = 'N/A';	
				}
				else if(objData.diffrence != '-' || objData.diffrence != null){
					objData['seconds'] = moment.duration(objData.diffrence).asSeconds();
				}
			});
		});
		console.log("Modified res1s =+++++++++++++." , res1);
		this.allLogs = res1;
		console.log("this is all logs inside the function " , this.allLogs);
		return res1;
	}
	getColor(value){
		if(!isNaN(value)){
			if(value < 30600){
				return '#ff000066'
			}
		}else{
			switch (value.toString()){
				case "N/A":
				return 'yellow';
				case 'AB':
				return 'red';
			}	

		}
	}
	openModel(indexOfDate , indexOfDiffrence){
		this.modelMessage = null;
		console.log(indexOfDate , indexOfDiffrence , this.allLogs);
		console.log("Finally got an object ===>" , this.allLogs[0][indexOfDate][indexOfDiffrence]);
		this.modelValue = this.allLogs[0][indexOfDate][indexOfDiffrence];
		if(this.modelValue._id == null){
			this.modelMessage = this.modelValue.user[0].name + " was absent or no logs found of that date";
		}
		$('#myModal').modal('show');
	}

}