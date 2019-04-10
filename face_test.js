

misty.MoveHeadPosition(-5,0,0,100);
misty.StartFaceRecognition();

misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
misty.RegisterEvent("FaceRec", "ComputerVision", 100, true);

misty.Set("emailSent",(new Date()).toUTCString());

function sendEmail(){
    //Email
    const user_email = "alexander.oliver@colorado.edu";
    const mode = "intruder";
    misty.SendExternalRequest(
        "POST",
        "https://script.google.com/macros/s/AKfycbyZUKkE6Ahs4R2MXVskTD4DRSwfFh7Fv8weLEy29q0XbmCn-I6J/exec?email=" + user_email + "&mode=" + mode, // resourceURL
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
}

function _FaceRec(data){
    if (data.PropertyTestResults[0].PropertyValue == "unknown person"){
        misty.Debug("Intruder Detected !!");
        misty.PlayAudioClip("002-Ahhh.wav");
        misty.ChangeDisplayImage("Disdainful.png");
        misty.SaveImageAssetToRobot(misty.TakePicture());
        misty.Debug(secondsPast(misty.Get("emailSent")));
        if (secondsPast(misty.Get("emailSent")) > 60){
            sendEmail();
            misty.Set("emailSent",(new Date()).toUTCString());
            misty.Debug("email sent.")
        }
    } else {
        // misty.Debug(data.PropertyTestResults[0].PropertyValue);
        misty.PlayAudioClip("032-Bewbewbeeew.wav");
        misty.ChangeDisplayImage("Happy.png");

    }
}

function secondsPast(value){
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}

