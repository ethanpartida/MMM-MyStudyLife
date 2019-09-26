/*WIP Magic Mirror Module
 * TO DO:
 * Add upcoming Exams
 * Pretty up code, get everything to follow StyleGuide since I didnt know language starting this project
 * MyStudyLife changes the security key
 */

Module.register("MMM-Study", {
  defaults: {
		url: "https://api.mystudylife.com/v6.1/data",
		interval: 100000,
		code: ' ',
		loaded: ' ',
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
	  return ["styles1.css"]; 
    },
  updateData: function(self) {
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
		else{
				wrapper.appendChild(this.makeSchedule());
				wrapper.appendChild(this.makeTasks());
				//wrapper.appendChild(this.makeExams());
				return wrapper;
			}
	},
  notificationReceived: function() {},
  makeExams: function() {
	  //TODO
	},
  makeTasks: function() {
		var d = new Date();
		var tasks =  document.createElement('div');
		tasks.className = "tasks";
		var tHeader = document.createElement('h2');
		tHeader.innerHTML = "Tasks";
		tHeader.className = "taskTitle";
		tasks.appendChild(tHeader);
		var toDo = this.sortTasks(this.datas.tasks);
		var numOfTasks = 0;
		for (i of toDo) {
			if (Date.parse(i.due_date) <= d.getTime()+604800000 || numOfTasks < 5) {	//Only adds tasks due in a week or less
				++numOfTasks;
				var newTask = document.createElement('div');
				var name = document.createElement('span');
				name.className = "taskName";
				name.innerHTML = i.title + ', ' + i.due_date;
				var progress = document.createElement('canvas');
				var pCircle = progress.getContext('2d');
				progress.className = "Circle";
				pCircle.canvas.width = 50;
				pCircle.canvas.height = 40;
				pCircle.beginPath(); //Drawing Background Circles
				pCircle.arc(20,20,20,0,2*Math.PI);
				pCircle.fillStyle = this.config.colorCode[i.color].b;
				pCircle.fill(); 
				if(i.progress != 0) { //Drawing Progress Circle
					pCircle.beginPath();
					pCircle.arc(20,20,20,3*Math.PI/2,i.progress/50*Math.PI + 3*Math.PI/2);
					pCircle.lineTo(20,20);
					pCircle.lineTo(20,40);
					pCircle.fillStyle = this.config.colorCode[i.color].h;
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
		var d = new Date();
		var dayOfTheWeek = d.getDay();
		var classesToday = this.sortClasses(dayOfTheWeek, this.datas.classes);
		if (classesToday.length == 0) {
			dayOfTheWeek = this.sortClasses(dayOfTheWeek+1, this.datas.classes);
			if (dayOfTheWeek.length) {
				var sHeader = document.createElement('h2');
				sHeader.className = "scheduleTitle";
				sHeader.innerHTML = "Tommorow's Classes";
				schedule.appendChild(sHeader);
			}
			else {
			var sHeader = document.createElement('h2');
			sHeader.innerHTML = "No Class Today!";
			sHeader.className = "scheduleTitle";
			schedule.appendChild(sHeader);
			return schedule;
			}
		}
		if ((d.getHours()*60+d.getMinutes()) > this.convertTime(classesToday[classesToday.length-1].times[0].end_time)) { //Checking if class is done for today
			classesToday = this.sortClasses(dayOfTheWeek + 1, this.datas.classes);
			var sHeader = document.createElement('h2');
			sHeader.className = "scheduleTitle";
			sHeader.innerHTML = "Tommorow's Classes";
			schedule.appendChild(sHeader);
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
			var newClass = document.createElement('div'); //clean up adding elements
			newClass.className = "newClass";
			newClass.style.setProperty("--element-height", i.length/totLength*40+'vh');
			newClass.style.setProperty("--space", i.length/totLength*350+'%'); 
			newClass.style.setProperty("--hColor", this.config.colorCode[i.color].h);
			newClass.style.setProperty("--bColor", this.config.colorCode[i.color].b);
			var nameOfClass = document.createElement('h');
			nameOfClass.className = "nameOfClass";
			nameOfClass.innerHTML = i.module;
			nameOfClass.style.setProperty("--font", i.length/totLength*57+8+'px');
			var classDetails = document.createElement('p');
			classDetails.className = "classDetails";
			classDetails.style.setProperty("--font", i.length/totLength*40+8+'px');
			classDetails.innerHTML = i.times[0].start_time + '-' + i.times[0].end_time + '<br />' +i.building + ' ' + i.room;
			newClass.appendChild(nameOfClass);
			newClass.appendChild(classDetails);
			schedule.appendChild(newClass);
		}
		return schedule;
	},
  socketNotificationReceived: function(notification, payload) {
		if(notification == "success"){
			this.datas = payload;
			//Adding Properties to Classes
			var subToColor = {};
			for (i of this.datas.subjects) {
				subToColor[i.guid] = i.color.toString();
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
			}
			this.loaded = true;
			this.updateDom(1000);
		}
		else {
			console.log("Error recieving http repsonse" + payload);
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
		classesToday.sort(function(a, b) {
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
		}}
		toDo.sort(function(a, b) {
			return Date.parse(a.due_date) -  Date.parse(b.due_date);
		})
		return toDo;  
	}
})

