// This is the script running in a Google Web App that is called in order to send out emails
// A call is of the form:
// POST https://script.google.com/macros/s/{uniqueId}/exec?email=example@example.com&mode=intruder

function
doPost(e)
{
  if (e.parameter["email"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No email specified");
  
  if (e.parameter["mode"] === undefined)
    return HtmlService.createHtmlOutput("ERROR: No mode specified");
  
  var email = e.parameter["email"];
  var mode  = e.parameter["mode"];
  
  var subject;
  var message;
  
  switch (mode)
  {
    case "intruder":
      subject = "Misty Detected An Intruder";
      message = "At " + (new Date).toUTCString() + ", Misty detected an intruder.";
      break;
      
    // TODO
    case "toohot":
      subject = "";
      message = "";
      break;
      
    // TODO: add others here
      
    default:
      return HtmlService.createHtmlOutput("ERROR: Unrecognized mode");
  }
  
  MailApp.sendEmail(email, subject, message);
  return HtmlService.createHtmlOutput("SUCCESS: Email sent");
}
