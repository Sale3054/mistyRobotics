misty.Debug("Sentry Skill started");
// raise head to look for faces
misty.MoveHeadPosition(0,0,0,100);
//subscribe to facial recognition
misty.StartFaceDetection();
misty.StartFaceRecognition();
//initialize important variables, so we don't spam the recipient
misty.Set("StartTime", (new Date()).toUTCString());
misty.Set("alarm", false);
misty.Set("lookStartTime",(new Date()).toUTCString());
misty.Set("timeInLook",6.0);
misty.Set("emailSent",(new Date()).toUTCString());
misty.Set("textSent", (new Date()).toUTCString());
misty.Set("climateSent", (new Date()).toUTCString());

function look_around(){
    misty.Set("lookStartTime",(new Date()).toUTCString());
    misty.Set("timeInLook",getRandomInt(5, 10));
    misty.Debug("Looking around");
    misty.Drive(0, 20,0,2000);
    // misty.Pause(1000);
    // misty.Drive(0,0,0, 2000);
    misty.Drive(0, -40,0,2000);
    // misty.Pause(1000);
    // misty.Drive(0, 0, 0, 2000);
    misty.Drive(0, 20,0,2000);
    // misty.Drive(0, 0, 0, 2000);
}

function sendText(){
    misty.SendExternalRequest(
        "POST",
        "https://textbelt.com/text",
        null,
        null,
        null,
        JSON.stringify({
            phone: 'INSERT-PHONE-NUMBER-HERE',
            message: 'Hello world',
            key: 'textbelt'
        }),
        false,
        false,
        null,
        null, /*callbackMethod*/
        null, /*callbackRule*/
        null, /*skillToCallOnCallback*/
        0, /*prePause*/
        0/*postPause*/
    );

}
// Issue commands to change LED and start driving

// Register for TimeOfFlight data and add property tests

// Register for TimeOfFlight data and add property tests
function registerAll() {
  //register our sensors in a compact way, since we're doing the same checks
  //for all of them
  var tof = ["Center", "Left", "Right", "Back"];
  for (var i = 0; i < tof.length; i++)
  {
    var sensor = tof[i]+"TOF";
    misty.AddPropertyTest(sensor, "SensorPosition", "==", tof[i] "string");
    misty.AddPropertyTest(sensor, "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent(sensor, "TimeOfFlight", 100, true);
  }
  misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
  misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, true);
}

function unregisterAll(){
  //unregister our sensors
  var tof = ["CenterTOF", "LeftTOF", "RightTOF", "BackTOF"];
  for (var i =0; i < tof.length; i++)
  {
    try {
      misty.UnregisterEvent(tof[i]);
    } catch(err){misty.Debug(err);}
  }
}

function _FaceRec(data){
    misty.Debug("Handling face recognition event");
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){
        misty.Debug("Intruder Detected !!");
        misty.Debug(secondsPast(misty.Get("emailSent")));
        if (secondsPast(misty.Get("emailSent")) > 5){
            misty.PlayAudio("intruder-alert.wav");
            misty.TakePicture(true, "intruderPIC", 1200, 1600, false, true);
            misty.Set("emailSent",(new Date()).toUTCString());
            misty.Debug("Email sent");
        }
        if (secondsPast(misty.Get("textSent")) > 5){
          sendText();
          misty.Set("textSent", (new Date()).toUTCString());
          misty.Debug("Text sent");
        }
    } else {
        misty.Debug(data.PropertyTestResults[0].PropertyValue);
        misty.PlayAudio("032-Bewbewbeeew.wav");
    }
}

function _SerialMessage(data) {
    if(data !== undefined && data !== null)
    {
        var obj = JSON.parse(data.AdditionalResults[0].Message);
        var temp = obj.temperature;
        var humidity = obj.pressure;

        misty.Debug("Temperature: " + temp);
        misty.Debug("Humidity: " + humidity);

        if (secondsPast(misty.Get("climateSent")) > 20){
            if(temp > 50){
              sendEmail(temp, 'toohot');
              misty.Debug("Climate Sent.");
            }
            if(humidity > 50){
              sendEmail(humidity, 'toohumid');
              misty.Debug("Climate Sent.");
            }
            misty.Set("climateSent", (new Date()).toUTCString());
        }
    }
}

function _TakePicture(data){
  misty.Debug("Taking a picture");
	var base64Image = data.Result.Base64;
  	misty.Debug(base64Image);
  	sendEmail(base64Image, 'intruder');
}

function _BackTOF(data)
{
    unregisterALL();
    misty.Set("tofTriggeredAt", (new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let backTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + backTOFData.DistanceInMeters));
    misty.Debug(JSON.stringify("Sensor Position: " + backTOFData.SensorPosition));
    //stop
    misty.Drive(0,0,0, 200);
    //drive forward
    misty.DriveTime(35, 0, 2500);
    //think
    misty.Pause(2500);
}

function _CenterTOF(data) {
    unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let frontTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + frontTOFData.DistanceInMeters));
    misty.Debug(JSON.stringify("Sensor Position: " + frontTOFData.SensorPosition));
    //back up
    misty.Drive(0,0,0, 200);
    //turn away
    misty.DriveTime(-35, 0, 2500);
    //think
    misty.Pause(1000);
    //drive forward
    misty.DriveTime(0, 52, 2500);
    //think
    misty.Pause(2500);
}


function _LeftTOF(data) {
    unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let leftTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + leftTOFData.DistanceInMeters));
    misty.Debug(JSON.stringify("Sensor Position: " + leftTOFData.SensorPosition));
    //stop
    misty.Drive(0,0,0, 200);
    //back up
    misty.DriveTime(-35, 0, 2500);
    //think
    misty.Pause(1000);
    //turn
    misty.DriveTime(0, -52, 2500);
    //think
    misty.Pause(2500);
}

function _RightTOF(data) {
    unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let rightTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + rightTOFData.DistanceInMeters));
    misty.Debug(JSON.stringify("Sensor Position: " + rightTOFData.SensorPosition));
    //stop
    misty.Drive(0,0,0, 200);
    //back up
    misty.DriveTime(-35, 0, 2500);
    //think
    misty.Pause(1000);
    //turn
    misty.DriveTime(0, 52, 2500);
    //think
    misty.Pause(2500);
}

// ------------------------------------------Supporting Functions------------------------------------------

function sendEmail(data, mode){
    misty.Debug("Sending Email");
    const user_email = "your.email@example.com";
    const = api_key = 'Enter your google apps script API key here';
    const appURL = "https://script.google.com/macros/s/"+ api_key + "/exec";
    if (mode == 'intruder'){
      //if the mode is intruder, try this:
        var data = data.substr(23)
        try {
            misty.SendExternalRequest(
                "POST",
                appURL + "?email=" + user_email + "&mode=" + mode, // resourceURL
                null, // authorizationType
                null, // token
                "text/html", // returnType
                data, // jsonArgs
                false, // saveAssetToRobot
                false, // applyAssetAfterSaving
                null, // fileName
                null, // callbackMethod
                null, // callbackRule
                null, // skillToCallOnCallback
                0, // prePause
                0  // postPause
            );
        } catch (error) {
            Misty.Debug(error);
        }
    } else {
        try {
          //otherwise, the email is being sent for humidity/temperature reasons, so use this form
    	    misty.SendExternalRequest(
    	        "POST",
    	        appURL + "?email=" + user_email + "&mode=" + mode + '&data='+ data, // resourceURL
    	        null, // authorizationType
    	        null, // token
    	        "text/html", // returnType
                null, // jsonArgs
    	        false, // saveAssetToRobot
    	        false, // applyAssetAfterSaving
    	        null, // fileName
    	        null, // callbackMethod
    	        null, // callbackRule
    	        null, // skillToCallOnCallback
    	        0, // prePause
    	        0  // postPause
    	    );
    	} catch (error) {
    		Misty.Debug(error);
    	}
    }
}


function secondsPast(value){
  // misty.Debug("Calculating seconds Past");
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
    // if (secondsPast(misty.Get("lookStartTime")) > misty.Get("timeInLook")){
    //     look_around();
    // }

    // Wander - tof
    //register the sensors
    if (misty.Get("tofTriggered")){
        if (secondsPast(misty.Get("tofTriggeredAt")) > 4.0){
            misty.Set("tofTriggered", false);
            registerAll();
        }
    }
    //Wander - drive
    //start driving
    if (secondsPast(misty.Get("driveStartAt")) > misty.Get("timeInDrive") && !misty.Get("tofTriggered")){
        misty.Set("driveStartAt",(new Date()).toUTCString());
        misty.Drive(getRandomInt(20,25), getRandomInt(-35,35));
        misty.Set("timeInDrive", getRandomInt(3, 8));
    }
}
