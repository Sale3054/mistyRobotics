misty.MoveHeadPosition(-5,0,0,100);
misty.StartFaceDetection();
misty.StartFaceRecognition();

misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, true);

misty.Set("emailSent",(new Date()).toUTCString());
//When Misty sees you in front of it, it will run the sendEmail and sendText functions,
//regardless if it recognizes you
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

function _FaceRec(data){
  // if the data received returns a person that is unknown
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
      sendText();
    }
}

function _TakePicture(data){
  misty.Debug("Taking a picture");
	var base64Image = data.Result.Base64;
  	misty.Debug(base64Image);
    //send an email with the 'intruder mode' set
  	sendEmail(base64Image, 'intruder');
}
function secondsPast(value){
  //calculate the seconds past since the passed-in value has occurred
	var timeElapsed = new Date() - new Date(value);
  timeElapsed /= 1000;
  return Math.round(timeElapsed); // seconds
}
