misty.Debug("wander skill started");

misty.StartFaceRecognition();

var drive = true;

// Issue commands to change LED and start driving
//misty.ChangeLED(0, 255, 0); // green, GO!
//misty.Drive(10, 0);

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



register();
while(drive) {
    //misty.Drive(10,0);
    misty.ChangeLED(0, 255, 0);
    misty.DriveTime(10,0,2000);
    misty.Pause(2000);
}