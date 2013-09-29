var DOMParser = require('xmldom').DOMParser;
var xml2js = require('xml2js');
var fs = require('fs');
var request = require('request');
var XMLSerializer = require('xmldom').XMLSerializer;
var sleep = require('sleep');


var readurl = "http://api.sportsdatallc.org/nhl-test3/games/9a6e608f-d48b-491d-b790-eb06e1f0247b/pbp.xml?api_key=bvzyx3z2w7wnf27s9yfeyk8x";
var localurl = "./data.xml"

function convertToSec(time)
{
t=time.split(':');
return ((parseInt(t[0])*60)+parseInt(t[1]));
}
function InitializeXML(doc)
{
	var currentdate = new Date();
	currentTime = doc.createElement('StartTime');
	currentTime.appendChild(doc.createTextNode(currentdate));
	doc.appendChild(currentTime);
	if(doc.childNodes.length == 1){
	currentPeriod = doc.createElement('currentPeriod');
	currentPeriod.appendChild(doc.createTextNode('0'));
	doc.appendChild(currentPeriod);
	}
	currentEvent = doc.createElement('currentEvent');
	currentEvent.appendChild(doc.createTextNode('0'));
	doc.appendChild(currentEvent);
}

function readfile()
{
	var currentPeriod = 0;
	var currentEvent = 0;
	var lastBeach = '';
	fs.open(localurl, "r", function(error, fd) {
	fs.readFile( fd, function(err, data) {
		var s = new XMLSerializer();
		xml2jsparser = new xml2js.Parser();
		var doc = new DOMParser().parseFromString(data.toString(),'text/xml');
		if(doc.childNodes.length <= 1) {
			InitializeXML(doc);
			str = s.serializeToString(doc);
			fs.writeFile(fd, str,0);
			}
		startTime = doc.getElementsByTagName('StartTime')[0].textContent;	
		currentPeriod = doc.getElementsByTagName('currentPeriod')[0].textContent;
		currentEvent = doc.getElementsByTagName('currentEvent')[0].textContent;
		var currentdate = new Date();
		var startdate = new Date(startTime);
		
		timediff = (Math.round((currentdate-startdate)/1000));
		

		if(currentEvent > 0)
		{
		lastChildTime = convertToSec(doc.getElementsByTagName('event')[parseInt(currentEvent)-1].getAttribute('clock'));
		firstChildTime = convertToSec(doc.getElementsByTagName('event')[0].getAttribute('clock'));
		}
		else {lastChildTime = 0;firstChildTime=0;}
		
		//clockdiff = firstChildTime - lastChildTime;
		
		
		request(readurl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			xml2jsparser.parseString(body, function (err, result) {
			nexttime = convertToSec(result.game.period[currentPeriod].events[0].event[currentEvent]['$']['clock']);
			if(currentEvent ==0) firstChildTime = nexttime;
			packetTimeDiff = firstChildTime - nexttime;
			if(packetTimeDiff > timediff){
			nextEv = parseInt(currentEvent)+1;
			nexttime2 = convertToSec(result.game.period[currentPeriod].events[0].event[nextEv]['$']['clock']);
			packetTimeDiff2 = firstChildTime - nexttime2;
			if(packetTimeDiff2 < timediff){ packetTimeDiff = packetTimeDiff2;nexttime =nexttime2 ;}
			}
			while(packetTimeDiff < timediff || currentEvent == 0)
			{
			lastdescription = result.game.period[currentPeriod].events[0].event[currentEvent].description[0];
			time = result.game.period[currentPeriod].events[0].event[currentEvent]['$']['clock'];
			newDescription = doc.createElement('event');
			newDescription.setAttribute('clock',time);
			newDescription.appendChild(doc.createTextNode(lastdescription));
			doc.appendChild(newDescription);
			currentEvent++;
			if(nexttime == 0 && packetTimeDiff == timediff ) break;
			nexttime = convertToSec(result.game.period[currentPeriod].events[0].event[currentEvent]['$']['clock']);
			packetTimeDiff = firstChildTime - nexttime;
			if(packetTimeDiff > timediff){
			nextEv = parseInt(currentEvent)+1;
			nexttime2 = convertToSec(result.game.period[currentPeriod].events[0].event[nextEv]['$']['clock']);
			packetTimeDiff2 = firstChildTime - nexttime2;
			if(packetTimeDiff2 < timediff){ packetTimeDiff = packetTimeDiff2;nexttime =nexttime2;}
			}
			}
			doc.getElementsByTagName('currentEvent')[0].textContent = currentEvent;
			str = s.serializeToString(doc);
			
			fs.writeFile(fd, str, function(err) {
				if(err) {
					console.log(err);
				    }
				}); 
			if(nexttime <= 0 || timediff == firstChildTime)
			{
				while (doc.firstChild) {
				    doc.removeChild(doc.firstChild);
				}
				currentPeriodtag = doc.createElement('currentPeriod');
				currentPeriodtag.appendChild(doc.createTextNode(currentPeriod+1));
				doc.appendChild(currentPeriodtag);
			}
			});
			};
		});
	});
	fs.close(fd);
	});
}

for(i =0;i<100;i++){
readfile();sleep.sleep(3);
}

