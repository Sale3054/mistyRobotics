

misty.MoveHeadPosition(-5,0,0,100);
misty.StartFaceDetection();
misty.StartFaceRecognition();

misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, true);

misty.Set("emailSent",(new Date()).toUTCString());

function sendEmail(imageBase64){
    //Email
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
            JSON.stringify({
                contents: imageBase64
            }), // jsonArgs
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
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){
        misty.Debug("Intruder Detected !!");
        // misty.Pause(50);
        misty.PlayAudio("002-Ahhh.wav");
        // misty.SaveImageAssetToRobot(misty.TakePicture());
        misty.Debug(secondsPast(misty.Get("emailSent")));
        if (secondsPast(misty.Get("emailSent")) > 5){
            // sendEmail();
            misty.TakePicture(true, "intruderPIC", 500, 100, false, true);
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

function secondsPast(value){
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    misty.Debug(timeElapsed);
    return Math.round(timeElapsed); // seconds
}
