// debug message to indicate the skill has started
misty.Debug("starting skill helloworld part3");

// global variable to track the amount of callbacks triggered
_count = 0;

// register for the timer event, specifying the duration of the timer
misty.RegisterTimerEvent("TimerEvent", 3000, true);

// callback specified for Timer event
function _TimerEvent() {

	// check if _count is less than 5
	if (_count < 5) {

		// if so, increment count by 1, specify random RGB values and send command to change LED
		_count = _count + 1;
		let value1 = Math.floor(Math.random() * (256));
		let value2 = Math.floor(Math.random() * (256));
		let value3 = Math.floor(Math.random() * (256));
		misty.ChangeLED(value1, value2, value3);

	} else {

		// otherwise, turn off LED, unregister for the timer event and
		// signal end of skill
		misty.UnregisterEvent("TimerEvent");
		misty.ChangeLED(0, 0, 0); // off
		misty.Debug("ending skill helloworld part3");
	}
}