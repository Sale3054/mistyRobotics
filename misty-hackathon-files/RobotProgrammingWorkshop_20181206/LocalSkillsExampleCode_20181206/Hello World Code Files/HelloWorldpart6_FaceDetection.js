// debug message to indicate the skill has started
misty.Debug("starting skill helloworld part6");

// register for face detection event, and timeout
misty.RegisterEvent("FaceDetection", "ComputerVision", 250);
misty.RegisterTimerEvent("FaceDetectionTimeout", 15000);

// send command to start face detection
misty.StartFaceDetection();

// face detection event callback
function _FaceDetection() {
   misty.Debug("Face Detected!");

   misty.PlayAudioClip("005-OoAhhh.wav");
   misty.ChangeLED(255, 255, 255); // white
   misty.StopFaceDetection();
}

// timeout callback
function _FaceDetectionTimeout() {
	misty.Debug("face detection timeout called, it's taking too long...");

	misty.ChangeLED(0, 0, 0); // black
	misty.StopFaceDetection();
}