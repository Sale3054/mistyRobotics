/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

misty.Debug("Starting Fire Security!!");

misty.Debug("Centering Head");
misty.MoveHeadPosition(0, 0, 0, 100);
misty.Pause(3000);

misty.Set("StartTime",(new Date()).toUTCString());
misty.Set("alarm",false);

misty.Set("eyeMemory", "Homeostasis.png");
misty.Set("blinkStartTime",(new Date()).toUTCString());
misty.Set("timeBetweenBlink",5);

misty.Set("lookStartTime",(new Date()).toUTCString());
misty.Set("timeInLook",6.0);

misty.Set("red", 148);
misty.Set("green", 0);
misty.Set("blue", 211);
misty.ChangeLED(148, 0, 211);

// ------------------------------------------Blink-----------------------------------------------------

function blink_now(){
    misty.Set("blinkStartTime",(new Date()).toUTCString());
    misty.Set("timeBetweenBlink",getRandomInt(2, 8));
    misty.ChangeDisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.ChangeDisplayImage(misty.Get("eyeMemory"));
}

//------------------------------------------Look Around-----------------------------------------------------

function look_around(){
	//misty.Debug("LOOKING AROUND");
    misty.Set("lookStartTime",(new Date()).toUTCString());
    misty.Set("timeInLook",getRandomInt(5, 10));
	misty.MoveHeadPosition(gaussianRandom(-5,1), gaussianRandom(-5,5), gaussianRandom(-5,5), 45);
}

// ------------------------------------------Loop---------------------------------------------------------

// Next 5 Lines are the only lines for Wander outside loop 
misty.Set("tofTriggeredAt",(new Date()).toUTCString());
misty.Set("tofTriggered", false);
registerAll();
misty.Set("driveStartAt",(new Date()).toUTCString());
misty.Set("timeInDrive", getRandomInt(3, 8));

while (true) {
	misty.Pause(50);
	if (secondsPast(misty.Get("blinkStartTime")) > misty.Get("timeBetweenBlink")){
        blink_now();
	}

	if (secondsPast(misty.Get("lookStartTime")) > misty.Get("timeInLook")){
		look_around();
	}

	// Wander - tof
	if (misty.Get("tofTriggered")){
        if (secondsPast(misty.Get("tofTriggeredAt")) > 4.0){
            misty.Set("tofTriggered", false);
            registerAll();
        }
    }

	//Wander - drive
    if (secondsPast(misty.Get("driveStartAt")) > misty.Get("timeInDrive") && !misty.Get("tofTriggered")){
        misty.Set("driveStartAt",(new Date()).toUTCString());
        misty.Drive(getRandomInt(20,25), getRandomInt(-35,35));
        misty.Set("timeInDrive", getRandomInt(3, 8));
    }

}

// ------------------------------------------Supporting Functions------------------------------------------

function secondsPast(value){
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function map (num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function gaussianRand() {
    var u = 0.0, v = 0.0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random() ; //(max - min + 1)) + min
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

function gaussianRandom(start, end) {
    return Math.floor(start + gaussianRand() * (end - start + 1));
}

//--------------------------------------TOFs-------------------------------------


function _BackTOF(data) {
	//misty.UnregisterEvent("FrontTOF");

	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let backTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + backTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + backTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(35, 0, 2500);
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
}


function _FrontTOF(data) {
	//misty.UnregisterEvent("FrontTOF");
	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let frontTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + frontTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + frontTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, 52, 2500);
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
	
}

function _LeftTOF(data) {
	//misty.UnregisterEvent("FrontTOF");
	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let leftTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + leftTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + leftTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, -52, 2500);	
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
	
}

function _RightTOF(data) {
	//misty.UnregisterEvent("FrontTOF");
	unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
	let rightTOFData = data.PropertyTestResults[0].PropertyParent; 
	misty.Debug(JSON.stringify("Distance: " + rightTOFData.DistanceInMeters)); 
	misty.Debug(JSON.stringify("Sensor Position: " + rightTOFData.SensorPosition));
	misty.Drive(0,0,0, 200);
	misty.DriveTime(-35, 0, 2500);
	misty.Pause(1000);
	misty.DriveTime(0, 52, 2500);	
	misty.Pause(2500);
	misty.Set("cannotDrive",false);
	
}


function registerAll(){

	misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string"); 
	misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("FrontTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("LeftTOF", "SensorPosition", "==", "Left", "string"); 
	misty.AddPropertyTest("LeftTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("LeftTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("RightTOF", "SensorPosition", "==", "Right", "string"); 
	misty.AddPropertyTest("RightTOF", "DistanceInMeters", "<=", 0.15, "double"); 
	misty.RegisterEvent("RightTOF", "TimeOfFlight", 0, false);

	misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string"); 
	misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.20, "double"); 
	misty.RegisterEvent("BackTOF", "TimeOfFlight", 0, false);

}


function unregisterAll(){

	try{
		misty.UnregisterEvent("FrontTOF");
	} catch(err) {}
	try{
		misty.UnregisterEvent("BackTOF");
	} catch(err) {}
	try{
		misty.UnregisterEvent("RightTOF");
	} catch(err) {}
	try{
		misty.UnregisterEvent("LeftTOF");
	} catch(err) {}
}