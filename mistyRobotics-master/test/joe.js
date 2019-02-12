// On seeing a known face Misty greets and smiles... while on seeing an unknown face misty takes a picture and saves it

misty.Debug("Centering Head");
misty.MoveHeadPosition(-5, 0, 0, 100);
misty.MoveArmPosition("left", 0, 45);
misty.Pause(50);
misty.MoveArmPosition("right", 0, 45);

misty.StartFaceRecognition();
registerFaceRec();
misty.Set("FaceDetectedAt",(new Date()).toUTCString());
misty.Set("Initiated",false);

// ------------------------------------------FaceRec-----------------------------------------------------

function registerFaceRec(){
  misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
  misty.RegisterEvent("FaceRec", "ComputerVision", 1000, false);
}

function _FaceRec(data){
  misty.Drive(0, 0);
  var faceDetected = data.PropertyTestResults[0].PropertyValue;
  if (faceDetected == "unknown person"){
      misty.ChangeLED(255, 0, 0);
      misty.ChangeDisplayImage("Disdainful.png");
      misty.PlayAudioClip("007-Surprised_Ahhh.wav");
      misty.TakePicture(false, "Intruder", 1200, 1600, false, true);
      misty.MoveArmPosition("left", 5, 45);
      misty.Pause(50);
      misty.MoveArmPosition("right", 5, 45);
  } else if (faceDetected == "JANE") {
      misty.ChangeLED(148, 0, 211);
      misty.ChangeDisplayImage("Happy.png");
      misty.PlayAudioClip("015-Meow.wav"); // This line could be replaced with an api to call google voice / mistys text to speech
      misty.MoveArmPosition("left", 10, 45);
      misty.Pause(50);
      misty.MoveArmPosition("right", 10, 45);
  } else {
      misty.ChangeLED(148, 0, 211);
      misty.ChangeDisplayImage("Wonder.png");
      misty.PlayAudioClip("wupd.wav");
      misty.MoveArmPosition("left", 10, 45);
      misty.Pause(50);
      misty.MoveArmPosition("right", 10, 45);
  }

  misty.Set("FaceDetectedAt",(new Date()).toUTCString());
  misty.Set("Initiated",true);
}

// ------------------------------------------Loop-----------------------------------------------------
misty.Drive(15,20);
while (true) {
  misty.Pause(100);
  if (misty.Get("Initiated") && secondsPast(misty.Get("FaceDetectedAt")) > 7.0){
      misty.ChangeDisplayImage("Homeostasis.png");
      misty.Set("Initiated",false);
      misty.MoveArmPosition("left", 0, 45);
      misty.Pause(50);
      misty.MoveArmPosition("right", 0, 45);
      misty.Drive(15,20);
      misty.Pause(1000);
      registerFaceRec();
      misty.ChangeLED(0, 255, 0);
  }
}

// ------------------------------------------Supporting Functions-----------------------------------------------------

function secondsPast(value){
   var timeElapsed = new Date() - new Date(value);
  timeElapsed /= 1000;
  return Math.round(timeElapsed); // seconds
}
