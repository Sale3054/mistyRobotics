misty.Debug("Sentry Skill started");
// raise head to look for faces
misty.MoveHeadPosition(-5,0,0,100);
//Subscribe to facial detection
misty.StartFaceDetection();
misty.StartFaceRecognition();
misty.Set("StartTime", (new Date()).toUTCString());
misty.Set("alarm", false);
misty.Set("lookStartTime",(new Date()).toUTCString());
misty.Set("timeInLook",6.0);
misty.Set("emailSent",(new Date()).toUTCString());
misty.Set("textSent", (new Date()).toUTCString());

//------------------------------------------Look Around-----------------------------------------------------

function look_around(){
    misty.Set("lookStartTime",(new Date()).toUTCString());
    misty.Set("timeInLook",getRandomInt(5, 10));
    //turn
    misty.Drive(0, 20);
    //wait
    misty.Drive(0,0,0, 2000);
    //turn back the other way
    misty.Drive(0, -40);
    //wait
    misty.Drive(0, 0, 0, 2000);
    //reset to center
    misty.Drive(0, 20);
    //wait
    misty.Drive(0, 0, 0, 2000);
}

function sendText(){
            misty.SendExternalRequest(
                "POST",
                "https://textbelt.com/text",
                null,
                null,
                null,
                JSON.stringify({
                    phone: 'ENTER-YOUR-PHONE-#-HERE',
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
    // if the data received returns a person that is unknown
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){
        misty.Debug("Intruder Detected !!");
        //Play the intruder-alert sound that is packaged within our files
        misty.PlayAudio("intruder-alert.wav");
        //print how long it has been since we have sent a message
        misty.Debug(secondsPast(misty.Get("emailSent")));
        //if it's been at least 60 seconds since we have sent an email, send one with a picture
        if (secondsPast(misty.Get("emailSent")) > 60){
            misty.TakePicture(true, "intruderPIC", 1200, 1600, false, true);
            //update the last time we have sent an email
            misty.Set("emailSent",(new Date()).toUTCString());
            misty.Debug("Email sent");
        }
        if (secondsPast(misty.Get("textSent")) > 60){
          //if it's been at least a minute since we've sent a text, send a text
          sendText();
          misty.Set("textSent", (new Date()).toUTCString());
          misty.Debug("Text sent");
        }
    } else {
        misty.Debug(data.PropertyTestResults[0].PropertyValue);
        misty.PlayAudio("032-Bewbewbeeew.wav");


    }
}

function _TakePicture(data){
  //take a picture and send it to the registered email
	var base64Image = data.Result.Base64;
  	misty.Debug(base64Image);
  	sendEmail(base64Image);
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

function sendEmail(imageBase64){
    //Email
    //take off the extra encoding information in the string (stuff that isn't actually the picture)
    //but rather picture file info
    var imageBase64Correct = imageBase64.substr(23)
    //enter your credentials
    const user_email = "your.email@example.com";
    const mode = "intruder";
    const api_key = 'PUT-YOUR-GOOGLE-APPS-SCRIPT-API-KEY-HERE';
    const appURL = "https://script.google.com/macros/s/"+api_key+"/exec";
    //make the request
    try {
	    misty.SendExternalRequest(
	        "POST",
	        appURL + "?email=" + user_email + "&mode=" + mode, // resourceURL
	        null, // authorizationType
	        null, // token
	        "text/html", // returnType
            imageBase64Correct, // jsonArgs
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


function secondsPast(value){
  //calculate the seconds past since the passed-in value has occurred
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}


function getRandomInt(min, max) {
    //calculate a random number in the range between max and min
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Next 5 Lines are the only lines for Wander outside loop
//this gets things rolling
misty.Set("tofTriggeredAt",(new Date()).toUTCString());
misty.Set("tofTriggered", false);
registerAll();
misty.Set("driveStartAt",(new Date()).toUTCString());
misty.Set("timeInDrive", getRandomInt(3, 8));

while(true)
{
    //wait for misty to begin next cycle, give it time to think
    // misty.Pause(50);
    // // if (secondsPast(misty.Get("lookStartTime")) > misty.Get("timeInLook")){
    // //     look_around();
    // // }

    // Wander - tof
    //register the sensors
    if (misty.Get("tofTriggered")){
        if (secondsPast(misty.Get("tofTriggeredAt")) > 4.0){
            misty.Set("tofTriggered", false);
            registerAll();
        }
    }
        //Wander - drive
        //drive!
    if (secondsPast(misty.Get("driveStartAt")) > misty.Get("timeInDrive") && !misty.Get("tofTriggered")){
        misty.Set("driveStartAt",(new Date()).toUTCString());
        misty.Drive(getRandomInt(20,25), getRandomInt(-35,35));
        misty.Set("timeInDrive", getRandomInt(3, 8));
    }
}
