misty.Debug("Intruder alert skill started");

misty.Set("StartTime",(new Date()).toUTCString());
misty.Set("Initiated",false);
misty.Set("falseAlarm", 0);

misty.StartFaceRecognition();

registerFaceRec();

function _FaceRec(data){
    // misty.Debug("IN");
    // try{
        if (data.PropertyTestResults[0].PropertyValue == "unknown person"){
            var count = misty.Get("falseAlarm");
            misty.Set("falseAlarm",count+1);
            misty.Debug("FalseAlarm_Avoided");
            if (misty.Get("falseAlarm")>3){        
                misty.UnregisterEvent("FaceRec");
                misty.Debug("Intruder Detected !!");
                misty.PlayAudioClip("002-Ahhh.wav");
                misty.Set("StartTime",(new Date()).toUTCString());
                misty.Set("Initiated",true);
                misty.ChangeDisplayImage("Disdainful.png");
                misty.Set("falseAlarm", 0);
            }
        } else {
            // misty.Debug(data.PropertyTestResults[0].PropertyValue);
            misty.Set("falseAlarm", 0);
            
            misty.PlayAudioClip("002-Ahhh.wav");

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

            // misty.SendExternalRequest(
            //     "GET", /*method*/
            //     "http://soundbible.com/grab.php?id=1949&type=mp3", /*resourceURL*/
            //     null, /*authorizationType*/
            //     null, /*token*/
            //     "audio/mp3", /*returnType*/
            //     null, /*jsonArgs*/
            //     true, /*saveAssetToRobot*/
            //     true, /*applyAssetAfterSaving*/
            //     "sound", /*fileName*/
            //     null, /*callbackMethod*/
            //     null, /*callbackRule*/
            //     null, /*skillToCallOnCallback*/
            //     0, /*prePause*/
            //     0/*postPause*/
            //     );

        //     $.post("https://textbelt.com/text", 
        //     {
        //         phone: '4439004615',
        //         message: 'Hello world',
        //         key: 'textbelt'
                
        //     },
        //     function(data, status) {
        //         misty.Debug("POSTGET"+JSON.stringify(data)+ JSON.stringify(status));
        //     }
        // );

        // var request = require('request');

        // request.post('https://textbelt.com/text', {
        // form: {
        // phone: '4439004615',
        // message: 'Hello world',
        // key: 'textbelt',
        // },
        // }, function(err, httpResponse, body) {
        // if (err) {
        //     misty.Debug('Error:', err);
        // // console.error('Error:', err);
        // return;
        // }
        // misty.Debug(JSON.parse(body));
        // // console.log();
        // })

        }
    
    // } catch (err) {
    //     misty.Debug("Some Error");
    // }
}

function _SendExternalRequest(data_response) {
    // Assign variables to grab the city name and current temperature
        misty.Debug(JSON.stringify(data_response));
        misty.Debug("Successful POST");
}

while (true) {
	// misty.Debug("In while loop...");
    
    if (misty.Get("Initiated")){
        var timeElapsed = new Date() - new Date(misty.Get("StartTime"));
        timeElapsed /= 1000;
        var secondsElapsed = Math.round(timeElapsed);
        // misty.Debug(secondsElapsed);
        if (secondsElapsed >= 14){
            registerFaceRec();
            misty.Set("Initiated",false);
            misty.ChangeDisplayImage("Homeostasis.png");
        } 
    } else {}
    misty.Pause(50);
}

function _Walk(data){

}

function registerFaceRec(){
	misty.Debug("In register faces...");
    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceRec", "ComputerVision", 100, true);
    //misty.RegisterEvent("Walk", "TimeOfFlight", 100, true);
}