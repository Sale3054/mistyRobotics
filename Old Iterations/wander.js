misty.Debug("wander skill started");

// Issue commands to change LED and start driving
misty.ChangeLED(0, 255, 0); // green, GO!
misty.Drive(10, 0);

// Register for TimeOfFlight data and add property tests
misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");

function registerTOF() {
    misty.RegisterEvent("FrontTOF", "TimeOfFlight", 100, true);

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
    if (frontTOF.DistanceInMeters <= 0.2) {
        misty.Stop();
        misty.ChangeLED(255, 0, 0); // red, STOP!
        misty.DriveTime(-10,30,2000);
        misty.Pause(2000);

    }
    // misty.Debug("ending skill helloworld_timeofflight ");
}

registerTOF();
while(true) {
    misty.Drive(10,0);
    misty.ChangeLED(0, 255, 0);
}