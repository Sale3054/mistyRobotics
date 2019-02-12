misty.GetListOfAudioClips();

function _GetListOfAudioClips(data)
{
	if (data)
	{
		let audioArr = data.Result;
		let randNum = Math.floor(Math.random() * audioArr.length);
	}
	let randSound = audioArr[randNum].Name;
	misty.Debug(json.Stringify(randSound));
	misty.PlayAudioClip(randSound);
}