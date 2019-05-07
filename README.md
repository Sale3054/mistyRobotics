# Misty Robotics
Project repo for CU Boulder's 2018-2019 Senior Projects...project for Misty Robotics
--------------------------------------------------------------------------------

This file contains two folders: `Sentry skill` and `Atomic Functions`. 

## Dependencies:
Our project is dependent on a few things:
1) You need to establish a Google Apps Script so that Misty can handle data that it would not normally be able to.
You can find that here: [Google App Scripts](https://script.google.com/home).
There, you will need to create an App and paste the contents of the `MistyEmailGoogleScript.gs` into your newly found script. Then you will need to publish that script and place its associated api-key onto `line 221` of the `sentry.js` file. This will be placed in the `const api_key` constant.

2) Google Vision API, which can be found [here](https://vision.googleapis.com).
Once more, you will need an API-Key for that. This is well documented on the internet. Place that API-key on `line 99` of `MistyEmailGoogleScript.gs`.

3) You will need to upload the `intruder-alert.wav` file to Misty (as an audio file) so that Misty will make the appropriate noise when it hears someone it does not recognize. 

4) To send a text, fill in your phone number on `line 37` of the `sentry.js` file.

5) To send an  email, fill in your email on `line 220` of `sentry.js`. 

Inside the atomic functions folder, you will also find two skills we used to test the functionality of Misty independent of the rest of the working system. Here you can test the `sendEmail()` functionality in addition to testing to see if the sensors attached to an arduino are sending information properly.

You will need to follow similar directions as above in order to make that function.

## What it does:
Presently, this function utilizes almost all of the functionality available to the Misty I, wrapped into one skill. 

* Misty randomly wanders around the room, backing away from obstacles
* Misty recognizes registered faces and cries wolf if it doesn't recognize someone
* Misty sends an Email & Text if it finds someone it does not recognize to the registered user
* Misty send an alert to the registered user if the Temperature and Humidity sensors surpass acceptable parameters
* Misty sends a photo of the intruder to the registered user, and pipes that photo through object recognition software to describe what's contained within the photo
* Misty plays custom sounds if it does not recognize the user.

All of this functionality is an excellent starting place to tie together other things/learn how to use Misty as much of the base functionality is being used.

The Google Apps Script is essential to circumventing some of the problematic data types that Misty encounters, enabling you to do more back-end logic and utilize libraries you otherwise wouldn't be able to via Misty, either due to computing power or software limitations.

Give it a go!
