
misty.Set("eyeMemory", "Homeostasis.png");
misty.Set("blinkStartTime",(new Date()).toUTCString());
misty.Set("timeBetweenBlink",5);

misty.Debug("wander skill started");
misty.MoveHeadPosition(-5,0,0,100);

misty.StartFaceRecognition();

var drive = true;

function blink_now(){
    misty.Debug("Calling Blink Now")
    misty.Set("blinkStartTime",(new Date()).toUTCString());
    misty.Set("timeBetweenBlink",getRandomInt(2, 8));
    misty.ChangeDisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.ChangeDisplayImage(misty.Get("eyeMemory"));
}

// Issue commands to change LED and start driving

// Register for TimeOfFlight data and add property tests

function register() {
    misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
    misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("FrontTOF", "TimeOfFlight", 100, true);

    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceRec", "ComputerVision", 100, true);

}

function _FaceRec(data){
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){     
        misty.Debug("Intruder Detected !!");
        misty.PlayAudioClip("002-Ahhh.wav");
        misty.ChangeDisplayImage("Disdainful.png");
    } else {
        misty.Debug(data.PropertyTestResults[0].PropertyValue);
        misty.PlayAudioClip("032-Bewbewbeeew.wav");

    }
}
    

// FrontTOF callback function
function _FrontTOF(data) {
    misty.Debug("FrontTOF called")
    // Get property test results
    let frontTOF = data.PropertyTestResults[0].PropertyParent;

    // // Print distance object was detected and sensor
    misty.Debug("Distance" + frontTOF.DistanceInMeters);
    misty.Debug("Sensor" + frontTOF.SensorPosition);
    // // Issue commands to change LED and stop driving
    drive = false;
    if (frontTOF.DistanceInMeters <= 0.2) {
        // misty.Stop();
        misty.ChangeLED(255, 0, 0); // red, STOP!
        misty.DriveTime(-10,30,2000);
        misty.Pause(2000);

    }
    // misty.Debug("ending skill helloworld_timeofflight ");
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


register();
while(true) {
    misty.Debug("Seconds Past: " + secondsPast(misty.Get("blinkStartTime")))
    if (secondsPast(misty.Get("blinkStartTime")) > misty.Get("timeBetweenBlink")){
        
        blink_now();
	}
    //misty.Drive(10,0);
    misty.ChangeLED(0, 255, 0);
    misty.DriveTime(10,0,2000);
    misty.Pause(2000);
}