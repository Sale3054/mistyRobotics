function
doPost(e)
{
  //Function takes in a POST request from a Misty Robot, looking for the following information:
  /*
  * Mode: Indicates what type of event triggered the need to notify the user
  * email: the recipient of the message
  * base64: a base64 string representation of an image, sent from Misty
  */

  //Ensure that the email parameter and mode parameter are specifed (as they are essential)
  if (e.parameter["email"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No email specified");

  if (e.parameter["mode"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No mode specified");

  var email = e.parameter["email"];
  var mode  = e.parameter["mode"];
  var data = e.parameter["data"];


  //declare these so we don't have to redeclare them in each switch statement
  var subject;
  var message;
  switch (mode)
  {
    //in the case that there is an intruder, we run this code (if Misty does not recognize the face)
    case "intruder":
      //base64 string of the image being received from misty
      var base64 = e.postData.contents;
      //place this image into inline HTML s.t. it can be delivered over the MailApp service with relative ease
      var objects = CloudVisionAPI(base64);
      var objectList = "\t";
      objects = objects.responses[0].labelAnnotations;
      for(i in objects){
        objectList = objectList + objects[i].description + "\n\t";
      }

      var img_str = '<html><body><img src="data:image/jpeg;base64,'+base64+'"></body></html>';
      //turn the image into a blob so that it is suitable for transmission
      var blob = Utilities.newBlob(img_str, 'text/html', 'event_image.html');
      //send an email!
      subject = "Misty Detected An Intruder";
      message = "At " + (new Date).toLocaleString() + ", Misty detected an intruder.\nMisty is looking at:\n" + objectList;
      MailApp.sendEmail({
        to:email,
        subject: subject,
        body: message,
        attachments: [blob]
      });
      break;

    //if the temperature sensors detect that it is too warm, send a signal for a fire, or something.
    case "toohot":
      subject = "Misty Detected High Temperatures";
      message = "At " + (new Date).toLocaleString() + ", Misty detected high temperatures.\nTemperature: " + data;
      MailApp.sendEmail({
        to:email,
        subject: subject,
        body: message
      });
      break;

    //if the house is too humid, send a message for that
    case "toohumid":
      subject = "Misty Detected High Humidity";
      message = "At " + (new Date).toLocaleString() + ", Misty detected high humidity.\nHumidity: " + data;
      MailApp.sendEmail({
        to:email,
        subject: subject,
        body: message
      });
      break;

    //if this stuff isn't filled out properly, give an HTML page that indicates failure to the POSTer
    default:
      return HtmlService.createHtmlOutput("ERROR: Unrecognized mode");
  }

  //in the case that this works, send a successful event to the POSTer
  return HtmlService.createHtmlOutput("SUCCESS: Email sent");
}

function CloudVisionAPI(imageBase64) {
  var api_key = 'YOUR-GOOGLE-VISION-API-KEY-HERE';
  var payload = JSON.stringify({
    requests: [{
      image: {
        content: imageBase64
      },
      features: [{
          type: "LABEL_DETECTION",
          maxResults: 3
      }]
    }]
  });

  var requestUrl = 'https://vision.googleapis.com/v1/images:annotate?key='+api_key;
  var response = UrlFetchApp.fetch(requestUrl, {
    method: 'POST',
    contentType: 'application/json',
    payload: payload,
    muteHttpExceptions: true
  }).getContentText();

  return JSON.parse(response);

}

//function TextToSpeechAPI(){
//    var payload = JSON.stringify({
//      "input": {
//        "text": "I'm saying things!"
//      },
//      "voice": {
//        "languageCode": "en-US"
//      },
//      "audioConfig": {
//        "audioEncoding": "MP3"
//      }
//  });
//  var api_key = 'insert google text to speech api key here'
//  var requestUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + api_key;
//  var response = UrlFetchApp.fetch(requestUrl, {
//    method: 'POST',
//    contentType: 'application/json',
//    payload: payload,
//    muteHttpExceptions: true
//  }).getContentText();
//  Logger.log(response);
//  return JSON.parse(response);
//}
//
