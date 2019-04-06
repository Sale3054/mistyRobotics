misty.AddReturnProperty("StringMessage", "StringMessage");
misty.RegisterEvent("StringMessage", "StringMessage", 0, true);

function _StringMessage(data) {
    if(data !== undefined && data !== null) {
        // Parse StringMessage data and assign it to a variable
        var obj = JSON.parse(data.AdditionalResults[0].Message);
        var temp = obj.temperature;
        var pressure = obj.pressure;
		misty.Debug(temp);
		misty.Debug(pressure);
    }
}
