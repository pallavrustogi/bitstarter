var DOMParser = require('xmldom').DOMParser;
var xml2js = require('xml2js');
var fs = require('fs');
var request = require('request');
var XMLSerializer = require('xmldom').XMLSerializer;
var http = require('http');

ptrs = './Local.xml'
localurl= 'data.xml'


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
			//console.log(str);
			fs.writeFile(ptrs, str,0);
		}
		startTime = doc1.getElementsByTagName('StartTime')[0].textContent;
		currentIdx = doc1.getElementsByTagName('currentIdx').textContent;
		var currentdate = new Date();
		var startdate = new Date(startTime);
		
		timediff = (Math.round((currentdate-startdate)/1000));
		
		//console.log(startTime);
		fs.readFile( localurl, function(err, body) {
		if(body != "")
		{
		xml2jsparser.parseString("<root>"+body+"</root>", function (err, result) {
		
		length = result.root.event.length;
		nextIdx=0;
		nexttime = convertToSec(result.root.event[length-1]['$']['clock']);
		firsttime = convertToSec(result.root.event[0]['$']['clock']);
		clockdiff = firsttime - nexttime;
		
		if(timediff > nexttime) {
		fs.writeFile(localurl, "",0);
		}
		/*while(clockdiff - timediff< 2)
		{
		nextIdx++;
		nexttime = convertToSec(result.event[nextIdx]['$']['clock']);
		}*/
		console.log(timediff+ "  "+clockdiff+ " " + length);
		responseText = "";
		for(i=1;i<length;i++) 
		{
		if(timediff-clockdiff > -2 && timediff-clockdiff < 2)
		{
			console.log(timediff+ "  "+clockdiff);	
			responseText += (result.root.event[i]['_']);
		}
		nexttime = convertToSec(result.root.event[i]['$']['clock']);
		clockdiff = firsttime - nexttime;
		console.log(timediff+ "  "+clockdiff);	
		}
		
		console.log(responseText);
		});
		}
		});
		
		
	});
	
}

sendData();