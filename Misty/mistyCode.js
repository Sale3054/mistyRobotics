//---------------
//Variables
//---------------

var playThisSound = { "AssetId": "001-OooOooo.wav", };
var shapeElement = document.getElementById("shape-selection");

var formDiv = document.getElementById("shape-form-div");
var dimensionsForm = document.getElementById("shape-form");
var len = document.getElementById("length-input");
var width = document.getElementById("width-input");
var diameter = document.getElementById("diameter-input");
var formSub = document.getElementById("form-submit");

var ipAddress  = document.getElementById("ip-address");
var connect = document.getElementById("connect");
var start = document.getElementById("start");
var stop = document.getElementById("stop");
var resultsBox = document.getElementById("results");
var client;
var ip;
var count = 0;
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
  len.setAttribute("type", "hidden");
  width.setAttribute("type", "hidden");
  diameter.setAttribute("type", "hidden");
  formSub.setAttribute("type", "hidden")
  if (selectedShape == "rectangle"){
    len.setAttribute("type", "number");
    width.setAttribute("type", "number");
    formSub.setAttribute("type", "button");
  }
  else if (selectedShape == "circle"){
    diameter.setAttribute("type", "number");
    formSub.setAttribute("type", "button");
  }
  else{
    alert("Not implemented, yet.");
  }
}

function getDimensions(){
  if (shapeElement[shapeElement.selectedIndex].value == "rectangle"){
    startSentry(len.value, width.value);
  }
}

function wander(shape, length, width){
  var driveArgs = {
    "LinearVelocity": 10,
    "AngularVelocity": 0,
    "TimeMS": 10000
  }
  var turnArgs = {
    "LinearVelocity": 5,
    "AngularVelocity": 50,
    "TimeMS": 2000
  }
  client.PostCommand("drive/time", JSON.stringify(driveArgs));
  await sleep(2000);
  client.PostCommand("drive/time", JSON.stringify(turnArgs));
  await sleep(2000);
  wander(shape, length, width);
}

//main sentry function
function startSentry(length, width) {
    //TODO
    /*
    var headArgs = {
      "Pitch": -5,
      "Roll": 0,
      "Yaw": 0,
      "Velocity": 5
    }
    client.PostCommand("beta/head/move", JSON.stringify(headArgs));
    */
    detectFaces();
    wander("rectangle", length, width);
    //WanderTOF();
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
    if (messageCount % 2 === 0) {
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
  client.PostCommand("drive/stop");

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function WanderTOF() {
  //ip = $("#misty-robot-ip-address").val();

  //Create client for commanding
  //var lightClient = new LightClient(ip, 10000);

  //Create socket for listening to sensors
  lightSocket = new LightSocket(ip);
  lightSocket.Connect();

  printToScreen("LightSocket connected.");

  //Wait for connection
  await sleep(5000);

  //Subscribe to WorldState to get objects and store them
  lightSocket.Subscribe("Objects", "WorldState", 200, null, null, null, "Objects", function (data) { $('#ObjectList').val(data); });

  printToScreen("TOF Subscribed.");

  //Wait for data
  await sleep(2000);

  //Take the first step
  wanderStep(client, lightSocket);
}

async function wanderStep(lightClient, lightSocket) {
  // if (document.getElementById('StopWander').checked == true) {
    //Cleanup
    // document.getElementById('StopWander').checked = false;
    // lightClient.PostCommand("drive/stop");
    // lightSocket.Unsubscribe("Objects");
    // return;
  // }

  //Wander pass 1 - Drive straight, but when you see an obstacle, turn away from it.
  //NOTE: This implementation tends to get stuck in corners
  lin = 50;
  ang = 0;
  ms = 2000;
  mindist = 0.75;
  var objectArray = $('#ObjectList').val();
  for (var i = 0; i < objectArray.message.length; i++) {
    wobj = objectArray.message[i];
    if (wobj.location != null) {
      bearing = wobj.location.bearing;
      distance = wobj.location.distance;
      if (bearing > -Math.PI / 4 && bearing < Math.PI / 4 && distance < mindist && wobj.isSensible == true) {
        mindist = distance;
        ang = -Math.sign(bearing) * 50;
        lin = 0;
        ms = 500;
      }
    }
  }

  //The callback will trigger when driveTime finishes (or is terminated by collision avoidance), and cause the next step.  Recursion FTW!
  lightClient.PostCommand("drive/time", " {\"LinearVelocity\":" + lin + ",\"AngularVelocity\":" + ang + ", \"TimeMs\":" + ms + "}", function () { wanderStep(lightClient, lightSocket); });
}