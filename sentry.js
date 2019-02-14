

misty.Set("eyeMemory", "Homeostasis.png");
misty.Set("blinkStartTime",(new Date()).toUTCString());
misty.Set("timeBetweenBlink",5);

misty.Debug("Sentry Skill started");
// raise head to look for faces
misty.MoveHeadPosition(-5,0,0,100);
misty.StartFaceRecognition();

misty.Set("StartTime", (new Date()).toUTCString());
misty.set("alarm", false);


misty.Set("lookStartTime",(new Date()).toUTCString());
misty.Set("timeInLook",6.0);

var drive = true;

function blink_now(){
    misty.Debug("Calling Blink Now")
    misty.Set("blinkStartTime",(new Date()).toUTCString());
    misty.Set("timeBetweenBlink",getRandomInt(2, 8));
    misty.ChangeDisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.ChangeDisplayImage(misty.Get("eyeMemory"));
}

//------------------------------------------Look Around-----------------------------------------------------

function look_around(){

    misty.Set("lookStartTime",(new Date()).toUTCString());
    misty.Set("timeInLook",getRandomInt(5, 10));
    misty.Drive(0, 20);
    misty.Drive(0,0,0, 2000);
    misty.Drive(0, -40);
    misty.Drive(0, 0, 0, 2000);
    misty.Drive(0, 20);
    misty.Drive(0, 0, 0, 2000);
    //TODO: Change MoveHeadPosition to utilize the ground sensors, call the facial recognition between stops
    // and then reset to original position
}
// Issue commands to change LED and start driving

// Register for TimeOfFlight data and add property tests

function registerAll() {
    misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
    misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");   
    misty.RegisterEvent("FrontTOF", "TimeOfFlight", 100, true);

    misty.AddPropertyTest("LeftTOF", "SensorPosition", "==", "Left", "string");
    misty.AddPropertyTest("LeftTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("LeftTOF", "TimeOfFlight", 100, true);

    misty.AddPropertyTest("RightTOF", "SensorPosition", "==", "Right", "string");
    misty.AddPropertyTest("RightTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("RightTOF", "TimeOfFlight", 100, true);

    misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string");
    misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("BackTOF", "TimeOfFlight", 100, true);


    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceRec", "ComputerVision", 100, true);

}

function _FaceRec(data){
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){     
        misty.Debug("Intruder Detected !!");
        misty.PlayAudioClip("002-Ahhh.wav");
        misty.ChangeDisplayImage("Disdainful.png");
        misty.SaveImageAssetToRobot(misty.TakePicture());
        ;
    } else {
        misty.Debug(data.PropertyTestResults[0].PropertyValue);
        misty.PlayAudioClip("032-Bewbewbeeew.wav");
        misty.ChangeDisplayImage("Happy.png");

    }
}
    
function _BackTOF(data)
{
    unregisterALL();
    misty.Set("tofTriggeredAt", (new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let backTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + backTOFData.DistanceInMeters)); 
    misty.Debug(JSON.stringify("Sensor Position: " + backTOFData.SensorPosition));
    misty.Drive(0,0,0, 200);
    misty.DriveTime(35, 0, 2500);
    misty.Pause(2500);
    misty.Set("cannotDrive",false);
}
// FrontTOF callback function
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
// ------------------------------------------Supporting Functions------------------------------------------

function secondsPast(value){
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Next 5 Lines are the only lines for Wander outside loop 
misty.Set("tofTriggeredAt",(new Date()).toUTCString());
misty.Set("tofTriggered", false);
registerAll();
misty.Set("driveStartAt",(new Date()).toUTCString());
misty.Set("timeInDrive", getRandomInt(3, 8));
while(true)
{
    //wait for misty to begin next cycle, give it time to think
    misty.Pause(50);
    misty.Debug("Seconds Past: " + secondsPast(misty.Get("blinkStartTime")))
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

    // //misty.Drive(10,0);
    // misty.ChangeLED(0, 255, 0);
    // misty.DriveTime(10,0,2000);
    // misty.Pause(2000);
}

function unregisterAll()
{
    try {
        misty.UnregisterEvent("FrontTOF")
    } catch(err){misty.Debug(err);}
    try {
        misty.UnregisterEvent("LeftTOF")
        
    } catch(err){misty.Debug(err);}
    try {
        misty.UnregisterEvent("RightTOF")
        
    } catch(err){misty.Debug(err);}
}