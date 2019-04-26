misty.AddReturnProperty("SerialMessage", "SerialMessage");
misty.RegisterEvent("SerialMessage", "SerialMessage", 0, true);

function _SerialMessage(data) {
  // misty.Debug("Called Serial Message");
    if(data !== undefined && data !== null)
    {
    // misty.Debug("It was not undefined");
        // Parse StringMessage data and assign it to a variable
        var obj = JSON.parse(data.AdditionalResults[0].Message);
        var temp = obj.temperature;
        var pressure = obj.pressure;
		misty.Debug("Temperature: " + temp);
		misty.Debug("Pressure: " + pressure);
    }
}
