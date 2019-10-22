/*WIP Magic Mirror Module
 * TO DO:
 * Add upcoming Exams
 * Pretty up code, get everything to follow StyleGuide since I didnt know language starting this project
 * MyStudyLife changes the security key
 * Get Subject in front of Exams and style exams so like tasks
 */

Module.register("MMM-MyStudyLife", {
  defaults: {
		url: "https://api.mystudylife.com/v6.1/data",
		interval: 100000,
		code: ' ',
		loaded: ' ',
		color: true,
		showSchedule: true,
		showExams: true,
		showTasks: true,
		totNumOfTasks: 5,
		totNumOfExams: 7,
    includeExamSub: true,
		classes: {},
		colorCode: {
			'0': {'h': "#049372", 'b': "#113b31"},
			'1':{'h': "#fd5645", 'b': "#5d1f19"},
			'2':{'h': "#f89406", 'b': "#4c3310"},
			'3':{'h': "#3a539b", 'b': "#242832"},
			'4':{'h': "#dc44b4", 'b': "#41253a"},
			'5':{'h': "#e3be0d", 'b': "#4c451f"},
			'6':{'h': "#95a5a6", 'b': "#343c3c"},
			'7':{'h': "#1098a5", 'b': "#1c3d40"},
			'8':{'h': "#7d59b6", 'b': "#342d3e"},
			'9':{'h': "#38acfa", 'b': "#182c3a"},
			'10':{'h': "#34495e", 'b': "#222e39"},
			'11':{'h': "#2574a9", 'b': "#0e2b3f"},
			'12':{'h': "#c0392b", 'b': "#412320"},
			'13':{'h': "#00634c", 'b': "#0e2f28"},
			'14':{'h': "#674172", 'b': "#2e2032"}
		}
	},
  start: function () {
		this.loaded = false;
		this.datas = ' ';
		this.updateData(this);
    },
  getStyles: function() {
	  return ["styles1.css", "font-awesome.css"];
    },
  updateData: function(self) {
		self.date= new Date();
		self.sendSocketNotification('load', {'url':self.config.url, 'code':self.config.code});
		setTimeout(self.updateData, self.config.interval, self);
    },
  getDom: function() {
	    var wrapper = document.createElement('div');
	    wrapper.className = "myStudyWrapper";
		if (!this.loaded){
				wrapper.innerHTML = "loading";
				return wrapper;
			}
		else {
				if(this.config.showSchedule) {
					wrapper.appendChild(this.makeSchedule());
				}
				var leftWrapper = document.createElement('div');
				leftWrapper.className = "leftWrapper";
				if(this.config.showTasks) {
					leftWrapper.appendChild(this.makeTasks());
				}
				if(this.config.showExams) {
					leftWrapper.appendChild(this.makeExams());
				}
				wrapper.appendChild(leftWrapper);
				return wrapper;
			}
	},
  notificationReceived: function() {},
  makeExams: function() {
	  var exams = document.createElement('div');
	  exams.className = "allExams";
	  var eHeader = document.createElement('h2');
	  eHeader.className = "taskTitle";
	  eHeader.innerHTML = "Exams";
	  exams.appendChild(eHeader);
	  var numOfExams = 0;
	  var sortExams = this.sortExams(this.datas.exams); //also removes exams that have already happened
	  for (i of sortExams) {
		  if (numOfExams < this.config.totNumOfTasks) {
			  var newExam = document.createElement('div');
			  newExam.className = "newExam";
			  if (this.config.color) {
				newExam.style.setProperty("--color", this.config.colorCode[i.color].h);
			  }
			  newExam.style.setProperty("--opacity", 1-(i.dueDate.getTime()-this.date.getTime())/7776000000); //gets more opaque as test gets closer, at 3 month is not visable
			  var examTitle = document.createElement('p');
			  examTitle.className = "examTitle";
			  if (this.config.includeExamSub) {
				examTitle.innerHTML = i.subjectN + ' ' + i.module + ', ' + this.datePretty(i.date, false);
			  }
			  else {
				  examTitle.innerHTML = i.module + ', ' + this.datePretty(i.date, false);
			  }
			  var exclamation = document.createElement('span');
			  exclamation.className = "fas fa-exclamation";
			  newExam.append(exclamation);
			  newExam.append(examTitle);
			  exams.append(newExam);
		  }
		  ++numOfExams;
	  }
	  return exams;
	},
  makeTasks: function() {
		var tasks =  document.createElement('div');
		tasks.className = "tasks";
		var tHeader = document.createElement('h2');
		tHeader.innerHTML = "Tasks";
		tHeader.className = "taskTitle";
		tasks.appendChild(tHeader);
		var toDo = this.sortTasks(this.datas.tasks);
		var numOfTasks = 0;
		for (i of toDo) {
			if (Date.parse(i.due_date) <= this.date.getTime()+604800000 || numOfTasks < this.config.totNumOfTasks) {	//Only adds tasks due in a week or less
				++numOfTasks;
				var newTask = document.createElement('div');
				var name = document.createElement('span');
				name.className = "taskName";
				name.innerHTML = i.title + ', ' + this.datePretty(i.due_date, true);
				var progress = document.createElement('canvas');
				var pCircle = progress.getContext('2d');
				progress.className = "Circle";
				pCircle.canvas.width = 50;
				pCircle.canvas.height = 40;
				pCircle.beginPath(); //Drawing Background Circles
				pCircle.arc(20,20,20,0,2*Math.PI);
				if (this.config.color) {
					pCircle.fillStyle = this.config.colorCode[i.color].b;
			    }
			    else {
					pCircle.fillStyle = this.config.colorCode[6].b;
				}
				pCircle.fill();
				if(i.progress != 0) { //Drawing Progress Circle
					pCircle.beginPath();
					pCircle.arc(20,20,20,3*Math.PI/2,i.progress/50*Math.PI + 3*Math.PI/2);
					pCircle.lineTo(20,20);
					pCircle.lineTo(20,40);
					if (this.config.color) {
						pCircle.fillStyle = this.config.colorCode[i.color].h;
					}
					else {
						pCircle.fillStyle = this.config.colorCode[6].h;
					}
					pCircle.fill();
				}
				newTask.appendChild(progress);
				newTask.appendChild(name);
				tasks.appendChild(newTask);
			}
		}
		return tasks;
	},
  makeSchedule: function() {
		var schedule = document.createElement('div');
		schedule.className = "schedule";
		var dayOfTheWeek = this.date.getDay();
		var classesToday = this.sortClasses(dayOfTheWeek, this.datas.classes);
		if (classesToday.length == 0 || this.date.getHours()*60+this.date.getMinutes() > this.convertTime(classesToday[classesToday.length-1].times[0].end_time)) {
			classesToday = this.sortClasses(dayOfTheWeek+1, this.datas.classes);
			if (classesToday.length != 0) {
				var sHeader = document.createElement('h2');
				sHeader.className = "scheduleTitle";
				sHeader.innerHTML = "Tomorrow's Classes";
				schedule.appendChild(sHeader);
			}
			else {
			var sHeader = document.createElement('h2');
			sHeader.innerHTML = "No Class Tomorrow!";
			sHeader.className = "scheduleTitle";
			schedule.appendChild(sHeader);
			return schedule;
			}
		}
		else {
			var sHeader = document.createElement('h2');
			sHeader.className = "scheduleTitle";
			sHeader.innerHTML = "Today's Classes";
			schedule.appendChild(sHeader);
		}
		var totLength = 0;
		for (i of classesToday) {
			totLength += i.length;
		}
		for (i of classesToday) {
			var newClass = document.createElement('div');
			newClass.className = "newClass";
			newClass.style.setProperty("--element-height", i.length/totLength*40+'vh');
			newClass.style.setProperty("--space", i.length/totLength*350+'%');
			if (this.config.color) {
			newClass.style.setProperty("--hColor", this.config.colorCode[i.color].h);
			newClass.style.setProperty("--bColor", this.config.colorCode[i.color].b);
		    }
		    else {
				newClass.style.setProperty("--hColor", this.config.colorCode[6].h); //makes grayscale
				newClass.style.setProperty("--bColor", this.config.colorCode[6].b);
			}
			var nameOfClass = document.createElement('h');
			nameOfClass.className = "nameOfClass";
			nameOfClass.innerHTML = i.module;
			nameOfClass.style.setProperty("--font", i.length/totLength*57+8+'px');
			var classDetails = document.createElement('p');
			classDetails.className = "classDetails";
			classDetails.style.setProperty("--font", i.length/totLength*40+8+'px');
			classDetails.innerHTML = i.times[0].start_time.substr(0,5) + '-' + i.times[0].end_time.substr(0,5) + '<br />' +i.building + ' ' + i.room;
			newClass.appendChild(nameOfClass);
			newClass.appendChild(classDetails);
			schedule.appendChild(newClass);
		}
		return schedule;
	},
  socketNotificationReceived: function(notification, payload) {
		if(notification == "success"){
			this.datas = payload;
			//Adding Properties to Classes, Tasks, and Exams
			var subToColor = {};
			var subjectName = {};
			for (i of this.datas.subjects) {
				subToColor[i.guid] = i.color.toString();
				subjectName[i.guid] = i.name;
			}
			for (i  of this.datas.classes) {
				i.days = this.config.classes[i.module];
				i.length= this.convertTime(i.times[0].end_time) - this.convertTime(i.times[0].start_time);
				i.color = subToColor[i.subject_guid];
			}
			for (i of this.datas.tasks) {
				i.color = subToColor[i.subject_guid];
			}
			for (i of this.datas.exams) {
				i.color = subToColor[i.subject_guid];
				i.subjectN = subjectName[i.subject_guid];
			}

			this.loaded = true;
			this.updateDom(1000);
		}
		else {
			console.log("Error recieving http repsonse (Check that your id is still valid)" + payload);
		}
	},
  convertTime: function(time) {
		if(!isNaN(time)) {
			return time;
		}
		return (Number(time.substring(0,2))*60 + Number(time.substring(3,5)));
	},
  sortClasses: function(dayOfTheWeek, classes) {
		var classesToday = [];
		for (i of classes) {
			if (i.days.includes(dayOfTheWeek)) {
				classesToday.push(i);
			}
		}
		classesToday.sort(function(a, b) { //sorting classes by start times
			var aTS = a.times[0].start_time;
			var bTS = b.times[0].start_time;
			return (Number(aTS.substring(0,2))*60 + Number(aTS.substring(3,5)) - Number(bTS.substring(0,2))*60 + Number(bTS.substring(3,5))); //inside of array so cant use convert time
		})
		return classesToday;
	},
  sortTasks: function(tasks) {
		var toDo = [];
		for (i of tasks) {
			if (i.completed_at == null) {
				toDo.push(i);
			}
		}
		toDo.sort(function(a, b) { //sorting tasks by due dates
			return Date.parse(a.due_date) -  Date.parse(b.due_date);
		})
		return toDo;
	},
  sortExams: function(exams) {
		var sortExams = [];
		for (i of exams) {
			i.dueDate = new Date(i.date);
			if (i.dueDate >= this.date) {
				sortExams.push(i);
			}
		}
		sortExams.sort(function(a, b) { //sorting exams by due date
			if (a.dueDate<b.dueDate) {
				return -1;
			}
			else {
				return 1;
			}
		})
		return sortExams;
  },
  datePretty: function(dString, isTask) {
	  var dueDay = new Date(dString);
	  if (isTask) { //The way tasks get turned into dates is off by index of one so hard coded fix
		  dueDay.setTime(dueDay.getTime()+86400000);
	  }
	  if (dueDay.getMonth() == this.date.getMonth() && dueDay.getDate() == this.date.getDate()) { //if due today
		  return "Today";
	  }
	  if (dueDay.getTime()-this.date.getTime() <= 604800000) { //if due less than a week say week day
			switch (dueDay.getDay()) {
			case 0:
				return "Sunday";
				break;
			case 1:
				return "Monday";
				break;
			case 2:
				return "Tuesday";
				break;
			case 3:
				return "Wednesday";
				break;
			case 4:
				return "Thursday";
				break;
			case 5:
				return "Friday";
				break;
			case 6:
				return "Saturday";
			}
	  }
	  var returnString = ""; //Farther out so printing like Oct 5th
	  switch (dueDay.getMonth()) {
			case 0:
				returnString += "Jan ";
				break;
			case 1:
				returnString += "Feb ";
				break;
			case 2:
				returnString += "Mar ";
				break;
			case 3:
				returnString += "Apr ";
				break;
			case 4:
				returnString += "May ";
				break;
			case 5:
				returnString += "Jun ";
				break;
			case 6:
				returnString += "Jul";
			case 7:
				returnString += "Aug ";
				break;
			case 8:
				returnString += "Sep ";
				break;
			case 9:
				returnString += "Oct ";
				break;
			case 10:
				returnString += "Nov ";
				break;
			case 11:
				returnString += "Dec ";
				break;
		}
		returnString += dueDay.getDate();
		if (Math.floor(dueDay.getDate()/10) == 1) { //checking if is 10-19
			return returnString += "th";
		}
		else {
			switch (dueDay.getDate() % 10) { //adding -st, -nd, -th
				case 1:
					returnString += "st";
					break;
				case 2:
					returnString += "nd";
					break;
				case 3:
					returnString += "rd";
					break;
				default:
					returnString += "th";
					break;
			}
		}
		return returnString;
  }
})
