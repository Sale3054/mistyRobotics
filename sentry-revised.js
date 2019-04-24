//raise Misty's head to look for faces
misty.MoveHeadPosition(-5, 0, 0, 100);
//subscribe to facial recognition services
misty.StartFaceRecognition();

function look_around()
{
  //turn left
  misty.DriveTime(0, 20, 5, 0, 0, 50);
  //pause
  misty.Drive(0, 0, 0);
  //turn right
  misty.DriveTime(0, -20, 10, 0, 0, 50);
  //pause
  misty.Drive(0, 0, 0);
  //turn return to the center
  misty.DriveTime(0, 20, 5, 0, 0, 50);
}
function register_all_sensors()
{
  var sensor_arr = ["Center", "Back", "Left", "Right"];
  for (i = 0; i < sensor_arr.length; i ++)
  {
    var func_name = sensor_arr[i].toLowerCase()+"TOF";
    var sensor_pos = sensor_arr[i];
    misty.AddPropertyTest(func_name, "SensorPosition", "==", sensor_pos, "string");
    misty.AddPropertyTest(func_name, "DistanceInMeters", "<=", 0.2, "double");
    misty.RegisterEvent(func_name, "TimeOfFlight", 100, true);
  }

  misty.AddPropertyTest("recFaces", "PersonName", "exists", "", "string");
  misty.RegisterEvent("FaceRec", "ComputerVision", 100, true);
};

function _centerTOF(data)
{
  unregister_all_sensors();
  misty.Set("triggerTimeStamp", (new Date()).toUTCString);
  misty.Set("tofTriggered", true);
  let centerTOFData = data.PropertyTestResults[0].PropertyParent;
  misty.Drive(0,0,0, 200);
  misty.DriveTime(-35, 0, 2500);
  misty.pause(1000);
  misty.DriveTime(0, 52, 2500);
  misty.Pause(2500);
  misty.Set("cannotDrive", false);
}

function _backTOF(data)
{
  unregister_all_sensors();
  misty.Set("triggerTimeStamp", (new Date()).toUTCString());
  misty.Set("tofTriggered", true);
  let backTOFData = data.PropertyTestResults[0].PropertyParent;
  //back up
  misty.Drive(0, 0, 0, 200);
  misty.DriveTime(35, 0 , 2500);
  misty.Pause(2500);
  misty.Set('cannotDrive', false);
}

function _leftTOF(data)
{
  unregister_all_sensors();
  misty.Set("tofTriggeredAt", (new Date()).toUTCString());
  misty.Set("tofTriggered", true);
  let leftTOFData = data.PropertyTestResults[0].PropertyParent;
  misty.Drive(0, 0, 0, 200);
  misty.DriveTime(-35, 0, 2500);
  misty.Pause(2500);
  misty.DriveTime(0, -52, 2500);
  misty.Pause(2500);
  misty.Set("cannotDrive", false);

}
function _rightTOF(data)
{
  unregister_all_sensors();
  misty.Set("tofTriggeredAt", (new Date()).toUTCString());
  misty.Set("tofTriggered", true);
  let rightTOFData = data.PropertyTestResults[0].PropertyParent;
  misty.Drive(0, 0, 0, 200);
  misty.DriveTime(-35, 0, 2500);
  misty.Pause(2500);
  misty.DriveTime(0, 52, 2500);
  misty.Pause(2500);
  misty.Set("cannotDrive", false);
}

misty.Set("tofTriggeredAt", (new Date()).toUTCString());
misty.Set("tofTriggered", false);
registerAll();
misty.Set("driveStartAt", (new Date()).toUTCString());
misty.Set("timeInDrive", getRandomInt(3, 8));
while(true){
  misty.Pause(50);
  if (secondsPast(misty.Get("lookStartTime")) > misty.Get("timeInLook")){
    look_around();
  }
    if (misty.Get("tofTriggered")){
      if (secondsPast(misty.Get("tofTriggeredAt")) > 4.0){
        misty.Set("tofTriggered", false);
        register_all_sensors();
      }
    }

    if(secondsPast(misty.Get("driveStartAt")) > misty.Get("timeInDrive") && !misty.Get("tofTriggered")){
      misty.Set("driveStartAt", (new Date()).toUTCString());
      misty.Drive(getRandomInt(20, 25), getRandomInt(-35, 35));
      misty.Set("timeInDrive", getRandomInt(3,8));
    }
}

function unregister_all_sensors()
{
  var sensor_arr = ["Center", "Back", "Left", "Right"];
  for (i = 0; i < sensor_arr.length; i ++)
  {
    var func_name = sensor_arr[i].toLowerCase()+"TOF";
    try{
      misty.UnregisterEvent(func_name);
    } catch(err)
    {
      misty.Debug(err);
    }
}
