/*WIP Magic Mirror Module
 * TO DO:
 * Add tasks, and upcoming Exams
 * Create custom CSS and prettify output
 * Pretty up code, get everything to follow StyleGuide since I didnt know language starting this project
 */

Module.register("MMM-Study", {
  defaults: {
		url: "https://api.mystudylife.com/v6.1/data",
		interval: 300000,
		code: ' ',
		loaded: ' ',
		classes: {},
		colorCode: {
			'0':"w3-teal",
			'1':"w3-deep-orange",
			'2':"w3-orange",
			'3':"w3-indigo",
			'4':"w3-pink",
			'5':"w3-amber",
			'6':"w3-gray",
			'7':"w3-cyan",
			'8':"w3-purple",
			'9':"w3-light-blue",
			'10':"w3-blue-gray",
			'11':"w3-blue",
			'12':"w3-red",
			'13':"w3-green",
			'14':"w3-deep-purple"
		}
	},
  start: function () {
		this.loaded = false;
		this.datas = ' ';
		this.updateData(this);
    },
  getStyles: function() {
	  return ["styles.css","styles1.css"]; //Using a style sheet for now will replace as I learn more CSS
  },
  updateData: function(self) {
		self.sendSocketNotification('load', {'url':self.config.url, 'code':self.config.code});
		setTimeout(self.updateData, self.config.interval, self);
    },
  getDom: function() {
	    var wrapper = document.createElement('div');
		if (!this.loaded){
				wrapper.innerHTML = "loading";
				return wrapper;
			}
		else{
				var schedule = document.createElement('div');
				schedule.id = "schedule";
				var d = new Date();
				var dayOfTheWeek = d.getDay();
				var classesToday = this.sortClasses(dayOfTheWeek, this.datas.classes);
				if ((d.getHours()*60+d.getMinutes()) > this.convertTime(classesToday[0].times[0].end_time)) { //Checking if class is done for today
					classesToday = this.sortClasses(dayOfTheWeek + 1, this.datas.classes);
					var sHeader = document.createElement('h1');
					sHeader.innerHTML = "Tommorow's Classes";
					schedule.appendChild(sHeader);
				}
				else {
					var sHeader = document.createElement('h1');
					sHeader.innerHTML = "Today's Classes";
					schedule.appendChild(sHeader);
				}
				for (i of classesToday) {
					var newClass = document.createElement('div'); //clean up adding elements
					newClass.id = "newClass";
					newClass.classList.add(this.config.colorCode[i.color]);
					newClass.classList.add("w3-panel");
					newClass.classList.add("w3-round-large");
					newClass.classList.add("w3-padding");
					newClass.classList.add("w3-left-align");
					//newClass.classlist.add("w3-leftbar");
					var className = document.createElement('h');
					className.classList.add("largeBody");	
					var classTime = document.createElement('p');
					classTime.classList.add("w3-opacity");
					classTime.classList.add("smallBody");
					var classLoc = document.createElement('p');
					classLoc.classList.add("w3-opacity");
					classLoc.classList.add("smallBody");
					className.innerHTML = i.module;
					classTime.innerHTML = i.times[0].start_time + '-' + i.times[0].end_time;
					classLoc.innerHTML = i.building + ' ' + i.room;
					newClass.appendChild(className);
					newClass.appendChild(classTime);
					newClass.appendChild(classLoc);
					schedule.appendChild(newClass);
				}
				wrapper.appendChild(schedule);
				return wrapper;
			}
	},
  notificationReceived: function() {},
  socketNotificationReceived: function(notification, payload) {
		if(notification == "success"){
				this.datas = payload;
				//Adding Properties to Classes
				var subToColor = {};
				for (i of this.datas.subjects) {
					subToColor[i.guid] = i.color.toString();
				}
				for (i  of this.datas.classes) {
					console.log(subToColor.sGuid);
					i.days = this.config.classes[i.module];
					i.length= this.convertTime(i.times[0].end_time) - this.convertTime(i.times[0].start_time);
					i.color = subToColor[i.subject_guid];	
				}
				this.loaded = true;
				this.updateDom(1000);
			}
		else {
			console.log("Error recieving http repsonse");
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
	  }}
	  classesToday.sort(function(a, b){
			var aTS = a.times[0].start_time;
			var bTS = b.times[0].start_time;
			return (Number(aTS.substring(0,2))*60 + Number(aTS.substring(3,5)) - Number(bTS.substring(0,2))*60 + Number(bTS.substring(3,5))); //inside of array so cant use convert time
	  })
	  return classesToday;
  }
})

