misty.Debug("Sentry Skill started");
// raise head to look for faces
misty.MoveHeadPosition(-5,0,0,100);
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
    misty.Drive(0, 20);
    misty.Drive(0,0,0, 2000);
    misty.Drive(0, -40);
    misty.Drive(0, 0, 0, 2000);
    misty.Drive(0, 20);
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
                    phone: '2678843378',
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
    misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
    misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("FrontTOF", "TimeOfFlight", 100, true);

    // misty.AddPropertyTest("LeftTOF", "SensorPosition", "==", "Left", "string");
    // misty.AddPropertyTest("LeftTOF", "DistanceInMeters", "<=", 0.2, "double");
    // misty.RegisterEvent("LeftTOF", "TimeOfFlight", 100, true);


    misty.AddPropertyTest("RightTOF", "SensorPosition", "==", "Right", "string");
    misty.AddPropertyTest("RightTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("RightTOF", "TimeOfFlight", 100, true);

    misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string");
    misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent("BackTOF", "TimeOfFlight", 100, true);


    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, true);

}

function _FaceRec(data){
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){
        misty.Debug("Intruder Detected !!");
        // misty.Pause(50);
        misty.PlayAudio("intruder-alert.wav");
        // misty.SaveImageAssetToRobot(misty.TakePicture());
        misty.Debug(secondsPast(misty.Get("emailSent")));
        if (secondsPast(misty.Get("emailSent")) > 5){
            // sendEmail();
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

function _TakePicture(data){
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
    misty.Drive(0,0,0, 200);
    misty.DriveTime(35, 0, 2500);
    misty.Pause(2500);
    misty.Set("cannotDrive",false);
}

// FrontTOF callback function
function _FrontTOF(data) {
    //misty.UnregisterEvent("FrontTOF");
    unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let frontTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + frontTOFData.DistanceInMeters));
    misty.Debug(JSON.stringify("Sensor Position: " + frontTOFData.SensorPosition));
    misty.Drive(0,0,0, 200);
    misty.DriveTime(-35, 0, 2500);
    misty.Pause(1000);
    misty.DriveTime(0, 52, 2500);
    misty.Pause(2500);
    misty.Set("cannotDrive",false);

}


function _LeftTOF(data) {
    //misty.UnregisterEvent("FrontTOF");
    unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let leftTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + leftTOFData.DistanceInMeters));
    misty.Debug(JSON.stringify("Sensor Position: " + leftTOFData.SensorPosition));
    misty.Drive(0,0,0, 200);
    misty.DriveTime(-35, 0, 2500);
    misty.Pause(1000);
    misty.DriveTime(0, -52, 2500);
    misty.Pause(2500);
    misty.Set("cannotDrive",false);
}

function _RightTOF(data) {
    //misty.UnregisterEvent("FrontTOF");
    unregisterAll();
    misty.Set("tofTriggeredAt",(new Date()).toUTCString());
    misty.Set("tofTriggered", true);
    let rightTOFData = data.PropertyTestResults[0].PropertyParent;
    misty.Debug(JSON.stringify("Distance: " + rightTOFData.DistanceInMeters));
    misty.Debug(JSON.stringify("Sensor Position: " + rightTOFData.SensorPosition));
    misty.Drive(0,0,0, 200);
    misty.DriveTime(-35, 0, 2500);
    misty.Pause(1000);
    misty.DriveTime(0, 52, 2500);
    misty.Pause(2500);
    misty.Set("cannotDrive",false);

}

// ------------------------------------------Supporting Functions------------------------------------------

function sendEmail(imageBase64){
    //Email
    var imageBase64Correct = imageBase64.substr(23)
    const user_email = "joseph.wroe@colorado.edu";
    const mode = "intruder";
    const appURL = "https://script.google.com/macros/s/AKfycbyK8HjMdcJ_eMRiMdS3hzR_6I2p4puHYwithe8UguejkPxPTuBZ/exec";
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
    if (secondsPast(misty.Get("lookStartTime")) > misty.Get("timeInLook")){
        look_around();
    }

    // Wander - tof
    if (misty.Get("tofTriggered")){
        if (secondsPast(misty.Get("tofTriggeredAt")) > 4.0){
            misty.Set("tofTriggered", false);
            registerAll();
        }
    }
        //Wander - drive
    if (secondsPast(misty.Get("driveStartAt")) > misty.Get("timeInDrive") && !misty.Get("tofTriggered")){
        misty.Set("driveStartAt",(new Date()).toUTCString());
        misty.Drive(getRandomInt(20,25), getRandomInt(-35,35));
        misty.Set("timeInDrive", getRandomInt(3, 8));
}
}

function unregisterAll()
{
    try {
        misty.UnregisterEvent("FrontTOF")
    } catch(err){misty.Debug(err);}
    try {
        misty.UnregisterEvent("LeftTOF")

    } catch(err){misty.Debug(err);}
    try {
        misty.UnregisterEvent("RightTOF")

    } catch(err){misty.Debug(err);}
}
