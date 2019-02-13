// debug message to indicate the skill has started
misty.Debug("starting skill helloworld part4");

const APIkey = "<your API key here>";

// send GET request to weather API
misty.SendExternalRequest("GET", `http://api.apixu.com/v1/current.json?key=${APIkey}&q=${_params.city}`, null, null, null, _SendExternalRequest);

// callback for external data
function _SendExternalRequest(data) {
	// Misty sends back the result from the command (SendExternalRequest) as an object, but when Misty receives the data from the request, it is JSON string. 
	// So, you need to parse the result from the request (data.Result) in order to access any properties.

	// assign variables to grab the city name and current temperature
	let currentCity = JSON.parse(data.Result).location.name;
	let currentTemp = JSON.parse(data.Result).current.temp_f;

	// log message to display data to the user
	misty.Debug(`The current temperature of ${currentCity} is ${currentTemp} degrees fahrenheit.`);
}