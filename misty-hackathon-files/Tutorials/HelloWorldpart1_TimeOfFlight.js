misty.Debug("starting skill local_hellowordl1");
misty.ChangeLED(0, 255, 0);
/*linearVelocity = 10, angularVelocity = 0, time = 10000*/
misty.DriveTIme(linearVeloctiy = 50, angularVeloctiy = 0, time = 10000);

misty.RegisterEvent(FrontTOF, TimeOfFlight, 100, true);
misty.AddPropertyTest("FrontTOF", "SensorPosition", "!==", "Back", "string");
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");

function _FrontTOF(data)
{
	let frontTOF = data.PropertyTestResults[0].PropertyParent;
	misty.Debug(JSON.stringify("Distance: " + frontTOF.DistanceInMeters));
	misty.Debug(JSON.stringify("Sensor Position: " + frontTOF.SensorPosition));	
	
	misty.Stop();
	misty.ChangeLED(255, 0, 0);
	misty.Debug("ending skill helloworld part1");
}

