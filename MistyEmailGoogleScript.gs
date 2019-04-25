function
doPost(e)
{
  //Function takes in a POST request from a Misty Robot, looking for the following information:
  /*
  * Mode: Indicates what type of event triggered the need to notify the user
  * email: the recipient of the message
  * base64: a base64 string representation of an image, sent from Misty
  */
  //Insure that the email parameter and mode parameter are specifed (as they are essential)
  if (e.parameter["email"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No email specified");

  if (e.parameter["mode"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No mode specified");

  var email = e.parameter["email"];
  var mode  = e.parameter["mode"];

  //base64 string of the image being received from misty
  var base64 = e.postData.contents;
  //place this image into inline HTML s.t. it can be delivered over the MailApp service with relative ease
  var img_str = '<html><body><img src="data:image/jpeg;base64,'+base64+'"></body></html>';
  //turn the image into a blob so that it is suitable for transmission
  var blob = Utilities.newBlob(img_str, 'text/html', 'event_image.html');

  //declare these so we don't have to redeclare them in each switch statement
  var subject;
  var message;
  switch (mode)
  {
      //in the case that there is an intruder, we run this code (if Misty does not recognize the face)
    case "intruder":
      subject = "Misty Detected An Intruder";
      message = "At " + (new Date).toLocaleString() + ", Misty detected an intruder.\n";
      break;
      //if the temperature sensors detect that it is too warm, send a signal for a fire, or something.
    case "toohot":
      subject = "Misty Detected High Temperatures";
      message = "At " + (new Date).toLocaleString() + ", Misty detected high temperatures.\n";
      break;
      //if the house is too humid, send a message for that
    case "toohumid":
      subject = "Misty Detected High Humidity";
      message = "At " + (new Date).toLocaleString() + ", Misty detected high humidity.\n";
      break;

    default:
      //if this stuff isn't filled out properly, give an HTML page that indicates failure to the POSTer
      return HtmlService.createHtmlOutput("ERROR: Unrecognized mode");
  }
  //send an email with the filled in parameters above..self explanatory
  //blob being the image decoded into an inline HTML page


  MailApp.sendEmail({
    to:email,
    subject: subject,
    body: message,
    attachments: [blob]
  });
  //in the case that this works, send a successful event to the POSTer
  return HtmlService.createHtmlOutput("SUCCESS: Email sent");
}
