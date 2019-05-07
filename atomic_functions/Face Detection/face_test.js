

misty.MoveHeadPosition(-5,0,0,100);
misty.StartFaceDetection();
misty.StartFaceRecognition();

misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, true);

misty.Set("emailSent",(new Date()).toUTCString());

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

function secondsPast(value){
  //calculate the seconds past since the passed-in value has occurred
	var timeElapsed = new Date() - new Date(value);
  timeElapsed /= 1000;
  return Math.round(timeElapsed); // seconds
}
