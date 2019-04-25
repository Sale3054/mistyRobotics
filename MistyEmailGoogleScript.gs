function
doPost(e)
{
  if (e.parameter["email"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No email specified");
  
  if (e.parameter["mode"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No mode specified");
  
  var email = e.parameter["email"];
  var mode  = e.parameter["mode"];
  
  var base64 = e.postData.contents;
  var img_str = '<html><body><img src="data:image/jpeg;base64,'+base64+'"></body></html>';
  var blob = Utilities.newBlob(img_str, 'text/html', 'event_image.html');
  
  var subject;
  var message;
  switch (mode)
  {
    case "intruder":
      subject = "Misty Detected An Intruder";
      message = "At " + (new Date).toLocaleString() + ", Misty detected an intruder.\n";
      break;
      
    case "toohot":
      subject = "Misty Detected High Temperatures";
      message = "At " + (new Date).toLocaleString() + ", Misty detected high temperatures.\n";
      break;
      
    case "toohumid":
      subject = "Misty Detected High Humidity";
      message = "At " + (new Date).toLocaleString() + ", Misty detected high humidity.\n";
      break;
      
    default:
      return HtmlService.createHtmlOutput("ERROR: Unrecognized mode");
  }
  
  MailApp.sendEmail({
    to:email, 
    subject: subject,   
    body: message,
    attachments: [blob]
  });
  return HtmlService.createHtmlOutput("SUCCESS: Email sent");
}
