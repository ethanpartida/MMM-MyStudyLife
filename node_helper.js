var NodeHelper = require("node_helper");
var request = require('request');


module.exports = NodeHelper.create({
  start: function() {},
  socketNotificationReceived: function(notification, payload) {
	var self= this;
	request({url: payload.url, method: "GET", headers: {Authorization: "Bearer " + payload.code}}, function(error,response,body){
	  if (!error && response.statusCode == 200) {
    	var jData = JSON.parse(body);
    	self.sendSocketNotification("success", jData)}
	  else {
		  self.sendSocketNotification("error", response)}
	  }
	  )
  }
});
