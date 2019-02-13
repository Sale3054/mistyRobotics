// debug message to indicate the skill has started
misty.Debug("starting skill helloworld part2");

// issue GET request to fetch list of audio clips
misty.GetListOfAudioClips();

// callback for GET request
function _GetListOfAudioClips(data) {
	// check if data was received
	if (data) {
		// capture the array of files
		let audioArr = data.Result;

		// generate a random number and use it to choose a filename at 
		// random from the list, log the name of the file
        let randNum = Math.floor(Math.random() * audioArr.length);
        let randSound = audioArr[randNum].Name;
		misty.Debug(randSound);

		// send command to play the audio clip
		misty.PlayAudioClip(randSound);
    }
}