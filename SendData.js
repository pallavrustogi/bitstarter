var DOMParser = require('xmldom').DOMParser;
var xml2js = require('xml2js');
var fs = require('fs');
var request = require('request');
var XMLSerializer = require('xmldom').XMLSerializer;

ptrs = './Local.xml'
localurl= './data.xml'

function convertToSec(time)
{
t=time.split(':');
return ((parseInt(t[0])*60)+parseInt(t[1]));
}

function sendData()
{

	fs.readFile( ptrs, function(err, data) {
		var s = new XMLSerializer();
		xml2jsparser = new xml2js.Parser();
		var doc1 = new DOMParser().parseFromString(data.toString(),'text/xml');
		
		if(doc1.childNodes.length == 0) {
			var currentdate = new Date();
			currentTime = doc1.createElement('StartTime');
			currentTime.appendChild(doc1.createTextNode(currentdate));
			doc1.appendChild(currentTime);
			currentIdx = doc1.createElement('CurrentIdx');
			currentIdx.appendChild(doc1.createTextNode('0'));
			doc1.appendChild(currentIdx);
			str = s.serializeToString(doc1);
			console.log(str);
			fs.writeFile(ptrs, str,0);
		}
		startTime = doc1.getElementsByTagName('StartTime').textContent;
		currentIdx = doc1.getElementsByTagName('currentIdx').textContent;
		var currentdate = new Date();
		var startdate = new Date(startTime);
		
		timediff = (Math.round((currentdate-startdate)/1000));
		
		
		request(localurl, function (error, response, body) {
		console.log(body);
		xml2jsparser.parseString(body, function (err, result) {
		
		console.log(result.root);
		length = 0//result.root[0].event.length;
		nextIdx=length;
		nexttime = convertToSec(result.root.event[length-1]['$']['clock']);
		firsttime = convertToSec(result.root.event[0]['$']['clock']);
		clockdiff = firsttime - nexttime;
		while(timediff - clockdiff < 2)
		{
		nextIdx--;
		nexttime = convertToSec(result.root.event[nextIdx]['$']['clock']);
		
		}
		
		responseText = "";
		
		for(i=nextIdx+1;i<length;i++) responseText += (result.root.event[i]);
		
		

		});
		
		});
		
		
	});
	
}

sendData();