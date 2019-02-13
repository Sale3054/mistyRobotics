// debug message to indicate the skill has started
misty.Debug("starting skill helloworld part1");

// issue commands to change LED and start DriveTime
misty.ChangeLED(0, 255, 0); // green, GO!
misty.DriveTime(10, 0, 10000);

// register for TOF and add property tests
misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");
misty.RegisterEvent("FrontTOF", "TimeOfFlight");

// TOF callback
function _FrontTOF(data) {
	// grab property test results
	let frontTOF = data.PropertyTestResults[0].PropertyParent;

	// log distance object was detected and sensor position
	misty.Debug("Distance: " + frontTOF.DistanceInMeters);
	misty.Debug("Sensor Position: " + frontTOF.SensorPosition);

	misty.Stop();
	misty.ChangeLED(255, 0, 0); // red, STOP!
	misty.Debug("ending skill helloworld part1");
}