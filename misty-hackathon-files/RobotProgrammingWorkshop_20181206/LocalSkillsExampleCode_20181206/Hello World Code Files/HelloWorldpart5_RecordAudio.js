// debug message to indicate the skill has started
misty.Debug("starting skill helloworld part5");

// send commands to start recording audio, pause for  five seconds 
// to record, then stop recording audio
misty.StartRecordingAudio("RecordingExample.wav");
misty.Pause(5000);
misty.StopRecordingAudio();

// give Misty time to save the recording
misty.Pause(2000);

// send GET request to fetch list of audio files
misty.GetListOfAudioFiles();

// callback for GET request
function _GetListOfAudioFiles(data) {
	// grab array of audio files
	let audioArr = data.Result;

	// initialize a variable to tell us if the list contained the audio file
	let containsNewFile = false;

	// loop through list and compare names of files to name specified for recording
	for (let i = 0; i < audioArr.length; i++) {
		if (audioArr[i].Name === "RecordingExample.wav") {
			// if there's a match, track it by updating boolean
			containsNewFile = true;
		}
	}

	// if list contains recording, send command to play recording
	if (containsNewFile) {
		misty.PlayAudioClip("RecordingExample.wav", 500, 500);
	} else {
		// log error message
		misty.Debug("file was not found");
	}
}