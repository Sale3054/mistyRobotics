// var Base64EncodedAudio = Your Base64 Encoded Audio
var audioAsByteArrayString = base64ToByteArrayString(Base64EncodedAudio);
misty.SaveAudio("directSave.wav", audioAsByteArrayString, "true", "true");

function base64ToByteArrayString(input) 
{
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var Base64 = {
        btoa: (input) => {
            let str = input;
            let output = '';

            for (let block = 0, charCode, i = 0, map = chars;
                str.charAt(i | 0) || (map = '=', i % 1);
                output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

                charCode = str.charCodeAt(i += 3 / 4);

                if (charCode > 0xFF) {
                    throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                }

                block = block << 8 | charCode;
            }

            return output;
        },

        atob: (input) => {
            // misty.Debug("input" + input);
            let str = input.replace(/=+$/, '');
            let output = '';

            if (str.length % 4 == 1) {
                throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
            }
            for (let bc = 0, bs = 0, buffer, i = 0;
                buffer = str.charAt(i++);

                ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
            ) {
                buffer = chars.indexOf(buffer);
            }

            return output;
        }
    }
    try 
    {
        var byteCharacters = Base64.atob(input);
        var bytesLength = byteCharacters.length;
        var bytes = new Uint8Array(bytesLength);
        for (var offset = 0, i = 0; offset < bytesLength; ++i, ++offset) 
        {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        misty.Debug(bytesLength);
        return bytes.toString();
    } 
    catch (e) 
    {
        // misty.Debug("Couldn't convert to byte array: " + e);
        return undefined;
    }
}