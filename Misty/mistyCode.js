//---------------
//Variables
//---------------

var playThisSound = { "AssetId": "001-OooOooo.wav", };
var shapeElement = document.getElementById("shape-selection");
var formDiv = document.getElementById("shape-form-div");
var dimensionsForm = document.getElementById("shape-form");
var ipAddress  = document.getElementById("ip-address");
var connect = document.getElementById("connect");
var start = document.getElementById("start");
var stop = document.getElementById("stop");
var resultsBox = document.getElementById("results");
var client;
var ip;
var msg = {
  "$id": "1",
  "Operation": "subscribe",
  "Type": "FaceDetection",
  "DebounceMs": 1500,
	"EventName": "FaceDetection",
  "Message": ""
};

var unsubscribeMsg = {
  "$id": "1",
  "Operation": "unsubscribe",
  "EventName": "FaceDetection",
  "Message": ""
};

var message = JSON.stringify(msg);
var unsubscribeMessage = JSON.stringify(unsubscribeMsg);
var messageCount = 0;
var socket;

//---------------
//Functions 
//---------------

//This function is called when the 'Connect' button is clicked
connect.onclick = function() {
    ip = validateIPAddress(ipAddress.value);
    if (!ip) {
      printToScreen("IP address needed.");
      return;
    }
    client = new LightClient(ip, 10000);
    client.GetCommand("info/device", function(data) {
      printToScreen("Connected to robot.");
      console.log(data);
    });
};

//This function is called when the 'Start' button is clicked
start.onclick = function() {
    if (!ip) {
      printToScreen("You must connect to a robot first.");
      return;
    }
    startSentry();
};

//This function is called when the 'Stop' button is clicked
stop.onclick = function() {
    stopSentry();
};

function createDimensionForm(){ 
  selectedShape = shapeElement[shapeElement.selectedIndex].value;
  var len = document.getElementById("length-input");
  var width = document.getElementById("width-input");
  var diameter = document.getElementById("diameter-input");
  var sub = document.getElementById("form-submit");
  len.setAttribute("type", "hidden");
  width.setAttribute("type", "hidden");
  diameter.setAttribute("type", "hidden");
  sub.setAttribute("type", "hidden");
  if (selectedShape == "rectangle"){
    len.setAttribute("type", "number");
    width.setAttribute("type", "number");
    sub.setAttribute("type", "submit");
  }
  else if (selectedShape == "circle"){
    diameter.setAttribute("type", "number");
    sub.setAttribute("type", "submit");
  }
}

function getDimensions(){
  
}

//main sentry function
function startSentry() {
    //TODO
    detectFaces();
}

//Face Detection
function detectFaces() {
  //Create a new websocket, if one is not already open
  socket = new WebSocket("ws://" + ip + "/pubsub");
    
  //When the socket is open, send the message
  socket.onopen = function(event) {
    printToScreen("WebSocket opened.");
    socket.send(message);
    client.PostCommand("beta/faces/detection/start");
    printToScreen("Face detection started.");
  };
  
  // Handle messages received from the server
  socket.onmessage = function(event) {
    messageCount +=1;
    var msg = JSON.parse(event.data).message;
    console.log(msg);
    
    // Adjust the timing of the desired reaction based on
    // how frequently the face detection messages come through
    if (messageCount % 5 === 0) {
      printToScreen("Face detected.");
      var payload = JSON.stringify(playThisSound);
      client.PostCommand("audio/play", payload);
    }
  };
  
  // Handle any errors that occur.
  socket.onerror = function(error) {
    console.log("WebSocket Error: " + error);
  };
  
  // Do something when the WebSocket is closed.
  socket.onclose = function(event) {
    printToScreen("WebSocket closed.");
  };
}

// Stop sentry function
function stopSentry() {
  client.PostCommand("beta/faces/detection/stop");

if(socket) {
  socket.send(unsubscribeMessage);
  printToScreen("Face detection stopped.");  
  //socket.close();
}

messageCount = 0;
}

//This function is validates that the number in the text field looks like an IP address
function validateIPAddress(ip) {
	var ipNumbers = ip.split(".");
	var ipNums = new Array(4);
	if (ipNumbers.length !== 4) {
		return "";
	}
	for (let i = 0; i < 4; i++) {
		ipNums[i] = parseInt(ipNumbers[i]);
		if (ipNums[i] < 0 || ipNums[i] > 255) {
			return "";
		}
	}
	return ip;
}

function printToScreen(msg) {
    resultsBox.innerHTML += (msg + "\n");
}
  